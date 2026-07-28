from app.core.database import db

class ExamResult(db.Model):
    __tablename__ = "exam_results"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    marks_obtained = db.Column(db.Float, nullable=False)
    total_marks = db.Column(db.Float, default=100.0)

    def to_dict(self):
        return {
            "id": self.id,
            "subject": self.subject,
            "marks_obtained": self.marks_obtained,
            "total_marks": self.total_marks,
        }