from fastapi import APIRouter

router = APIRouter(
    prefix="/api",
    tags=["Example of API"],
)


@router.get("/example")
async def main():
    return "Test"
