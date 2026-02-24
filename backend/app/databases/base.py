from sqlalchemy.orm import declarative_base

Base = declarative_base()

from app.databases.models import user, role  
