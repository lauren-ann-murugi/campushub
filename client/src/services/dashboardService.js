import { authService, ApiError } from "./authService";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function dashboardFetch(endpoint) {
  const token = authService.getToken();
  if (!token) throw new ApiError("Unauthorized", 401);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(data.detail || "Failed to load dashboard data", response.status);
  }
  return data;
}

export const dashboardService = {
  // ================= STUDENT ENDPOINTS =================
  async getStudentOverview() {
    return await dashboardFetch("/student/overview");
  },
  async getStudentTimetable() {
    return await dashboardFetch("/student/timetable");
  },
  async getStudentFees() {
    return await dashboardFetch("/student/fees");
  },
  async getStudentResults() {
    return await dashboardFetch("/student/results");
  },

  // ================= TEACHER ENDPOINTS =================
  async getTeacherOverview() {
    return await dashboardFetch("/teacher/overview");
  },
  async getTeacherClasses() {
    return await dashboardFetch("/teacher/classes");
  },
  async markAttendance(attendanceData) {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/teacher/attendance`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(attendanceData),
    });
    return await response.json();
  },

  // ================= ADMIN ENDPOINTS =================
  async getAdminOverview() {
    return await dashboardFetch("/admin/overview");
  },
  async getAdmissions() {
    return await dashboardFetch("/admin/admissions");
  },
  async getFinancialReports() {
    return await dashboardFetch("/admin/reports/finance");
  },
};