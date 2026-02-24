from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.config import settings
from app.databases.seccion import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.user import get_user_email

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
): 
    """
    obtiene el usuario actual a partir del token JWT.
    Verifica que el usuario esté activo y no eliminado.
    """
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        email: str = payload.get("sub")
        
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido: falta el subject"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token JWT inválido o expirado"
        )
    
    user = await get_user_email(db, email=email)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no encontrado"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )
    
    if user.is_deleted:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario eliminado"
        )
    
    return user


async def get_current_admin_user(
    current_user = Depends(get_current_user)
):
    """
    dependencia que verifica que el usuario actual sea administrador.
    """
    if current_user.role.name.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Se requiere permisos de administrador"
        )
    return current_user


async def get_current_active_user(
    current_user = Depends(get_current_user)
):
    """
    dependencia que simplemente verifica que el usuario esté activo.
    Es más flexible que get_current_user, permite cualquier rol activo.
    """
    return current_user
