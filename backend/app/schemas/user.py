from pydantic import BaseModel, EmailStr

# Esquema para un registro nuevo de usuario
class UserCreate(BaseModel):
    email: EmailStr
    password: str

# Esquema  de salida que define la estructura publica de un usuario
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    role: str
    
    model_config = {
        "from_attributes": True
    }