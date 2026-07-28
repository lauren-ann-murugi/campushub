import { NextResponse } from "next/server";
import { createStudent, deleteStudent, getStudentsData } from "../../_shared/adminData";

export async function GET() {
  return NextResponse.json(getStudentsData());
}

export async function POST(request) {
  const payload = await request.json();
  const created = createStudent(payload);
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    deleteStudent(id);
  }
  return new NextResponse(null, { status: 204 });
}
