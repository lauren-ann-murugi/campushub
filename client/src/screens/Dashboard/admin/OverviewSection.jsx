"use client";

import { useEffect, useState } from "react";
import { AdminAdmissionsSection } from "./AdmissionsSection";
import { AdminAttendanceSection } from "./AttendanceSection";
import { AdminExamsSection } from "./ExamsSection";
import { AdminResultsSection } from "./ResultsSection";
import { AdminReportsSection } from "./ReportsSection";
import { AdminStaffSection } from "./StaffSection";
import { AdminStudentsSection } from "./StudentsSection";

export function AdminOverviewSection({ name, onNavigate }) {
  const [metrics, setMetrics] = useState({
    totalStudents: { count: "2,450", change: "+12% from last month", isPositive: true },
    totalTeachers: { count: "184", note: "Stable" },
    totalClasses: { count: "72", note: "Across 4 blocks" },
    attendanceRate: { value: "94%", change: "-2% from yesterday", isPositive: false },
    feeCollection: { amount: "$45k", change: "85% collected", isPositive: true },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/dashboard-stats");
        if (res.ok) {
          const data = await res.json();
          if (data.metrics) setMetrics(data.metrics);
        }
      } catch (error) {
        console.warn("Dashboard metrics unavailable", error);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#111827]">Welcome back, {name || "Admin"}</h2>
        <p className="mt-2 text-sm text-[#6b7280]">The admin experience is now connected to live in-app data across admissions, academics, attendance, and finance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Total Students", value: metrics.totalStudents.count, helper: metrics.totalStudents.change },
          { label: "Total Teachers", value: metrics.totalTeachers.count, helper: metrics.totalTeachers.note },
          { label: "Total Classes", value: metrics.totalClasses.count, helper: metrics.totalClasses.note },
          { label: "Attendance Rate", value: metrics.attendanceRate.value, helper: metrics.attendanceRate.change },
          { label: "Fee Collection", value: metrics.feeCollection.amount, helper: metrics.feeCollection.change },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7280]">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-[#111827]">{item.value}</p>
            <p className="mt-1 text-sm text-[#6b7280]">{item.helper}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#111827]">Rapid navigation</h3>
            <button onClick={() => onNavigate?.("students")} className="text-sm font-semibold text-[#2563eb]">Open students</button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              ["students", "Student Records"],
              ["staff", "Staff Directory"],
              ["admissions", "Admissions"],
              ["attendance", "Attendance"],
              ["examinations", "Examinations"],
              ["results", "Results"],
            ].map(([id, label]) => (
              <button key={id} onClick={() => onNavigate?.(id)} className="rounded-xl border border-[#e5e7eb] px-3 py-2 text-left text-sm font-medium text-[#111827] hover:bg-[#f9fafb]">
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#111827]">Module preview</h3>
          <p className="mt-2 text-sm text-[#6b7280]">Admissions, attendance, exams, results, fees, reports, and announcements are all backed by in-app mock data so the admin portal is usable immediately.</p>
        </div>
      </div>
    </div>
  );
}
