from flask import Blueprint, jsonify, request

from app.api.deps import require_role
from app.core.database import db
from app.services.dashboard_service import dashboard_service
from app.services.settings_service import settings_service
from app.utils.exceptions import error_response

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/dashboard", methods=["GET"])
@require_role("administrator")
def admin_dashboard(current_user):
    summary = dashboard_service.get_admin_dashboard_summary()
    return jsonify(summary), 200


@admin_bp.route("/settings", methods=["GET"])
@require_role("administrator")
def get_settings(current_user):
    settings = settings_service.get_or_create(current_user.id)
    return jsonify({"settings": settings.to_dict()}), 200


@admin_bp.route("/settings", methods=["PUT"])
@require_role("administrator")
def update_settings(current_user):
    payload = request.get_json(silent=True) or {}
    if not payload:
        return error_response("No settings provided", 400)

    settings, error = settings_service.update(current_user.id, payload)
    if error:
        db.session.rollback()
        return error_response(error, 400)

    return jsonify({"message": "Settings saved", "settings": settings.to_dict()}), 200


__all__ = ["admin_bp"]
