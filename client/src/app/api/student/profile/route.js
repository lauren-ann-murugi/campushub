import { NextResponse } from "next/server";

const fallbackProfile = {
  fullName: "Alex Mercer",
  studentId: "2024-89X1",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  program: "B.Sc. Computer Science",
  gradeYear: "Junior (3rd Year)",
  enrollmentDate: "September 1, 2022",
  academicStanding: "Good Standing",
  email: "a.mercer@campushub.edu",
  phone: "+1 (555) 123-4567",
  address: "North Campus Dorms, Room 402\nUniversity City, ST 12345",
  guardians: [
    {
      id: "g1",
      name: "Sarah Mercer",
      relationship: "Mother / Primary Contact",
      phone: "+1 (555) 987-6543",
      email: "s.mercer@example.com",
      initials: "SM",
    },
  ],
};

function normalizeProfile(payload) {
  const source = payload && typeof payload === "object" ? payload : {};

  return {
    fullName: source.full_name || source.fullName || fallbackProfile.fullName,
    studentId: source.student_id || source.studentId || fallbackProfile.studentId,
    avatarUrl: source.avatar_url || source.avatarUrl || fallbackProfile.avatarUrl,
    program: source.program || fallbackProfile.program,
    gradeYear: source.grade_year || source.gradeYear || fallbackProfile.gradeYear,
    enrollmentDate: source.enrollment_date || source.enrollmentDate || fallbackProfile.enrollmentDate,
    academicStanding: source.academic_standing || source.academicStanding || fallbackProfile.academicStanding,
    email: source.email || fallbackProfile.email,
    phone: source.phone || fallbackProfile.phone,
    address: source.address || fallbackProfile.address,
    guardians: Array.isArray(source.guardians) && source.guardians.length > 0
      ? source.guardians.map((guardian, index) => ({
          id: guardian.id || `g${index + 1}`,
          name: guardian.name || fallbackProfile.guardians[0].name,
          relationship: guardian.relationship || "Guardian",
          phone: guardian.phone || "",
          email: guardian.email || "",
          initials: guardian.initials || guardian.name?.split(" ").map((chunk) => chunk[0]).join("").toUpperCase() || "G",
        }))
      : fallbackProfile.guardians,
  };
}

export async function GET(request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || "http://localhost:5000/api/v1";

  try {
    const response = await fetch(`${apiBaseUrl}/student/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(normalizeProfile(data?.profile || data));
    }
  } catch {
    // Fall through to the local fallback data below.
  }

  return NextResponse.json(fallbackProfile, { status: 200 });
}

export async function PUT(request) {
  const body = await request.json().catch(() => null);
  return NextResponse.json(normalizeProfile(body || fallbackProfile), { status: 200 });
}
