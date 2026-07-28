from app.api.v1.admin import admin_bp
from app.api.v1.auth import auth_bp
from app.api.v1.student import student_bp
from app.api.v1.teacher import teacher_bp
from app.api.v1.users import users_bp

__all__ = ["auth_bp", "users_bp", "student_bp", "teacher_bp", "admin_bp"]