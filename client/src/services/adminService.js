import { apiFetch, query } from "./apiClient";

export const adminService = {
  async getSettings() {
    const data = await apiFetch("/admin/settings");
    return data.settings ?? data;
  },

  async updateSettings(settings) {
    const data = await apiFetch("/admin/settings", {
      method: "PUT",
      body: JSON.stringify(settings),
    });
    return data.settings ?? data;
  },

  async changePassword({ currentPassword, newPassword }) {
    return await apiFetch("/users/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  // announcements
  listAnnouncements: () => apiFetch("/admin/announcements"),
  createAnnouncement: (announcement) =>
    apiFetch("/admin/announcements", {
      method: "POST",
      body: JSON.stringify(announcement),
    }),
  deleteAnnouncement: (id) =>
    apiFetch(`/admin/announcements/${id}`, { method: "DELETE" }),

  // people
  listStudents: (params) => apiFetch(`/admin/students${query(params)}`),
  createStudent: (student) =>
    apiFetch("/admin/students", { method: "POST", body: JSON.stringify(student) }),
  updateStudent: (id, changes) =>
    apiFetch(`/admin/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    }),
  listTeachers: () => apiFetch("/admin/teachers"),
  createTeacher: (teacher) =>
    apiFetch("/admin/teachers", { method: "POST", body: JSON.stringify(teacher) }),
  updateTeacher: (id, changes) =>
    apiFetch(`/admin/teachers/${id}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    }),

  // money
  listFees: () => apiFetch("/admin/fees"),
  createFee: (fee) =>
    apiFetch("/admin/fees", { method: "POST", body: JSON.stringify(fee) }),
  updateFee: (id, changes) =>
    apiFetch(`/admin/fees/${id}`, { method: "PUT", body: JSON.stringify(changes) }),
  deleteFee: (id) => apiFetch(`/admin/fees/${id}`, { method: "DELETE" }),
  listSalaries: () => apiFetch("/admin/salaries"),
  createSalary: (salary) =>
    apiFetch("/admin/salaries", { method: "POST", body: JSON.stringify(salary) }),
  updateSalary: (id, changes) =>
    apiFetch(`/admin/salaries/${id}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    }),
  deleteSalary: (id) => apiFetch(`/admin/salaries/${id}`, { method: "DELETE" }),

  // read-only views of what teachers and students see
  getDashboard: () => apiFetch("/admin/dashboard"),
  viewAttendance: (params) => apiFetch(`/admin/attendance${query(params)}`),
  viewResults: (params) => apiFetch(`/admin/results${query(params)}`),
  viewTimetable: (params) => apiFetch(`/admin/timetable${query(params)}`),
};
