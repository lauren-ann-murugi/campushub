from flask import Blueprint, jsonify, request

from app.api.deps import get_current_user
from app.core.database import db
from app.utils.exceptions import error_response

users_bp = Blueprint("users", __name__)


@users_bp.route("/me", methods=["GET"])
def get_me():
    user, err = get_current_user()
    if err:
        return error_response(err[0], err[1])
    return jsonify(user.to_dict()), 200


@users_bp.route("/profile", methods=["GET"])
def get_profile():
    user, err = get_current_user()
    if err:
        return error_response(err[0], err[1])
    return jsonify({"user": user.to_dict()}), 200


@users_bp.route("/change-password", methods=["POST"])
def change_password():
    user, err = get_current_user()
    if err:
        return error_response(err[0], err[1])

    payload = request.get_json(silent=True) or {}
    current_password = payload.get("currentPassword") or payload.get("current_password")
    new_password = payload.get("newPassword") or payload.get("new_password")

    if not current_password or not new_password:
        return error_response("Current and new password are required", 400)
    if not user.check_password(current_password):
        return error_response("Current password is incorrect", 400)
    if len(new_password) < 8:
        return error_response("New password must be at least 8 characters", 400)
    if new_password == current_password:
        return error_response("New password must be different from the current password", 400)

    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully"}), 200


__all__ = ["users_bp"]
