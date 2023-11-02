from fastapi import APIRouter
from p8hub import globals


router = APIRouter(
    prefix="/api/apps",
    tags=["Manage Applications"],
)

@router.get("")
async def apps():
    return globals.app_manager.get_apps()

