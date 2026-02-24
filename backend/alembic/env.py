import os
import sys
from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context

# Agrega la raíz del proyecto al PATH para habilitar las importaciones
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))

from app.core.config import settings 
from app.databases.base import Base
#from app.databases.models import user, role

config = context.config
fileConfig(config.config_file_name)
target_metadata = Base.metadata

#migrar sin tener conecciones a la db
def run_migrations_offline():
    context.configure(
        url=settings.database_url_sync,
        target_metadata=target_metadata,
        literal_binds=True,
    )
    
    with context.begin_transaction():
        context.run_migrations()

# migrar con coneexion a la db
def run_migrations_online():
    connectable = engine_from_config(
        {"sqlalchemy.url": settings.database_url_sync},
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata
        )
        
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
