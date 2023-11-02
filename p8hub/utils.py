import logging
import os
import pathlib
import platform
import shutil
import subprocess
import tempfile

import pkg_resources
import requests

def open_file(path):
    """
    Open file in default application
    """
    if platform.system() == "Windows":
        os.startfile(path)
    elif platform.system() == "Darwin":
        subprocess.Popen(["open", path])
    else:
        subprocess.Popen(["xdg-open", path])


def extract_frontend_dist(static_folder):
    """
    Extract folder frontend/dist from package p8hub
    and put it in the same static folder for serving
    """
    if os.path.exists(static_folder):
        logging.info(f"Refreshing {static_folder}...")
        shutil.rmtree(static_folder, ignore_errors=True)
    dist_folder = pkg_resources.resource_filename("p8hub", "frontend-dist")
    if os.path.exists(dist_folder):
        pathlib.Path(static_folder).parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(dist_folder, static_folder)
    if not os.path.exists(static_folder):
        logging.warning("frontend-dist not found in package p8hub")
        pathlib.Path(static_folder).mkdir(parents=True, exist_ok=True)
        with open(os.path.join(static_folder, "index.html"), "w") as f:
            f.write(
                "<b>frontend-dist</b> not found in package p8hub. Please run: <code>bash build_frontend.sh</code>"
            )
        return


def extract_apps(static_folder):
    """
    Extract folder apps from package p8hub
    and put it in the same static folder for serving
    """
    if os.path.exists(static_folder):
        logging.info(f"Refreshing {static_folder}...")
        shutil.rmtree(static_folder, ignore_errors=True)
    apps_folder = pkg_resources.resource_filename("p8hub", "apps")
    if os.path.exists(apps_folder):
        pathlib.Path(static_folder).parent.mkdir(parents=True, exist_ok=True)
        shutil.copytree(apps_folder, static_folder)
    if not os.path.exists(static_folder):
        logging.warning("apps not found in package p8hub")
        pathlib.Path(static_folder).mkdir(parents=True, exist_ok=True)
        with open(os.path.join(static_folder, "index.html"), "w") as f:
            f.write(
                "<b>apps</b> not found in package p8hub. Please run: <code>bash build_apps.sh</code>"
            )
        return

