# from datetime import datetime
# from sqlalchemy import Column, DateTime, ForeignKey, String
# from sqlalchemy.orm import relationship
# from app.core.database import Base


# class Student(Base):
#     __tablename__ = "students"

#     id = Column(String, primary_key=True, index=True)
#     user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
#     admission_number = Column(String, nullable=True)
#     created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

#     user = relationship("User", back_populates="student_profile")



from datetime import datetime
from app.core.database import db

class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.String, primary_key=True, index=True)
    user_id = db.Column(db.String, db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)
    course = db.Column(db.String(100), nullable=True)
    year_of_study = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="student_profile")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "registration_number": self.registration_number,
            "course": self.course,
            "year_of_study": self.year_of_study,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# Compatibility alias for older imports
StudentProfile = Student