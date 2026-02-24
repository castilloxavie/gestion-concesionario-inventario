from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.user import UserCreate, UserResponse, UserRegister, UserListResponse, UserUpdate
from app.databases.seccion import get_db
from app.services.user_service import register_seed_admin, register_user, get_users, get_user_by_id, update_user, delete_user
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas.token import Token
from app.services.auth_services import authenticate_user
from app.core.dependencies import get_current_user, get_current_admin_user

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register-seed", response_model=UserResponse)
async def register_seed_admin_endpoint(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    """
    registra el primer usuario admin (seed).
    solo se permite si NO existe ningún usuario en la base de datos.
    """
    user = await register_seed_admin(
        db=db,
        email=user_data.email,
        password=user_data.password
    )
    
    return UserResponse(
        id=user.id,
        uuid=user.uuid,
        email=user.email,
        is_active=user.is_active,
        role=user.role.name,
        created_at=user.created_at
    )


@router.post("/register", response_model=UserResponse)
async def register_user_endpoint(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db),
):
    """
    endpoint(url) para que usuarios normales se registren a sí mismos.
    por defecto reciben el rol 'user'.
    """
    # crear usuario con rol "user" por defecto
    user_create = UserCreate(
        email=user_data.email,
        password=user_data.password,
        role_name="user"
    )
    
    # no tenemos created_by ya que se auto-registra
    user = await register_user(
        db=db,
        user_data=user_create,
        created_by_id=None  
    )
    
    return UserResponse(
        id=user.id,
        uuid=user.uuid,
        email=user.email,
        is_active=user.is_active,
        role=user.role.name,
        created_at=user.created_at
    )


@router.post("/register-by-admin", response_model=UserResponse)
async def register_user_by_admin(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    endpoint(url) para que un admin cree nuevos usuarios.
    puede especificar el rol (admin o user).
    """
    user = await register_user(
        db=db,
        user_data=user_data,
        created_by_id=current_user.id
    )
    
    return UserResponse(
        id=user.id,
        uuid=user.uuid,
        email=user.email,
        is_active=user.is_active,
        role=user.role.name,
        created_at=user.created_at
    )


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    endpoint(url) de login. Retorna un token JWT.
    """
    token = await authenticate_user(
        db=db,
        email=form_data.username,
        password=form_data.password
    )
    
    return Token(**token)
