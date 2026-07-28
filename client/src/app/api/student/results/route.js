import { NextResponse } from "next/server";

const fallbackResults = {
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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term") || "Term 2 · 2025/26";

  return NextResponse.json({
    ...fallbackResults,
    selectedTerm: term,
  });
}
