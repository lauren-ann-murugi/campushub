import { NextResponse } from "next/server";
import { createSupportTicket, getSupportData } from "../../_shared/adminData";

export async function GET() {
  return NextResponse.json(getSupportData());
}

export async function POST(request) {
  const payload = await request.json();
  const created = createSupportTicket(payload);
  return NextResponse.json(created, { status: 201 });
}
