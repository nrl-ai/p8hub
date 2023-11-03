import uuid
import pathlib
import socket
import logging
import shutil
import time

from python_on_whales import DockerClient, DockerException
from fastapi import BackgroundTasks

from p8hub.core.app_manager import AppManager
from p8hub.database import session, Service, ServiceStatus
from p8hub import globals as global_data

class ServiceManager:
    """Manage services (app instances)"""
    MAX_LOG_LINES = 10000

    def __init__(self, app_manager: AppManager, data_root: str):
        self.app_manager = app_manager
        self.data_root = data_root

    def get_service_unique_name(self, app_id: str):
        """Generate a unique service id"""
        return app_id + "-" + str(uuid.uuid4())

    def is_free_port(self, port: int):
        """Check if a port is free"""
        a_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        location = ("127.0.0.1", port)
        result_of_check = a_socket.connect_ex(location)
        return result_of_check

    def find_usable_port(self, target_port: int, logger: logging.Logger = None):
        """Find a usable port"""
        logger.debug(f"Finding usable port. Initial: {target_port}")
        for port in range(target_port, 65535):
            logger.debug(f"Checking port {port}")
            if self.is_free_port(port):
                return port
        return None

    def get_service_data_dir(self, service_unique_name: str, create_if_not_exists: bool = False):
        """Get the data directory for a service"""
        data_dir = pathlib.Path(self.data_root) / "services" / service_unique_name
        if create_if_not_exists:
            data_dir.mkdir(parents=True, exist_ok=True)
        return data_dir


    def get_service_log_file(self, service_unique_name: str):
        """Get the log file for a service"""
        return self.get_service_data_dir(service_unique_name, create_if_not_exists=True) / "service.log"


    def get_service_logger(self, service_unique_name: str):
        """Get a logger for a service.
        Log files will be saved in the service data directory.
        """
        logger = logging.getLogger(service_unique_name)
        logger.setLevel(logging.INFO)
        if logger.hasHandlers():
            return logger
        log_file = self.get_service_log_file(service_unique_name)
        handler = logging.FileHandler(log_file)
        handler.setLevel(logging.INFO)
        logger.addHandler(handler)
        return logger

    def make_service_env_file(self, service_unique_name: str):
        """Create a .env file for a service and return the path to the file"""
        env_file = self.get_service_data_dir(service_unique_name, create_if_not_exists=True) / ".env"
        with open(env_file, "w") as f:
            f.write(f"SERVICE_UNIQUE_NAME={service_unique_name}\n")
        return env_file

    def run_docker_service(self, app: dict, service: Service):
        """Run a docker service"""
        logger = self.get_service_logger(service.service_unique_name)
        logger.info(f"Running service {service.service_unique_name}")

        # Create .env file
        env_file = self.make_service_env_file(service.service_unique_name)
        app_dir = pathlib.Path(app["app_dir"])
        docker_compose_file = app_dir / "docker-compose.yml"

        # Try to run docker-compose
        try:
            docker = DockerClient(
                compose_files=[docker_compose_file],
                compose_project_name=service.service_unique_name,
                compose_env_file=env_file,
            )
            service.status = ServiceStatus.pulling_images.value
            session.commit()
            docker.compose.pull()

            # Find a usable port and update .env file
            usable_port = app["default_service_port"]
            if global_data.environment == "local":
                usable_port = self.find_usable_port(app["default_service_port"], logger=logger)
            logger.info(f"Using port {usable_port}")
            with open(env_file, "a") as f:
                f.write(f"P8HUB_SERVICE_PORT={usable_port}\n")
            service.status = ServiceStatus.initializing.value
            session.commit()
            docker.compose.up(detach=True)

            # Wait for service port to be available
            if global_data.environment == "local":
                service.status = ServiceStatus.waiting_to_online.value
                session.commit()
                while self.is_free_port(usable_port):
                    time.sleep(2)
                    logger.debug(f"Waiting for service port {usable_port}")

        except DockerException as e:
            logger.error(e)
            service.status = ServiceStatus.error.value
            session.commit()
            return

        # Update service status
        service.status = ServiceStatus.online.value
        service.service_port = usable_port
        session.commit()


    def create_service(self, app_id: str, name: str = None, description: str = None, port: int = None, background_tasks: BackgroundTasks = None):
        """Create a new service"""
        app = self.app_manager.get_app(app_id)
        if not app.get("deployable", True):
            raise Exception("App is not deployable")

        # Create data folder
        service_unique_name = self.get_service_unique_name(app_id)
        logger = self.get_service_logger(service_unique_name)
        logger.info(f"Service unique name: {service_unique_name}")
        self.get_service_data_dir(app_id, create_if_not_exists=True)
        logger = self.get_service_logger(service_unique_name)

        # Create Service record
        new_service = Service(
            service_unique_name=service_unique_name,
            app_id=app_id,
            name=name if name else app["name"],
            description=description if description else app["description"],
            service_port=port,
            status=ServiceStatus.not_started.value,
        )
        session.add(new_service)
        session.commit()

        # Create service in background
        background_tasks.add_task(self.run_docker_service, app, new_service)
        return new_service


    def stop_docker_service(self, service: Service):
        """Stop a docker service"""
        logger = self.get_service_logger(service.service_unique_name)
        logger.info(f"Stopping service {service.service_unique_name}")
        service.status = ServiceStatus.terminating.value
        session.commit()
        try:
            docker = DockerClient(
                compose_project_name=service.service_unique_name,
            )
            docker.compose.down()
        except DockerException as e:
            logger.error(e)
            pass
        session.delete(service)
        session.commit()

        # Delete data folder
        data_dir = self.get_service_data_dir(service.service_unique_name)
        if data_dir.exists():
            shutil.rmtree(data_dir)

    def delete_service(self, service: Service, background_tasks: BackgroundTasks = None):
        """Delete a service"""
        background_tasks.add_task(self.stop_docker_service, service)

    def get_logs(self, service: Service):
        """Get logs for a service"""
        log_file = self.get_service_log_file(service.service_unique_name)
        if not log_file.exists():
            return ""
        with open(log_file, "r") as f:
            return f.read()


    def get_container_logs(self, service: Service):
        """Get logs for a service"""
        logger = self.get_service_logger(service.service_unique_name)
        try:
            docker = DockerClient(
                compose_project_name=service.service_unique_name,
            )
            return docker.compose.logs(tail=self.MAX_LOG_LINES)
        except DockerException as e:
            logger.error(e)
            pass

        return ""