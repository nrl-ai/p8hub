from fastapi import APIRouter
from p8hub.globals import app_manager


router = APIRouter(
    prefix="/api/apps",
    tags=["Manage Applications"],
)

@router.get("")
async def apps():
    return app_manager.get_apps()

