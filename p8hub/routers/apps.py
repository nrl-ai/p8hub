from fastapi import APIRouter

from p8hub.app_manager import AppManager

router = APIRouter(
    prefix="/api/apps",
    tags=["Manage Applications"],
)

app_manager = AppManager()

@router.get("/")
async def apps():
    return app_manager.get_apps()

