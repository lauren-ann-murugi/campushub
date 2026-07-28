import { NextResponse } from "next/server";
import { addTeacherExam, getTeacherExamsData } from "../../_shared/teacherData";

export async function GET() {
  return NextResponse.json(getTeacherExamsData());
}

export async function POST(request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid exam payload" }, { status: 400 });
  }

  const exams = addTeacherExam(payload);
  return NextResponse.json({ exams, roster: getTeacherExamsData().roster });
}
