import datetime
from app.core.database import db


class AdminSetting(db.Model):
    __tablename__ = "admin_settings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    # School profile
    school_name = db.Column(db.String(120), default="CampusHub Main Campus")
    school_email = db.Column(db.String(120), default="")
    school_phone = db.Column(db.String(40), default="")
    school_address = db.Column(db.String(255), default="")

    # Academic configuration
    academic_year = db.Column(db.String(20), default="2025/2026")
    current_term = db.Column(db.String(20), default="Term 1")
    timezone = db.Column(db.String(60), default="Africa/Nairobi")

    # Notification preferences
    email_notifications = db.Column(db.Boolean, default=True)
    sms_notifications = db.Column(db.Boolean, default=False)
    push_notifications = db.Column(db.Boolean, default=True)
    weekly_digest = db.Column(db.Boolean, default=True)

    # Security and access
    two_factor_required = db.Column(db.Boolean, default=True)
    allow_self_registration = db.Column(db.Boolean, default=True)
    maintenance_mode = db.Column(db.Boolean, default=False)
    session_timeout_minutes = db.Column(db.Integer, default=30)

    updated_at = db.Column(
        db.DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
    )

    BOOLEAN_FIELDS = (
        "email_notifications",
        "sms_notifications",
        "push_notifications",
        "weekly_digest",
        "two_factor_required",
        "allow_self_registration",
        "maintenance_mode",
    )

    STRING_FIELDS = (
        "school_name",
        "school_email",
        "school_phone",
        "school_address",
        "academic_year",
        "current_term",
        "timezone",
    )

    def to_dict(self):
        payload = {field: getattr(self, field) or "" for field in self.STRING_FIELDS}
        payload.update({field: bool(getattr(self, field)) for field in self.BOOLEAN_FIELDS})
        payload["session_timeout_minutes"] = self.session_timeout_minutes
        payload["updated_at"] = self.updated_at.isoformat() if self.updated_at else None
        return payload
