from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from app.databases.models.user import User
from datetime import datetime
from typing import Optional


# obtiene todos los usuarios de la db (sin traer eliminados)
async def get_all_users(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(User)
        .where(User.is_deleted == False)
        .options(selectinload(User.role))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


# obtiene el total de usuarios (sin traer eliminados)
async def get_total_users(db: AsyncSession):
    result = await db.execute(
        select(User).where(User.is_deleted == False)
    )
    return len(result.scalars().all())


# obtiene un usuario por su email, devuelve None si no existe
async def get_user_email(db: AsyncSession, email: str):
    result = await db.execute(
        select(User).where(User.email == email).options(selectinload(User.role))
    )
    return result.scalar_one_or_none()


# obtiene un usuario por su ID
async def get_user_by_id(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(User).where(User.id == user_id).options(selectinload(User.role))
    )
    return result.scalar_one_or_none()


# obtiene un usuario 
async def get_user_by_uuid(db: AsyncSession, user_uuid: str):
    result = await db.execute(
        select(User).where(User.uuid == user_uuid).options(selectinload(User.role))
    )
    return result.scalar_one_or_none()


# crea un nuevo usuario en la db, devuelve el usuario creado
async def create_user(db: AsyncSession, user: User):
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


# actualiza un usuario
async def update_user(db: AsyncSession, user_id: int, user_data: dict):
    user_data["updated_at"] = datetime.utcnow()
    await db.execute(
        update(User)
        .where(User.id == user_id)
        .values(**user_data)
    )
    await db.commit()
    return await get_user_by_id(db, user_id)


# eliminar de la db
async def soft_delete_user(db: AsyncSession, user_id: int):
    await db.execute(
        update(User)
        .where(User.id == user_id)
        .values(
            is_deleted=True,
            deleted_at=datetime.utcnow(),
            is_active=False
        )
    )
    await db.commit()


# reactiva un usuario
async def reactivate_user(db: AsyncSession, user_id: int):
    await db.execute(
        update(User)
        .where(User.id == user_id)
        .values(
            is_deleted=False,
            deleted_at=None,
            is_active=True
        )
    )
    await db.commit()
    return await get_user_by_id(db, user_id)
