import os
import argparse
import logging
import pathlib

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from p8hub.app_info import __appname__, __description__, __version__
from p8hub import globals as global_data

def main():
    parser = argparse.ArgumentParser(
        description=__description__,
    )
    parser.add_argument(
        "--host",
        type=str,
        default="0.0.0.0",
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
    parser.add_argument(
        "--data_root",
        default=os.path.abspath(
            os.path.join(os.path.expanduser("~"), "p8hub-data")
        ),
    )
    parser.add_argument(
        "--environment",
        default="local",
    )
    args = parser.parse_args()

    if args.version:
        print(f"{__appname__} v{__version__}")
        return

    logging.info(f"Starting {__appname__}...")
    logging.info(f"Version: {__version__}")

    logging.info(f"Environment: {args.environment}")
    global_data.environment = args.environment

    logging.info(f"Data root: {args.data_root}")
    global_data.data_root = args.data_root
    pathlib.Path(global_data.data_root).mkdir(parents=True, exist_ok=True)

    # Import these after setting data_root
    from p8hub.routers import apps, system_monitor, services
    from p8hub.utils import extract_frontend_dist, extract_apps
    from p8hub.database import engine, Base
    from p8hub.core.app_manager import AppManager
    from p8hub.core.service_manager import ServiceManager

    logging.info("Extracting frontend distribution...")
    static_folder = os.path.abspath(
        os.path.join(global_data.data_root, "frontend-dist")
    )
    extract_frontend_dist(static_folder)
    print(static_folder)

    logging.info("Extracting apps...")
    apps_folder = os.path.abspath(os.path.join(global_data.data_root, "apps"))
    extract_apps(apps_folder)

    # Initialize global_data
    global_data.app_manager = AppManager(
        apps_dir=os.path.join(global_data.data_root, "apps")
    )
    global_data.service_manager = ServiceManager(global_data.app_manager, global_data.data_root)

    logging.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)

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

    app.include_router(apps.router)
    app.include_router(services.router)
    app.include_router(system_monitor.router)
    app.mount(
        "/", StaticFiles(directory=static_folder, html=True), name="static"
    )

    uvicorn.run(app, host=args.host, port=args.port, workers=1)


if __name__ == "__main__":
    main()
