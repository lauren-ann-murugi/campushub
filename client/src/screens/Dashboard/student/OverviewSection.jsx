"use client";

export function OverviewSection({ name = "Student", onNavigate }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e6e8ea] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-[#191c1e]">Welcome back, {name}</h2>
        <p className="mt-2 text-sm text-[#434655]">
          Your dashboard is ready. Use the navigation to view attendance, results, timetable, and fees.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => onNavigate?.("attendance")}
          className="rounded-2xl border border-[#e6e8ea] bg-white p-5 text-left shadow-sm"
        >
          <p className="text-sm font-semibold text-[#191c1e]">Attendance</p>
          <p className="mt-2 text-sm text-[#434655]">Review your class attendance and status.</p>
        </button>
        <button
          type="button"
          onClick={() => onNavigate?.("results")}
          className="rounded-2xl border border-[#e6e8ea] bg-white p-5 text-left shadow-sm"
        >
          <p className="text-sm font-semibold text-[#191c1e]">Results</p>
          <p className="mt-2 text-sm text-[#434655]">View your latest grades and assessments.</p>
        </button>
      </div>
    </div>
  );
}
