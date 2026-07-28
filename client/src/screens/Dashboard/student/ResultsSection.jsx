"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader, PanelCard, StatCard, Badge } from "../DashboardLayout";
import { TrendUp, BarChartIcon, DownloadIcon, GraduationCap } from "../../../components/icons";

export function ResultsSection() {
  const [selectedTerm, setSelectedTerm] = useState("Term 2 · 2025/26");
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [resultsData, setResultsData] = useState({
    stats: {
      gpa: "3.78",
      gpaTrend: "+0.3",
      avgScore: "84.8%",
      classRank: "12th",
      totalStudents: "180",
      creditsEarned: "18",
    },
    subjects: [],
    assessments: [],
    gradeDistribution: [],
  });

  // Default fallback data matching your exact layout
  const fallbackData = {
    stats: {
      gpa: "3.78",
      gpaTrend: "+0.3",
      avgScore: "84.8%",
      classRank: "12th",
      totalStudents: "180",
      creditsEarned: "18",
    },
    subjects: [
      { name: "Mathematics 201", code: "MATH201", grade: "A-", score: 88, teacher: "Mr. Adeyemi", color: "#004ac6" },
      { name: "English Literature", code: "ENG201", grade: "B+", score: 82, teacher: "Ms. Bello", color: "#006c49" },
      { name: "Computer Science", code: "CS201", grade: "A", score: 94, teacher: "Mr. Okafor", color: "#7c3aed" },
      { name: "Biology", code: "BIO201", grade: "B", score: 76, teacher: "Dr. Eze", color: "#f59e0b" },
      { name: "Physics", code: "PHY201", grade: "B+", score: 84, teacher: "Dr. Ojo", color: "#0891b2" },
    ],
    assessments: [
      { subject: "Mathematics 201", type: "Midterm Exam", score: 88, max: 100, grade: "A-", date: "Jul 14" },
      { subject: "English Literature", type: "Essay", score: 41, max: 50, grade: "B+", date: "Jul 12" },
      { subject: "Computer Science", type: "Quiz 3", score: 19, max: 20, grade: "A", date: "Jul 10" },
      { subject: "Biology", type: "Lab Report", score: 38, max: 50, grade: "B", date: "Jul 08" },
      { subject: "Physics", type: "Assignment 2", score: 17, max: 20, grade: "B+", date: "Jul 05" },
      { subject: "Mathematics 201", type: "Quiz 4", score: 9, max: 10, grade: "A-", date: "Jul 03" },
    ],
    gradeDistribution: [
      { grade: "A", count: 1, pct: 20 },
      { grade: "A-", count: 1, pct: 20 },
      { grade: "B+", count: 2, pct: 40 },
      { grade: "B", count: 1, pct: 20 },
    ],
  };

  // Fetch results when term changes
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const queryParam = encodeURIComponent(selectedTerm);
        const res = await fetch(`/api/student/results?term=${queryParam}`);
        if (!res.ok) throw new Error("Failed to fetch term results");
        const data = await res.json();
        setResultsData(data);
      } catch (error) {
        // Fallback to static structure if backend endpoint is unavailable
        setResultsData(fallbackData);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [selectedTerm]);

  // Handle Transcript Download Action
  const handleDownloadTranscript = async () => {
    try {
      setDownloading(true);
      const res = await fetch(`/api/student/transcript/download?term=${encodeURIComponent(selectedTerm)}`);
      
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Academic_Transcript_${selectedTerm.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        // Fallback trigger print dialog for standard browser transcript preview/download
        window.print();
      }
    } catch (err) {
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <DashboardHeader
        title="Results"
        subtitle="Your academic performance and grades for this term."
        action={
          <button
            onClick={handleDownloadTranscript}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#c3c6d7] bg-white px-4 py-2.5 text-sm font-medium text-[#191c1e] transition-colors hover:bg-[#f7f9fb] disabled:opacity-60"
          >
            <DownloadIcon className="h-4 w-4" />
            {downloading ? "Preparing..." : "Download transcript"}
          </button>
        }
      />

      {/* Term Switcher */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm text-[#434655]">Term:</span>
        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          className="rounded-lg border border-[#c3c6d7] bg-white px-4 py-2 text-sm font-medium text-[#191c1e] transition-colors focus:border-[#004ac6] focus:outline-none"
        >
          <option value="Term 2 · 2025/26">Term 2 · 2025/26</option>
          <option value="Term 1 · 2025/26">Term 1 · 2025/26</option>
          <option value="Term 3 · 2024/25">Term 3 · 2024/25</option>
        </select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm font-medium text-[#434655]">
          Loading academic results...
        </div>
      ) : (
        <>
          {/* Key Metric Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Current GPA"
              value={resultsData.stats.gpa}
              trend={resultsData.stats.gpaTrend}
              icon={<TrendUp className="h-5 w-5" />}
              accent="green"
            />
            <StatCard
              label="Average Score"
              value={resultsData.stats.avgScore}
              icon={<BarChartIcon className="h-5 w-5" />}
              accent="blue"
            />
            <StatCard
              label="Class Rank"
              value={resultsData.stats.classRank}
              trend={`of ${resultsData.stats.totalStudents}`}
              icon={<GraduationCap className="h-5 w-5" />}
              accent="amber"
            />
            <StatCard
              label="Credits Earned"
              value={resultsData.stats.creditsEarned}
              icon={<TrendUp className="h-5 w-5" />}
              accent="blue"
            />
          </div>

          {/* Subject Grades and Grade Distribution */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PanelCard title="Subject Grades">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {resultsData.subjects.map((s) => (
                    <div key={s.code} className="rounded-xl border border-[#e6e8ea] p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-[#191c1e]">{s.name}</p>
                          <p className="text-xs text-[#434655]">
                            {s.code} · {s.teacher}
                          </p>
                        </div>
                        <span
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
                          style={{ backgroundColor: s.color || "#004ac6" }}
                        >
                          {s.grade}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-[#434655]">Score</span>
                          <span className="text-xs font-medium text-[#191c1e]">{s.score}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#f7f9fb]">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${s.score}%`,
                              backgroundColor: s.color || "#004ac6",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PanelCard>
            </div>

            <div>
              <PanelCard title="Grade Distribution">
                <div className="flex flex-col gap-4">
                  {resultsData.gradeDistribution.map((g) => (
                    <div key={g.grade}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="flex h-6 w-6 items-center justify-center rounded bg-[#004ac60d] text-xs font-bold text-[#004ac6]">
                          {g.grade}
                        </span>
                        <span className="text-xs text-[#434655]">
                          {g.count} subject{g.count > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#f7f9fb]">
                        <div
                          className="h-full rounded-full bg-[#004ac6] transition-all duration-500"
                          style={{ width: `${g.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </PanelCard>
            </div>
          </div>

          {/* Assessment Breakdown Table */}
          <div className="mt-6">
            <PanelCard title="Recent Assessments">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#eceef0]">
                      <th className="pb-3 text-xs font-medium text-[#434655]">Subject</th>
                      <th className="pb-3 text-xs font-medium text-[#434655]">Assessment</th>
                      <th className="pb-3 text-xs font-medium text-[#434655]">Date</th>
                      <th className="pb-3 text-right text-xs font-medium text-[#434655]">Score</th>
                      <th className="pb-3 text-right text-xs font-medium text-[#434655]">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultsData.assessments.map((a, i) => (
                      <tr key={i} className="border-b border-[#f0f1f3] transition-colors hover:bg-slate-50/50 last:border-0">
                        <td className="py-3 text-sm font-medium text-[#191c1e]">{a.subject}</td>
                        <td className="py-3 text-sm text-[#434655]">{a.type}</td>
                        <td className="py-3 text-sm text-[#434655]">{a.date}</td>
                        <td className="py-3 text-right text-sm font-medium text-[#191c1e]">
                          {a.score}/{a.max}
                        </td>
                        <td className="py-3 text-right">
                          <Badge variant="green">{a.grade}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </PanelCard>
          </div>
        </>
      )}
    </>
  );
}