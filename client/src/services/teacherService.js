import { apiFetch, query } from "./apiClient";

export const teacherService = {
  getOverview: () => apiFetch("/teacher/overview"),
  getProfile: () => apiFetch("/teacher/profile"),
  listClasses: () => apiFetch("/teacher/classes"),
  listStudents: (params) => apiFetch(`/teacher/students${query(params)}`),

  getAttendance: (params) => apiFetch(`/teacher/attendance${query(params)}`),
  saveAttendance: (payload) =>
    apiFetch("/teacher/attendance", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  listResults: (params) => apiFetch(`/teacher/results${query(params)}`),
  createResult: (result) =>
    apiFetch("/teacher/results", { method: "POST", body: JSON.stringify(result) }),
  updateResult: (id, changes) =>
    apiFetch(`/teacher/results/${id}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    }),
  deleteResult: (id) => apiFetch(`/teacher/results/${id}`, { method: "DELETE" }),

  getTimetable: (params) => apiFetch(`/teacher/timetable${query(params)}`),
  createTimetableEntry: (entry) =>
    apiFetch("/teacher/timetable", { method: "POST", body: JSON.stringify(entry) }),
  updateTimetableEntry: (id, changes) =>
    apiFetch(`/teacher/timetable/${id}`, {
      method: "PUT",
      body: JSON.stringify(changes),
    }),
  deleteTimetableEntry: (id) =>
    apiFetch(`/teacher/timetable/${id}`, { method: "DELETE" }),

  listAnnouncements: () => apiFetch("/teacher/announcements"),
  listSalaries: () => apiFetch("/teacher/salaries"),
};
