import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.core.config import settings

# encriptar la contraseña en texto plano
def hash_password(password: str):
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

# compara la contraseña encriptada(texto plano) con la que le dan a ver si coinciden
def verify_password(plain_password: str, hashed_password: str):
    password_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)

# crear el acceso con el token
def create_access_token(data: dict):
    to_encode = data.copy()
    exipire = datetime.utcnow() + timedelta(
        minutes= settings.access_token_expire_minutes
    )
    to_encode.update({"exp": exipire})
    return jwt.encode(
        to_encode,
        settings.secret_key,
        algorithm= settings.algorithm
    )