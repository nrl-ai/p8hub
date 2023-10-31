import uuid
import pathlib
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

    def create_service(self, app_id: str):
        """Create a new service"""
        app = self.app_manager.get_app(app_id)

        service_unique_name = self.get_service_unique_name(app_id)
        app_dir = pathlib.Path(app["app_dir"])
        docker_compose_file = app_dir / "docker-compose.yml"

        docker = DockerClient(
            compose_files=[docker_compose_file],
            compose_project_name=service_unique_name,
        )
        docker.compose.up(detach=True)

        return service_unique_name

    def delete_service(self, service_unique_name: str):
        """Delete a service"""
        docker = DockerClient(
            compose_project_name=service_unique_name,
        )
        docker.compose.down()


