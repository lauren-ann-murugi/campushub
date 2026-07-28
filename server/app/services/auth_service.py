# import datetime
# import random
# from typing import Any, Dict

# from fastapi import HTTPException, status
# from sqlalchemy import select

# from app.core.database import AsyncSessionLocal
# from app.models.admin import Administrator
# from app.models.student import Student
# from app.models.teacher import Teacher
# from app.models.user import User
# from app.schemas.auth import AuthResponse, LoginRequest, SignupRequest, UserOut
# from app.services.email_service import email_service

# # Simulated in-memory store for 2FA codes (In production: use Redis or DB table)
# verification_codes_db: Dict[str, Dict[str, Any]] = {}


# def _hash_password(password: str) -> str:
#     import hashlib

#     return hashlib.sha256(password.encode("utf-8")).hexdigest()


# def _verify_password(plain_password: str, hashed_password: str) -> bool:
#     return _hash_password(plain_password) == hashed_password


# class AuthService:
#     @staticmethod
#     def _generate_2fa_code() -> str:
#         return f"{random.randint(100000, 999999)}"

#     @staticmethod
#     def _hash_password(password: str) -> str:
#         return _hash_password(password)

#     @staticmethod
#     def _verify_password(plain_password: str, hashed_password: str) -> bool:
#         return _verify_password(plain_password, hashed_password)

#     async def authenticate_user(self, payload: LoginRequest) -> AuthResponse:
#         async with AsyncSessionLocal() as session:
#             result = await session.execute(select(User).where(User.email == str(payload.email)))
#             user = result.scalar_one_or_none()

#             if not user or not self._verify_password(payload.password, user.password_hash):
#                 raise HTTPException(
#                     status_code=status.HTTP_401_UNAUTHORIZED,
#                     detail="Invalid email or password credentials."
#                 )

#             if user.role != payload.role.value:
#                 raise HTTPException(
#                     status_code=status.HTTP_400_BAD_REQUEST,
#                     detail=f"User exists but is not registered as a {payload.role.value}."
#                 )

#             code = self._generate_2fa_code()
#             verification_codes_db[str(payload.email)] = {
#                 "code": code,
#                 "expires_at": datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
#             }

#             await email_service.send_verification_code(str(payload.email), code)

#             return AuthResponse(
#                 requiresVerification=True,
#                 message=f"2FA verification code sent to {payload.email}",
#                 user=None,
#             )

#     async def register_user(self, payload: SignupRequest) -> AuthResponse:
#         async with AsyncSessionLocal() as session:
#             result = await session.execute(select(User).where(User.email == str(payload.email)))
#             existing_user = result.scalar_one_or_none()

#             if existing_user:
#                 raise HTTPException(
#                     status_code=status.HTTP_400_BAD_REQUEST,
#                     detail="An account with this email already exists.",
#                 )

#             new_user = User(
#                 id=f"usr_{random.randint(1000, 9999)}",
#                 email=str(payload.email),
#                 password_hash=self._hash_password(payload.password),
#                 first_name=payload.firstName,
#                 last_name=payload.lastName,
#                 role=payload.role.value,
#             )

#             if payload.role.value == "student":
#                 new_user.student_profile = Student(id=f"std_{random.randint(1000, 9999)}", user_id=new_user.id)
#             elif payload.role.value == "teacher":
#                 new_user.teacher_profile = Teacher(id=f"tch_{random.randint(1000, 9999)}", user_id=new_user.id)
#             elif payload.role.value == "administrator":
#                 new_user.administrator_profile = Administrator(id=f"adm_{random.randint(1000, 9999)}", user_id=new_user.id)

#             session.add(new_user)
#             await session.commit()
#             await session.refresh(new_user)

#             code = self._generate_2fa_code()
#             verification_codes_db[str(payload.email)] = {
#                 "code": code,
#                 "expires_at": datetime.datetime.utcnow() + datetime.timedelta(minutes=10),
#             }

#             await email_service.send_verification_code(str(payload.email), code)

#             return AuthResponse(
#                 requiresVerification=True,
#                 message="Account created successfully. Please verify your email.",
#                 user=None,
#             )

#     async def verify_2fa_code(self, email: str, code: str) -> AuthResponse:
#         record = verification_codes_db.get(email)

#         if not record:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="No verification process pending for this email.",
#             )

#         if record["expires_at"] < datetime.datetime.utcnow():
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Verification code has expired. Please request a new one.",
#             )

#         if record["code"] != code:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Invalid 6-digit code provided.",
#             )

#         del verification_codes_db[email]

#         async with AsyncSessionLocal() as session:
#             result = await session.execute(select(User).where(User.email == email))
#             user = result.scalar_one_or_none()

#         if not user:
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

#         mock_jwt_token = f"jwt_access_token_for_{user.id}"

#         return AuthResponse(
#             token=mock_jwt_token,
#             requiresVerification=False,
#             message="Authentication successful",
#             user=UserOut(
#                 id=user.id,
#                 email=user.email,
#                 firstName=user.first_name,
#                 lastName=user.last_name,
#                 role=user.role,
#             ),
#         )


# auth_service = AuthService()




import datetime
from app.core.database import db
from app.models.user import User, VerificationCode
from app.core.security import create_access_token
from app.services.email_service import email_service


class AuthService:
    @staticmethod
    def register_user(name: str, email: str, password: str, role: str = "student"):
        """Register a new user"""
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            return False, "User with this email already exists", 400

        # Create new user
        user = User(name=name, email=email, role=role, is_email_verified=False)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        # Send verification code
        if not email_service.send_verification_code(email):
            return False, "Unable to send verification email. Please check your SMTP settings and try again.", 500

        return True, {
            "message": "Registration successful. Please verify your email.",
            "email": email,
            "requires_verification": True
        }, 201

    @staticmethod
    def login_user(email: str, password: str, role: str = None):
        """Authenticate user and send verification code"""
        user = User.query.filter_by(email=email).first()

        if not user or not user.check_password(password):
            return False, "Invalid email or password", 401

        if role and user.role != role:
            return False, f"User is registered as {user.role}, not {role}", 400

        # Send verification code
        if not email_service.send_verification_code(email):
            return False, "Unable to send verification email. Please check your SMTP settings and try again.", 500

        return True, {
            "message": "Verification code sent to your email",
            "email": email,
            "requires_verification": True,
            "user": user.to_dict()
        }, 200

    @staticmethod
    def verify_code(email: str, input_code: str):
        """Verify 6-digit code and return auth token"""
        record = VerificationCode.query.filter_by(email=email).first()

        if not record:
            return False, "No active code found. Please login again.", 404

        # Rate limit (Lockout after 3 attempts)
        if record.attempts >= 3:
            db.session.delete(record)
            db.session.commit()
            return False, "Too many failed attempts. Please login again.", 429

        # Expiration check
        if record.is_expired():
            db.session.delete(record)
            db.session.commit()
            return False, "Verification code expired. Please login again.", 400

        # Verify code
        if not record.check_code(input_code):
            record.attempts += 1
            db.session.commit()
            remaining = 3 - record.attempts
            return False, f"Invalid code. {remaining} attempt(s) left.", 400

        # Success -> Clear verification code and mark user as verified
        user = User.query.filter_by(email=email).first()
        if not user:
            db.session.delete(record)
            db.session.commit()
            return False, "User not found", 404

        user.is_email_verified = True
        db.session.delete(record)
        db.session.commit()

        # Create access token
        access_token = create_access_token(user.id, user.email, user.role)

        return True, {
            "message": "Email verified successfully",
            "access_token": access_token,
            "token_type": "bearer",
            "user": user.to_dict()
        }, 200

    @staticmethod
    def resend_code(email: str):
        """Resend verification code"""
        user = User.query.filter_by(email=email).first()

        if not user:
            return False, "User not found", 404

        existing_code = VerificationCode.query.filter_by(email=email).first()
        if existing_code:
            elapsed_seconds = (datetime.datetime.utcnow() - existing_code.created_at).total_seconds()
            if elapsed_seconds < 20:
                return False, "Please wait 20 seconds before requesting a new verification code.", 429

        if not email_service.send_verification_code(email):
            return False, "Unable to send verification email. Please check your SMTP settings and try again.", 500

        return True, {"message": "Verification code resent to your email"}, 200


auth_service = AuthService()