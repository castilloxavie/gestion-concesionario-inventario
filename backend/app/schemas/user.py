from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# esquema para crear un usuario con rol (solo admins pueden usar este)
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    role_name: Optional[str] = "user"  # Por defecto es "user", solo admins pueden cambiar a "admin"


# esquema para registrar un nuevo usuario sin especificar rol (autoregistro)
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


# esquema para actualizar un usuario
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    role_name: Optional[str] = None


# esquema de salida que define la estructura pública de un usuario
class UserResponse(BaseModel):
    id: int
    uuid: str
    email: EmailStr
    is_active: bool
    is_seed: bool = False
    role: str
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }


# esquema para listar usuarios (con paginación)
class UserListResponse(BaseModel):
    users: list[UserResponse]
    total: int
