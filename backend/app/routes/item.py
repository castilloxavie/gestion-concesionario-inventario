from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user, get_current_admin_user

router = APIRouter(prefix="/items", tags=["Items"])


@router.post("/")
async def create_item(
    current_user = Depends(get_current_user)
):
    """
    crea un nuevo item (vehículo).
    accessible para usuarios activos (admin y user).
    """
    return {"message": "Item creado", "user": current_user.email}


@router.get("/{item_id}")
async def get_item(
    item_id: int,
    current_user = Depends(get_current_user)
):
    """
    obtiene un item por su ID.
    accessible para usuarios activos (admin y user).
    """
    return {"message": f"Item {item_id}", "user": current_user.email}


@router.put("/{item_id}")
async def update_item(
    item_id: int,
    current_user = Depends(get_current_user)
):
    """
    actualiza un item.
    accessible para usuarios activos (admin y user).
    """
    return {"message": f"Item {item_id} actualizado", "user": current_user.email}


@router.delete("/{item_id}")
async def delete_item(
    item_id: int,
    current_user = Depends(get_current_admin_user)
):
    """
    elimina un item (soft delete).
    sOLO admins pueden eliminar.
    """
    return {"message": f"Item {item_id} eliminado", "user": current_user.email}
