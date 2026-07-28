from flask import Blueprint, jsonify
from app.api.deps import require_role
from app.services.dashboard_service import dashboard_service

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/dashboard", methods=["GET"])
@require_role("administrator")
def admin_dashboard(current_user):
    summary = dashboard_service.get_admin_dashboard_summary()
    return jsonify(summary), 200


__all__ = ["admin_bp"]