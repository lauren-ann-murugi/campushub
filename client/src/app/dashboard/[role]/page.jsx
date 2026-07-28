import StudentDashboard from "@/screens/Dashboard/StudentDashboard";
import TeacherDashboard from "@/screens/Dashboard/TeacherDashboard";
import AdminDashboard from "@/screens/Dashboard/AdminDashboard";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const role = resolvedParams?.role?.toLowerCase() || "student";
  const label = role === "teacher" ? "Teacher" : role === "administrator" || role === "admin" ? "Admin" : "Student";

  return {
    title: `${label} Dashboard - CampusHub`,
    description: `${label} dashboard`,
  };
}

export default async function DashboardPage({ params }) {
  const resolvedParams = await params;
  const role = resolvedParams?.role?.toLowerCase() || "student";

  if (role === "teacher") {
    return <TeacherDashboard />;
  }

  if (role === "administrator" || role === "admin") {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
}
