# from fastapi import APIRouter, HTTPException, status
# from app.schemas.auth import (
#     LoginRequest,
#     SignupRequest,
#     VerifyCodeRequest,
#     ResendCodeRequest,
#     AuthResponse
# )
# from app.services.auth_service import auth_service
# from app.services.email_service import email_service

# router = APIRouter()


# @router.post("/login", response_model=AuthResponse)
# async def login(payload: LoginRequest):
#     """
#     Authenticate user and trigger 2FA code email
#     """
#     return await auth_service.authenticate_user(payload)


# @router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
# async def signup(payload: SignupRequest):
#     """
#     Register new user identity and issue 2FA verification code
#     """
#     return await auth_service.register_user(payload)


# @router.post("/verify-code", response_model=AuthResponse)
# async def verify_code(payload: VerifyCodeRequest):
#     """
#     Verify 6-digit 2FA code and return JWT access token
#     """
#     return await auth_service.verify_2fa_code(payload.email, payload.code)


# @router.post("/resend-code")
# async def resend_code(payload: ResendCodeRequest):
#     """
#     Resend a fresh 6-digit code
#     """
#     code = f"{auth_service._generate_2fa_code()}"
#     await email_service.send_verification_code(payload.email, code)
#     return {"message": f"A new verification code was sent to {payload.email}"}



from flask import Blueprint, request, jsonify
from app.services.auth_service import auth_service
from app.utils.exceptions import error_response

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user and send verification code"""
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "student")

    if not name or not email or not password:
        return error_response("Name, email, and password are required", 400)

    success, payload, status_code = auth_service.register_user(name, email, password, role)
    
    if not success:
        return error_response(payload, status_code)

    return jsonify(payload), status_code


@auth_bp.route("/login", methods=["POST"])
def login():
    """Authenticate user and send verification code"""
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password:
        return error_response("Email and password are required", 400)

    success, payload, status_code = auth_service.login_user(email, password, role)
    
    if not success:
        return error_response(payload, status_code)

    return jsonify(payload), status_code


@auth_bp.route("/verify-code", methods=["POST"])
def verify_code():
    """Verify 6-digit code and return access token"""
    data = request.get_json() or {}
    email = data.get("email")
    code = data.get("code")

    if not email or not code:
        return error_response("Email and verification code are required", 400)

    success, payload, status_code = auth_service.verify_code(email, code)
    
    if not success:
        return error_response(payload, status_code)

    return jsonify(payload), status_code


@auth_bp.route("/resend-code", methods=["POST"])
def resend_code():
    """Resend verification code"""
    data = request.get_json() or {}
    email = data.get("email")

    if not email:
        return error_response("Email is required", 400)

    success, payload, status_code = auth_service.resend_code(email)
    
    if not success:
        return error_response(payload, status_code)

    return jsonify(payload), status_code