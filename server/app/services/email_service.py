import secrets
import smtplib
import logging
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from app.core.config import settings
from app.core.database import db
from app.models.user import VerificationCode

logger = logging.getLogger("campushub")

class EmailService:
    @staticmethod
    def generate_code() -> str:
        code = secrets.randbelow(900_000) + 100_000
        return str(code)

    @classmethod
    def send_verification_code(cls, email: str) -> bool:
        existing_code = VerificationCode.query.filter_by(email=email).first()
        raw_code = cls.generate_code()
        expires_at = datetime.utcnow() + timedelta(seconds=20)

        def save_code():
            if existing_code:
                db.session.delete(existing_code)
                db.session.commit()

            record = VerificationCode(email=email, expires_at=expires_at, created_at=datetime.utcnow())
            record.set_code(raw_code)
            db.session.add(record)
            db.session.commit()

        if not settings.SMTP_USER or not settings.SMTP_PASSWORD or not settings.SMTP_USER.strip() or not settings.SMTP_PASSWORD.strip():
            print("\n==========================================")
            print(f"  [2FA CODE] FOR {email}: {raw_code}")
            print("==========================================\n")
            save_code()
            return True

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"CampusHub - Verification Code: {raw_code}"
            msg["From"] = f"CampusHub <{settings.SMTP_USER}>"
            msg["To"] = email

            html_content = f"""
            <div style="font-family: Arial; padding: 20px;">
                <h2>CampusHub Identity Verification</h2>
                <p>Your 6-digit code is:</p>
                <h1 style="color: #004ac6; letter-spacing: 5px;">{raw_code}</h1>
                <p>Expires in 20 seconds.</p>
            </div>
            """
            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT, timeout=10) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.SMTP_USER, email, msg.as_string())

            save_code()
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            print("\n==========================================")
            print(f"  [2FA CODE] FOR {email}: {raw_code}")
            print("==========================================\n")
            save_code()
            return True

email_service = EmailService()