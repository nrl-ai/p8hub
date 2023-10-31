import uuid
import pathlib
from python_on_whales import DockerClient, DockerException

from .app_manager import AppManager


class ServiceManager:
    """Manage services (app instances)"""

    def __init__(self, app_manager: AppManager):
        self.app_manager = app_manager

    @staticmethod
    def get_service_unique_name(app_id: str):
        """Generate a unique service id"""
        return app_id + "-" + str(uuid.uuid4())

    def run_app(self, app_id: str):
        """Run application"""
        app = self.app_manager.get_app(app_id)
        print("Running app: {}".format(app["name"]))
        print("App directory: {}".format(app["app_dir"]))

        service_unique_name = self.get_service_unique_name(app_id)
        app_dir = pathlib.Path(app["app_dir"])
        docker_compose_file = app_dir / "docker-compose.yml"

        docker = DockerClient(
            compose_files=[docker_compose_file],
            compose_project_name=service_unique_name,
        )
        docker.compose.up(detach=True)

        return service_unique_name
