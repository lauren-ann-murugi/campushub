from functools import wraps
from flask import request
from app.core.security import decode_access_token
from app.models.user import User
from app.utils.exceptions import error_response

def get_current_user():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, ("Missing token", 401)

    token = auth_header.split(" ")[1]
    try:
        payload = decode_access_token(token)
        user = User.query.get(int(payload.get("sub")))
        if not user:
            return None, ("User not found", 404)
        return user, None
    except Exception:
        return None, ("Invalid or expired token", 401)

def require_role(role_name: str):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            user, err = get_current_user()
            if err:
                return error_response(err[0], err[1])
            if user.role != role_name and user.role != "administrator":
                return error_response("Forbidden: insufficient permissions", 403)
            return f(user, *args, **kwargs)
        return decorated_function
    return decorator