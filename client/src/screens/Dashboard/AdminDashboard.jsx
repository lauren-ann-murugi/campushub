

//USING THE DESIGN SYSTEM FOR THE DASHBOARD

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Avatar from "@/components/Avatar";
import NotificationBell from "@/components/NotificationBell";
import { AdminOverviewSection } from "./admin/OverviewSection";
import { AdminStudentsSection } from "./admin/StudentsSection";
import { AdminStaffSection } from "./admin/StaffSection";
import { AdminAdmissionsSection } from "./admin/AdmissionsSection";
import { AdminAttendanceSection } from "./admin/AttendanceSection";
import { AdminExamsSection } from "./admin/ExamsSection";
import { AdminResultsSection } from "./admin/ResultsSection";
import { AdminReportsSection } from "./admin/ReportsSection";
import { AdminAnnouncementsSection } from "./admin/AnnouncementsSection";
import { AdminSupportSection } from "./admin/SupportSection";
import { AdminFeesSection } from "./admin/FeesSection";
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

export function AdminDashboard() {
  const router = useRouter();
  const { displayName, signOut } = useAuth();
  
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
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.metrics) setMetrics(data.metrics);
        if (data.pendingAdmissions) setPendingAdmissions(data.pendingAdmissions);
        if (data.tickets) setSupportTickets(data.tickets);
      }
    } catch (err) {
      console.warn("Using default frontend dashboard data until FastAPI endpoint responds.", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
              <h1 className="text-2xl font-bold text-[#111827]">Dashboard Overview</h1>
              <p className="text-sm text-[#6b7280] mt-0.5">
                Welcome back, {displayName || "Admin"}. Here is what's happening today.
              </p>
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
            <AdminOverviewSection name={displayName} onNavigate={setActiveTab} />
          ) : activeTab === "students" ? (
            <AdminStudentsSection />
          ) : activeTab === "teachers" ? (
            <AdminStaffSection />
          ) : activeTab === "admissions" ? (
            <AdminAdmissionsSection />
          ) : activeTab === "attendance" ? (
            <AdminAttendanceSection />
          ) : activeTab === "examinations" ? (
            <AdminExamsSection />
          ) : activeTab === "results" ? (
            <AdminResultsSection />
          ) : activeTab === "fees" ? (
            <AdminFeesSection />
          ) : activeTab === "reports" ? (
            <AdminReportsSection />
          ) : activeTab === "announcements" ? (
            <AdminAnnouncementsSection />
          ) : activeTab === "support" ? (
            <AdminSupportSection />
          ) : activeTab === "settings" ? (
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-12 text-center shadow-xs">
              <h2 className="text-xl font-bold text-[#111827]">Settings</h2>
              <p className="text-sm text-[#6b7280] mt-2">Administrative preferences and system controls will appear here.</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-12 text-center shadow-xs">
              <h2 className="text-xl font-bold text-[#111827] capitalize">
                {activeTab} Management
              </h2>
              <p className="text-sm text-[#6b7280] mt-2">
                This feature module connects directly with your admin data endpoints.
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

/* Legacy placeholder removed: the admin portal now uses section components directly. */










