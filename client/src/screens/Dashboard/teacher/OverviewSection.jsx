"use client";

import React, { useState, useEffect } from "react";
import {
  DashboardHeader,
  PanelCard,
  StatCard,
  Badge,
} from "../DashboardLayout";
import {
  Presentation,
  UsersIcon,
  ClipboardCheck,
  FileText,
  ClockIcon,
  ArrowRight,
  CheckIcon,
} from "../../../components/icons";

const INITIAL_CLASSES = [
  { name: "JSS 3A — Mathematics", students: 32, time: "08:00", room: "Room 7", color: "#004ac6" },
  { name: "SS 2B — Mathematics", students: 28, time: "10:00", room: "Room 12", color: "#006c49" },
  { name: "SS 1A — Mathematics", students: 30, time: "13:00", room: "Room 9", color: "#f59e0b" },
];

const INITIAL_PENDING_GRADING = [
  { title: "JSS 3A — Quiz 3", submitted: 28, total: 32 },
  { title: "SS 2B — Assignment 5", submitted: 22, total: 28 },
  { title: "SS 1A — Term Test", submitted: 30, total: 30 },
];

const INITIAL_ATTENDANCE_TODAY = [
  { name: "JSS 3A", present: 30, total: 32 },
  { name: "SS 2B", present: 27, total: 28 },
  { name: "SS 1A", present: 29, total: 30 },
];

const INITIAL_UPCOMING_EXAMS = [
  { name: "JSS 3A Midterm", date: "Jul 25", students: 32 },
  { name: "SS 2B Quiz 4", date: "Jul 28", students: 28 },
  { name: "SS 1A End of Term", date: "Aug 02", students: 30 },
];

export function TeacherOverviewSection({ name = "Teacher", onNavigate }) {
  const [classesList, setClassesList] = useState(INITIAL_CLASSES);
  const [pendingGradingList, setPendingGradingList] = useState(INITIAL_PENDING_GRADING);
  const [attendanceTodayList, setAttendanceTodayList] = useState(INITIAL_ATTENDANCE_TODAY);
  const [upcomingExamsList, setUpcomingExamsList] = useState(INITIAL_UPCOMING_EXAMS);
  const [loading, setLoading] = useState(true);

  // Fetch overview metrics dynamically from Python Backend
  useEffect(() => {
    async function loadOverviewData() {
      try {
        setLoading(true);
        const res = await fetch("/api/teacher/overview");
        if (res.ok) {
          const data = await res.json();
          if (data.classes) setClassesList(data.classes);
          if (data.pendingGrading) setPendingGradingList(data.pendingGrading);
          if (data.attendanceToday) setAttendanceTodayList(data.attendanceToday);
          if (data.upcomingExams) setUpcomingExamsList(data.upcomingExams);
        }
      } catch (err) {
        // Fallback silently to preset data if API is offline
      } finally {
        setLoading(false);
      }
    }
    loadOverviewData();
  }, []);

  const totalStudents = classesList.reduce((acc, curr) => acc + (curr.students || 0), 0);

  const totalAttendancePresent = attendanceTodayList.reduce((acc, curr) => acc + curr.present, 0);
  const totalAttendanceTotal = attendanceTodayList.reduce((acc, curr) => acc + curr.total, 0);
  const overallAttendancePct = totalAttendanceTotal > 0 
    ? Math.round((totalAttendancePresent / totalAttendanceTotal) * 100) 
    : 0;

  const handleNavigation = (sectionId) => {
    if (typeof onNavigate === "function") {
      onNavigate(sectionId);
    }
  };

  return (
    <>
      <DashboardHeader
        title={`Welcome, ${name || "Teacher"}`}
        subtitle="Manage your classes, attendance, and grading in one place."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="My Classes"
          value={String(classesList.length)}
          icon={<Presentation className="h-5 w-5" />}
          accent="blue"
        />
        <StatCard
          label="Total Students"
          value={String(totalStudents)}
          icon={<UsersIcon className="h-5 w-5" />}
          accent="green"
        />
        <StatCard
          label="Attendance Today"
          value={`${overallAttendancePct}%`}
          trend="Good"
          icon={<ClipboardCheck className="h-5 w-5" />}
          accent="amber"
        />
        <StatCard
          label="Pending Grading"
          value={String(pendingGradingList.length)}
          icon={<FileText className="h-5 w-5" />}
          accent="red"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <PanelCard
            title="My Classes"
            action="View students"
            onAction={() => handleNavigation("students")}
          >
            {loading ? (
              <div className="py-8 text-center text-xs text-[#434655]">Loading classes...</div>
            ) : (
              <ul className="flex flex-col gap-4">
                {classesList.map((c, index) => (
                  <li
                    key={`${c.name}-${index}`}
                    className="flex flex-col gap-2 border-b border-[#eceef0] pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: c.color || "#004ac6" }}
                      >
                        <Presentation className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-[#191c1e]">{c.name}</p>
                        <p className="text-xs text-[#434655]">
                          {c.students} students · {c.room}
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 self-start rounded-full bg-[#f7f9fb] px-3 py-1 text-xs font-medium text-[#434655] sm:self-center">
                      <ClockIcon className="h-3 w-3" /> {c.time}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </PanelCard>

          <PanelCard
            title="Upcoming Exams"
            action="Manage exams"
            onAction={() => handleNavigation("exams")}
          >
            {loading ? (
              <div className="py-8 text-center text-xs text-[#434655]">Loading exams...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#eceef0]">
                      <th className="pb-3 text-xs font-medium text-[#434655]">Exam</th>
                      <th className="pb-3 text-xs font-medium text-[#434655]">Date</th>
                      <th className="pb-3 text-right text-xs font-medium text-[#434655]">
                        Students
                      </th>
                      <th className="pb-3 text-right text-xs font-medium text-[#434655]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomingExamsList.map((ex, index) => (
                      <tr key={`${ex.name}-${index}`} className="border-b border-[#f0f1f3] last:border-0 hover:bg-[#f7f9fb]/50 transition-colors">
                        <td className="py-3 text-sm font-medium text-[#191c1e]">{ex.name}</td>
                        <td className="py-3 text-sm text-[#434655]">{ex.date}</td>
                        <td className="py-3 text-right text-sm text-[#434655]">
                          {ex.students}
                        </td>
                        <td className="py-3 text-right">
                          <Badge variant="amber">Scheduled</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </PanelCard>
        </div>

        <div className="flex flex-col gap-6">
          <PanelCard
            title="Pending Grading"
            action="Grade now"
            onAction={() => handleNavigation("exams")}
          >
            <ul className="flex flex-col gap-4">
              {pendingGradingList.map((g, index) => (
                <li key={`${g.title}-${index}`} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#191c1e]">{g.title}</p>
                    <span className="text-xs text-[#434655]">
                      {g.submitted}/{g.total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#f7f9fb]">
                    <div
                      className="h-full rounded-full bg-[#006c49] transition-all duration-300"
                      style={{ width: `${(g.submitted / g.total) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </PanelCard>

          <PanelCard title="Attendance Today">
            <ul className="flex flex-col gap-3">
              {attendanceTodayList.map((a, index) => (
                <li key={`${a.name}-${index}`} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#191c1e]">{a.name}</p>
                    <p className="text-xs text-[#434655]">
                      {a.present} present, {a.total - a.present} absent
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-[#006c49]">
                    <CheckIcon className="h-4 w-4" />{" "}
                    {Math.round((a.present / a.total) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleNavigation("attendance")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#c3c6d7] py-2.5 text-sm font-medium text-[#004ac6] transition-colors hover:bg-[#f7f9fb]"
            >
              Take attendance <ArrowRight className="h-4 w-4" />
            </button>
          </PanelCard>
        </div>
      </div>
    </>
  );
}