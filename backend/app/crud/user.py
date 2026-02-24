from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.databases.models.user import User

# obtiene todos los usuarios de la db
async def get_all_users(db: AsyncSession):
    result = await db.execute(select(User).options(selectinload(User.role)))
    return result.scalars().all()


# obtiene un usuario por su email, devuelve None si no existe
async def get_user_email(db: AsyncSession, email: str):
    result = await db.execute(
        select(User).where(User.email == email).options(selectinload(User.role))
    )
    return result.scalar_one_or_none()


# crea un nuevo usuario en la db, devuelve el usuario creado
async def create_user(db: AsyncSession, user: User):
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user