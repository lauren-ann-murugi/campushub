# from datetime import datetime
# from sqlalchemy import Column, DateTime, ForeignKey, String
# from sqlalchemy.orm import relationship
# from app.core.database import Base


# class Teacher(Base):
#     __tablename__ = "teachers"

#     id = Column(String, primary_key=True, index=True)
#     user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
#     employee_number = Column(String, nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

#     user = relationship("User", back_populates="teacher_profile")




from app.core.database import db

class TeacherProfile(db.Model):
    __tablename__ = "teacher_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    employee_id = db.Column(db.String(50), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False)

    user = db.relationship("User", back_populates="teacher_profile")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "employee_id": self.employee_id,
            "department": self.department,
        }