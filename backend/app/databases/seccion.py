from sqlalchemy.ext.asyncio import (
    create_async_engine,
    async_sessionmaker,
    AsyncSession,
)

from app.core.config import settings
"""
    se configura el motor asyncronico
    se utiliza la url  de la db que sde encuentra en el archivo .env
"""
engine = create_async_engine(
    settings.database_url,
    echo=True,
    pool_pre_ping=True,
)

# se encarga de construir la seccion asyncronica
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_= AsyncSession,
    expire_on_commit=False,
)

# se encarga de las sesiones de la db, se encarga que cada solicitud o peticion tenga su propia sesion y se cierre al finalizar la solicitud 
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session