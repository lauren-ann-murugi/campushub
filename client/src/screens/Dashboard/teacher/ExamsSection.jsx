"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader, PanelCard, StatCard, Badge } from "../DashboardLayout";
import {
  FileText,
  PlusIcon,
  CheckIcon,
  XIcon,
  SaveIcon,
  AlertCircleIcon,
  GraduationCap,
  EditIcon,
} from "../../../components/icons";

const CLASSES = ["JSS 3A", "SS 2B", "SS 1A"];

const INITIAL_EXAMS = [
  { id: "e1", title: "Midterm Exam", class: "JSS 3A", date: "Jul 25", maxScore: 100, status: "scheduled" },
  { id: "e2", title: "Quiz 4", class: "SS 2B", date: "Jul 28", maxScore: 20, status: "scheduled" },
  { id: "e3", title: "Assignment 5", class: "SS 2B", date: "Jul 14", maxScore: 50, status: "graded" },
  { id: "e4", title: "Term Test", class: "SS 1A", date: "Jul 12", maxScore: 100, status: "graded" },
];

const INITIAL_ROSTER = {
  "JSS 3A": [
    { id: "s1", name: "Ada Okafor" },
    { id: "s2", name: "Bola Adeyemi" },
    { id: "s3", name: "Chidi Eze" },
    { id: "s4", name: "Doris Ojo" },
    { id: "s5", name: "Emeka Nwosu" },
  ],
  "SS 2B": [
    { id: "s6", name: "Fatima Bello" },
    { id: "s7", name: "Grace Okon" },
    { id: "s8", name: "Henry Obi" },
    { id: "s9", name: "Ifeoma Okoro" },
  ],
  "SS 1A": [
    { id: "s10", name: "John Adeleke" },
    { id: "s11", name: "Kemi Lawal" },
    { id: "s12", name: "Lola Bello" },
  ],
};

export function TeacherExamSection() {
  const [exams, setExams] = useState(INITIAL_EXAMS);
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [showForm, setShowForm] = useState(false);
  const [gradingExam, setGradingExam] = useState(null);
  const [grades, setGrades] = useState([]);
  const [savedGrades, setSavedGrades] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form Fields
  const [title, setTitle] = useState("");
  const [examClass, setExamClass] = useState(CLASSES[0]);
  const [date, setDate] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  const [formError, setFormError] = useState(null);

  // Fetch real exam data from Python Backend API
  useEffect(() => {
    async function loadExamsData() {
      try {
        setLoading(true);
        const res = await fetch("/api/teacher/exams");
        if (res.ok) {
          const data = await res.json();
          if (data.exams && data.exams.length > 0) {
            setExams(data.exams);
          }
          if (data.roster) {
            setRoster(data.roster);
          }
        }
      } catch (err) {
        // Silently keep default fallback data if API isn't active
      } finally {
        setLoading(false);
      }
    }
    loadExamsData();
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !date.trim()) {
      setFormError("Please fill in all fields.");
      return;
    }

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const newExam = {
      id: `e${Date.now()}`,
      title: title.trim(),
      class: examClass,
      date: formattedDate,
      maxScore: Number(maxScore),
      status: "scheduled",
    };

    setExams((prev) => [newExam, ...prev]);

    // Send to Python backend
    try {
      await fetch("/api/teacher/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExam),
      });
    } catch (err) {
      // Local UI fallback
    }

    setTitle("");
    setDate("");
    setMaxScore(100);
    setShowForm(false);
  };

  const openGrading = async (exam) => {
    setGradingExam(exam);
    setSavedGrades(false);

    let currentGrades = (roster[exam.class] || []).map((s) => ({
      studentId: s.id,
      name: s.name,
      score: "",
    }));

    // Fetch existing grades from API if available
    try {
      const res = await fetch(`/api/teacher/grades?examId=${exam.id}`);
      if (res.ok) {
        const fetchedGrades = await res.json();
        if (Array.isArray(fetchedGrades) && fetchedGrades.length > 0) {
          currentGrades = fetchedGrades;
        }
      }
    } catch (err) {
      // Local state fallback
    }

    setGrades(currentGrades);
  };

  const setScore = (studentId, score) => {
    setGrades((prev) =>
      prev.map((g) => (g.studentId === studentId ? { ...g, score } : g))
    );
    setSavedGrades(false);
  };

  const handleSaveGrades = async () => {
    if (!gradingExam) return;

    const updatedExams = exams.map((e) =>
      e.id === gradingExam.id ? { ...e, status: "graded" } : e
    );
    setExams(updatedExams);

    try {
      await fetch("/api/teacher/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: gradingExam.id,
          grades,
        }),
      });
    } catch (err) {
      // Local UI fallback
    }

    setSavedGrades(true);
    setTimeout(() => {
      setGradingExam(null);
      setSavedGrades(false);
    }, 1800);
  };

  const enteredCount = grades.filter((g) => g.score !== "").length;

  return (
    <>
      <DashboardHeader
        title="Exams"
        subtitle="Create exams and enter grades for your classes."
        action={
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#004ac6] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#003ba6] transition-colors"
          >
            <PlusIcon className="h-4 w-4" /> New exam
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Exams" value={String(exams.length)} icon={<FileText className="h-5 w-5" />} accent="blue" />
        <StatCard label="Scheduled" value={String(exams.filter((e) => e.status === "scheduled").length)} icon={<GraduationCap className="h-5 w-5" />} accent="amber" />
        <StatCard label="Graded" value={String(exams.filter((e) => e.status === "graded").length)} icon={<CheckIcon className="h-5 w-5" />} accent="green" />
        <StatCard label="Drafts" value={String(exams.filter((e) => e.status === "draft").length)} icon={<FileText className="h-5 w-5" />} accent="gray" />
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-[0px_1px_2px_#0000000d]">
          <h3 className="mb-4 text-base font-semibold text-[#191c1e]">Create New Exam</h3>
          {formError && (
            <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
              <AlertCircleIcon className="h-4 w-4" /> {formError}
            </div>
          )}
          <form onSubmit={handleCreateExam} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="ex-title" className="text-sm font-medium text-[#191c1e]">Title</label>
              <input
                id="ex-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midterm Exam"
                className="rounded-lg border border-[#c3c6d7] bg-white px-4 py-2.5 text-sm text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ex-class" className="text-sm font-medium text-[#191c1e]">Class</label>
              <select
                id="ex-class"
                value={examClass}
                onChange={(e) => setExamClass(e.target.value)}
                className="rounded-lg border border-[#c3c6d7] bg-white px-4 py-2.5 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none"
              >
                {CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ex-date" className="text-sm font-medium text-[#191c1e]">Date</label>
              <input
                id="ex-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-lg border border-[#c3c6d7] bg-white px-4 py-2.5 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="ex-max" className="text-sm font-medium text-[#191c1e]">Max Score</label>
              <input
                id="ex-max"
                type="number"
                min={1}
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                className="rounded-lg border border-[#c3c6d7] bg-white px-4 py-2.5 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
              />
            </div>
            <div className="flex gap-3 sm:col-span-2 lg:col-span-4">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-[#004ac6] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#003ba6] transition-colors"
              >
                <PlusIcon className="h-4 w-4" /> Create exam
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-[#c3c6d7] px-5 py-2.5 text-sm font-medium text-[#434655] hover:bg-[#f7f9fb] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <PanelCard title="Exam List">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-[#434655]">
            Loading exams list...
          </div>
        ) : exams.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#434655]">
            No exams created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#eceef0]">
                  <th className="pb-3 text-xs font-medium text-[#434655]">Title</th>
                  <th className="pb-3 text-xs font-medium text-[#434655]">Class</th>
                  <th className="pb-3 text-xs font-medium text-[#434655]">Date</th>
                  <th className="pb-3 text-right text-xs font-medium text-[#434655]">Max Score</th>
                  <th className="pb-3 text-center text-xs font-medium text-[#434655]">Status</th>
                  <th className="pb-3 text-right text-xs font-medium text-[#434655]">Action</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="border-b border-[#f0f1f3] last:border-0 hover:bg-[#f7f9fb]/50 transition-colors">
                    <td className="py-3 text-sm font-medium text-[#191c1e]">{exam.title}</td>
                    <td className="py-3 text-sm text-[#434655]">{exam.class}</td>
                    <td className="py-3 text-sm text-[#434655]">{exam.date}</td>
                    <td className="py-3 text-right text-sm text-[#434655]">{exam.maxScore}</td>
                    <td className="py-3 text-center">
                      <Badge variant={exam.status === "graded" ? "green" : exam.status === "scheduled" ? "amber" : "gray"}>
                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openGrading(exam)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#004ac6] hover:underline"
                      >
                        {exam.status === "graded" ? (
                          <>
                            <EditIcon className="h-4 w-4" /> Edit grades
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4" /> Enter grades
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PanelCard>

      {/* Grading Modal */}
      {gradingExam && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setGradingExam(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#191c1e]">
                  {gradingExam.title} — Grades
                </h3>
                <p className="text-sm text-[#434655]">
                  {gradingExam.class} · Max score: {gradingExam.maxScore}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setGradingExam(null)}
                className="text-[#434655] hover:text-[#191c1e]"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {savedGrades ? (
              <div className="flex flex-col items-center gap-3 py-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#006c491a]">
                  <CheckIcon className="h-6 w-6 text-[#006c49]" />
                </span>
                <p className="text-sm font-medium text-[#191c1e]">Grades saved successfully!</p>
              </div>
            ) : (
              <>
                <div className="max-h-[400px] overflow-y-auto">
                  {grades.length === 0 ? (
                    <p className="py-6 text-center text-sm text-[#434655]">
                      No roster students found for this class.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {grades.map((g) => (
                        <li
                          key={g.studentId}
                          className="flex items-center justify-between gap-3 rounded-lg border border-[#e6e8ea] p-3 transition-colors hover:border-[#c3c6d7]"
                        >
                          <p className="text-sm font-medium text-[#191c1e]">{g.name}</p>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={gradingExam.maxScore}
                              value={g.score}
                              onChange={(e) =>
                                setScore(
                                  g.studentId,
                                  e.target.value === "" ? "" : Number(e.target.value)
                                )
                              }
                              placeholder="—"
                              className="w-20 rounded-lg border border-[#c3c6d7] bg-white px-3 py-2 text-right text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                            />
                            <span className="text-xs text-[#434655]">/ {gradingExam.maxScore}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-[#434655]">
                    {enteredCount} of {grades.length} graded
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setGradingExam(null)}
                      className="rounded-lg border border-[#c3c6d7] px-4 py-2 text-sm font-medium text-[#434655] hover:bg-[#f7f9fb] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveGrades}
                      disabled={enteredCount === 0}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#004ac6] px-5 py-2 text-sm font-medium text-white hover:bg-[#003ba6] disabled:opacity-50 transition-colors"
                    >
                      <SaveIcon className="h-4 w-4" /> Save grades
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}