import datetime
from app.core.database import db

class FeeRecord(db.Model):
    __tablename__ = "fee_records"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False, index=True)
    title = db.Column(db.String(120), default="School fees")
    term = db.Column(db.String(20), default="")
    amount = db.Column(db.Float, nullable=False)
    amount_paid = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default="pending")  # 'pending', 'partial', 'paid'
    due_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    student = db.relationship("Student")

    @property
    def balance(self) -> float:
        return round((self.amount or 0.0) - (self.amount_paid or 0.0), 2)

    def sync_status(self):
        if self.balance <= 0:
            self.status = "paid"
        elif (self.amount_paid or 0.0) > 0:
            self.status = "partial"
        else:
            self.status = "pending"

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "student_name": self.student.user.name if self.student and self.student.user else "",
            "class_name": self.student.class_name if self.student else "",
            "title": self.title or "School fees",
            "term": self.term or "",
            "amount": self.amount,
            "amount_paid": self.amount_paid or 0.0,
            "balance": self.balance,
            "status": self.status,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
