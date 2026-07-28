from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, text

db = SQLAlchemy()

# Alias Base so models importing 'Base' don't crash
Base = db.Model

def init_db(app=None) -> None:
    if app:
        db.init_app(app)
        with app.app_context():
            db.create_all()
            _ensure_user_schema()


def _ensure_user_schema() -> None:
    inspector = inspect(db.engine)
    table_names = inspector.get_table_names()

    if "users" in table_names:
        user_columns = {column["name"] for column in inspector.get_columns("users")}
        if "is_email_verified" not in user_columns:
            db.session.execute(
                text("ALTER TABLE users ADD COLUMN is_email_verified BOOLEAN DEFAULT 0")
            )
            db.session.commit()

    if "verification_codes" in table_names:
        code_columns = {column["name"] for column in inspector.get_columns("verification_codes")}
        if "created_at" not in code_columns:
            db.session.execute(
                text("ALTER TABLE verification_codes ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
            )
            db.session.commit()