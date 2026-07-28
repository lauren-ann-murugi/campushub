"""
Central API Router Initialization
Combines all v1 feature blueprints under /api/v1 prefix
"""

from flask import Blueprint
from app.api.v1.auth import auth_bp
from app.api.v1.users import users_bp
from app.api.v1.student import student_bp
from app.api.v1.teacher import teacher_bp
from app.api.v1.admin import admin_bp
from app.api.v1.announcements import announcements_bp  # Import the new blueprint
from app.api.v1.student_fees import student_fees_bp
from app.api.v1.admin_fees import admin_fees_bp

# Central v1 API router
api_router = Blueprint("api_v1", __name__, url_prefix="/api/v1")

# Register all feature blueprints
api_router.register_blueprint(auth_bp, url_prefix="/auth")
api_router.register_blueprint(users_bp, url_prefix="/users")
api_router.register_blueprint(student_bp, url_prefix="/student")
api_router.register_blueprint(teacher_bp, url_prefix="/teacher")
api_router.register_blueprint(admin_bp, url_prefix="/admin")
api_router.register_blueprint(announcements_bp, url_prefix="/announcements")
api_router.register_blueprint(student_fees_bp, url_prefix="/student/fees")
api_router.register_blueprint(admin_fees_bp, url_prefix="/admin/fees")
__all__ = ["api_router"]