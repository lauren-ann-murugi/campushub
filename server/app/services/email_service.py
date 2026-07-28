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
        # Codes expire after 10 minutes to match implementation guide
        expires_at = datetime.utcnow() + timedelta(minutes=10)

        def save_code():
            if existing_code:
                db.session.delete(existing_code)
                db.session.commit()

            record = VerificationCode(email=email, expires_at=expires_at, created_at=datetime.utcnow())
            record.set_code(raw_code)
            db.session.add(record)
            db.session.commit()

        # If no SMTP server is configured, fallback to console output
        if not settings.SMTP_SERVER:
            logger.info("[2FA CODE] %s -> %s", email, raw_code)
            print("\n==========================================")
            print(f"  [2FA CODE] FOR {email}: {raw_code} (expires in 10 minutes)")
            print("==========================================\n")
            save_code()
            return True

        if settings.SMTP_SERVER and not settings.SMTP_PASSWORD:
            logger.warning("SMTP server is configured but SMTP_PASSWORD is empty; falling back to console output for %s", email)
            print("\n==========================================")
            print(f"  [2FA CODE] FOR {email}: {raw_code} (expires in 10 minutes)")
            print("==========================================\n")
            save_code()
            return True

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"CampusHub - Verification Code: {raw_code}"
            from_addr = settings.SMTP_USER or f"no-reply@{settings.SMTP_SERVER or 'campushub.local'}"
            msg["From"] = f"CampusHub <{from_addr}>"
            msg["To"] = email

            html_content = f"""
            <div style="font-family: Arial; padding: 20px;">
                <h2>CampusHub Identity Verification</h2>
                <p>Your 6-digit code is:</p>
                <h1 style="color: #004ac6; letter-spacing: 5px;">{raw_code}</h1>
                <p>Expires in 10 minutes.</p>
            </div>
            """
            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT, timeout=10) as server:
                # Try to start TLS if supported; ignore errors for plain SMTP servers (e.g., MailHog)
                try:
                    server.starttls()
                except Exception:
                    pass

                # Only attempt login if credentials are provided
                if settings.SMTP_USER and settings.SMTP_PASSWORD:
                    server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)

                server.sendmail(from_addr, email, msg.as_string())

            save_code()
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            print("\n==========================================")
            print(f"  [2FA CODE] FOR {email}: {raw_code} (expires in 10 minutes)")
            print("==========================================\n")
            save_code()
            return True

email_service = EmailService()