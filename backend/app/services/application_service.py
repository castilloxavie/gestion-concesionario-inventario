from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.application import (
    get_all_applications,
    get_application_by_id as crud_get_application_by_id,
    get_application_by_uuid,
    create_application as crud_create_application,
    update_application as crud_update_application,
    soft_delete_application,
    get_total_applications
)
from app.databases.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate
from fastapi import HTTPException, status
import uuid


async def get_applications(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    obtiene todas las aplicaciones (excluyendo eliminadas).
    """
    applications = await get_all_applications(db, skip=skip, limit=limit)
    total = await get_total_applications(db)
    return {"applications": applications, "total": total}


async def get_application_by_id_service(db: AsyncSession, application_id: int):
    """
    obtiene una aplicación por su ID.
    """
    application = await crud_get_application_by_id(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicación no encontrada"
        )
    return application


async def create_application_service(
    db: AsyncSession,
    application_data: ApplicationCreate,
    created_by_id: int
):
    """
    crea una nueva aplicación.
    """
    application = Application(
        uuid=str(uuid.uuid4()),
        marca=application_data.marca,
        sucursal=application_data.sucursal,
        aspirante=application_data.aspirante,
        created_by=created_by_id,
        is_active=True,
        is_deleted=False
    )
    
    return await crud_create_application(db, application)


async def update_application_service(
    db: AsyncSession,
    application_id: int,
    application_data: ApplicationUpdate
):
    """
    actualiza una aplicación.
    """
    application = await crud_get_application_by_id(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicación no encontrada"
        )
    
    update_data = {}
    
    if application_data.marca is not None:
        update_data["marca"] = application_data.marca
    if application_data.sucursal is not None:
        update_data["sucursal"] = application_data.sucursal
    if application_data.aspirante is not None:
        update_data["aspirante"] = application_data.aspirante
    if application_data.is_active is not None:
        update_data["is_active"] = application_data.is_active
    
    if not update_data:
        return application
    
    return await crud_update_application(db, application_id, update_data)


async def delete_application_service(db: AsyncSession, application_id: int):
    """
    Soft delete de una aplicación.
    """
    application = await crud_get_application_by_id(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aplicación no encontrada"
        )
    
    await soft_delete_application(db, application_id)
    return {"message": "Aplicación eliminada correctamente"}
