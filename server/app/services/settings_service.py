from typing import Any, Dict, Tuple

from app.core.database import db
from app.models.setting import AdminSetting


class SettingsService:
    @staticmethod
    def get_or_create(user_id: int) -> AdminSetting:
        settings = AdminSetting.query.filter_by(user_id=user_id).first()
        if not settings:
            settings = AdminSetting(user_id=user_id)
            db.session.add(settings)
            db.session.commit()
        return settings

    @staticmethod
    def update(user_id: int, payload: Dict[str, Any]) -> Tuple[AdminSetting, str]:
        settings = SettingsService.get_or_create(user_id)

        for field in AdminSetting.STRING_FIELDS:
            if field in payload:
                value = payload[field]
                if value is not None and not isinstance(value, str):
                    return settings, f"'{field}' must be text"
                setattr(settings, field, (value or "").strip())

        for field in AdminSetting.BOOLEAN_FIELDS:
            if field in payload:
                setattr(settings, field, bool(payload[field]))

        if "session_timeout_minutes" in payload:
            try:
                timeout = int(payload["session_timeout_minutes"])
            except (TypeError, ValueError):
                return settings, "'session_timeout_minutes' must be a number"
            if timeout < 5 or timeout > 480:
                return settings, "Session timeout must be between 5 and 480 minutes"
            settings.session_timeout_minutes = timeout

        if not settings.school_name:
            return settings, "School name is required"

        db.session.commit()
        return settings, ""


settings_service = SettingsService()
