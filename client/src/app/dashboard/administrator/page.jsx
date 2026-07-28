import RequireRole from "@/components/RequireRole";
import AdminDashboard from "@/screens/Dashboard/AdminDashboard";

export const metadata = {
  title: "Admin Portal - CampusHub",
  description: "Administrator dashboard and school settings",
};

export default function AdministratorDashboardPage() {
  return (
    <RequireRole role="administrator">
      <AdminDashboard />
    </RequireRole>
  );
}
