from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import inspect, text

db = SQLAlchemy()

# Alias Base so models importing 'Base' don't crash
Base = db.Model

def init_db(app=None) -> None:
    if app:
        db.init_app(app)
        with app.app_context():
            _drop_legacy_empty_tables()
            db.create_all()
            _ensure_user_schema()


# Columns added after the first release. SQLite cannot add them through
# create_all(), so they are patched in on boot.
ADDED_COLUMNS = {
    "students": {"class_name": "VARCHAR(50) DEFAULT ''"},
    "teacher_profiles": {
        "subject": "VARCHAR(100) DEFAULT ''",
        "classes": "VARCHAR(255) DEFAULT ''",
        "created_at": "DATETIME",
    },
    "announcements": {
        "audience": "VARCHAR(20) DEFAULT 'all'",
        "class_name": "VARCHAR(50) DEFAULT ''",
        "author_id": "INTEGER",
    },
    "fee_records": {
        "title": "VARCHAR(120) DEFAULT 'School fees'",
        "term": "VARCHAR(20) DEFAULT ''",
        "amount_paid": "FLOAT DEFAULT 0",
        "created_at": "DATETIME",
    },
    "exam_results": {
        "exam_title": "VARCHAR(120) DEFAULT ''",
        "term": "VARCHAR(20) DEFAULT ''",
        "class_name": "VARCHAR(50) DEFAULT ''",
        "recorded_by": "INTEGER",
        "recorded_at": "DATETIME",
    },
}

# Tables whose primary key type changed from TEXT to INTEGER. They are only
# dropped while still empty, so no data can be lost.
RETYPED_TABLES = ("students",)


def _drop_legacy_empty_tables() -> None:
    inspector = inspect(db.engine)
    for table in RETYPED_TABLES:
        if table not in inspector.get_table_names():
            continue
        id_column = next(
            (c for c in inspector.get_columns(table) if c["name"] == "id"), None
        )
        if not id_column or "INT" in str(id_column["type"]).upper():
            continue
        rows = db.session.execute(text(f"SELECT COUNT(*) FROM {table}")).scalar()
        if not rows:
            db.session.execute(text(f"DROP TABLE {table}"))
            db.session.commit()


def _ensure_user_schema() -> None:
    inspector = inspect(db.engine)
    table_names = inspector.get_table_names()

    for table, columns in ADDED_COLUMNS.items():
        if table not in table_names:
            continue
        existing = {column["name"] for column in inspector.get_columns(table)}
        for name, definition in columns.items():
            if name not in existing:
                db.session.execute(
                    text(f"ALTER TABLE {table} ADD COLUMN {name} {definition}")
                )
        db.session.commit()

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