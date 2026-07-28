import { NextResponse } from "next/server";
import { createStaff, getStaffData } from "../../_shared/adminData";

export async function GET() {
  return NextResponse.json(getStaffData());
}

export async function POST(request) {
  const payload = await request.json();
  const created = createStaff(payload);
  return NextResponse.json(created, { status: 201 });
}
