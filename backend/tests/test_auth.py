"""
Tests para el módulo de autenticación.
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_seed_admin(client: AsyncClient, test_admin_data: dict):
    """Test: Registrar administrador inicial (seed)."""
    response = await client.post("/auth/register-seed", json=test_admin_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_admin_data["email"]
    assert data["role"] == "admin"
    assert "id" in data
    assert "uuid" in data


@pytest.mark.asyncio
async def test_register_user(client: AsyncClient, test_user_data: dict):
    """Test: Registrar usuario normal."""
    response = await client.post("/auth/register", json=test_user_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user_data["email"]
    assert data["role"] == "user"


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, test_admin_data: dict):
    """Test: Login exitoso con credenciales correctas."""
    # Primero registrar el usuario
    await client.post("/auth/register-seed", json=test_admin_data)
    
    # Luego hacer login
    response = await client.post(
        "/auth/login",
        data={
            "username": test_admin_data["email"],
            "password": test_admin_data["password"]
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_invalid_password(client: AsyncClient, test_admin_data: dict):
    """Test: Login fallido con contraseña incorrecta."""
    # Registrar usuario
    await client.post("/auth/register-seed", json=test_admin_data)
    
    # Intentar login con contraseña incorrecta
    response = await client.post(
        "/auth/login",
        data={
            "username": test_admin_data["email"],
            "password": "password_incorrecto"
        }
    )
    
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_login_invalid_email(client: AsyncClient):
    """Test: Login fallido con email inexistente."""
    response = await client.post(
        "/auth/login",
        data={
            "username": "noexiste@ejemplo.com",
            "password": "password123"
        }
    )
    
    assert response.status_code == 401
