from datetime import date

from flask import Blueprint, jsonify

from app.api.deps import require_role
from app.models.attendance import AttendanceRecord
from app.models.exam import ExamResult
from app.models.fee import FeeRecord
from app.models.timetable import TimetableEntry
from app.services import portal_service
from app.utils.exceptions import error_response

student_bp = Blueprint("student", __name__)


def _student_or_error(current_user):
    student = portal_service.student_for_user(current_user.id)
    if not student:
        return None, error_response("Student profile not found", 404)
    return student, None


def _attendance_for(student):
    return (
        AttendanceRecord.query.filter_by(student_id=student.id)
        .order_by(AttendanceRecord.date.desc())
        .all()
    )


def _results_for(student):
    return (
        ExamResult.query.filter_by(student_id=student.id)
        .order_by(ExamResult.recorded_at.desc())
        .all()
    )


def _fees_for(student):
    return (
        FeeRecord.query.filter_by(student_id=student.id)
        .order_by(FeeRecord.due_date.asc())
        .all()
    )


@student_bp.route("/dashboard", methods=["GET"])
@require_role("student")
def student_dashboard(current_user):
    student, err = _student_or_error(current_user)
    if err:
        return err

    attendance = _attendance_for(student)
    results = _results_for(student)
    fees = _fees_for(student)
    announcements = portal_service.announcements_for_class(student.class_name)
    timetable = portal_service.sorted_timetable(
        TimetableEntry.query.filter_by(class_name=student.class_name).all()
    )
    today = date.today().strftime("%A")

    return (
        jsonify(
            {
                "profile": student.to_dict(),
                "attendance_summary": portal_service.attendance_summary(attendance),
                "results_summary": portal_service.results_summary(results),
                "fees_summary": portal_service.fees_summary(fees),
                "recent_results": [r.to_dict() for r in results[:5]],
                "announcements": [a.to_dict() for a in announcements[:5]],
                "today_classes": [e.to_dict() for e in timetable if e.day == today],
            }
        ),
        200,
    )


@student_bp.route("/attendance", methods=["GET"])
@require_role("student")
def student_attendance(current_user):
    student, err = _student_or_error(current_user)
    if err:
        return err

    records = _attendance_for(student)
    return (
        jsonify(
            {
                "records": [r.to_dict() for r in records],
                "summary": portal_service.attendance_summary(records),
            }
        ),
        200,
    )


@student_bp.route("/results", methods=["GET"])
@require_role("student")
def student_results(current_user):
    student, err = _student_or_error(current_user)
    if err:
        return err

    results = _results_for(student)
    return (
        jsonify(
            {
                "results": [r.to_dict() for r in results],
                "summary": portal_service.results_summary(results),
            }
        ),
        200,
    )


@student_bp.route("/timetable", methods=["GET"])
@require_role("student")
def student_timetable(current_user):
    student, err = _student_or_error(current_user)
    if err:
        return err

    entries = portal_service.sorted_timetable(
        TimetableEntry.query.filter_by(class_name=student.class_name).all()
    )
    return (
        jsonify(
            {
                "class_name": student.class_name,
                "entries": [e.to_dict() for e in entries],
            }
        ),
        200,
    )


@student_bp.route("/fees", methods=["GET"])
@require_role("student")
def student_fees(current_user):
    student, err = _student_or_error(current_user)
    if err:
        return err

    fees = _fees_for(student)
    return (
        jsonify(
            {
                "fees": [f.to_dict() for f in fees],
                "summary": portal_service.fees_summary(fees),
            }
        ),
        200,
    )


@student_bp.route("/announcements", methods=["GET"])
@require_role("student")
def student_announcements(current_user):
    student, err = _student_or_error(current_user)
    if err:
        return err

    announcements = portal_service.announcements_for_class(student.class_name)
    return jsonify({"announcements": [a.to_dict() for a in announcements]}), 200


__all__ = ["student_bp"]
