import datetime
from app.core.database import db


class SalaryRecord(db.Model):
    __tablename__ = "salary_records"

    id = db.Column(db.Integer, primary_key=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey("teacher_profiles.id"), nullable=False, index=True)
    period = db.Column(db.String(30), nullable=False)  # "October 2025"
    gross_amount = db.Column(db.Float, nullable=False)
    deductions = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(20), default="pending")  # 'pending', 'paid'
    note = db.Column(db.String(255), default="")
    paid_on = db.Column(db.Date, nullable=True)
    issued_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    teacher = db.relationship("TeacherProfile")
    issuer = db.relationship("User")

    @property
    def net_amount(self) -> float:
        return round((self.gross_amount or 0.0) - (self.deductions or 0.0), 2)

    def to_dict(self):
        return {
            "id": self.id,
            "teacher_id": self.teacher_id,
            "teacher_name": self.teacher.user.name if self.teacher and self.teacher.user else "",
            "employee_id": self.teacher.employee_id if self.teacher else "",
            "period": self.period,
            "gross_amount": self.gross_amount,
            "deductions": self.deductions or 0.0,
            "net_amount": self.net_amount,
            "status": self.status,
            "note": self.note or "",
            "paid_on": self.paid_on.isoformat() if self.paid_on else None,
            "issued_by": self.issuer.name if self.issuer else "",
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
