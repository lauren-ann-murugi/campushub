import { NextResponse } from "next/server";
import { getReportsData } from "../../_shared/adminData";

export async function GET() {
  return NextResponse.json(getReportsData());
}
