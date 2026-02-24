from fastapi import  Depends, HTTPException, status
from app.core.dependencies import get_current_user


def require_role(allowed_roles: list[str]):
    
    async def role_dependency(user = Depends(get_current_user)):
        
        if user.role.name.lower() not in [r.lower() for r in allowed_roles]:
            raise HTTPException(
                status_code= status.HTTP_403_FORBIDDEN,
                detail="Permiso denegado"
            )
        
        return user
    
    return role_dependency

require_admin = require_role(["admin"])
require_user_or_admin = require_role(["admin", "user"])