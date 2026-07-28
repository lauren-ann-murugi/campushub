#!/usr/bin/env python3
import sys
from pathlib import Path
import os

# Ensure server package is importable
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.database import db
from app.models.user import VerificationCode
import datetime

if len(sys.argv) < 3:
    print("Usage: set_test_code.py <email> <code>")
    sys.exit(1)

email = sys.argv[1]
code = sys.argv[2]

from main import app

with app.app_context():
    # Remove existing code for this email
    existing = VerificationCode.query.filter_by(email=email).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()

    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    record = VerificationCode(email=email, expires_at=expires_at, created_at=datetime.datetime.utcnow())
    record.set_code(code)
    db.session.add(record)
    db.session.commit()

    print(f"Set verification code for {email} to {code} (hashed in DB)")
