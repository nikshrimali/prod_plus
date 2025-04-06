from sqlalchemy.orm import Session
from .base_class import Base
from .session import engine
from ..models import task  # Import all models here

def init_db() -> None:
    Base.metadata.create_all(bind=engine) 