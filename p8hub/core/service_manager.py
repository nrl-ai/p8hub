import uuid
import tempfile
import pathlib
import socket
from python_on_whales import DockerClient

from .app_manager import AppManager


class ServiceManager:
    """Manage services (app instances)"""

    def __init__(self, app_manager: AppManager):
        self.app_manager = app_manager

    @staticmethod
    def get_service_unique_name(app_id: str):
        """Generate a unique service id"""
        return app_id + "-" + str(uuid.uuid4())

    @staticmethod
    def is_free_port(port: int):
        """Check if a port is free"""
        a_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        location = ("127.0.0.1", port)
        result_of_check = a_socket.connect_ex(location)
        return result_of_check

    @staticmethod
    def find_usable_port(target_port: int):
        """Find a usable port"""
        for port in range(target_port, 65535):
            if ServiceManager.is_free_port(port):
                return port
        return None

    def create_service(self, app_id: str):
        """Create a new service"""
        app = self.app_manager.get_app(app_id)
        if not app.get("deployable", True):
            raise Exception("App is not deployable")

        service_unique_name = self.get_service_unique_name(app_id)
        app_dir = pathlib.Path(app["app_dir"])
        docker_compose_file = app_dir / "docker-compose.yml"

        # Create temporary directory for .env file
        temp_dir = tempfile.TemporaryDirectory()
        env_file = pathlib.Path(temp_dir.name) / ".env"
        usable_port = self.find_usable_port(app["default_service_port"])
        print("Usable port:", usable_port)
        with open(env_file, "w") as f:
            f.write(f"P8HUB_SERVICE_PORT={usable_port}\n")

        # Create service
        docker = DockerClient(
            compose_files=[docker_compose_file],
            compose_project_name=service_unique_name,
            compose_env_file=env_file,
        )
        docker.compose.up(detach=True)

        return service_unique_name, usable_port

    def delete_service(self, service_unique_name: str):
        """Delete a service"""
        docker = DockerClient(
            compose_project_name=service_unique_name,
        )
        docker.compose.down()


