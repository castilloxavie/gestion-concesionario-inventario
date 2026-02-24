from pydantic_settings import BaseSettings
from pydantic import Field

""" 
    configuracion centralizada de la aplicacion, gestiona las variables de entorno
    para la base de datos, seguridad JWT etc.
""" 
class Settings(BaseSettings):
    database_url: str = Field(..., alias="DB_URL")
    database_url_sync: str = Field(..., alias="DB_URL_SYNC")
    
    secret_key: str = Field(..., alias="SECRET_KEY")
    algorithm : str = Field(..., alias="ALGORITHM")
    access_token_expire_minutes: int = Field(..., alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        
settings = Settings()
