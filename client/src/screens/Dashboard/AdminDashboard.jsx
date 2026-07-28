// "use client";

// import { useState } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { DashboardLayout } from "./DashboardLayout";

// // Admin Section Imports
// import { AdminOverviewSection } from "./admin/OverviewSection";
// import { AdminStudentsSection } from "./admin/StudentsSection";
// import { AdminStaffSection } from "./admin/StaffSection";
// import { AdminAdmissionsSection } from "./admin/AdmissionsSection";
// import { AdminAttendanceSection } from "./admin/AttendanceSection";
// import { AdminExamsSection } from "./admin/ExamsSection";
// import { AdminResultsSection } from "./admin/ResultsSection";
// import { AdminFeesSection } from "./admin/FeesSection";
// import { AdminReportsSection } from "./admin/ReportsSection";
// import { AdminAnnouncementsSection } from "./admin/AnnouncementsSection";
// import { AdminSupportSection } from "./admin/SupportSection";

// // Shared / Student Section Imports
// import { ProfileSection } from "./student/ProfileSection";
// import { SettingsSection } from "./student/SettingsSection";

// export function AdminDashboard() {
//   const { displayName } = useAuth();
//   const [active, setActive] = useState("overview");

//   return (
//     <DashboardLayout
//       role="administrator"
//       activeId={active}
//       onNavigate={setActive}
//     >
//       {active === "overview" && (
//         <AdminOverviewSection name={displayName} onNavigate={setActive} />
//       )}
//       {active === "students" && <AdminStudentsSection />}
//       {active === "staff" && <AdminStaffSection />}
//       {active === "admissions" && <AdminAdmissionsSection />}
//       {active === "attendance" && <AdminAttendanceSection />}
//       {active === "exams" && <AdminExamsSection />}
//       {active === "results" && <AdminResultsSection />}
//       {active === "fees" && <AdminFeesSection />}
//       {active === "reports" && <AdminReportsSection />}
//       {active === "announcements" && <AdminAnnouncementsSection />}
//       {active === "support" && <AdminSupportSection />}
//       {active === "profile" && <ProfileSection />}
//       {active === "settings" && <SettingsSection />}
//     </DashboardLayout>
//   );
// }

// export default AdminDashboard;





//USING THE DESIGN SYSTEM FOR THE DASHBOARD

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Avatar from "@/components/Avatar";
import NotificationBell from "@/components/NotificationBell";
import { authService } from "@/services/authService";
import { AdminSettingsSection } from "./admin/SettingsSection";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserPlus,
  CalendarCheck,
  FileSpreadsheet,
  Award,
  Wallet,
  BarChart3,
  Megaphone,
  LifeBuoy,
  Settings,
  LogOut,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Plus,
  CheckCircle2,
  Building2,
  Clock,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function formatMoney(amount) {
  const value = Number(amount) || 0;
  if (value >= 1000) return `$${Math.round(value / 1000)}k`;
  return `$${value.toFixed(0)}`;
}

export function AdminDashboard() {
  const router = useRouter();
  const { displayName, signOut, user, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Backend Metrics State
  const [metrics, setMetrics] = useState({
    totalStudents: { count: "2,450", change: "+12% from last month", isPositive: true },
    totalTeachers: { count: "184", note: "Stable" },
    totalClasses: { count: "72", note: "Across 4 blocks" },
    attendanceRate: { value: "94%", change: "-2% from yesterday", isPositive: false },
    feeCollection: { amount: "$45k", change: "85% collected", isPositive: true },
  });

  const [pendingAdmissions, setPendingAdmissions] = useState([
    { id: "1", initials: "JD", name: "Jane Doe", detail: "Grade 10 Application" },
    { id: "2", initials: "MS", name: "Michael Smith", detail: "Grade 8 Application" },
    { id: "3", initials: "AJ", name: "Alice Johnson", detail: "Grade 12 Application" },
  ]);

  const [supportTickets, setSupportTickets] = useState([
    { id: "#TK-4029", subject: "Portal Login Issue", requester: "Sarah Connor (Parent)", status: "HIGH PRIORITY", type: "high" },
    { id: "#TK-4030", subject: "Update Course Materials", requester: "Mr. Davis (Teacher)", status: "OPEN", type: "open" },
    { id: "#TK-4031", subject: "Fee Receipt Missing", requester: "John Smith (Student)", status: "PENDING INFO", type: "pending" },
    { id: "#TK-4032", subject: "Schedule Adjustment Request", requester: "Mrs. Lee (Admin)", status: "OPEN", type: "open" },
  ]);

  // Fetch real metrics from FastAPI server
  const fetchDashboardData = useCallback(async () => {
    try {
      const token = authService.getToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const { stats } = await res.json();
        if (stats) {
          setMetrics((current) => ({
            ...current,
            totalStudents: {
              ...current.totalStudents,
              count: String(stats.total_students),
              change: `${stats.total_users} portal accounts`,
            },
            totalTeachers: { ...current.totalTeachers, count: String(stats.total_teachers) },
            feeCollection: {
              ...current.feeCollection,
              amount: formatMoney(stats.collected_fees_amount),
              change: `${formatMoney(stats.pending_fees_amount)} outstanding`,
            },
          }));
        }
      }
    } catch (err) {
      console.warn("Using default frontend dashboard data until the API responds.", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  // Sidebar navigation configuration
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    { id: "teachers", label: "Teachers", icon: GraduationCap },
    { id: "admissions", label: "Admissions", icon: UserPlus },
    { id: "attendance", label: "Attendance", icon: CalendarCheck },
    { id: "examinations", label: "Examinations", icon: FileSpreadsheet },
    { id: "results", label: "Results", icon: Award },
    { id: "fees", label: "Fees", icon: Wallet },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "announcements", label: "Announcements", icon: Megaphone },
  ];

  const handleTicketReview = (ticketId) => {
    alert(`Opening review modal for Ticket ${ticketId}`);
  };

  const handleNewTicket = () => {
    alert("Opening Create New Support Ticket dialog.");
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const header =
    activeTab === "settings"
      ? {
          title: "Settings",
          subtitle: "Manage school details, notifications, security and your password.",
        }
      : {
          title: "Dashboard Overview",
          subtitle: `Welcome back, ${displayName || "Admin"}. Here is what's happening today.`,
        };

  return (
    <div className="flex min-h-screen bg-[#f8f9fc] font-sans antialiased">
      {/* ---------------- SIDEBAR ---------------- */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-[#e5e7eb] bg-white px-4 py-6">
        {/* Brand Header */}
        <div className="mb-8 px-3">
          <h1 className="text-xl font-bold text-[#111827]">Admin Portal</h1>
          <p className="text-xs text-[#6b7280]">Main Campus</p>
        </div>

        {/* Main Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#2563eb] text-white shadow-sm"
                    : "text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#111827]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-[#6b7280]"}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Sidebar Action Buttons */}
        <div className="mt-auto pt-4 space-y-2">
          <button
            onClick={() => setActiveTab("support")}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === "support"
                ? "bg-[#1d4ed8] text-white"
                : "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
            }`}
          >
            <LifeBuoy className="h-4 w-4" />
            Support Center
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              activeTab === "settings"
                ? "bg-[#f3f4f6] text-[#111827]"
                : "text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#111827]"
            }`}
          >
            <Settings className="h-4 w-4 text-[#6b7280]" />
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#4b5563] transition-all hover:bg-[#fee2e2] hover:text-[#dc2626]"
          >
            <LogOut className="h-4 w-4 text-[#6b7280]" />
            Logout
          </button>
        </div>
      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <main className="pl-64 flex-1">
        <div className="p-8">
          {/* Top Header Bar */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">{header.title}</h1>
              <p className="text-sm text-[#6b7280] mt-0.5">{header.subtitle}</p>
            </div>

            {/* Global Search and Profile Corner */}
            <div className="flex items-center gap-4">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#e5e7eb] bg-white py-2 pl-9 pr-4 text-sm text-[#111827] placeholder-[#9ca3af] outline-none transition-all focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20"
                />
              </div>

              {/* Notification Bell Component */}
              <NotificationBell />

              {/* User Avatar */}
              <Avatar size="md" />
            </div>
          </div>

          {/* Conditional View Switching */}
          {activeTab === "dashboard" ? (
            <div className="space-y-8">
              {/* ---------------- STAT CARDS GRID ---------------- */}
              <div className="grid grid-cols-5 gap-4">
                {/* Total Students Card */}
                <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6b7280]">Total Students</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-[#111827]">{metrics.totalStudents.count}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-[#16a34a] font-medium">
                      <ArrowUpRight className="h-3 w-3" />
                      <span>{metrics.totalStudents.change}</span>
                    </div>
                  </div>
                </div>

                {/* Total Teachers Card */}
                <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6b7280]">Total Teachers</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0fdf4] text-[#16a34a]">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-[#111827]">{metrics.totalTeachers.count}</p>
                    <p className="mt-1 text-xs text-[#6b7280]">{metrics.totalTeachers.note}</p>
                  </div>
                </div>

                {/* Total Classes Card */}
                <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6b7280]">Total Classes</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#4b5563]">
                      <Building2 className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-[#111827]">{metrics.totalClasses.count}</p>
                    <p className="mt-1 text-xs text-[#6b7280]">{metrics.totalClasses.note}</p>
                  </div>
                </div>

                {/* Attendance Rate Card */}
                <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6b7280]">Attendance Rate</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0fdf4] text-[#16a34a]">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-[#111827]">{metrics.attendanceRate.value}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-[#dc2626] font-medium">
                      <ArrowDownRight className="h-3 w-3" />
                      <span>{metrics.attendanceRate.change}</span>
                    </div>
                  </div>
                </div>

                {/* Fee Collection Card */}
                <div className="rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs transition-all hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#6b7280]">Fee Collection</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
                      <Wallet className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-2xl font-bold text-[#111827]">{metrics.feeCollection.amount}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs text-[#16a34a] font-medium">
                      <ArrowUpRight className="h-3 w-3" />
                      <span>{metrics.feeCollection.change}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------- CHARTS SECTION ---------------- */}
              <div className="grid grid-cols-2 gap-6">
                {/* Attendance Overview Bar Chart Card */}
                <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-bold text-[#111827]">Attendance Overview</h2>
                    <button
                      onClick={() => setActiveTab("attendance")}
                      className="text-xs font-semibold text-[#2563eb] hover:underline"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Visual Bar Chart */}
                  <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
                    {[
                      { day: "Mon", val: "65%" },
                      { day: "Tue", val: "70%" },
                      { day: "Wed", val: "78%" },
                      { day: "Thu", val: "60%" },
                      { day: "Fri", val: "82%" },
                      { day: "Sat", val: "72%" },
                    ].map((bar, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <div
                          style={{ height: bar.val }}
                          className="w-full rounded-md bg-[#1d4ed8] transition-all hover:bg-[#2563eb]"
                        />
                        <span className="text-xs text-[#6b7280] font-medium">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Student Performance Line Chart Card */}
                <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-base font-bold text-[#111827]">Student Performance</h2>
                    <button
                      onClick={() => setActiveTab("results")}
                      className="text-xs font-semibold text-[#2563eb] hover:underline"
                    >
                      View Details
                    </button>
                  </div>

                  {/* Vector SVG Area Curve Chart */}
                  <div className="h-48 relative flex flex-col justify-end">
                    <svg className="w-full h-36 overflow-visible" viewBox="0 0 400 120">
                      <defs>
                        <linearGradient id="performanceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#15803d" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#15803d" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 60 Q 80 40, 160 55 T 320 80 T 400 20 L 400 120 L 0 120 Z"
                        fill="url(#performanceGrad)"
                      />
                      <path
                        d="M 0 60 Q 80 40, 160 55 T 320 80 T 400 20"
                        fill="none"
                        stroke="#15803d"
                        strokeWidth="3"
                      />
                    </svg>
                    <div className="flex justify-between text-xs text-[#6b7280] font-medium pt-3 border-t border-[#f3f4f6]">
                      <span>Term 1</span>
                      <span>Term 2</span>
                      <span>Term 3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ---------------- BOTTOM TABLES SECTION ---------------- */}
              <div className="grid grid-cols-12 gap-6">
                {/* Pending Admissions Panel */}
                <div className="col-span-4 rounded-2xl border border-[#e5e7eb] bg-white flex flex-col justify-between overflow-hidden shadow-xs">
                  <div className="p-5 border-b border-[#f3f4f6] flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-[#111827]">Pending Admissions</h2>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-[#f0fdf4] px-2.5 py-1 text-xs font-bold text-[#16a34a]">
                      3 New
                    </span>
                  </div>

                  <div className="divide-y divide-[#f3f4f6] flex-1">
                    {pendingAdmissions.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 hover:bg-[#f9fafb] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f4f6] text-xs font-bold text-[#374151]">
                            {item.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#111827]">{item.name}</p>
                            <p className="text-xs text-[#6b7280]">{item.detail}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setActiveTab("admissions")}
                          className="p-1.5 text-[#6b7280] hover:text-[#2563eb] transition-colors"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab("admissions")}
                    className="w-full bg-[#f9fafb] py-3 text-center text-xs font-semibold text-[#2563eb] hover:bg-[#f3f4f6] transition-colors border-t border-[#f3f4f6]"
                  >
                    View All Admissions
                  </button>
                </div>

                {/* Open Support Tickets Panel */}
                <div className="col-span-8 rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-bold text-[#111827]">Open Support Tickets</h2>
                      <button
                        onClick={handleNewTicket}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563eb] px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#1d4ed8] transition-all"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        New Ticket
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#e5e7eb] text-[#6b7280] font-semibold">
                            <th className="pb-3 pt-1 uppercase">Ticket ID</th>
                            <th className="pb-3 pt-1 uppercase">Subject</th>
                            <th className="pb-3 pt-1 uppercase">Requester</th>
                            <th className="pb-3 pt-1 uppercase">Status</th>
                            <th className="pb-3 pt-1 uppercase text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f3f4f6]">
                          {supportTickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-[#f9fafb]">
                              <td className="py-3 font-semibold text-[#111827]">{ticket.id}</td>
                              <td className="py-3 font-medium text-[#374151]">{ticket.subject}</td>
                              <td className="py-3 text-[#6b7280]">{ticket.requester}</td>
                              <td className="py-3">
                                {ticket.type === "high" && (
                                  <span className="inline-block rounded-md bg-[#fef3c7] px-2 py-0.5 text-[10px] font-bold text-[#d97706]">
                                    HIGH PRIORITY
                                  </span>
                                )}
                                {ticket.type === "open" && (
                                  <span className="inline-block rounded-md bg-[#eff6ff] px-2.5 py-0.5 text-[10px] font-bold text-[#2563eb]">
                                    OPEN
                                  </span>
                                )}
                                {ticket.type === "pending" && (
                                  <span className="inline-block rounded-md bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-bold text-[#4b5563]">
                                    PENDING INFO
                                  </span>
                                )}
                              </td>
                              <td className="py-3 text-right">
                                <button
                                  onClick={() => handleTicketReview(ticket.id)}
                                  className="font-semibold text-[#2563eb] hover:underline"
                                >
                                  Review
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "settings" ? (
            <AdminSettingsSection />
          ) : (
            /* Selected Active Tab Placeholder Section */
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-12 text-center shadow-xs">
              <h2 className="text-xl font-bold text-[#111827] capitalize">
                {activeTab} Management
              </h2>
              <p className="text-sm text-[#6b7280] mt-2">
                This feature module connects directly with your FastAPI endpoints.
              </p>
              <button
                onClick={() => setActiveTab("dashboard")}
                className="mt-6 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1d4ed8]"
              >
                Return to Overview
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;