import RequireRole from "@/components/RequireRole";
import StudentDashboard from "@/screens/Dashboard/StudentDashboard";

export const metadata = {
  title: "Student Portal - CampusHub",
  description: "Attendance, results, timetable and fees",
};

export default function StudentDashboardPage() {
  return (
    <RequireRole role="student">
      <StudentDashboard />
    </RequireRole>
  );
}
