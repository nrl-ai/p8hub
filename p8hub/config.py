import os
import pathlib

DATA_ROOT = os.path.abspath(
    os.path.join(os.path.expanduser("~"), "p8hub-data")
)
pathlib.Path(DATA_ROOT).mkdir(parents=True, exist_ok=True)

DATABASE_PATH = os.path.abspath(os.path.join(DATA_ROOT, "p8hub.db"))
