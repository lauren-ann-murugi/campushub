from datetime import date

from flask import Blueprint, jsonify, request

from app.api.deps import require_role
from app.core.database import db
from app.models.attendance import AttendanceRecord
from app.models.exam import ExamResult
from app.models.student import Student
from app.models.timetable import DAYS, TimetableEntry
from app.services import portal_service
from app.utils.exceptions import error_response

teacher_bp = Blueprint("teacher", __name__)


def _teacher_or_error(current_user):
    teacher = portal_service.teacher_for_user(current_user.id)
    if not teacher:
        return None, error_response("Teacher profile not found", 404)
    return teacher, None


def _class_or_error(teacher, class_name):
    if not class_name:
        return None, error_response("class_name is required", 400)
    if teacher.class_list and class_name not in teacher.class_list:
        return None, error_response(f"You are not assigned to {class_name}", 403)
    return class_name, None


@teacher_bp.route("/profile", methods=["GET"])
@require_role("teacher")
def get_teacher_profile(current_user):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err
    return jsonify(teacher.to_dict()), 200


@teacher_bp.route("/classes", methods=["GET"])
@require_role("teacher")
def list_classes(current_user):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    classes = [
        {"class_name": name, "students": len(portal_service.students_in_class(name))}
        for name in teacher.class_list
    ]
    return jsonify({"classes": classes}), 200


@teacher_bp.route("/students", methods=["GET"])
@require_role("teacher")
def list_students(current_user):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    class_name = request.args.get("class_name")
    names = [class_name] if class_name else teacher.class_list
    if class_name and teacher.class_list and class_name not in teacher.class_list:
        return error_response(f"You are not assigned to {class_name}", 403)

    students = []
    for name in names:
        students.extend(portal_service.students_in_class(name))

    return (
        jsonify(
            {
                "students": [s.to_dict() for s in students],
                "classes": teacher.class_list,
            }
        ),
        200,
    )


# ----------------------------------------------------------------- attendance


@teacher_bp.route("/attendance", methods=["GET"])
@require_role("teacher")
def get_attendance(current_user):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    class_name, err = _class_or_error(teacher, request.args.get("class_name"))
    if err:
        return err

    on_date = portal_service.parse_date(request.args.get("date"), date.today())
    if not on_date:
        return error_response("Date must be YYYY-MM-DD", 400)

    students = portal_service.students_in_class(class_name)
    existing = {
        record.student_id: record
        for record in AttendanceRecord.query.filter_by(
            class_name=class_name, date=on_date
        ).all()
    }

    roll = []
    for student in students:
        record = existing.get(student.id)
        roll.append(
            {
                "student_id": student.id,
                "student_name": student.user.name if student.user else "",
                "registration_number": student.registration_number,
                "status": record.status if record else "present",
                "note": record.note if record else "",
                "saved": bool(record),
            }
        )

    history = (
        AttendanceRecord.query.filter_by(class_name=class_name)
        .order_by(AttendanceRecord.date.desc())
        .limit(200)
        .all()
    )

    return (
        jsonify(
            {
                "class_name": class_name,
                "date": on_date.isoformat(),
                "roll": roll,
                "summary": portal_service.attendance_summary(history),
            }
        ),
        200,
    )


@teacher_bp.route("/attendance", methods=["POST"])
@require_role("teacher")
def mark_attendance(current_user):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    payload = request.get_json(silent=True) or {}
    class_name, err = _class_or_error(teacher, (payload.get("class_name") or "").strip())
    if err:
        return err

    on_date = portal_service.parse_date(payload.get("date"), date.today())
    if not on_date:
        return error_response("Date must be YYYY-MM-DD", 400)
    if on_date > date.today():
        return error_response("Attendance cannot be marked for a future date", 400)

    records = payload.get("records")
    if not isinstance(records, list) or not records:
        return error_response("No attendance records submitted", 400)

    saved, error = portal_service.upsert_attendance(
        class_name, on_date, records, current_user.id
    )
    if error:
        db.session.rollback()
        return error_response(error, 400)

    return (
        jsonify(
            {
                "message": f"Attendance saved for {class_name}",
                "records": [r.to_dict() for r in saved],
            }
        ),
        200,
    )


# -------------------------------------------------------------------- results


@teacher_bp.route("/results", methods=["GET"])
@require_role("teacher")
def list_results(current_user):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    class_name = request.args.get("class_name")
    query = ExamResult.query
    if class_name:
        query = query.filter_by(class_name=class_name)
    elif teacher.class_list:
        query = query.filter(ExamResult.class_name.in_(teacher.class_list))

    results = query.order_by(ExamResult.recorded_at.desc()).all()
    return (
        jsonify(
            {
                "results": [r.to_dict() for r in results],
                "summary": portal_service.results_summary(results),
                "classes": teacher.class_list,
            }
        ),
        200,
    )


@teacher_bp.route("/results", methods=["POST"])
@require_role("teacher")
def create_result(current_user):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    payload = request.get_json(silent=True) or {}

    try:
        student_id = int(payload.get("student_id"))
    except (TypeError, ValueError):
        return error_response("Select a student", 400)

    student = db.session.get(Student, student_id)
    if not student:
        return error_response("Student not found", 404)

    class_name, err = _class_or_error(teacher, student.class_name)
    if err:
        return err

    subject = (payload.get("subject") or teacher.subject or "").strip()
    if not subject:
        return error_response("Subject is required", 400)

    try:
        marks_obtained = float(payload.get("marks_obtained"))
        total_marks = float(payload.get("total_marks") or 100)
    except (TypeError, ValueError):
        return error_response("Marks must be numbers", 400)
    if total_marks <= 0:
        return error_response("Total marks must be greater than zero", 400)
    if marks_obtained < 0 or marks_obtained > total_marks:
        return error_response("Marks obtained must be between 0 and the total marks", 400)

    result = ExamResult(
        student_id=student.id,
        exam_title=(payload.get("exam_title") or "").strip(),
        subject=subject,
        term=(payload.get("term") or "").strip(),
        class_name=class_name,
        marks_obtained=marks_obtained,
        total_marks=total_marks,
        recorded_by=current_user.id,
    )
    db.session.add(result)
    db.session.commit()

    return jsonify({"message": "Result published to student", "result": result.to_dict()}), 201


@teacher_bp.route("/results/<int:result_id>", methods=["PUT"])
@require_role("teacher")
def update_result(current_user, result_id):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    result = db.session.get(ExamResult, result_id)
    if not result:
        return error_response("Result not found", 404)

    _, err = _class_or_error(teacher, result.class_name)
    if err:
        return err

    payload = request.get_json(silent=True) or {}
    if "marks_obtained" in payload or "total_marks" in payload:
        try:
            marks_obtained = float(payload.get("marks_obtained", result.marks_obtained))
            total_marks = float(payload.get("total_marks", result.total_marks))
        except (TypeError, ValueError):
            return error_response("Marks must be numbers", 400)
        if total_marks <= 0:
            return error_response("Total marks must be greater than zero", 400)
        if marks_obtained < 0 or marks_obtained > total_marks:
            return error_response(
                "Marks obtained must be between 0 and the total marks", 400
            )
        result.marks_obtained = marks_obtained
        result.total_marks = total_marks

    for field in ("exam_title", "subject", "term"):
        if field in payload:
            setattr(result, field, (payload.get(field) or "").strip())

    if not result.subject:
        return error_response("Subject is required", 400)

    result.recorded_by = current_user.id
    db.session.commit()

    return jsonify({"message": "Result updated", "result": result.to_dict()}), 200


@teacher_bp.route("/results/<int:result_id>", methods=["DELETE"])
@require_role("teacher")
def delete_result(current_user, result_id):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    result = db.session.get(ExamResult, result_id)
    if not result:
        return error_response("Result not found", 404)

    _, err = _class_or_error(teacher, result.class_name)
    if err:
        return err

    db.session.delete(result)
    db.session.commit()
    return jsonify({"message": "Result deleted"}), 200


# ------------------------------------------------------------------ timetable


@teacher_bp.route("/timetable", methods=["GET"])
@require_role("teacher")
def get_timetable(current_user):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    class_name = request.args.get("class_name")
    query = TimetableEntry.query
    if class_name:
        query = query.filter_by(class_name=class_name)
    elif teacher.class_list:
        query = query.filter(TimetableEntry.class_name.in_(teacher.class_list))

    entries = portal_service.sorted_timetable(query.all())
    return (
        jsonify(
            {
                "entries": [e.to_dict() for e in entries],
                "classes": teacher.class_list,
                "days": list(DAYS),
            }
        ),
        200,
    )


def _timetable_payload(teacher, payload):
    class_name, err = _class_or_error(teacher, (payload.get("class_name") or "").strip())
    if err:
        return None, err

    day = (payload.get("day") or "").strip().title()
    if day not in DAYS:
        return None, error_response(f"Day must be one of: {', '.join(DAYS)}", 400)

    subject = (payload.get("subject") or "").strip()
    if not subject:
        return None, error_response("Subject is required", 400)

    start_time = (payload.get("start_time") or "").strip()
    end_time = (payload.get("end_time") or "").strip()
    if not start_time or not end_time:
        return None, error_response("Start and end time are required", 400)
    if end_time <= start_time:
        return None, error_response("End time must be after the start time", 400)

    return (
        {
            "class_name": class_name,
            "day": day,
            "subject": subject,
            "start_time": start_time,
            "end_time": end_time,
            "room": (payload.get("room") or "").strip(),
        },
        None,
    )


@teacher_bp.route("/timetable", methods=["POST"])
@require_role("teacher")
def create_timetable_entry(current_user):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    values, err = _timetable_payload(teacher, request.get_json(silent=True) or {})
    if err:
        return err

    entry = TimetableEntry(**values, teacher_id=current_user.id)
    db.session.add(entry)
    db.session.commit()

    return jsonify({"message": "Timetable updated", "entry": entry.to_dict()}), 201


@teacher_bp.route("/timetable/<int:entry_id>", methods=["PUT"])
@require_role("teacher")
def update_timetable_entry(current_user, entry_id):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    entry = db.session.get(TimetableEntry, entry_id)
    if not entry:
        return error_response("Timetable entry not found", 404)

    payload = request.get_json(silent=True) or {}
    payload.setdefault("class_name", entry.class_name)
    payload.setdefault("day", entry.day)
    payload.setdefault("subject", entry.subject)
    payload.setdefault("start_time", entry.start_time)
    payload.setdefault("end_time", entry.end_time)
    payload.setdefault("room", entry.room)

    values, err = _timetable_payload(teacher, payload)
    if err:
        return err

    for field, value in values.items():
        setattr(entry, field, value)
    entry.teacher_id = current_user.id
    db.session.commit()

    return jsonify({"message": "Timetable updated", "entry": entry.to_dict()}), 200


@teacher_bp.route("/timetable/<int:entry_id>", methods=["DELETE"])
@require_role("teacher")
def delete_timetable_entry(current_user, entry_id):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    entry = db.session.get(TimetableEntry, entry_id)
    if not entry:
        return error_response("Timetable entry not found", 404)

    _, err = _class_or_error(teacher, entry.class_name)
    if err:
        return err

    db.session.delete(entry)
    db.session.commit()
    return jsonify({"message": "Timetable entry deleted"}), 200


# ------------------------------------------------- announcements and payslips


@teacher_bp.route("/announcements", methods=["GET"])
@require_role("teacher")
def list_announcements(current_user):
    announcements = portal_service.announcements_for_teacher()
    return jsonify({"announcements": [a.to_dict() for a in announcements]}), 200


@teacher_bp.route("/salaries", methods=["GET"])
@require_role("teacher")
def list_salaries(current_user):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    salaries = portal_service.salaries_for_teacher(teacher.id)
    return jsonify({"salaries": [s.to_dict() for s in salaries]}), 200


@teacher_bp.route("/overview", methods=["GET"])
@require_role("teacher")
def teacher_overview(current_user):
    teacher, err = _teacher_or_error(current_user)
    if err:
        return err

    students = [s for name in teacher.class_list for s in portal_service.students_in_class(name)]
    today = date.today()
    marked_today = AttendanceRecord.query.filter(
        AttendanceRecord.date == today,
        AttendanceRecord.class_name.in_(teacher.class_list or [""]),
    ).count()
    results = (
        ExamResult.query.filter(ExamResult.class_name.in_(teacher.class_list or [""]))
        .order_by(ExamResult.recorded_at.desc())
        .limit(5)
        .all()
    )
    announcements = portal_service.announcements_for_teacher()[:5]

    return (
        jsonify(
            {
                "profile": teacher.to_dict(),
                "stats": {
                    "classes": len(teacher.class_list),
                    "students": len(students),
                    "attendance_marked_today": marked_today,
                    "results_recorded": ExamResult.query.filter(
                        ExamResult.class_name.in_(teacher.class_list or [""])
                    ).count(),
                },
                "recent_results": [r.to_dict() for r in results],
                "announcements": [a.to_dict() for a in announcements],
            }
        ),
        200,
    )


@teacher_bp.route("/grades", methods=["POST"])
@require_role("teacher")
def submit_grades(current_user):
    """Backwards compatible alias for POST /teacher/results."""
    return create_result()


__all__ = ["teacher_bp"]
