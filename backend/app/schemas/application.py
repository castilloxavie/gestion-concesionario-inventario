from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


# esquema para crear una nueva aplicación
class ApplicationCreate(BaseModel):
    marca: str = Field(..., min_length=1, max_length=100)
    sucursal: str = Field(..., min_length=1, max_length=100)
    aspirante: str = Field(..., min_length=1, max_length=200)


# esquema para actualizar una aplicación
class ApplicationUpdate(BaseModel):
    marca: Optional[str] = Field(None, min_length=1, max_length=100)
    sucursal: Optional[str] = Field(None, min_length=1, max_length=100)
    aspirante: Optional[str] = Field(None, min_length=1, max_length=200)
    is_active: Optional[bool] = None


# esquema de salida para una aplicación
class ApplicationResponse(BaseModel):
    id: int
    uuid: str
    marca: str
    sucursal: str
    aspirante: str
    is_active: bool
    created_at: datetime
    created_by: Optional[int] = None
    
    model_config = {
        "from_attributes": True
    }


# esquema para listar aplicaciones (con paginación)
class ApplicationListResponse(BaseModel):
    applications: list[ApplicationResponse]
    total: int
