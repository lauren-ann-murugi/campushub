import datetime
from app.core.database import db

class FeeRecord(db.Model):
    __tablename__ = "fee_records"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default="pending")  # 'pending', 'paid'
    due_date = db.Column(db.DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "amount": self.amount,
            "status": self.status,
            "due_date": self.due_date.isoformat(),
        }