from fastapi import FastAPI
from app.routes import auth, users, application, item

app = FastAPI(
    title="API de Concesionario",
    description="Backend para gestión de inventario de concesionario con autenticación RBAC",
    version="1.0.0"
)

# Rutas de autenticación
app.include_router(auth.router)

# Rutas de usuarios (solo admins)
app.include_router(users.router)

# Rutas de aplicaciones (users pueden crear/editar, solo admins pueden eliminar)
app.include_router(application.router)

# Rutas de items (vehículos)
app.include_router(item.router)
