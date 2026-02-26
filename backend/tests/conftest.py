"""
Configuración de pytest para los tests.
"""
import pytest
import pytest_asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.main import app
from app.databases.base import Base
from app.databases.seccion import get_db
from app.databases.models.role import Role


# URL de base de datos para testing (SQLite en memoria)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture(scope="function")
async def test_engine():
    """Crea el motor de base de datos para testing."""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
        # Sembrar roles (admin y user)
        admin_role = Role(name="admin")
        user_role = Role(name="user")
        session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        async with session() as conn_session:
            conn_session.add_all([admin_role, user_role])
            await conn_session.commit()

    yield engine

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def test_db(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """Crea una sesión de base de datos para testing."""
    async_session = async_sessionmaker(
        test_engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        yield session


@pytest_asyncio.fixture(scope="function")
async def client(test_db) -> AsyncGenerator[AsyncClient, None]:
    """Crea un cliente de prueba para la API."""

    async def override_get_db():
        yield test_db

    app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest.fixture
def test_user_data():
    """Datos de prueba para crear un usuario."""
    return {
        "email": "test@ejemplo.com",
        "password": "password123",
        "role_name": "user"
    }


@pytest.fixture
def test_admin_data():
    """Datos de prueba para crear un admin."""
    return {
        "email": "admin@ejemplo.com",
        "password": "admin123",
        "role_name": "admin"
    }


@pytest.fixture
def test_application_data():
    """Datos de prueba para crear una aplicación."""
    return {
        "marca": "Toyota",
        "sucursal": "Ciudad de México",
        "aspirante": "Juan Pérez",
        "is_active": True
    }
