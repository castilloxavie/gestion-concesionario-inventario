from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.application import ApplicationResponse, ApplicationListResponse, ApplicationCreate, ApplicationUpdate
from app.databases.seccion import get_db
from app.services.application_service import (
    get_applications,
    get_application_by_id_service,
    create_application_service,
    update_application_service,
    delete_application_service
)

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.get("/", response_model=ApplicationListResponse)
async def list_applications(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=100, description="Límite de registros"),
    db: AsyncSession = Depends(get_db),
):
    """
    Lista todas las aplicaciones (CRUD - Read).
    Accessible públicamente sin autenticación.
    """
    return await get_applications(db, skip=skip, limit=limit)


@router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(
    application_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Obtiene una aplicación por su ID (CRUD - Read).
    Accessible públicamente sin autenticación.
    """
    application = await get_application_by_id_service(db, application_id)
    return ApplicationResponse(
        id=application.id,
        uuid=application.uuid,
        marca=application.marca,
        sucursal=application.sucursal,
        aspirante=application.aspirante,
        is_active=application.is_active,
        created_at=application.created_at,
        created_by=application.created_by
    )


@router.post("/", response_model=ApplicationResponse)
async def create_application_endpoint(
    application_data: ApplicationCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    Crea una nueva aplicación (CRUD - Create).
    Accessible públicamente sin autenticación.
    """
    application = await create_application_service(
        db=db,
        application_data=application_data,
        created_by_id=None
    )
    return ApplicationResponse(
        id=application.id,
        uuid=application.uuid,
        marca=application.marca,
        sucursal=application.sucursal,
        aspirante=application.aspirante,
        is_active=application.is_active,
        created_at=application.created_at,
        created_by=application.created_by
    )


@router.patch("/{application_id}", response_model=ApplicationResponse)
async def update_application_endpoint(
    application_id: int,
    application_data: ApplicationUpdate,
    db: AsyncSession = Depends(get_db),
):
    """
    Actualiza una aplicación (CRUD - Update).
    Accessible públicamente sin autenticación.
    """
    application = await update_application_service(db, application_id, application_data)
    return ApplicationResponse(
        id=application.id,
        uuid=application.uuid,
        marca=application.marca,
        sucursal=application.sucursal,
        aspirante=application.aspirante,
        is_active=application.is_active,
        created_at=application.created_at,
        created_by=application.created_by
    )


@router.delete("/{application_id}")
async def delete_application_endpoint(
    application_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Elimina una aplicación (CRUD - Delete).
    Accessible públicamente sin autenticación.
    """
    return await delete_application_service(db, application_id)
