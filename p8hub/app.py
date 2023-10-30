import os

import argparse
import logging

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from p8hub import globals
from p8hub.app_info import __appname__, __description__, __version__
from p8hub.config import DATA_ROOT
from p8hub.database import engine
from p8hub.routers import docker
from p8hub.utils import extract_frontend_dist


def main():
    parser = argparse.ArgumentParser(
        description=__description__,
    )
    parser.add_argument(
        "--host",
        type=str,
        default="127.0.0.1",
        help="Host to run the server on",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=5678,
        help="Port to run the server on",
    )
    parser.add_argument(
        "--version",
        action="store_true",
        help="Print version and exit",
    )
    args = parser.parse_args()

    if args.version:
        print(f"{__appname__} v{__version__}")
        return

    logging.info(f"Starting {__appname__}...")
    logging.info(f"Version: {__version__}")

    logging.info("Extracting frontend distribution...")
    static_folder = os.path.abspath(os.path.join(DATA_ROOT, "frontend-dist"))
    extract_frontend_dist(static_folder)

    logging.info("Creating database tables...")
    # models.Base.metadata.create_all(bind=engine)

    app = FastAPI(
        title=__appname__,
        description=__description__,
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

    app.include_router(docker.router)
    app.mount(
        "/", StaticFiles(directory=static_folder, html=True), name="static"
    )

    uvicorn.run(app, host=args.host, port=args.port, reload=False, workers=1)


if __name__ == "__main__":
    main()
