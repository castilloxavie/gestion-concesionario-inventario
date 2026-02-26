from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import UserResponse, UserListResponse, UserUpdate
from app.databases.seccion import get_db
from app.services.user_service import get_users, get_user_by_id, update_user, delete_user
from app.core.dependencies import get_current_admin_user, get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Obtiene el perfil del usuario actualmente autenticado.
    Cualquier usuario logueado puede acceder a su propio perfil.
    """
    return UserResponse(
        id=current_user.id,
        uuid=current_user.uuid,
        email=current_user.email,
        is_active=current_user.is_active,
        is_seed=current_user.is_seed,
        role=current_user.role.name,
        created_at=current_user.created_at
    )


@router.get("/", response_model=UserListResponse)
async def list_users(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=100, description="Límite de registros"),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    lista todos los usuarios (solo admins).
    """
    return await get_users(db, skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    obtiene un usuario por su ID (solo admins).
    """
    user = await get_user_by_id(db, user_id)
    return UserResponse(
        id=user.id,
        uuid=user.uuid,
        email=user.email,
        is_active=user.is_active,
        is_seed=user.is_seed,
        role=user.role.name,
        created_at=user.created_at
    )


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user_endpoint(
    user_id: int,
    user_data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    actualiza un usuario (solo admins).
    """
    user = await update_user(db, user_id, user_data, current_user.id)
    return UserResponse(
        id=user.id,
        uuid=user.uuid,
        email=user.email,
        is_active=user.is_active,
        is_seed=user.is_seed,
        role=user.role.name,
        created_at=user.created_at
    )


@router.delete("/{user_id}")
async def delete_user_endpoint(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    elimina un usuario  de db
    """
    return await delete_user(db, user_id)
