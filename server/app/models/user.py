# from datetime import datetime
# from sqlalchemy import Column, DateTime, String
# from sqlalchemy.orm import relationship
# from app.core.database import Base


# class User(Base):
#     __tablename__ = "users"

#     id = Column(String, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True, nullable=False)
#     password_hash = Column(String, nullable=False)
#     first_name = Column(String, nullable=False)
#     last_name = Column(String, nullable=False)
#     role = Column(String, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

#     student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
#     teacher_profile = relationship("Teacher", back_populates="user", uselist=False, cascade="all, delete-orphan")
#     administrator_profile = relationship("Administrator", back_populates="user", uselist=False, cascade="all, delete-orphan")




import datetime
from app.core.database import db
from app.core.security import hash_password, verify_password

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default="student")
    is_email_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    student_profile = db.relationship(
        "Student",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    teacher_profile = db.relationship(
        "TeacherProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    administrator_profile = db.relationship(
        "Administrator",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    def set_password(self, password: str):
        self.password_hash = hash_password(password)

    def check_password(self, password: str) -> bool:
        return verify_password(password, self.password_hash)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "is_email_verified": self.is_email_verified,
            "created_at": self.created_at.isoformat()
        }


class VerificationCode(db.Model):
    __tablename__ = "verification_codes"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), index=True, nullable=False)
    code_hash = db.Column(db.String(200), nullable=False)
    attempts = db.Column(db.Integer, default=0)
    expires_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    def set_code(self, plain_code: str):
        self.code_hash = hash_password(plain_code)

    def check_code(self, plain_code: str) -> bool:
        return verify_password(plain_code, self.code_hash)

    def is_expired(self) -> bool:
        return datetime.datetime.utcnow() > self.expires_at