from fastapi import APIRouter, HTTPException, status
from p8hub.globals import service_manager, app_manager
from p8hub.models import NewServiceRequest
from p8hub.database import session, Service

router = APIRouter(
    prefix="/api/services",
    tags=["Manage Services"],
)

@router.post("")
def new_service(data: NewServiceRequest):
    """Run application"""
    try:
        service_unique_name = service_manager.run_app(data.app_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    # Create Service record
    app = app_manager.get_app(data.app_id)
    session.add(Service(
        service_unique_name=service_unique_name,
        app_id=data.app_id,
        name=data.name if data.name else app["name"],
        description=data.description if data.description else app["description"],
        service_port=data.service_port,
    ))
    session.commit()

    return {"service_unique_name": service_unique_name}


@router.get("")
def get_services():
    """Get services"""
    services = session.query(Service).all()
    return services
