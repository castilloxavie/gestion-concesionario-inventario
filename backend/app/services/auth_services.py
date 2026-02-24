from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.crud.user import get_user_email
from app.core.security import verify_password, create_access_token


async def authenticate_user(
    db: AsyncSession,
    email: str,
    password: str
):
    """
    Autentica un usuario y devuelve un token JWT.
    Verifica que el usuario exista, la contraseña sea correcta,
    y que el usuario esté activo y no eliminado.
    """
    user = await get_user_email(db, email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )
    
    # Verificar si el usuario está eliminado (soft delete)
    if user.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )
    
    # Verificar si el usuario está activo
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo. Contacte al administrador."
        )
    
    # Verificar la contraseña
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas"
        )
    
    # Crear el token JWT con el email y el rol
    token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role.name,
            "user_id": user.id
        }
    )
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }
