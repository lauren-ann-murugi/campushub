import { NextResponse } from "next/server";
import { getUserPreferences, updateUserPreferences } from "../../_shared/teacherData";

export async function GET() {
  return NextResponse.json(getUserPreferences());
}

export async function PUT(request) {
  const payload = await request.json().catch(() => null);
  return NextResponse.json(updateUserPreferences(payload || {}));
}
