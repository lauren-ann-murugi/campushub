import { NextResponse } from "next/server";
import { deleteAdmission, updateAdmissionStatus } from "../../_shared/adminData";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const updated = updateAdmissionStatus(id, body.status);
  return NextResponse.json(updated);
}

export async function DELETE(_request, { params }) {
  const { id } = await params;
  deleteAdmission(id);
  return new NextResponse(null, { status: 204 });
}
