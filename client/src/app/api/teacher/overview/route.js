import { NextResponse } from "next/server";
import { getTeacherOverviewData } from "../../_shared/teacherData";

export async function GET() {
  return NextResponse.json(getTeacherOverviewData());
}
