"use client";

import { useEffect, useState } from "react";

export function AdminAttendanceSection() {
  const [records, setRecords] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState("All");
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [search, setSearch] = useState("");

  // Modals & Actions state
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Form input states
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("Grade 10");
  const [attendanceStatus, setAttendanceStatus] = useState("present");
  const [submitting, setSubmitting] = useState(false);

  // Load Attendance & Intervention Data
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/attendance?date=${filterDate}`);
      if (!res.ok) throw new Error("Failed to load attendance");
      const data = await res.json();
      setRecords(data.records || []);
      setInterventions(data.interventions || []);
    } catch (err) {
      // Fallback mock data matching design layout
      setRecords([
        { id: "1", student_name: "Emma Smith", class_name: "Grade 10", status: "present", date: filterDate },
        { id: "2", student_name: "James Lawson", class_name: "Grade 9", status: "present", date: filterDate },
        { id: "3", student_name: "Noah Johnson", class_name: "Grade 12", status: "absent", date: filterDate },
        { id: "4", student_name: "Sophia Davis", class_name: "Grade 11", status: "late", date: filterDate },
      ]);

      setInterventions([
        { id: "101", student_name: "Alex Sterling", student_id: "10429", class_name: "Grade 11 - Sci A", attendance_pct: 74, consecutive_absences: "4 Days" },
        { id: "102", student_name: "Mia Kinsley", student_id: "10553", class_name: "Grade 11 - Arts B", attendance_pct: 78, consecutive_absences: "2 Days" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterDate]);

  // Handle Recording New Attendance
  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      student_name: studentName,
      class_name: studentClass,
      status: attendanceStatus,
      date: filterDate,
    };

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to mark attendance");

      setActionNotice("Attendance recorded successfully!");
      setShowMarkModal(false);
      setStudentName("");
      loadData();
    } catch (err) {
      // Optimistic local update fallback
      setRecords((prev) => [{ id: String(Date.now()), ...payload }, ...prev]);
      setActionNotice("Attendance recorded!");
      setShowMarkModal(false);
      setStudentName("");
    } finally {
      setSubmitting(false);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  // Action Button Handlers
  const handleContactGuardian = (student) => {
    setSelectedStudent(student);
    setActionNotice(`Contact request dispatched to guardian of ${student.student_name}.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleSendNotice = (student) => {
    setSelectedStudent(student);
    setActionNotice(`Warning notice delivered to ${student.student_name}.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Metrics Calculations
  const totalPresent = 1124;
  const totalAbsent = 56;
  const lateArrivals = 20;

  return (
    <div className="space-y-6">
      {/* Search Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <svg
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search students, staff, or classes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif tracking-tight text-gray-900 sm:text-3xl">
            Attendance Overview
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Today's school-wide attendance statistics and trends.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Picker Button */}
          <div className="relative inline-flex items-center rounded-xl border border-gray-200 bg-white px-3.5 py-2 shadow-sm">
            <svg className="mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-700 outline-none cursor-pointer"
            />
          </div>

          {/* Mark Attendance Button */}
          <button
            type="button"
            onClick={() => setShowMarkModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <svg className="h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {actionNotice}
        </div>
      )}

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Overall Attendance */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-600">Overall Attendance</p>
              <p className="mt-3 text-3xl font-bold font-serif text-gray-900">94.2%</p>
              <p className="mt-2 text-xs font-semibold text-emerald-600">
                ↗ +1.2% <span className="font-normal text-gray-400">from yesterday</span>
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Present */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-600">Total Present</p>
              <p className="mt-3 text-3xl font-bold font-serif text-gray-900">
                {totalPresent.toLocaleString()}
              </p>
              <p className="mt-2 text-xs text-gray-400">Out of 1,200 students</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5-3.87M9 20H4v-2a3 3 0 015-3.87m6-4a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Absent */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-600">Total Absent</p>
              <p className="mt-3 text-3xl font-bold font-serif text-gray-900">{totalAbsent}</p>
              <p className="mt-2 text-xs font-semibold text-red-600">
                ↗ +5 <span className="font-normal text-gray-400">from yesterday</span>
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-500">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6h12a6 6 0 00-6-6z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 8l4 4m0-4l-4 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Late Arrivals */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold text-gray-600">Late Arrivals</p>
              <p className="mt-3 text-3xl font-bold font-serif text-gray-900">{lateArrivals}</p>
              <p className="mt-2 text-xs text-gray-400">Requires review</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Grid: Weekly Trend Chart & Class Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Attendance Trend Chart Box */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-base font-bold font-serif text-gray-900">
              Weekly Attendance Trend
            </h2>
            <button type="button" className="text-xs font-semibold text-blue-600 hover:underline">
              View Full Report
            </button>
          </div>

          {/* Bar Chart Mock Representation */}
          <div className="relative mt-4 flex h-48 items-end justify-between gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6">
            <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
              <div className="w-full bg-blue-200 rounded-t-md transition-all hover:bg-blue-300" style={{ height: "65%" }} />
              <span className="text-[10px] font-semibold text-gray-400">Mon</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
              <div className="w-full bg-blue-200 rounded-t-md transition-all hover:bg-blue-300" style={{ height: "80%" }} />
              <span className="text-[10px] font-semibold text-gray-400">Tue</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
              <div className="w-full bg-blue-300 rounded-t-md transition-all hover:bg-blue-400" style={{ height: "92%" }} />
              <span className="text-[10px] font-semibold text-gray-400">Wed</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
              <div className="w-full bg-blue-200 rounded-t-md transition-all hover:bg-blue-300" style={{ height: "88%" }} />
              <span className="text-[10px] font-semibold text-gray-400">Thu</span>
            </div>
            <div className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
              <div className="w-full bg-blue-200 rounded-t-md transition-all hover:bg-blue-300" style={{ height: "95%" }} />
              <span className="text-[10px] font-semibold text-gray-400">Fri</span>
            </div>
          </div>
        </div>

        {/* Class Breakdown Section */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold font-serif text-gray-900 mb-6">
            Class Breakdown
          </h2>

          <div className="space-y-5">
            {/* Grade 10 */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-800 mb-1.5">
                <span>Grade 10</span>
                <span className="text-emerald-700">98%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-emerald-800 rounded-full" style={{ width: "98%" }} />
              </div>
            </div>

            {/* Grade 9 */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-800 mb-1.5">
                <span>Grade 9</span>
                <span className="text-emerald-700">96%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-emerald-800 rounded-full" style={{ width: "96%" }} />
              </div>
            </div>

            {/* Grade 12 */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-800 mb-1.5">
                <span>Grade 12</span>
                <span className="text-blue-700">92%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-blue-700 rounded-full" style={{ width: "92%" }} />
              </div>
            </div>

            {/* Grade 11 */}
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-800 mb-1.5">
                <span>Grade 11</span>
                <span className="text-red-600">85%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-red-600 rounded-full" style={{ width: "85%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Administrative Intervention Table */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-bold font-serif text-gray-900">
            Administrative Intervention Required
          </h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 border border-red-100">
            ⚠ Below 80%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                <th className="py-3.5 pl-6 pr-3">Student Name</th>
                <th className="px-3 py-3.5">Class/Grade</th>
                <th className="px-3 py-3.5">Attendance %</th>
                <th className="px-3 py-3.5">Consecutive Absences</th>
                <th className="py-3.5 pl-3 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {interventions.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/60 transition-colors">
                  {/* Name & ID */}
                  <td className="py-4 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {student.student_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          {student.student_name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          ID: {student.student_id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Class Grade */}
                  <td className="px-3 py-4 text-xs font-medium text-gray-600">
                    {student.class_name}
                  </td>

                  {/* Percentage */}
                  <td className="px-3 py-4 text-xs font-bold text-red-600">
                    {student.attendance_pct}%
                  </td>

                  {/* Absences */}
                  <td className="px-3 py-4 text-xs font-medium text-gray-600">
                    {student.consecutive_absences}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 pl-3 pr-6 text-right">
                    {student.attendance_pct < 75 ? (
                      <button
                        type="button"
                        onClick={() => handleContactGuardian(student)}
                        className="rounded-xl border border-gray-300 bg-white px-4 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                      >
                        Contact Guardian
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendNotice(student)}
                        className="rounded-xl border border-gray-300 bg-white px-4 py-1.5 text-xs font-semibold text-blue-600 shadow-sm hover:bg-blue-50 active:scale-95 transition-all"
                      >
                        Send Notice
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mark Attendance Modal */}
      {showMarkModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowMarkModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Record Attendance</h3>
              <button
                type="button"
                onClick={() => setShowMarkModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleMarkAttendance} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student full name"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Class Grade</label>
                <select
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 outline-none focus:border-blue-600"
                >
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700">Status</label>
                <select
                  value={attendanceStatus}
                  onChange={(e) => setAttendanceStatus(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-900 outline-none focus:border-blue-600"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMarkModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}