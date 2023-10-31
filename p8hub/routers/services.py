import logging
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from python_on_whales import DockerException

from p8hub.globals import service_manager, app_manager
from p8hub.database import session, Service

router = APIRouter(
    prefix="/api/services",
    tags=["Manage Services"],
)

@router.get("")
def get_services():
    """Get services"""
    services = session.query(Service).all()
    return services

class NewServiceRequest(BaseModel):
    app_id: str
    name: str = None
    description: str = None
    service_port: int = None


@router.post("")
def new_service(data: NewServiceRequest):
    """Run application"""
    try:
        service_unique_name = service_manager.create_service(data.app_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    # Create Service record
    app = app_manager.get_app(data.app_id)
    new_service = Service(
        service_unique_name=service_unique_name,
        app_id=data.app_id,
        name=data.name if data.name else app["name"],
        description=data.description if data.description else app["description"],
        service_port=data.service_port,
    )
    session.add(new_service)
    session.commit()

    return new_service


@router.delete("/{service_id}")
def delete_service(service_id: int):
    """Delete service"""
    service = session.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with id {service_id} not found"
        )

    try:
        service_manager.delete_service(service.service_unique_name)
    except DockerException as e:
        logging.error(e)
        pass

    session.delete(service)
    session.commit()
    return {"message": "Service deleted"}

