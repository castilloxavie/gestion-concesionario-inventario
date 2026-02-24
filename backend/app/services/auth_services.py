from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.crud.user import get_user_email
from app.core.security import verify_password, create_access_token

# realiza la utenticacion para dar el token
async def authenticate_user(
    db: AsyncSession,
    email: str,
    password: str
):
    user = await get_user_email(db, email)
    
    if not user:
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="credenciales invalidas"
        )
    
    if not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code= status.HTTP_401_UNAUTHORIZED,
            detail="credenciales invalidas"
        )
    
    token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role.name
        }
    )
    
    return {
        "access_token": token,
        "token_type": "bearer"
    }
    

   