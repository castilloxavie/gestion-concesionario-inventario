"""
Tests para el módulo de aplicaciones.
"""
import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_application(client: AsyncClient, test_application_data: dict):
    """Test: Crear una aplicación."""
    response = await client.post("/applications/", json=test_application_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["marca"] == test_application_data["marca"]
    assert data["sucursal"] == test_application_data["sucursal"]
    assert data["aspirante"] == test_application_data["aspirante"]
    assert data["is_active"] == True
    assert "id" in data
    assert "uuid" in data


@pytest.mark.asyncio
async def test_list_applications(client: AsyncClient, test_application_data: dict):
    """Test: Listar todas las aplicaciones."""
    # Crear una aplicación primero
    await client.post("/applications/", json=test_application_data)
    
    # Listar aplicaciones
    response = await client.get("/applications/")
    
    assert response.status_code == 200
    data = response.json()
    assert "applications" in data
    assert "total" in data
    assert len(data["applications"]) >= 1


@pytest.mark.asyncio
async def test_get_application_by_id(client: AsyncClient, test_application_data: dict):
    """Test: Obtener una aplicación por ID."""
    # Crear aplicación
    create_response = await client.post("/applications/", json=test_application_data)
    application_id = create_response.json()["id"]
    
    # Obtener por ID
    response = await client.get(f"/applications/{application_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == application_id
    assert data["marca"] == test_application_data["marca"]


@pytest.mark.asyncio
async def test_get_application_not_found(client: AsyncClient):
    """Test: Obtener aplicación que no existe."""
    response = await client.get("/applications/99999")
    
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_application(client: AsyncClient, test_application_data: dict):
    """Test: Actualizar una aplicación."""
    # Crear aplicación
    create_response = await client.post("/applications/", json=test_application_data)
    application_id = create_response.json()["id"]
    
    # Actualizar
    update_data = {"marca": "Honda", "is_active": False}
    response = await client.patch(f"/applications/{application_id}", json=update_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["marca"] == "Honda"
    assert data["is_active"] == False


@pytest.mark.asyncio
async def test_delete_application(client: AsyncClient, test_application_data: dict):
    """Test: Eliminar una aplicación (soft delete)."""
    # Crear aplicación
    create_response = await client.post("/applications/", json=test_application_data)
    application_id = create_response.json()["id"]
    
    # Eliminar
    response = await client.delete(f"/applications/{application_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
