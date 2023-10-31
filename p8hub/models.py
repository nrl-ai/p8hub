from pydantic import BaseModel

class NewServiceRequest(BaseModel):
    app_id: str
    name: str = None
    description: str = None
    service_port: int = None

