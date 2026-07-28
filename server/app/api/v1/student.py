from flask import Blueprint, jsonify
from app.api.deps import require_role
from app.models.student import Student  # Changed from StudentProfile to Student
from app.models.exam import ExamResult
from app.models.fee import FeeRecord

student_bp = Blueprint("student", __name__)

@student_bp.route("/dashboard", methods=["GET"])
@require_role("student")
def student_dashboard(current_user):
    student = Student.query.filter_by(user_id=current_user.id).first()
    
    results = ExamResult.query.filter_by(student_id=student.id).all() if student else []
    fees = FeeRecord.query.filter_by(student_id=student.id).all() if student else []

    return jsonify({
        "profile": student.to_dict() if student else None,
        "results": [r.to_dict() for r in results],
        "fees": [f.to_dict() for f in fees]
    }), 200