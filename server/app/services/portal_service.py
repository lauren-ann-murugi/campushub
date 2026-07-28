"""Shared queries for the admin, teacher and student portals.

All three portals read and write the same tables, so anything an
administrator or teacher records here is immediately visible to the
students it concerns.
"""

from datetime import date, datetime
from typing import Any, Dict, List, Optional, Tuple

from app.core.database import db
from app.models.announcement import Announcement
from app.models.attendance import AttendanceRecord
from app.models.exam import ExamResult
from app.models.fee import FeeRecord
from app.models.salary import SalaryRecord
from app.models.student import Student
from app.models.teacher import TeacherProfile
from app.models.timetable import TimetableEntry

DAY_ORDER = {
    "Monday": 0,
    "Tuesday": 1,
    "Wednesday": 2,
    "Thursday": 3,
    "Friday": 4,
    "Saturday": 5,
    "Sunday": 6,
}


def parse_date(value: Any, fallback: Optional[date] = None) -> Optional[date]:
    if isinstance(value, date):
        return value
    if not value:
        return fallback
    try:
        return datetime.strptime(str(value)[:10], "%Y-%m-%d").date()
    except ValueError:
        return None


def student_for_user(user_id: int) -> Optional[Student]:
    return Student.query.filter_by(user_id=user_id).first()


def teacher_for_user(user_id: int) -> Optional[TeacherProfile]:
    return TeacherProfile.query.filter_by(user_id=user_id).first()


def students_in_class(class_name: str) -> List[Student]:
    return (
        Student.query.filter_by(class_name=class_name)
        .join(Student.user)
        .order_by(db.text("users.name"))
        .all()
    )


def known_classes() -> List[str]:
    """Every class name referenced by a student, timetable entry or teacher."""
    names = {
        row[0]
        for row in db.session.query(Student.class_name).distinct()
        if row[0]
    }
    names.update(
        row[0] for row in db.session.query(TimetableEntry.class_name).distinct() if row[0]
    )
    for teacher in TeacherProfile.query.all():
        names.update(teacher.class_list)
    return sorted(names)


def announcements_for_teacher() -> List[Announcement]:
    return [
        a
        for a in Announcement.query.order_by(Announcement.created_at.desc()).all()
        if a.visible_to_teachers()
    ]


def announcements_for_class(class_name: str) -> List[Announcement]:
    return [
        a
        for a in Announcement.query.order_by(Announcement.created_at.desc()).all()
        if a.visible_to_class(class_name)
    ]


def attendance_summary(records: List[AttendanceRecord]) -> Dict[str, Any]:
    total = len(records)
    counts = {status: 0 for status in ("present", "absent", "late", "excused")}
    for record in records:
        counts[record.status] = counts.get(record.status, 0) + 1
    attended = counts["present"] + counts["late"] + counts["excused"]
    return {
        "total_days": total,
        "present": counts["present"],
        "absent": counts["absent"],
        "late": counts["late"],
        "excused": counts["excused"],
        "rate": round((attended / total) * 100, 1) if total else 0.0,
    }


def results_summary(results: List[ExamResult]) -> Dict[str, Any]:
    obtained = sum(r.marks_obtained for r in results)
    possible = sum(r.total_marks or 0 for r in results)
    return {
        "exams": len(results),
        "average": round((obtained / possible) * 100, 1) if possible else 0.0,
        "best_subject": max(results, key=lambda r: r.percentage).subject if results else "",
    }


def fees_summary(fees: List[FeeRecord]) -> Dict[str, Any]:
    billed = sum(f.amount or 0 for f in fees)
    paid = sum(f.amount_paid or 0 for f in fees)
    return {
        "billed": round(billed, 2),
        "paid": round(paid, 2),
        "balance": round(billed - paid, 2),
        "records": len(fees),
    }


def sorted_timetable(entries: List[TimetableEntry]) -> List[TimetableEntry]:
    return sorted(entries, key=lambda e: (DAY_ORDER.get(e.day, 9), e.start_time))


def salaries_for_teacher(teacher_id: int) -> List[SalaryRecord]:
    return (
        SalaryRecord.query.filter_by(teacher_id=teacher_id)
        .order_by(SalaryRecord.created_at.desc())
        .all()
    )


def upsert_attendance(
    class_name: str,
    on_date: date,
    records: List[Dict[str, Any]],
    marked_by: int,
) -> Tuple[List[AttendanceRecord], str]:
    """Create or update one attendance row per student for a given day."""
    valid_ids = {s.id for s in students_in_class(class_name)}
    saved: List[AttendanceRecord] = []

    for entry in records:
        student_id = entry.get("student_id")
        try:
            student_id = int(student_id)
        except (TypeError, ValueError):
            return [], "Each record needs a numeric student_id"
        if student_id not in valid_ids:
            return [], f"Student {student_id} is not in {class_name}"

        status = (entry.get("status") or "present").lower()
        if status not in ("present", "absent", "late", "excused"):
            return [], f"'{status}' is not a valid attendance status"

        record = AttendanceRecord.query.filter_by(
            student_id=student_id, date=on_date
        ).first()
        if not record:
            record = AttendanceRecord(student_id=student_id, date=on_date)
            db.session.add(record)

        record.class_name = class_name
        record.status = status
        record.note = (entry.get("note") or "").strip()
        record.marked_by = marked_by
        record.updated_at = datetime.utcnow()
        saved.append(record)

    db.session.commit()
    return saved, ""
