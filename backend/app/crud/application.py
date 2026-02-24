from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from app.databases.models.application import Application
from datetime import datetime
from typing import Optional


# obtiene todas las aplicaciones de la db (excluyendo eliminadas)
async def get_all_applications(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(Application)
        .where(Application.is_deleted == False)
        .options(selectinload(Application.user))
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()


# obtiene el total de aplicaciones (sin traer las eliminadas)
async def get_total_applications(db: AsyncSession):
    result = await db.execute(
        select(Application).where(Application.is_deleted == False)
    )
    return len(result.scalars().all())


# obtiene una aplicación por su id
async def get_application_by_id(db: AsyncSession, application_id: int):
    result = await db.execute(
        select(Application)
        .where(Application.id == application_id)
        .options(selectinload(Application.user))
    )
    return result.scalar_one_or_none()


# obtiene una aplicación
async def get_application_by_uuid(db: AsyncSession, application_uuid: str):
    result = await db.execute(
        select(Application)
        .where(Application.uuid == application_uuid)
        .options(selectinload(Application.user))
    )
    return result.scalar_one_or_none()


# obtiene aplicaciones por usuario creador
async def get_applications_by_creator(db: AsyncSession, creator_id: int):
    result = await db.execute(
        select(Application)
        .where(Application.created_by == creator_id, Application.is_deleted == False)
        .options(selectinload(Application.user))
    )
    return result.scalars().all()


# crea una nueva aplicación en la db
async def create_application(db: AsyncSession, application: Application):
    db.add(application)
    await db.commit()
    await db.refresh(application)
    return application


# actualiza una aplicación
async def update_application(db: AsyncSession, application_id: int, application_data: dict):
    application_data["updated_at"] = datetime.utcnow()
    await db.execute(
        update(Application)
        .where(Application.id == application_id)
        .values(**application_data)
    )
    await db.commit()
    return await get_application_by_id(db, application_id)


# eliminar de db
async def soft_delete_application(db: AsyncSession, application_id: int):
    await db.execute(
        update(Application)
        .where(Application.id == application_id)
        .values(
            is_deleted=True,
            deleted_at=datetime.utcnow(),
            is_active=False
        )
    )
    await db.commit()


# reactiva una aplicación
async def reactivate_application(db: AsyncSession, application_id: int):
    await db.execute(
        update(Application)
        .where(Application.id == application_id)
        .values(
            is_deleted=False,
            deleted_at=None,
            is_active=True
        )
    )
    await db.commit()
    return await get_application_by_id(db, application_id)
