import os
import yaml
import pathlib

from .exceptions import AppNotFound

class AppManager:
    """Manage applications"""

    def __init__(self, apps_dir: str="apps"):
        pathlib.Path(apps_dir).mkdir(parents=True, exist_ok=True)
        self.apps_dir = apps_dir
        self.apps = []
        self.load_apps()

    def load_apps(self):
        """Load applications from apps directory"""
        self.apps = []
        for app in os.listdir(self.apps_dir):
            if os.path.isdir(os.path.join(self.apps_dir, app)):
                self.apps.append(self.load_app(app))

    def load_app(self, app: str):
        """Load application from app directory"""
        app_dir = os.path.join(self.apps_dir, app)
        app_config = os.path.join(app_dir, "p8hub.app.yml")
        with open(app_config, "r") as f:
            config = yaml.safe_load(f)
            config.update({"app_dir": app_dir})
        return config

    def get_apps(self):
        """Get applications"""
        return self.apps

    def get_app(self, app_id: str):
        """Get application by ID"""
        for app in self.apps:
            if app["id"] == app_id:
                return app
        raise AppNotFound("App not found: {}".format(app_id))
