import { NextResponse } from "next/server";
import { getTeacherGrades, saveTeacherGrades } from "../../_shared/teacherData";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const examId = searchParams.get("examId");
  return NextResponse.json(getTeacherGrades(examId));
}

export async function POST(request) {
  const payload = await request.json().catch(() => null);
  if (!payload?.examId) {
    return NextResponse.json({ error: "Missing examId" }, { status: 400 });
  }

  const result = saveTeacherGrades(payload.examId, payload.grades || []);
  return NextResponse.json(result);
}
