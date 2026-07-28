from datetime import date, timedelta

from flask import Blueprint, jsonify, request

from app.api.deps import require_role
from app.core.database import db
from app.models.announcement import AUDIENCES, Announcement
from app.models.attendance import AttendanceRecord
from app.models.exam import ExamResult
from app.models.fee import FeeRecord
from app.models.salary import SalaryRecord
from app.models.student import Student
from app.models.teacher import TeacherProfile
from app.models.timetable import TimetableEntry
from app.models.user import User
from app.services import portal_service
from app.services.dashboard_service import dashboard_service
from app.services.settings_service import settings_service
from app.utils.exceptions import error_response

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/dashboard", methods=["GET"])
@require_role("administrator")
def admin_dashboard(current_user):
    summary = dashboard_service.get_admin_dashboard_summary()
    return jsonify(summary), 200


@admin_bp.route("/settings", methods=["GET"])
@require_role("administrator")
def get_settings(current_user):
    settings = settings_service.get_or_create(current_user.id)
    return jsonify({"settings": settings.to_dict()}), 200


@admin_bp.route("/settings", methods=["PUT"])
@require_role("administrator")
def update_settings(current_user):
    payload = request.get_json(silent=True) or {}
    if not payload:
        return error_response("No settings provided", 400)

    settings, error = settings_service.update(current_user.id, payload)
    if error:
        db.session.rollback()
        return error_response(error, 400)

    return jsonify({"message": "Settings saved", "settings": settings.to_dict()}), 200


# ---------------------------------------------------------------- announcements


@admin_bp.route("/announcements", methods=["GET"])
@require_role("administrator")
def list_announcements(current_user):
    announcements = Announcement.query.order_by(Announcement.created_at.desc()).all()
    return (
        jsonify(
            {
                "announcements": [a.to_dict() for a in announcements],
                "classes": portal_service.known_classes(),
            }
        ),
        200,
    )


@admin_bp.route("/announcements", methods=["POST"])
@require_role("administrator")
def create_announcement(current_user):
    payload = request.get_json(silent=True) or {}
    title = (payload.get("title") or "").strip()
    content = (payload.get("content") or "").strip()
    audience = (payload.get("audience") or "all").strip().lower()
    class_name = (payload.get("class_name") or "").strip()

    if not title or not content:
        return error_response("Title and message are required", 400)
    if audience not in AUDIENCES:
        return error_response(f"Audience must be one of: {', '.join(AUDIENCES)}", 400)
    if audience == "class" and not class_name:
        return error_response("Select a class for a class announcement", 400)

    announcement = Announcement(
        title=title,
        content=content,
        audience=audience,
        class_name=class_name if audience == "class" else "",
        author_id=current_user.id,
    )
    db.session.add(announcement)
    db.session.commit()

    return (
        jsonify({"message": "Announcement published", "announcement": announcement.to_dict()}),
        201,
    )


@admin_bp.route("/announcements/<int:announcement_id>", methods=["DELETE"])
@require_role("administrator")
def delete_announcement(current_user, announcement_id):
    announcement = db.session.get(Announcement, announcement_id)
    if not announcement:
        return error_response("Announcement not found", 404)

    db.session.delete(announcement)
    db.session.commit()
    return jsonify({"message": "Announcement deleted"}), 200


# --------------------------------------------------------------------- people


@admin_bp.route("/students", methods=["GET"])
@require_role("administrator")
def list_students(current_user):
    class_name = request.args.get("class_name")
    query = Student.query
    if class_name:
        query = query.filter_by(class_name=class_name)
    students = query.all()
    return (
        jsonify(
            {
                "students": [s.to_dict() for s in students],
                "classes": portal_service.known_classes(),
            }
        ),
        200,
    )


@admin_bp.route("/students", methods=["POST"])
@require_role("administrator")
def create_student(current_user):
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    registration_number = (payload.get("registration_number") or "").strip()
    class_name = (payload.get("class_name") or "").strip()

    if not name or not email or not registration_number:
        return error_response("Name, email and registration number are required", 400)
    if User.query.filter_by(email=email).first():
        return error_response("A user with that email already exists", 400)
    if Student.query.filter_by(registration_number=registration_number).first():
        return error_response("That registration number is already in use", 400)

    user = User(name=name, email=email, role="student", is_email_verified=True)
    user.set_password(payload.get("password") or registration_number)
    db.session.add(user)
    db.session.flush()

    student = Student(
        user_id=user.id,
        registration_number=registration_number,
        class_name=class_name,
        course=(payload.get("course") or "").strip(),
        year_of_study=int(payload.get("year_of_study") or 1),
    )
    db.session.add(student)
    db.session.commit()

    return jsonify({"message": "Student added", "student": student.to_dict()}), 201


@admin_bp.route("/students/<int:student_id>", methods=["PUT"])
@require_role("administrator")
def update_student(current_user, student_id):
    student = db.session.get(Student, student_id)
    if not student:
        return error_response("Student not found", 404)

    payload = request.get_json(silent=True) or {}
    if "class_name" in payload:
        student.class_name = (payload.get("class_name") or "").strip()
    if "course" in payload:
        student.course = (payload.get("course") or "").strip()
    if "year_of_study" in payload:
        try:
            student.year_of_study = int(payload["year_of_study"])
        except (TypeError, ValueError):
            return error_response("Year of study must be a number", 400)

    db.session.commit()
    return jsonify({"message": "Student updated", "student": student.to_dict()}), 200


@admin_bp.route("/teachers", methods=["GET"])
@require_role("administrator")
def list_teachers(current_user):
    teachers = TeacherProfile.query.all()
    return jsonify({"teachers": [t.to_dict() for t in teachers]}), 200


@admin_bp.route("/teachers", methods=["POST"])
@require_role("administrator")
def create_teacher(current_user):
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    employee_id = (payload.get("employee_id") or "").strip()
    department = (payload.get("department") or "").strip()

    if not name or not email or not employee_id or not department:
        return error_response("Name, email, employee ID and department are required", 400)
    if User.query.filter_by(email=email).first():
        return error_response("A user with that email already exists", 400)
    if TeacherProfile.query.filter_by(employee_id=employee_id).first():
        return error_response("That employee ID is already in use", 400)

    classes = payload.get("classes") or []
    if isinstance(classes, str):
        classes = [c.strip() for c in classes.split(",") if c.strip()]

    user = User(name=name, email=email, role="teacher", is_email_verified=True)
    user.set_password(payload.get("password") or employee_id)
    db.session.add(user)
    db.session.flush()

    teacher = TeacherProfile(
        user_id=user.id,
        employee_id=employee_id,
        department=department,
        subject=(payload.get("subject") or "").strip(),
        classes=",".join(classes),
    )
    db.session.add(teacher)
    db.session.commit()

    return jsonify({"message": "Teacher added", "teacher": teacher.to_dict()}), 201


@admin_bp.route("/teachers/<int:teacher_id>", methods=["PUT"])
@require_role("administrator")
def update_teacher(current_user, teacher_id):
    teacher = db.session.get(TeacherProfile, teacher_id)
    if not teacher:
        return error_response("Teacher not found", 404)

    payload = request.get_json(silent=True) or {}
    if "department" in payload:
        teacher.department = (payload.get("department") or "").strip()
    if "subject" in payload:
        teacher.subject = (payload.get("subject") or "").strip()
    if "classes" in payload:
        classes = payload.get("classes") or []
        if isinstance(classes, str):
            classes = [c.strip() for c in classes.split(",") if c.strip()]
        teacher.classes = ",".join(classes)

    db.session.commit()
    return jsonify({"message": "Teacher updated", "teacher": teacher.to_dict()}), 200


# ----------------------------------------------------------------------- fees


@admin_bp.route("/fees", methods=["GET"])
@require_role("administrator")
def list_fees(current_user):
    fees = FeeRecord.query.order_by(FeeRecord.created_at.desc()).all()
    return (
        jsonify(
            {
                "fees": [f.to_dict() for f in fees],
                "summary": portal_service.fees_summary(fees),
            }
        ),
        200,
    )


@admin_bp.route("/fees", methods=["POST"])
@require_role("administrator")
def create_fee(current_user):
    payload = request.get_json(silent=True) or {}

    try:
        student_id = int(payload.get("student_id"))
    except (TypeError, ValueError):
        return error_response("Select a student", 400)

    student = db.session.get(Student, student_id)
    if not student:
        return error_response("Student not found", 404)

    try:
        amount = float(payload.get("amount"))
    except (TypeError, ValueError):
        return error_response("Amount must be a number", 400)
    if amount <= 0:
        return error_response("Amount must be greater than zero", 400)

    due_date = portal_service.parse_date(
        payload.get("due_date"), date.today() + timedelta(days=30)
    )
    if not due_date:
        return error_response("Due date must be a valid date", 400)

    fee = FeeRecord(
        student_id=student.id,
        title=(payload.get("title") or "School fees").strip(),
        term=(payload.get("term") or "").strip(),
        amount=amount,
        amount_paid=float(payload.get("amount_paid") or 0),
        due_date=due_date,
    )
    fee.sync_status()
    db.session.add(fee)
    db.session.commit()

    return jsonify({"message": "Fee issued to student", "fee": fee.to_dict()}), 201


@admin_bp.route("/fees/<int:fee_id>", methods=["PUT"])
@require_role("administrator")
def update_fee(current_user, fee_id):
    fee = db.session.get(FeeRecord, fee_id)
    if not fee:
        return error_response("Fee record not found", 404)

    payload = request.get_json(silent=True) or {}
    if "amount_paid" in payload:
        try:
            amount_paid = float(payload["amount_paid"])
        except (TypeError, ValueError):
            return error_response("Amount paid must be a number", 400)
        if amount_paid < 0 or amount_paid > fee.amount:
            return error_response("Amount paid must be between 0 and the fee amount", 400)
        fee.amount_paid = amount_paid

    fee.sync_status()
    db.session.commit()
    return jsonify({"message": "Fee record updated", "fee": fee.to_dict()}), 200


@admin_bp.route("/fees/<int:fee_id>", methods=["DELETE"])
@require_role("administrator")
def delete_fee(current_user, fee_id):
    fee = db.session.get(FeeRecord, fee_id)
    if not fee:
        return error_response("Fee record not found", 404)

    db.session.delete(fee)
    db.session.commit()
    return jsonify({"message": "Fee record deleted"}), 200


# ------------------------------------------------------------------- salaries


@admin_bp.route("/salaries", methods=["GET"])
@require_role("administrator")
def list_salaries(current_user):
    salaries = SalaryRecord.query.order_by(SalaryRecord.created_at.desc()).all()
    return (
        jsonify(
            {
                "salaries": [s.to_dict() for s in salaries],
                "summary": {
                    "gross": round(sum(s.gross_amount or 0 for s in salaries), 2),
                    "net": round(sum(s.net_amount for s in salaries), 2),
                    "pending": sum(1 for s in salaries if s.status != "paid"),
                    "paid": sum(1 for s in salaries if s.status == "paid"),
                },
            }
        ),
        200,
    )


@admin_bp.route("/salaries", methods=["POST"])
@require_role("administrator")
def create_salary(current_user):
    payload = request.get_json(silent=True) or {}

    try:
        teacher_id = int(payload.get("teacher_id"))
    except (TypeError, ValueError):
        return error_response("Select a teacher", 400)

    teacher = db.session.get(TeacherProfile, teacher_id)
    if not teacher:
        return error_response("Teacher not found", 404)

    period = (payload.get("period") or "").strip()
    if not period:
        return error_response("Pay period is required", 400)

    try:
        gross_amount = float(payload.get("gross_amount"))
        deductions = float(payload.get("deductions") or 0)
    except (TypeError, ValueError):
        return error_response("Gross amount and deductions must be numbers", 400)
    if gross_amount <= 0:
        return error_response("Gross amount must be greater than zero", 400)
    if deductions < 0 or deductions > gross_amount:
        return error_response("Deductions must be between 0 and the gross amount", 400)

    status = (payload.get("status") or "pending").lower()
    if status not in ("pending", "paid"):
        return error_response("Status must be pending or paid", 400)

    salary = SalaryRecord(
        teacher_id=teacher.id,
        period=period,
        gross_amount=gross_amount,
        deductions=deductions,
        status=status,
        note=(payload.get("note") or "").strip(),
        paid_on=date.today() if status == "paid" else None,
        issued_by=current_user.id,
    )
    db.session.add(salary)
    db.session.commit()

    return jsonify({"message": "Salary record sent to teacher", "salary": salary.to_dict()}), 201


@admin_bp.route("/salaries/<int:salary_id>", methods=["PUT"])
@require_role("administrator")
def update_salary(current_user, salary_id):
    salary = db.session.get(SalaryRecord, salary_id)
    if not salary:
        return error_response("Salary record not found", 404)

    payload = request.get_json(silent=True) or {}
    status = (payload.get("status") or salary.status).lower()
    if status not in ("pending", "paid"):
        return error_response("Status must be pending or paid", 400)

    salary.status = status
    salary.paid_on = date.today() if status == "paid" else None
    db.session.commit()

    return jsonify({"message": "Salary record updated", "salary": salary.to_dict()}), 200


@admin_bp.route("/salaries/<int:salary_id>", methods=["DELETE"])
@require_role("administrator")
def delete_salary(current_user, salary_id):
    salary = db.session.get(SalaryRecord, salary_id)
    if not salary:
        return error_response("Salary record not found", 404)

    db.session.delete(salary)
    db.session.commit()
    return jsonify({"message": "Salary record deleted"}), 200


# ------------------------------------------- read-only views of portal activity


@admin_bp.route("/attendance", methods=["GET"])
@require_role("administrator")
def view_attendance(current_user):
    query = AttendanceRecord.query
    class_name = request.args.get("class_name")
    if class_name:
        query = query.filter_by(class_name=class_name)

    on_date = request.args.get("date")
    if on_date:
        parsed = portal_service.parse_date(on_date)
        if not parsed:
            return error_response("Date must be YYYY-MM-DD", 400)
        query = query.filter_by(date=parsed)

    records = query.order_by(AttendanceRecord.date.desc()).limit(500).all()
    return (
        jsonify(
            {
                "records": [r.to_dict() for r in records],
                "summary": portal_service.attendance_summary(records),
                "classes": portal_service.known_classes(),
            }
        ),
        200,
    )


@admin_bp.route("/results", methods=["GET"])
@require_role("administrator")
def view_results(current_user):
    query = ExamResult.query
    class_name = request.args.get("class_name")
    if class_name:
        query = query.filter_by(class_name=class_name)

    results = query.order_by(ExamResult.recorded_at.desc()).limit(500).all()
    return (
        jsonify(
            {
                "results": [r.to_dict() for r in results],
                "summary": portal_service.results_summary(results),
                "classes": portal_service.known_classes(),
            }
        ),
        200,
    )


@admin_bp.route("/timetable", methods=["GET"])
@require_role("administrator")
def view_timetable(current_user):
    query = TimetableEntry.query
    class_name = request.args.get("class_name")
    if class_name:
        query = query.filter_by(class_name=class_name)

    entries = portal_service.sorted_timetable(query.all())
    return (
        jsonify(
            {
                "entries": [e.to_dict() for e in entries],
                "classes": portal_service.known_classes(),
            }
        ),
        200,
    )


__all__ = ["admin_bp"]
