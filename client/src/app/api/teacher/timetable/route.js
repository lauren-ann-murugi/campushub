import { NextResponse } from "next/server";
import { getTeacherTimetableData, upsertTeacherTimetableSlot } from "../../_shared/teacherData";

export async function GET() {
  return NextResponse.json(getTeacherTimetableData());
}

export async function POST(request) {
  const payload = await request.json().catch(() => null);
  if (!payload?.day || !payload?.slot) {
    return NextResponse.json({ error: "Missing timetable payload" }, { status: 400 });
  }

  return NextResponse.json(upsertTeacherTimetableSlot(payload.day, payload.slot));
}

export async function PUT(request) {
  const payload = await request.json().catch(() => null);
  if (!payload?.day || !payload?.slot) {
    return NextResponse.json({ error: "Missing timetable payload" }, { status: 400 });
  }

  return NextResponse.json(upsertTeacherTimetableSlot(payload.day, payload.slot));
}
