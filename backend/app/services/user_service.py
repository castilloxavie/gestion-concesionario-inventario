from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user import (
    get_all_users, 
    get_user_email, 
    get_user_by_id as crud_get_user_by_id,
    create_user, 
    update_user as crud_update_user,
    soft_delete_user,
    get_total_users
)
from app.databases.models.user import User
from app.databases.models.role import Role
from app.schemas.user import UserCreate, UserUpdate
from sqlalchemy import select
from fastapi import HTTPException, status
from app.core.security import hash_password
import uuid


async def register_seed_admin(db: AsyncSession, email: str, password: str):
    """
    registra el primer usuario admin (seed).
    solo se permite si NO existe ningún usuario en la base de datos.
    """
    existing_users = await get_all_users(db)
    
    if existing_users:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ya existe un usuario en el sistema. El admin seed ya fue creado."
        )
    
    result = await db.execute(
        select(Role).where(Role.name == "admin")
    )
    admin_role = result.scalar_one_or_none()
    
    if not admin_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El rol 'admin' no existe en la base de datos. Ejecuta el seed primero."
        )
    
    user = User(
        uuid=str(uuid.uuid4()),
        email=email,
        hashed_password=hash_password(password),
        role_id=admin_role.id,
        is_active=True,
        is_deleted=False
    )
    
    return await create_user(db, user)


async def register_user(
    db: AsyncSession, 
    user_data: UserCreate, 
    created_by_id: int
):
    """
    registra un nuevo usuario.
    - si el creador es admin, puede especificar el rol (admin o user)
    - el email debe ser único
    """
    # Verificar si el email ya existe
    existing_user = await get_user_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El email ya está registrado"
        )
    
    # Obtener el rol especificado (por defecto "user")
    role_name = user_data.role_name or "user"
    
    # Validar que el rol sea válido
    if role_name not in ["admin", "user"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rol inválido. Debe ser 'admin' o 'user'"
        )
    
    result = await db.execute(
        select(Role).where(Role.name == role_name)
    )
    role = result.scalar_one_or_none()
    
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"El rol '{role_name}' no existe en la base de datos."
        )
    
    user = User(
        uuid=str(uuid.uuid4()),
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        role_id=role.id,
        is_active=True,
        is_deleted=False,
        created_by=created_by_id
    )
    
    return await create_user(db, user)


async def get_users(db: AsyncSession, skip: int = 0, limit: int = 100):
    """
    obtiene todos los usuarios (excluyendo eliminados).
    """
    users = await get_all_users(db, skip=skip, limit=limit)
    total = await get_total_users(db)
    return {"users": users, "total": total}


async def get_user_by_id(db: AsyncSession, user_id: int):
    """
    obtiene un usuario por su ID.
    """
    user = await crud_get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    return user


async def update_user(db: AsyncSession, user_id: int, user_data: UserUpdate, current_user_id: int):
    """
    actualiza un usuario.
    solo admins pueden cambiar el rol o estado de otros usuarios.
    """
    user = await crud_get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    update_data = {}
    
    # Si se proporciona un nuevo email, verificar que no exista
    if user_data.email and user_data.email != user.email:
        existing = await get_user_email(db, user_data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está en uso"
            )
        update_data["email"] = user_data.email
    
    # Actualizar estado active
    if user_data.is_active is not None:
        update_data["is_active"] = user_data.is_active
    
    # actualizar rol (solo si se especifica)
    if user_data.role_name:
        result = await db.execute(
            select(Role).where(Role.name == user_data.role_name)
        )
        role = result.scalar_one_or_none()
        if not role:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"El rol '{user_data.role_name}' no existe"
            )
        update_data["role_id"] = role.id
    
    if not update_data:
        return user
    
    return await crud_update_user(db, user_id, update_data)


async def delete_user(db: AsyncSession, user_id: int):
    """
    eliminar de db
    """
    user = await crud_get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    await soft_delete_user(db, user_id)
    return {"message": "Usuario eliminado correctamente"}
