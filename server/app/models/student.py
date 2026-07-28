from datetime import datetime
from app.core.database import db

class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    registration_number = db.Column(db.String(50), unique=True, nullable=False)
    class_name = db.Column(db.String(50), default="", index=True)
    course = db.Column(db.String(100), nullable=True)
    year_of_study = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = db.relationship("User", back_populates="student_profile")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.user.name if self.user else "",
            "email": self.user.email if self.user else "",
            "registration_number": self.registration_number,
            "class_name": self.class_name or "",
            "course": self.course,
            "year_of_study": self.year_of_study,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


# Compatibility alias for older imports
StudentProfile = Student
