import asyncio
import sys
from pathlib import Path

# añade directorio del back a la ruta de python
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.databases.seccion import AsyncSessionLocal
from app.databases.models.role import Role


async def seed_role():
    """
    función semillera que crea los roles iniciales (admin y user).
    valida si ya existen antes de crearlos.
    """
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Role))
        role = result.scalars().all()

        if role:
            print("Los roles ya existen en la db")
            return

        admin = Role(name="admin")
        user = Role(name="user")
        
        session.add_all([admin, user])
        await session.commit()
        print("Ambos roles fueron creados correctamente")


if __name__ == "__main__":
    asyncio.run(seed_role())
