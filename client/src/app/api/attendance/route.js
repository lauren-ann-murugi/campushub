import { NextResponse } from "next/server";
import { createAttendanceRecord, getAttendanceData } from "../_shared/adminData";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  return NextResponse.json(getAttendanceData(date));
}

export async function POST(request) {
  const payload = await request.json();
  const created = createAttendanceRecord(payload);
  return NextResponse.json(created, { status: 201 });
}
