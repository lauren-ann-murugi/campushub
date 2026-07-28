import { NextResponse } from "next/server";

export async function GET() {
  const content = "CampusHub transcript export";

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": 'attachment; filename="Academic_Transcript.pdf"',
    },
  });
}
