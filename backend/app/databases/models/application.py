import uuid
from sqlalchemy import String, Boolean, ForeignKey, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.databases.base import Base


class Application(Base):
    """
    Modelo para gestionar solicitudes de aspirantes en el concessionsario.
    """
    __tablename__ = "applications"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid: Mapped[str] = mapped_column(String(36), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    marca: Mapped[str] = mapped_column(String(100), nullable=False)
    sucursal: Mapped[str] = mapped_column(String(100), nullable=False)
    aspirante: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False)  
    deleted_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)  
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    
    user = relationship("User", back_populates="applications")
