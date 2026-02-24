from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean
from datetime import datetime
from app.databases.base import Base

# modelo de datos para el rol
class Role(Base):
    __tablename__ = "roles"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False) 
    deleted_at: Mapped[datetime] = mapped_column(nullable=True)  
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    
    users = relationship("User", back_populates="role")
