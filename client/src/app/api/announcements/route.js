import { NextResponse } from "next/server";
import { createAnnouncement, deleteAnnouncement, getAnnouncementsData } from "../_shared/adminData";

export async function GET() {
  return NextResponse.json(getAnnouncementsData());
}

export async function POST(request) {
  const payload = await request.json();
  const created = createAnnouncement(payload);
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (id) {
    deleteAnnouncement(id);
  }
  return new NextResponse(null, { status: 204 });
}
