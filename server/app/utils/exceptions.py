from flask import jsonify

def error_response(message: str, status_code: int = 400):
    return jsonify({"message": message}), status_code