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
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        email: str = payload.get("sub")
        
        if email is None:
            raise HTTPException(
                status_code= status.HTTP_401_UNAUTHORIZED,
            )
    except JWTError:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
        )
    
    use = await get_user_email(db, email = email)
    
    if use is None:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
        )
    
    if not use.is_active:
        raise HTTPException(
            status_code= status.HTTP_403_FORBIDDEN,
            detail="Usuario inactivo"
        )
    
    return use
