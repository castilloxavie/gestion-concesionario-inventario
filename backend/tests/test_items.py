"""
Tests para el módulo de items (vehículos).
"""
import pytest
from httpx import AsyncClient


async def get_auth_token(client: AsyncClient, email: str, password: str, role: str = "admin") -> str:
    """Función helper para obtener token de autenticación."""
    # Intentar registrar como seed solo si es el primer admin
    if role == "admin":
        register_response = await client.post("/auth/register-seed", json={
            "email": email,
            "password": password
        })
        # Si falla (ya existe admin), intentar login directamente
        if register_response.status_code != 200:
            pass  # El usuario ya existe, hacer login
    else:
        # Registro normal para usuarios (usando JSON)
        register_response = await client.post("/auth/register", json={
            "email": email,
            "password": password
        })
        if register_response.status_code != 200:
            raise ValueError(f"Register failed: {register_response.status_code} - {register_response.text}")
    
    response = await client.post(
        "/auth/login",
        data={"username": email, "password": password}
    )
    if response.status_code != 200:
        raise ValueError(f"Login failed: {response.status_code} - {response.text}")
    return response.json()["access_token"]


@pytest.mark.asyncio
async def test_create_item_with_auth(client: AsyncClient):
    """Test: Crear item con autenticación."""
    token = await get_auth_token(client, "admin@admin.com", "admin123")
    
    response = await client.post(
        "/items/",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "message" in data


@pytest.mark.asyncio
async def test_create_item_without_auth(client: AsyncClient):
    """Test: Crear item sin autenticación debe fallar."""
    response = await client.post("/items/")
    
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_item_with_auth(client: AsyncClient):
    """Test: Obtener item con autenticación."""
    # Usar contraseña de 8+ caracteres
    token = await get_auth_token(client, "user@test.com", "password123", role="user")
    
    response = await client.get(
        "/items/1",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_delete_item_as_admin(client: AsyncClient):
    """Test: Admin puede eliminar items."""
    token = await get_auth_token(client, "admin2@admin.com", "admin123")
    
    response = await client.delete(
        "/items/1",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # Status 200 o 404 si no existe el item
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_delete_item_as_regular_user(client: AsyncClient):
    """Test: Usuario regular NO puede eliminar items."""
    # Usar contraseña de 8+ caracteres
    token = await get_auth_token(client, "user@user.com", "password123", role="user")
    
    # Intentar eliminar
    response = await client.delete(
        "/items/1",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    assert response.status_code == 403
