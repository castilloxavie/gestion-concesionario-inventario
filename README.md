# 🚗 Sistema de Gestión de Concesionario e Inventario

## 📋 Descripción del Proyecto

**Gestion Concesionario Inventario** es una aplicación web completa para la gestión de inventarios de un concesionario de vehículos. El sistema permite administrar solicitudes de aplicaciones, usuarios y vehículos con un control de acceso basado en roles (RBAC).

### Características Principales

- ✅ **Autenticación JWT** con login seguro
- ✅ **Control de Acceso Basado en Roles (RBAC)**
- ✅ **CRUD completo** de solicitudes de aplicaciones
- ✅ **Interfaz moderna** con React
- ✅ **API REST** con FastAPI
- ✅ **Persistencia de sesión** en localStorage

---

## 🏗️ Arquitectura del Proyecto

```
gestion-concesionario-inventario/
├── backend/                 # Servidor FastAPI
│   ├── app/
│   │   ├── core/           # Configuración y seguridad
│   │   ├── crud/           # Operaciones de base de datos
│   │   ├── databases/      # Modelos y conexiones
│   │   ├── routes/         # Endpoints de la API
│   │   ├── schemas/        # Esquemas Pydantic
│   │   └── services/       # Lógica de negocio
│   ├── alembic/            # Migraciones de base de datos
│   ├── tests/              # Pruebas unitarias
│   └── requirements.txt    # Dependencias Python
│
└── frontend/               # Aplicación React
    ├── src/
    │   ├── api/            # Cliente Axios
    │   ├── components/     # Componentes reutilizables
    │   ├── context/        # Contextos de React
    │   ├── pages/          # Páginas de la aplicación
    │   ├── routes/         # Configuración de rutas
    │   ├── services/       # Servicios de API
    │   └── styles/         # Estilos CSS
    └── package.json        # Dependencias Node.js
```

---

## 🔧 Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| **FastAPI** | 0.132.0 | Framework web moderno y rápido |
| **SQLAlchemy** | 2.0.46 | ORM para base de datos |
| **MySql** | - | Base de datos principal (asyncpg) |
| **SQLite** | - | Base de datos para desarrollo (aiosqlite -testing) |
| **Alembic** | 1.18.4 | Migraciones de base de datos |
| **PyJWT** | 3.5.0 | Autenticación con tokens JWT |
| **BCrypt** | 5.0.0 | Hashing de contraseñas |
| **Pydantic** | 2.12.5 | Validación de datos |
| **Uvicorn** | 0.41.0 | Servidor ASGI |

### Frontend

| Tecnología | Descripción |
|------------|-------------|
| **React 18** | Biblioteca de interfaces de usuario |
| **Vite** | Build tool moderno y rápido |
| **React Router v6** | Enrutamiento de páginas |
| **Axios** | Cliente HTTP para API |
| **CSS3** | Estilos modernos |

---

## 🚀 Guía de Instalación

### Prerrequisitos

- **Python 3.10+**
- **Node.js 18+**
- **MySql** (opcional, puede usar SQLite para desarrollo)** (opcional, puede usar SQLite para desarrollo)

---

### 1. Configuración del Backend

```
bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
# Crear archivo .env en backend/
cp .env.example .env
# Editar .env con tus configuraciones
```

#### Variables de Entorno del Backend

```
env
# Database
DATABASE_URL=sqlite+aiosqlite:///./concesionario.db
# O para PostgreSQL:
# DATABASE_URL=postgresql+asyncpg://user:password@localhost/dbname

# Security
SECRET_KEY=tu_secret_key_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS (orígenes permitidos)
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

#### Ejecutar el Backend

```
bash
# Iniciar servidor de desarrollo
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# La API estará disponible en: http://localhost:8000
# Documentación Swagger: http://localhost:8000/docs
# Documentación ReDoc: http://localhost:8000/redoc
```

---

### 2. Configuración del Frontend

```
bash
# Navegar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env en frontend/
cp .env.example .env
```

#### Variables de Entorno del Frontend

```
env
# URL de la API backend
VITE_API_URL=http://localhost:8000
```

#### Ejecutar el Frontend

```
bash
# Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en: http://localhost:5173
```

---

## 📱 Guía de Uso de la Aplicación

### 🔐 Flujo de Autenticación

El sistema maneja un flujo de autenticación de dos pasos para crear el primer usuario administrador:

#### Paso 1: Crear Usuario Seed (Administrador Inicial)

1. Navegar a `/setup`
2. Crear el primer usuario administrador
3. Este será el **único usuario seed** del sistema

#### Paso 2: Iniciar Sesión

1. Navegar a `/login`
2. Ingresar credenciales
3. Redirigido al Dashboard

#### Paso 3: Registro de Usuarios (Opcional)

- Usuarios normales pueden registrarse en `/register`
- Reciben el rol `user` por defecto

---

### 👥 Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **admin** (seed) | Acceso completo: ver, crear, editar, eliminar usuarios y aplicaciones |
| **user** | Ver dashboard, crear/editar aplicaciones, NO puede eliminar |
| **Sin sesión** | Solo acceso a páginas públicas: /login, /register, /setup |

---

### 📄 Páginas de la Aplicación

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Dashboard | Requiere auth |
| `/dashboard` | Dashboard | Requiere auth |
| `/login` | Inicio de Sesión | Público |
| `/register` | Registro de Usuario | Público |
| `/setup` | Configuración Inicial | Público (solo si no hay admins) |
| `/users` | Gestión de Usuarios | Solo admins |
| `/applications` | Gestión de Aplicaciones | Requiere auth |
| `*` | Página No Encontrada | - |

---

## 🔌 API Endpoints

### Autenticación (`/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register-seed` | Crear primer admin (seed) | Público |
| POST | `/auth/register` | Registro de usuario | Público |
| POST | `/auth/register-by-admin` | Crear usuario por admin | Admin |
| POST | `/auth/login` | Iniciar sesión (OAuth2) | Público |

### Usuarios (`/users`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/users/me` | Obtener perfil actual | Requiere token |
| GET | `/users/` | Listar todos los usuarios | Admin |
| GET | `/users/{id}` | Obtener usuario por ID | Admin |
| PATCH | `/users/{id}` | Actualizar usuario | Admin |
| DELETE | `/users/{id}` | Eliminar usuario | Admin |

### Aplicaciones (`/applications`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/applications/` | Listar aplicaciones | Público |
| GET | `/applications/{id}` | Ver aplicación | Público |
| POST | `/applications/` | Crear aplicación | Público |
| PATCH | `/applications/{id}` | Editar aplicación | Público |
| DELETE | `/applications/{id}` | Eliminar aplicación | **Admin** |

### Items (`/items`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/items/{id}` | Ver item | Requiere token |
| POST | `/items/` | Crear item | Requiere token |
| PUT | `/items/{id}` | Actualizar item | Requiere token |
| DELETE | `/items/{id}` | Eliminar item | **Admin** |

---

## 🧪 Ejecutar Pruebas

### Backend

```
bash
cd backend

# Ejecutar todas las pruebas
pytest

# Ejecutar con coverage
pytest --cov=app

# Ejecutar prueba específica
pytest tests/test_auth.py -v
```

---

## 📦 Scripts Disponibles

### Backend

```
bash
# Iniciar servidor
uvicorn app.main:app --reload

# Con migraciones Alembic
alembic upgrade head
alembic migration generate -m "descripcion"
```

### Frontend

```
bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview producción
npm run preview

# Linting
npm run lint
```

---

## 🔐 Características de Seguridad

1. **Contraseñas hasheadas** con BCrypt
2. **Tokens JWT** con expiración configurable
3. **CORS** configurado para orígenes específicos
4. **Protección de rutas** en frontend y backend
5. **Validación de datos** con Pydantic

---

## 🎨 Personalización

### Cambiar Logo e Imágenes

Las imágenes se encuentran en `frontend/public/`:
- `portada1.png` - Logo principal
- `portada2.png` - Ilustración login
- `portada3.png` - Marca de agua
- `agregar.png` - Icono agregar
- `editar.png` - Icono editar
- `eliminar.png` - Icono eliminar

### Colores Principales

Los colores se definen en los archivos CSS:
- **Rosa**: `#C6007E` - Color secundario
- **Azul**: `#00249C` - Color primario

---

## 📝 Notas de Desarrollo

### Sistema de Roles

El sistema implementa RBAC (Role-Based Access Control):

1. El **primer usuario** creado en `/setup` es el **admin seed**
2. Los usuarios registrados tienen rol `user` por defecto
3. Solo el **admin** puede eliminar aplicaciones y gestionar usuarios
4. Los usuarios normales pueden crear y editar sus aplicaciones

### Persistencia

- El **token JWT** se guarda en `localStorage`
- El **usuario** se guarda en `localStorage`
- Al cerrar sesión se eliminan ambos

---


## 👨‍💻 Desarrollado por

XAvier Alberto Castillo Varon
