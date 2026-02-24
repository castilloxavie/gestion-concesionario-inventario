from pydantic import BaseModel

# esquema de respuesta al token de acceso
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"