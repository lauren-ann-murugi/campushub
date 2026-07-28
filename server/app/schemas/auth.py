from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum


class UserRoleEnum(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    ADMINISTRATOR = "administrator"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: UserRoleEnum


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: UserRoleEnum
    firstName: str = Field(..., min_length=2)
    lastName: str = Field(..., min_length=2)


class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


class ResendCodeRequest(BaseModel):
    email: EmailStr


class UserOut(BaseModel):
    id: str
    email: EmailStr
    firstName: str
    lastName: str
    role: UserRoleEnum

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    token: Optional[str] = None
    requiresVerification: bool = False
    message: str
    user: Optional[UserOut] = None