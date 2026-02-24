from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import UserCreate, UserResponse
from app.databases.seccion import get_db
from app.services.user_service import register_user_admin
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.token import Token
from app.services.auth_services import authenticate_user
from fastapi import HTTPException



router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register-admin", response_model=UserResponse)
async def register_admin(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),

) :
    
    user = await register_user_admin(
        db = db,
        email = user_data.email,
        password = user_data.password
    )
    
    return UserResponse(
        id = user.id,
        email = user.email,
        is_active = user.is_active,
        role= user.role.name
    
    )

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    token = await  authenticate_user(
        db=db,
        email=form_data.username,
        password=form_data.password
    )
    
    return Token(**token)
