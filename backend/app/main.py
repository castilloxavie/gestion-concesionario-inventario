from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users, application, item

app = FastAPI(
    title="API de Concesionario",
    description="Backend para gestión de inventario de concesionario con autenticación RBAC",
    version="1.0.0"
)

# Configuración CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas de autenticación
app.include_router(auth.router)

# Rutas de usuarios (solo admins)
app.include_router(users.router)

# Rutas de aplicaciones (users pueden crear/editar, solo admins pueden eliminar)
app.include_router(application.router)

# Rutas de items (vehículos)
app.include_router(item.router)
