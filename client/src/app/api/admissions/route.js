import { NextResponse } from "next/server";
import { createAdmission, getAdmissionsData } from "../_shared/adminData";

export async function GET() {
  return NextResponse.json(getAdmissionsData());
}

export async function POST(request) {
  const payload = await request.json();
  const created = createAdmission(payload);
  return NextResponse.json(created, { status: 201 });
}
