import { apiFetch } from "./apiClient";

export const studentService = {
  getDashboard: () => apiFetch("/student/dashboard"),
  getAttendance: () => apiFetch("/student/attendance"),
  getResults: () => apiFetch("/student/results"),
  getTimetable: () => apiFetch("/student/timetable"),
  getFees: () => apiFetch("/student/fees"),
  listAnnouncements: () => apiFetch("/student/announcements"),
};
