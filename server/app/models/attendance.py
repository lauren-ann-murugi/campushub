import datetime
from app.core.database import db

STATUSES = ("present", "absent", "late", "excused")


class AttendanceRecord(db.Model):
    __tablename__ = "attendance_records"
    __table_args__ = (
        db.UniqueConstraint("student_id", "date", name="uq_attendance_student_date"),
    )

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False, index=True)
    class_name = db.Column(db.String(50), default="", index=True)
    date = db.Column(db.Date, nullable=False, index=True)
    status = db.Column(db.String(20), default="present")
    note = db.Column(db.String(255), default="")
    marked_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    student = db.relationship("Student")
    marker = db.relationship("User")

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "student_name": self.student.user.name if self.student and self.student.user else "",
            "registration_number": self.student.registration_number if self.student else "",
            "class_name": self.class_name or "",
            "date": self.date.isoformat() if self.date else None,
            "status": self.status,
            "note": self.note or "",
            "marked_by": self.marker.name if self.marker else "",
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
