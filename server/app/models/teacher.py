from datetime import datetime
from app.core.database import db

class TeacherProfile(db.Model):
    __tablename__ = "teacher_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    employee_id = db.Column(db.String(50), unique=True, nullable=False)
    department = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(100), default="")
    # Comma separated class names the teacher is responsible for, e.g. "Grade 10A,Grade 11B"
    classes = db.Column(db.String(255), default="")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="teacher_profile")

    @property
    def class_list(self):
        return [c.strip() for c in (self.classes or "").split(",") if c.strip()]

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.user.name if self.user else "",
            "email": self.user.email if self.user else "",
            "employee_id": self.employee_id,
            "department": self.department,
            "subject": self.subject or "",
            "classes": self.class_list,
        }
