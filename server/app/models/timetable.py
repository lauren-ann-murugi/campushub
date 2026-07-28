import datetime
from app.core.database import db

DAYS = ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")


class TimetableEntry(db.Model):
    __tablename__ = "timetable_entries"

    id = db.Column(db.Integer, primary_key=True)
    class_name = db.Column(db.String(50), nullable=False, index=True)
    day = db.Column(db.String(20), nullable=False)
    start_time = db.Column(db.String(10), nullable=False)  # "08:00"
    end_time = db.Column(db.String(10), nullable=False)  # "09:00"
    subject = db.Column(db.String(100), nullable=False)
    room = db.Column(db.String(50), default="")
    teacher_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    teacher = db.relationship("User")

    def to_dict(self):
        return {
            "id": self.id,
            "class_name": self.class_name,
            "day": self.day,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "subject": self.subject,
            "room": self.room or "",
            "teacher": self.teacher.name if self.teacher else "",
            "teacher_id": self.teacher_id,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
