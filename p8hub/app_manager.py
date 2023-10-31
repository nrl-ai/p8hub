import os
import yaml
import pathlib


class AppManager:
    """Manage applications"""

    def __init__(self, apps_dir: str="apps"):
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
        return config

    def get_apps(self):
        """Get applications"""
        return self.apps
