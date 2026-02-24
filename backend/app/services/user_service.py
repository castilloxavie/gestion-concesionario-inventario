from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user import get_all_users, get_user_email, create_user
from app.databases.models.user import User
from app.databases.models.role import Role
from sqlalchemy import select
from fastapi import HTTPException, status
from app.core.security import hash_password

async def register_user_admin(db: AsyncSession, email: str, password: str):
    axisting_user = await get_all_users(db)
    
    #valido si el usuario existe
    if axisting_user:
        raise HTTPException(
            status_code= status.HTTP_403_FORBIDDEN,
            detail="El usuario ya existe"
        )
    
    result = await db.execute(
        select(Role).where(Role.name == "admin")
    )
    
    admin_role = result.scalar_one_or_none()
    
    if not admin_role:
        raise HTTPException(
            status_code= status.HTTP_404_NOT_FOUND,
            detail="El rol 'admin' no existe en la base de datos. Ejecuta el seed primero."
        )
    
    user = User(
        email = email,
        hashed_password = hash_password(password),
        role_id = admin_role.id
    )
    
    return await create_user(db, user)
