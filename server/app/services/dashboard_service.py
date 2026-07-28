from typing import Dict, Any, List
from app.core.database import db
from app.models.user import User
from app.models.student import Student
from app.models.teacher import TeacherProfile
from app.models.fee import FeeRecord
from app.models.exam import ExamResult
from app.models.announcement import Announcement
from app.models.attendance import AttendanceRecord
from app.services import portal_service

class DashboardService:
    @staticmethod
    def get_admin_dashboard_summary() -> Dict[str, Any]:
        """
        Aggregates system-wide metrics for the Administrator overview.
        """
        total_users = User.query.count()
        total_students = Student.query.count()
        total_teachers = TeacherProfile.query.count()
        total_classes = len(portal_service.known_classes())

        fees: List[FeeRecord] = FeeRecord.query.all()
        collected_fees = sum(f.amount_paid or 0.0 for f in fees)
        pending_fees = sum(f.balance for f in fees)

        attendance: List[AttendanceRecord] = AttendanceRecord.query.all()
        attendance_rate = portal_service.attendance_summary(attendance)["rate"]

        recent_announcements = Announcement.query.order_by(
            Announcement.created_at.desc()
        ).limit(5).all()

        return {
            "stats": {
                "total_users": total_users,
                "total_students": total_students,
                "total_teachers": total_teachers,
                "total_classes": total_classes,
                "attendance_rate": attendance_rate,
                "pending_fees_amount": float(pending_fees),
                "collected_fees_amount": float(collected_fees),
            },
            "recent_announcements": [a.to_dict() for a in recent_announcements]
        }

    @staticmethod
    def get_student_analytics(student_id: int) -> Dict[str, Any]:
        """
        Calculates personal GPA/average marks and fee summaries for a student.
        """
        results: List[ExamResult] = ExamResult.query.filter_by(student_id=student_id).all()
        
        total_marks_obtained = sum(r.marks_obtained for r in results)
        total_possible_marks = sum(r.total_marks for r in results)
        
        average_percentage = (
            (total_marks_obtained / total_possible_marks * 100)
            if total_possible_marks > 0
            else 0.0
        )

        fees: List[FeeRecord] = FeeRecord.query.filter_by(student_id=student_id).all()
        outstanding_fee = sum(f.amount for f in fees if f.status == "pending")

        return {
            "average_percentage": round(average_percentage, 2),
            "exams_completed": len(results),
            "outstanding_fee": float(outstanding_fee),
            "recent_results": [r.to_dict() for r in results[:5]]
        }

dashboard_service = DashboardService()