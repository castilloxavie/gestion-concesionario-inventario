from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String
from app.databases.base import Base

class Role(Base):
    __tablename__ = "roles"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False, unique=True)
    
    users = relationship("User", back_populates="role")