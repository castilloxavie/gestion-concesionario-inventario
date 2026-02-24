import asyncio
import sys
from pathlib import Path

# Add backend directory to Python path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.databases.seccion import AsyncSessionLocal
from app.databases.models.role import Role

async def seed_role():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Role))
        role = result.scalars().all()

        if role:
            print("El rol ya existe en la db")
            return

        admin = Role(name="admin")
        user = Role(name="user")
        
        session.add_all([admin, user])
        await session.commit()
        print("Ambos roles fueron creados correctamente")

if __name__ == "__main__":
    asyncio.run(seed_role())