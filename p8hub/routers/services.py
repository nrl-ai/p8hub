import logging
from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from pydantic import BaseModel
from python_on_whales import DockerException

from p8hub import globals
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
def new_service(data: NewServiceRequest, background_tasks: BackgroundTasks):
    """Run application"""
    try:
        new_service = globals.service_manager.create_service(
            data.app_id, data.name, data.description, data.service_port, background_tasks
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return new_service


@router.get("/{service_id}")
def get_service(service_id: int):
    """Get service"""
    service = session.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with id {service_id} not found",
        )
    return service


@router.delete("/{service_id}")
def delete_service(service_id: int, background_tasks: BackgroundTasks):
    """Delete service"""
    service = session.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with id {service_id} not found",
        )

    try:
        globals.service_manager.delete_service(service, background_tasks)
    except DockerException as e:
        logging.error(e)
        pass

    return {"message": "Service deleted"}


@router.get("/{service_id}/logs")
def logs(service_id: int):
    """Get service logs"""
    service = session.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with id {service_id} not found",
        )

    try:
        return globals.service_manager.get_logs(service)
    except DockerException as e:
        logging.error(e)
        pass

    return ""


@router.get("/{service_id}/container_logs")
def logs(service_id: int):
    """Get service logs"""
    service = session.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service with id {service_id} not found",
        )

    try:
        return globals.service_manager.get_container_logs(service)
    except DockerException as e:
        logging.error(e)
        pass

    return ""