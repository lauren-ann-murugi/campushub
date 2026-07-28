import { NextResponse } from "next/server";
import { getResultsData } from "../../_shared/adminData";

export async function GET() {
  return NextResponse.json(getResultsData());
}
