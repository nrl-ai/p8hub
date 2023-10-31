import psutil
from fastapi import APIRouter

router = APIRouter(
    prefix="/api/system_monitor",
    tags=["System Monitor"],
)

@router.get("")
async def get_system_monitor():
    return {
        "cpu_percent": psutil.cpu_percent(),
        "num_cpu_cores": psutil.cpu_count(),
        "memory_percent": psutil.virtual_memory().percent,
        "memory_total": psutil.virtual_memory().total,
        "memory_used": psutil.virtual_memory().used,
        "memory_free": psutil.virtual_memory().free,
        "swap_percent": psutil.swap_memory().percent,
        "swap_total": psutil.swap_memory().total,
        "swap_used": psutil.swap_memory().used,
        "swap_free": psutil.swap_memory().free,
    }
