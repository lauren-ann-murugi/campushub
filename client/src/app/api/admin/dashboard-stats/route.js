import { NextResponse } from "next/server";
import { getAdminDashboardData } from "../../_shared/adminData";

export async function GET() {
  return NextResponse.json(getAdminDashboardData());
}
