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


def download_file(url, file_path):
    """
    Send a GET request to the URL
    """
    tmp_file = tempfile.NamedTemporaryFile(delete=False)
    pathlib.Path(file_path).parent.mkdir(parents=True, exist_ok=True)
    response = requests.get(url, stream=True)

    # Check if the request was successful
    if response.status_code == 200:
        total_size = int(response.headers.get("content-length", 0))
        block_size = 8192  # Chunk size in bytes
        progress_bar = tqdm(total=total_size, unit="B", unit_scale=True)

        with open(tmp_file.name, "wb") as file:
            # Iterate over the response content in chunks
            for chunk in response.iter_content(chunk_size=block_size):
                file.write(chunk)
                progress_bar.update(len(chunk))

        progress_bar.close()
        shutil.move(tmp_file.name, file_path)
        logging.info("File downloaded successfully.")
    else:
        logging.info("Failed to download file.")

