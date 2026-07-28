import { NextResponse } from "next/server";
import { deleteTeacherTimetableSlot } from "../../../_shared/teacherData";

export async function DELETE(request, { params }) {
  const { slotId } = await params;
  return NextResponse.json(deleteTeacherTimetableSlot(slotId));
}
