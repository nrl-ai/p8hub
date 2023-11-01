import enum
import datetime

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, DateTime, types

from p8hub.config import DATABASE_PATH

DATABASE_URL = "sqlite:///{}".format(DATABASE_PATH)
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
session = SessionLocal()

Base = declarative_base()


class DateTimeUTC(types.TypeDecorator):
    impl = types.DateTime
    LOCAL_TIMEZONE = datetime.datetime.utcnow().astimezone().tzinfo

    def process_bind_param(self, value: datetime, dialect):
        if value.tzinfo is None:
            value = value.astimezone(self.LOCAL_TIMEZONE)
        return value.astimezone(datetime.timezone.utc)

    def process_result_value(self, value, dialect):
        if value.tzinfo is None:
            return value.replace(tzinfo=datetime.timezone.utc)
        return value.astimezone(datetime.timezone.utc)


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
    created_at = Column(DateTimeUTC, nullable=False, default=datetime.datetime.now)


Base.metadata.create_all(bind=engine)
