"use client";

import { useEffect, useState } from "react";

// --- Inline Sub-components for Layout & Visual Structure ---

function DashboardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#191c1e]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#434655]">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function StatCard({ label, value, icon, accent }) {
  const accentClasses = {
    blue: "border-l-4 border-l-[#004ac6]",
    green: "border-l-4 border-l-emerald-500",
    amber: "border-l-4 border-l-amber-500",
    red: "border-l-4 border-l-rose-500",
  };

  return (
    <div
      className={`rounded-2xl border border-[#e6e8ea] bg-white p-4 shadow-[0px_1px_2px_#0000000d] ${
        accentClasses[accent] || ""
      }`}
    >
      <div className="flex items-center justify-between text-[#434655]">
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-bold text-[#191c1e]">{value}</p>
    </div>
  );
}

function PanelCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-[0px_1px_2px_#0000000d]">
      {title && (
        <h2 className="mb-4 text-base font-semibold text-[#191c1e]">{title}</h2>
      )}
      {children}
    </div>
  );
}

function Badge({ children, variant = "gray" }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-[#004ac6] border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    gray: "bg-gray-100 text-[#434655] border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
        styles[variant] || styles.gray
      }`}
    >
      {children}
    </span>
  );
}

const GRADE_VARIANT = {
  A: "green",
  B: "blue",
  C: "amber",
  D: "red",
  F: "red",
};

// --- Main Component ---

export function AdminResultsSection() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("All");

  useEffect(() => {
    const loadResultsData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/results");
        if (!res.ok) throw new Error("Failed to load exam results");
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        // Dev Fallback Data
        setResults([
          {
            id: "res-1",
            exam_id: "ex-101",
            student_name: "Sarah Jenkins",
            score: 95,
            grade: "A",
            recorded_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            exam: { title: "Mid-Term Assessment", class_name: "Grade 10-A", subject: "Mathematics", max_score: 100 },
          },
          {
            id: "res-2",
            exam_id: "ex-101",
            student_name: "Michael Vance",
            score: 84,
            grade: "B",
            recorded_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
            exam: { title: "Mid-Term Assessment", class_name: "Grade 10-A", subject: "Mathematics", max_score: 100 },
          },
          {
            id: "res-3",
            exam_id: "ex-102",
            student_name: "Elena Rostova",
            score: 72,
            grade: "C",
            recorded_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            exam: { title: "Unit Test 2", class_name: "Grade 11-B", subject: "Physics", max_score: 100 },
          },
          {
            id: "res-4",
            exam_id: "ex-103",
            student_name: "David Kim",
            score: 61,
            grade: "D",
            recorded_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
            exam: { title: "Mock Finals", class_name: "Grade 12-Sci", subject: "Chemistry", max_score: 100 },
          },
          {
            id: "res-5",
            exam_id: "ex-103",
            student_name: "Chloe Bennett",
            score: 98,
            grade: "A",
            recorded_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
            exam: { title: "Mock Finals", class_name: "Grade 12-Sci", subject: "Chemistry", max_score: 100 },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadResultsData();
  }, []);

  const filtered = results.filter((r) => {
    const query = search.toLowerCase();
    const matchSearch =
      r.student_name.toLowerCase().includes(query) ||
      (r.exam?.title ?? "").toLowerCase().includes(query) ||
      (r.exam?.subject ?? "").toLowerCase().includes(query);
    const matchGrade = filterGrade === "All" || r.grade === filterGrade;
    return matchSearch && matchGrade;
  });

  const avgScore =
    results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
      : 0;
  const topScorer = results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0;
  const gradeA = results.filter((r) => r.grade === "A").length;

  return (
    <>
      <DashboardHeader
        title="Results"
        subtitle="View exam results across all classes and subjects."
      />

      {/* Overview Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Results"
          value={String(results.length)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
          accent="blue"
        />
        <StatCard
          label="Average Score"
          value={`${avgScore}%`}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          accent="green"
        />
        <StatCard
          label="Top Score"
          value={String(topScorer)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          }
          accent="amber"
        />
        <StatCard
          label="Grade A's"
          value={String(gradeA)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          accent="red"
        />
      </div>

      {/* Main Results Table Panel */}
      <PanelCard title="All Results">
        {/* Search & Grade Filter Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#434655]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by student or exam..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#c3c6d7] bg-white py-2.5 pl-10 pr-4 text-sm text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "A", "B", "C", "D", "F"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setFilterGrade(g)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  filterGrade === g
                    ? "bg-[#004ac6] text-white"
                    : "border border-[#e6e8ea] bg-white text-[#434655] hover:bg-[#f7f9fb]"
                }`}
              >
                {g === "All" ? "All" : `Grade ${g}`}
              </button>
            ))}
          </div>
        </div>

        {/* Data Rendering Table */}
        {loading ? (
          <div className="py-12 text-center text-sm text-[#434655]">Loading results...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#434655]">No results found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#eceef0]">
                  <th className="pb-3 text-xs font-medium text-[#434655]">Student</th>
                  <th className="pb-3 text-xs font-medium text-[#434655]">Exam</th>
                  <th className="pb-3 text-xs font-medium text-[#434655]">Subject</th>
                  <th className="pb-3 text-center text-xs font-medium text-[#434655]">Score</th>
                  <th className="pb-3 text-center text-xs font-medium text-[#434655]">Grade</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const maxScore = r.exam?.max_score ?? 100;
                  const pct = Math.round((r.score / maxScore) * 100);

                  return (
                    <tr
                      key={r.id}
                      className="border-b border-[#f0f1f3] transition-colors last:border-0 hover:bg-[#f7f9fb]"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#004ac60d] text-xs font-semibold text-[#004ac6]">
                            {r.student_name
                              ? r.student_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join("")
                              : "U"}
                          </span>
                          <p className="text-sm font-medium text-[#191c1e]">{r.student_name}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <p className="text-sm text-[#191c1e]">{r.exam?.title ?? "—"}</p>
                        <p className="text-xs text-[#434655]">{r.exam?.class_name}</p>
                      </td>
                      <td className="py-3 text-sm text-[#434655]">{r.exam?.subject ?? "—"}</td>
                      <td className="py-3 text-center">
                        <p className="text-sm font-semibold text-[#191c1e]">
                          {r.score}/{maxScore}
                        </p>
                        <p className="text-xs text-[#434655]">{pct}%</p>
                      </td>
                      <td className="py-3 text-center">
                        {r.grade ? (
                          <Badge variant={GRADE_VARIANT[r.grade] || "gray"}>{r.grade}</Badge>
                        ) : (
                          <Badge variant="gray">—</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </PanelCard>
    </>
  );
}