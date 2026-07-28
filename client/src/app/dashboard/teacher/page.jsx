import RequireRole from "@/components/RequireRole";
import TeacherDashboard from "@/screens/Dashboard/TeacherDashboard";

export const metadata = {
  title: "Teacher Portal - CampusHub",
  description: "Attendance, students, exams and timetable",
};

export default function TeacherDashboardPage() {
  return (
    <RequireRole role="teacher">
      <TeacherDashboard />
    </RequireRole>
  );
}
