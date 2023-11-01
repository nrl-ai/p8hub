import enum
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String

from p8hub.config import DATABASE_PATH

DATABASE_URL = "sqlite:///{}".format(DATABASE_PATH)
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()

Base = declarative_base()


class ServiceStatus(enum.Enum):
    initializing = "initializing"
    running = "running"
    terminating = "terminating"
    error = "error"
    unknown = "unknown"

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    service_unique_name = Column(String, unique=True, index=True)
    app_id = Column(String, nullable=True)
    name = Column(String, index=True, nullable=True)
    description = Column(String, nullable=True)
    service_port = Column(Integer, nullable=True)
    status = Column(String, nullable=False, default=ServiceStatus("initializing").value)


Base.metadata.create_all(bind=engine)
