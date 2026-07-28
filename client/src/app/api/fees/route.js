import { NextResponse } from "next/server";
import { createFeePayment, getFeesData } from "../_shared/adminData";

export async function GET() {
  return NextResponse.json(getFeesData());
}

export async function POST(request) {
  const payload = await request.json();
  const created = createFeePayment(payload);
  return NextResponse.json(created, { status: 201 });
}
