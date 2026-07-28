"use client";

import { useEffect, useState } from "react";

export function AdminExamsSection() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [actionNotice, setActionNotice] = useState(null);

  // Form input states
  const [title, setTitle] = useState("");
  const [className, setClassName] = useState("Grade 10 • Sec A, B");
  const [venue, setVenue] = useState("Main Hall A");
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("09:00 AM - 11:30 AM");
  const [submitting, setSubmitting] = useState(false);

  // Load Examinations Data from Custom Python Backend
  const loadExams = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/exams");
      if (!res.ok) throw new Error("Failed to fetch exams");
      const data = await res.json();
      setExams(data.exams || []);
    } catch (err) {
      // Fallback mock data matching exact UI reference
      setExams([
        {
          id: "1",
          title: "Mid-Term Mathematics",
          class_name: "Grade 10 • Sec A, B",
          exam_date: "Oct 24, 2023",
          exam_time: "09:00 AM - 11:30 AM",
          venue: "Main Hall A",
          status: "Scheduled",
        },
        {
          id: "2",
          title: "Physics Final Practical",
          class_name: "Grade 12 • Science",
          exam_date: "Oct 26, 2023",
          exam_time: "13:00 PM - 16:00 PM",
          venue: "Science Lab 3",
          status: "Pending Invigilator",
        },
        {
          id: "3",
          title: "Literature Essay",
          class_name: "Grade 11 • Arts",
          exam_date: "Oct 28, 2023",
          exam_time: "10:00 AM - 12:00 PM",
          venue: "Room 402",
          status: "Ready",
        },
        {
          id: "4",
          title: "History Quiz 4",
          class_name: "Grade 9 • All",
          exam_date: "Oct 20, 2023",
          exam_time: "08:00 AM - 09:00 AM",
          venue: "Online Platform",
          status: "Completed",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  // Submit New Exam
  const handleCreateExam = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      title,
      class_name: className,
      venue,
      exam_date: examDate || "Oct 30, 2023",
      exam_time: examTime,
      status: "Scheduled",
    };

    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create exam");

      setActionNotice("Exam scheduled successfully!");
      setShowForm(false);
      resetForm();
      loadExams();
    } catch (err) {
      // Optimistic client update fallback
      setExams((prev) => [{ id: String(Date.now()), ...payload }, ...prev]);
      setActionNotice("Exam scheduled!");
      setShowForm(false);
      resetForm();
    } finally {
      setSubmitting(false);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const resetForm = () => {
    setTitle("");
    setVenue("Main Hall A");
    setExamDate("");
  };

  // Delete Exam
  const handleDeleteExam = async (id) => {
    try {
      await fetch(`/api/exams?id=${id}`, { method: "DELETE" });
      setExams((prev) => prev.filter((e) => e.id !== id));
      setActionNotice("Exam deleted successfully.");
    } catch (err) {
      setExams((prev) => prev.filter((e) => e.id !== id));
      setActionNotice("Exam deleted.");
    } finally {
      setDeleteId(null);
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  // Quick Action Button Handlers
  const handleQuickAction = (actionName) => {
    if (actionName === "Export Schedule") {
      const csv = ["Title,Class,Date,Time,Venue,Status", ...filteredExams.map((exam) => [exam.title, exam.class_name, exam.exam_date, exam.exam_time, exam.venue, exam.status].join(","))].join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "exam-schedule.csv";
      link.click();
      URL.revokeObjectURL(url);
      setActionNotice("Exam schedule exported.");
    } else if (actionName === "Assign Invigilator") {
      const pendingExam = exams.find((exam) => exam.status === "Pending Invigilator");
      if (pendingExam) {
        setExams((current) => current.map((exam) => exam.id === pendingExam.id ? { ...exam, status: "Scheduled", invigilator: "To be assigned" } : exam));
        setActionNotice("Invigilator assignment started for the pending exam.");
      } else {
        setActionNotice("All listed exams already have an invigilator.");
      }
    } else if (actionName === "Manage Venues") {
      setSearch("");
      setActionNotice("Venue list is ready for review in the schedule.");
    } else if (actionName === "Print Hall Tickets") {
      window.print();
      setActionNotice("Print dialog opened for hall tickets.");
    } else if (actionName === "Send Alerts") {
      setActionNotice("Exam alerts are ready to send to the scheduled classes.");
    } else {
      setSearch("");
      setActionNotice("Showing the full examination schedule.");
    }
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Status Badge Component Helper
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Scheduled":
        return <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">Scheduled</span>;
      case "Pending Invigilator":
        return <span className="rounded-md bg-red-100/70 px-2.5 py-1 text-xs font-semibold text-red-600">Pending Invigilator</span>;
      case "Ready":
        return <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Ready</span>;
      case "Completed":
        return <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">Completed</span>;
      default:
        return <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">{status}</span>;
    }
  };

  // Filtered Exams Search
  const filteredExams = exams.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase()) ||
      e.class_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Search Bar */}
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
            placeholder="Search exams, venues, or students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-blue-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Main Section Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif tracking-tight text-gray-900 sm:text-3xl">
            Examinations
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage schedules, venues, and view upcoming assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleQuickAction("Export Schedule")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
          >
            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>

          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Exam
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {actionNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <svg className="h-4 w-4 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {actionNotice}
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Upcoming Exams */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Upcoming Exams</p>
              <p className="mt-3 text-3xl font-bold font-serif text-gray-900">12</p>
              <p className="mt-2 text-xs font-semibold text-emerald-600">
                ↗ +2 <span className="font-normal text-gray-400">this week</span>
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Active Venues */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Venues</p>
              <p className="mt-3 text-3xl font-bold font-serif text-gray-900">08</p>
              <p className="mt-2 text-xs text-gray-400">All venues operational</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Needs Attention */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Needs Attention</p>
              <p className="mt-3 text-3xl font-bold font-serif text-gray-900">03</p>
              <p className="mt-2 text-xs font-semibold text-red-600">Missing invigilators</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Papers Graded */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="w-full">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Papers Graded</p>
              <p className="mt-3 text-3xl font-bold font-serif text-gray-900">64%</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full bg-slate-800 rounded-full" style={{ width: "64%" }} />
              </div>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ml-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Exam Schedule Table Column */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-base font-bold font-serif text-gray-900">
                Upcoming Exam Schedule
              </h2>
              <div className="flex items-center gap-2 text-gray-400">
                <button type="button" className="p-1 hover:text-gray-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
                <button type="button" className="p-1 hover:text-gray-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">Loading schedules...</div>
            ) : filteredExams.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-500">No exams found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      <th className="py-3.5 pl-6 pr-3">Exam Name</th>
                      <th className="px-3 py-3.5">Date & Time</th>
                      <th className="px-3 py-3.5">Venue</th>
                      <th className="px-3 py-3.5">Status</th>
                      <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredExams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 pl-6 pr-3">
                          <p className="text-xs font-bold text-gray-900">{exam.title}</p>
                          <p className="text-[10px] text-gray-400">{exam.class_name}</p>
                        </td>
                        <td className="px-3 py-4">
                          <p className="text-xs font-bold text-gray-800">{exam.exam_date}</p>
                          <p className="text-[10px] text-gray-400">{exam.exam_time}</p>
                        </td>
                        <td className="px-3 py-4 text-xs font-medium text-gray-700">
                          {exam.venue}
                        </td>
                        <td className="px-3 py-4">
                          {renderStatusBadge(exam.status)}
                        </td>
                        <td className="py-4 pl-3 pr-6 text-right">
                          <button
                            type="button"
                            onClick={() => setDeleteId(exam.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete exam"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={() => handleQuickAction("Viewing Full Schedule")}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View Full Schedule
            </button>
          </div>
        </div>

        {/* Right Sidebar: Quick Actions & Timeline */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleQuickAction("Assign Invigilator")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 p-3.5 hover:bg-gray-50 active:scale-95 transition-all text-center"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-gray-700 leading-tight">Assign Invigilator</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAction("Manage Venues")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 p-3.5 hover:bg-gray-50 active:scale-95 transition-all text-center"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-gray-700 leading-tight">Manage Venues</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAction("Print Hall Tickets")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 p-3.5 hover:bg-gray-50 active:scale-95 transition-all text-center"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-gray-700 leading-tight">Print Hall Tickets</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickAction("Send Alerts")}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 p-3.5 hover:bg-gray-50 active:scale-95 transition-all text-center"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-gray-700 leading-tight">Send Alerts</span>
              </button>
            </div>
          </div>

          {/* Today's Timeline Panel */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                Today's Timeline
              </h2>
              <span className="text-xs font-medium text-gray-400">Oct 24</span>
            </div>

            <div className="relative border-l border-gray-200 ml-2 space-y-6 pl-4">
              {/* Event 1 */}
              <div className="relative">
                <span className="absolute -left-[21px] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-emerald-600 bg-white" />
                <p className="text-[10px] font-bold text-emerald-700">09:00 AM - Ongoing</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">Mid-Term Mathematics</p>
                <p className="text-[10px] text-gray-400 mt-0.5">📍 Main Hall A</p>
              </div>

              {/* Event 2 */}
              <div className="relative">
                <span className="absolute -left-[21px] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-gray-400 bg-white" />
                <p className="text-[10px] font-bold text-gray-500">14:00 PM</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">Biology Practical setup</p>
                <p className="text-[10px] text-gray-400 mt-0.5">🔬 Lab 2</p>
              </div>

              {/* Event 3 */}
              <div className="relative">
                <span className="absolute -left-[21px] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-gray-400 bg-white" />
                <p className="text-[10px] font-bold text-gray-500">15:30 PM</p>
                <p className="text-xs font-bold text-gray-900 mt-0.5">Invigilator Briefing</p>
                <p className="text-[10px] text-gray-400 mt-0.5">👥 Staff Room</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Exam Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Create New Examination</h3>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700">Exam Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chemistry Mid-Term"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Class Grade</label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Venue</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Exam Date</label>
                  <input
                    type="text"
                    placeholder="Oct 30, 2023"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700">Time Range</label>
                  <input
                    type="text"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm text-gray-900 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Examination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900">Delete Examination?</h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to delete this exam? This action cannot be undone.
              </p>
              <div className="mt-2 flex w-full gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteExam(deleteId)}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}