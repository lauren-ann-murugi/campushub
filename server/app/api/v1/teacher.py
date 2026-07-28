from flask import Blueprint, request, jsonify
from app.api.deps import require_role
from app.core.database import db
from app.models.teacher import TeacherProfile
from app.models.exam import ExamResult
from app.utils.exceptions import error_response

teacher_bp = Blueprint("teacher", __name__)


@teacher_bp.route("/profile", methods=["GET"])
@require_role("teacher")
def get_teacher_profile(current_user):
    teacher = TeacherProfile.query.filter_by(user_id=current_user.id).first()
    if not teacher:
        return error_response("Teacher profile not found", 404)
    return jsonify(teacher.to_dict()), 200


@teacher_bp.route("/grades", methods=["POST"])
@require_role("teacher")
def submit_grades(current_user):
    data = request.get_json() or {}
    student_id = data.get("student_id")
    subject = data.get("subject")
    marks_obtained = data.get("marks_obtained")
    total_marks = data.get("total_marks", 100.0)

    if not student_id or not subject or marks_obtained is None:
        return error_response("student_id, subject, and marks_obtained are required", 400)

    result = ExamResult(
        student_id=student_id,
        subject=subject,
        marks_obtained=float(marks_obtained),
        total_marks=float(total_marks),
    )

    db.session.add(result)
    db.session.commit()

    return jsonify({"message": "Grade submitted successfully", "result": result.to_dict()}), 201


__all__ = ["teacher_bp"]