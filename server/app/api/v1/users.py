from flask import Blueprint, jsonify
from app.api.deps import get_current_user
from app.utils.exceptions import error_response

users_bp = Blueprint("users", __name__)

@users_bp.route("/me", methods=["GET"])
def get_me():
    user, err = get_current_user()
    if err:
        return error_response(err[0], err[1])
    return jsonify(user.to_dict()), 200