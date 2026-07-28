import { NextResponse } from "next/server";
import { createExam, deleteExam, getExamsData } from "../_shared/adminData";

export async function GET() {
  return NextResponse.json(getExamsData());
}

export async function POST(request) {
  const payload = await request.json();
  const created = createExam(payload);
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    deleteExam(id);
  }
  return new NextResponse(null, { status: 204 });
}
