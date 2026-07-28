import datetime
from app.core.database import db

class ExamResult(db.Model):
    __tablename__ = "exam_results"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False, index=True)
    exam_title = db.Column(db.String(120), default="")
    subject = db.Column(db.String(100), nullable=False)
    term = db.Column(db.String(20), default="")
    class_name = db.Column(db.String(50), default="", index=True)
    marks_obtained = db.Column(db.Float, nullable=False)
    total_marks = db.Column(db.Float, default=100.0)
    recorded_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    recorded_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    student = db.relationship("Student")
    recorder = db.relationship("User")

    @property
    def percentage(self) -> float:
        total = self.total_marks or 0
        if not total:
            return 0.0
        return round((self.marks_obtained / total) * 100, 1)

    @property
    def grade(self) -> str:
        pct = self.percentage
        if pct >= 80:
            return "A"
        if pct >= 70:
            return "B"
        if pct >= 60:
            return "C"
        if pct >= 50:
            return "D"
        return "E"

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "student_name": self.student.user.name if self.student and self.student.user else "",
            "exam_title": self.exam_title or "",
            "subject": self.subject,
            "term": self.term or "",
            "class_name": self.class_name or "",
            "marks_obtained": self.marks_obtained,
            "total_marks": self.total_marks,
            "percentage": self.percentage,
            "grade": self.grade,
            "recorded_by": self.recorder.name if self.recorder else "",
            "recorded_at": self.recorded_at.isoformat() if self.recorded_at else None,
        }
