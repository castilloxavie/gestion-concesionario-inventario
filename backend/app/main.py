from fastapi import FastAPI
from app.databases.seccion import engine

app = FastAPI()

@app.on_event("startup")
async def test_db_connection():
   async with engine.begin() as conn:
       await conn.run_sync(lambda conn: print("base de datos conectada correctamente"))
