const clone = (value) => JSON.parse(JSON.stringify(value));

const initialAdmissions = [
  {
    id: "adm-101",
    applicant_name: "Emma Smith",
    email: "emma.s@example.com",
    phone: "+1 555 010 0101",
    program: "Grade 5",
    status: "pending",
    applied_at: "2024-10-24T00:00:00Z",
  },
  {
    id: "adm-102",
    applicant_name: "James Lawson",
    email: "james.l@example.com",
    phone: "+1 555 010 0102",
    program: "Grade 8",
    status: "approved",
    applied_at: "2024-10-23T00:00:00Z",
  },
  {
    id: "adm-103",
    applicant_name: "Mia Khalifa",
    email: "mia.k@example.com",
    phone: "+1 555 010 0103",
    program: "Grade 1",
    status: "rejected",
    applied_at: "2024-10-22T00:00:00Z",
  },
  {
    id: "adm-104",
    applicant_name: "Noah Johnson",
    email: "noah.j@example.com",
    phone: "+1 555 010 0104",
    program: "Grade 10",
    status: "pending",
    applied_at: "2024-10-21T00:00:00Z",
  },
];

const initialStudents = [
  {
    id: "STU-2023-0142",
    full_name: "Alexander James",
    first_name: "Alexander",
    last_name: "James",
    dob: "12 May 2008",
    class_section: "Grade 10 - A",
    guardian_name: "Sarah James",
    guardian_relation: "Mother",
    guardian_phone: "+1 (555) 123-4567",
    status: "Active",
    avatar_url: null,
    created_at: "2023-08-15T00:00:00Z",
  },
  {
    id: "STU-2023-0188",
    full_name: "Maya Patel",
    first_name: "Maya",
    last_name: "Patel",
    dob: "03 Aug 2007",
    class_section: "Grade 11 - Sci",
    guardian_name: "Raj Patel",
    guardian_relation: "Father",
    guardian_phone: "+1 (555) 987-6543",
    status: "Active",
    avatar_url: null,
    created_at: "2023-08-18T00:00:00Z",
  },
  {
    id: "STU-2022-0056",
    full_name: "Lucas Chen",
    first_name: "Lucas",
    last_name: "Chen",
    dob: "22 Nov 2006",
    class_section: "Grade 12 - Arts",
    guardian_name: "Wei Chen",
    guardian_relation: "Mother",
    guardian_phone: "+1 (555) 444-5555",
    status: "Inactive",
    avatar_url: null,
    created_at: "2022-09-01T00:00:00Z",
  },
];

const initialStaff = [
  {
    id: "tch-1",
    full_name: "Dr. Robert Chen",
    first_name: "Robert",
    last_name: "Chen",
    staff_id: "TCH-2039",
    role: "teacher",
    department: "Science",
    subjects: ["Physics", "Chemistry"],
    email: "r.chen@campushub.edu",
    phone: "+1 (555) 019-2834",
    avatar_url: null,
    is_online: true,
    last_seen_at: new Date().toISOString(),
    created_at: "2023-01-15T00:00:00Z",
  },
  {
    id: "tch-2",
    full_name: "Sarah Jenkins",
    first_name: "Sarah",
    last_name: "Jenkins",
    staff_id: "TCH-1882",
    role: "teacher",
    department: "Mathematics",
    subjects: ["Algebra II", "Calculus"],
    email: "s.jenkins@campushub.edu",
    phone: "+1 (555) 018-9921",
    avatar_url: null,
    is_online: true,
    last_seen_at: new Date().toISOString(),
    created_at: "2022-08-20T00:00:00Z",
  },
  {
    id: "tch-4",
    full_name: "Elena Rodriguez",
    first_name: "Elena",
    last_name: "Rodriguez",
    staff_id: "TCH-4011",
    role: "administrator",
    department: "Languages",
    subjects: ["Spanish I", "Spanish Lit"],
    email: "e.rodriguez@campushub.edu",
    phone: "+1 (555) 016-7782",
    avatar_url: null,
    is_online: true,
    last_seen_at: new Date().toISOString(),
    created_at: "2021-11-01T00:00:00Z",
  },
];

const initialAttendance = {
  records: [
    { id: "att-1", student_name: "Emma Smith", class_name: "Grade 10", status: "present", date: new Date().toISOString().split("T")[0] },
    { id: "att-2", student_name: "James Lawson", class_name: "Grade 9", status: "present", date: new Date().toISOString().split("T")[0] },
    { id: "att-3", student_name: "Noah Johnson", class_name: "Grade 12", status: "absent", date: new Date().toISOString().split("T")[0] },
    { id: "att-4", student_name: "Sophia Davis", class_name: "Grade 11", status: "late", date: new Date().toISOString().split("T")[0] },
  ],
  interventions: [
    { id: "101", student_name: "Alex Sterling", student_id: "10429", class_name: "Grade 11 - Sci A", attendance_pct: 74, consecutive_absences: "4 Days" },
    { id: "102", student_name: "Mia Kinsley", student_id: "10553", class_name: "Grade 11 - Arts B", attendance_pct: 78, consecutive_absences: "2 Days" },
  ],
};

const initialExams = [
  {
    id: "exam-1",
    title: "Mid-Term Mathematics",
    class_name: "Grade 10 • Sec A, B",
    exam_date: "Oct 24, 2024",
    exam_time: "09:00 AM - 11:30 AM",
    venue: "Main Hall A",
    status: "Scheduled",
    invigilator: "Mr. Bassey",
    room: "Hall A",
  },
  {
    id: "exam-2",
    title: "Physics Final Practical",
    class_name: "Grade 12 • Science",
    exam_date: "Oct 26, 2024",
    exam_time: "13:00 PM - 16:00 PM",
    venue: "Science Lab 3",
    status: "Pending Invigilator",
    invigilator: "Pending",
    room: "Lab 3",
  },
  {
    id: "exam-3",
    title: "Literature Essay",
    class_name: "Grade 11 • Arts",
    exam_date: "Oct 28, 2024",
    exam_time: "10:00 AM - 12:00 PM",
    venue: "Room 402",
    status: "Ready",
    invigilator: "Mrs. Okafor",
    room: "Room 402",
  },
];

const initialResults = [
  {
    id: "res-1",
    exam_id: "ex-101",
    student_name: "Sarah Jenkins",
    score: 95,
    grade: "A",
    recorded_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    exam: { title: "Mid-Term Assessment", class_name: "Grade 10-A", subject: "Mathematics", max_score: 100 },
  },
  {
    id: "res-2",
    exam_id: "ex-101",
    student_name: "Michael Vance",
    score: 84,
    grade: "B",
    recorded_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    exam: { title: "Mid-Term Assessment", class_name: "Grade 10-A", subject: "Mathematics", max_score: 100 },
  },
  {
    id: "res-3",
    exam_id: "ex-102",
    student_name: "Elena Rostova",
    score: 72,
    grade: "C",
    recorded_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    exam: { title: "Unit Test 2", class_name: "Grade 11-B", subject: "Physics", max_score: 100 },
  },
];

const initialFees = [
  { id: "fee-1", student_name: "Amina Yusuf", amount: 2450, status: "Paid", due_date: "2024-10-10", method: "Bank Transfer" },
  { id: "fee-2", student_name: "John Okafor", amount: 1800, status: "Pending", due_date: "2024-10-25", method: "Cash" },
  { id: "fee-3", student_name: "Marta Adebayo", amount: 3200, status: "Overdue", due_date: "2024-09-15", method: "Card" },
];

const initialReports = {
  tickets: [
    { id: "t1", category: "Technical", subject: "Lab Computer Projector Malfunction", message: "The projector in CS Lab 3 is displaying distorted colors during lectures.", status: "open", created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
    { id: "t2", category: "Academic", subject: "Grade Dispute - Mathematics Midterm", message: "Student requesting re-evaluation for question 4 regarding calculus integration.", status: "in_progress", created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
  ],
  results: initialResults,
  studentCount: 1240,
};

const initialAnnouncements = [
  { id: "ann-1", title: "Orientation Week", body: "All new students should report to the main hall on Monday at 9 AM.", audience: "All Students", priority: "High", created_at: new Date().toISOString() },
  { id: "ann-2", title: "Parent-Teacher Meeting", body: "The meeting is scheduled for Friday, 2 PM in the conference room.", audience: "Parents", priority: "Medium", created_at: new Date().toISOString() },
];

const initialSupport = [
  { id: "tk-4029", subject: "Portal Login Issue", requester: "Sarah Connor (Parent)", status: "HIGH PRIORITY", type: "high" },
  { id: "tk-4030", subject: "Update Course Materials", requester: "Mr. Davis (Teacher)", status: "OPEN", type: "open" },
  { id: "tk-4031", subject: "Fee Receipt Missing", requester: "John Smith (Student)", status: "PENDING INFO", type: "pending" },
];

const adminStore = {
  admissions: clone(initialAdmissions),
  students: clone(initialStudents),
  staff: clone(initialStaff),
  attendance: clone(initialAttendance),
  exams: clone(initialExams),
  results: clone(initialResults),
  fees: clone(initialFees),
  reports: clone(initialReports),
  announcements: clone(initialAnnouncements),
  support: clone(initialSupport),
};

export function getAdminDashboardData() {
  return {
    metrics: {
      totalStudents: { count: "2,450", change: "+12% from last month", isPositive: true },
      totalTeachers: { count: "184", note: "Stable" },
      totalClasses: { count: "72", note: "Across 4 blocks" },
      attendanceRate: { value: "94%", change: "-2% from yesterday", isPositive: false },
      feeCollection: { amount: "$45k", change: "85% collected", isPositive: true },
    },
    pendingAdmissions: adminStore.admissions.filter((item) => item.status === "pending").slice(0, 3).map((item) => ({
      id: item.id,
      initials: item.applicant_name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
      name: item.applicant_name,
      detail: `${item.program} Application`,
    })),
    tickets: adminStore.support.slice(0, 4).map((item) => ({
      id: item.id,
      subject: item.subject,
      requester: item.requester,
      status: item.status,
      type: item.type,
    })),
  };
}

export function getAdmissionsData() {
  return clone(adminStore.admissions);
}

export function createAdmission(payload) {
  const nextEntry = {
    id: payload.id || `adm-${Date.now()}`,
    applicant_name: payload.applicant_name || "New Applicant",
    email: payload.email || null,
    phone: payload.phone || null,
    program: payload.program || "Grade 1",
    status: payload.status || "pending",
    applied_at: payload.applied_at || new Date().toISOString(),
  };
  adminStore.admissions = [nextEntry, ...adminStore.admissions];
  return clone(nextEntry);
}

export function updateAdmissionStatus(id, status) {
  adminStore.admissions = adminStore.admissions.map((item) => (item.id === id ? { ...item, status } : item));
  return clone(adminStore.admissions.find((item) => item.id === id));
}

export function deleteAdmission(id) {
  adminStore.admissions = adminStore.admissions.filter((item) => item.id !== id);
  return { ok: true };
}

export function getStudentsData() {
  return { students: clone(adminStore.students) };
}

export function createStudent(payload) {
  const fullName = payload.full_name || `${payload.first_name ?? ""} ${payload.last_name ?? ""}`.trim();
  const nextStudent = {
    id: payload.id || `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    full_name: fullName,
    first_name: payload.first_name || fullName.split(" ")[0] || "Student",
    last_name: payload.last_name || fullName.split(" ").slice(1).join(" ") || "",
    dob: payload.dob || "01 Jan 2008",
    class_section: payload.class_section || "Grade 10 - A",
    guardian_name: payload.guardian_name || "",
    guardian_relation: payload.guardian_relation || "Mother",
    guardian_phone: payload.guardian_phone || "+1 (555) 000-0000",
    email: payload.email || "",
    status: payload.status || "Active",
    avatar_url: payload.avatar_url || null,
    created_at: payload.created_at || new Date().toISOString(),
  };
  adminStore.students = [nextStudent, ...adminStore.students];
  return clone(nextStudent);
}

export function deleteStudent(id) {
  adminStore.students = adminStore.students.filter((item) => item.id !== id);
  return { ok: true };
}

export function getStaffData() {
  return { staff: clone(adminStore.staff) };
}

export function createStaff(payload) {
  const fullName = payload.full_name || `${payload.first_name ?? ""} ${payload.last_name ?? ""}`.trim();
  const nextStaff = {
    id: payload.id || `tch-${Date.now()}`,
    full_name: fullName,
    first_name: payload.first_name || fullName.split(" ")[0] || "Staff",
    last_name: payload.last_name || fullName.split(" ").slice(1).join(" ") || "",
    staff_id: payload.staff_id || `TCH-${Math.floor(1000 + Math.random() * 9000)}`,
    role: payload.role || "teacher",
    department: payload.department || "Mathematics",
    subjects: payload.subjects || [payload.department || "Mathematics"],
    email: payload.email || "",
    phone: payload.phone || "+1 (555) 000-0000",
    avatar_url: payload.avatar_url || null,
    is_online: true,
    last_seen_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };
  adminStore.staff = [nextStaff, ...adminStore.staff];
  return clone(nextStaff);
}

export function getAttendanceData(date) {
  const matchingRecords = adminStore.attendance.records.filter((item) => !date || item.date === date);
  return {
    records: clone(matchingRecords),
    interventions: clone(adminStore.attendance.interventions),
  };
}

export function createAttendanceRecord(payload) {
  const nextRecord = {
    id: payload.id || `att-${Date.now()}`,
    student_name: payload.student_name || "Student",
    class_name: payload.class_name || "Grade 10",
    status: payload.status || "present",
    date: payload.date || new Date().toISOString().split("T")[0],
  };
  adminStore.attendance.records = [nextRecord, ...adminStore.attendance.records];
  return clone(nextRecord);
}

export function getExamsData() {
  return { exams: clone(adminStore.exams) };
}

export function createExam(payload) {
  const nextExam = {
    id: payload.id || `exam-${Date.now()}`,
    title: payload.title || "New Exam",
    class_name: payload.class_name || "Grade 10 • Sec A",
    exam_date: payload.exam_date || "Oct 30, 2024",
    exam_time: payload.exam_time || "09:00 AM - 11:30 AM",
    venue: payload.venue || "Main Hall A",
    status: payload.status || "Scheduled",
    invigilator: payload.invigilator || "Pending",
    room: payload.room || payload.venue || "Main Hall A",
  };
  adminStore.exams = [nextExam, ...adminStore.exams];
  return clone(nextExam);
}

export function deleteExam(id) {
  adminStore.exams = adminStore.exams.filter((item) => item.id !== id);
  return { ok: true };
}

export function getResultsData() {
  return { results: clone(adminStore.results) };
}

export function getFeesData() {
  return {
    fees: clone(adminStore.fees),
    summary: {
      paid: adminStore.fees.filter((item) => item.status === "Paid").length,
      pending: adminStore.fees.filter((item) => item.status === "Pending").length,
      overdue: adminStore.fees.filter((item) => item.status === "Overdue").length,
      totalCollected: adminStore.fees.filter((item) => item.status === "Paid").reduce((sum, item) => sum + item.amount, 0),
    },
  };
}

export function createFeePayment(payload) {
  const nextFee = {
    id: payload.id || `fee-${Date.now()}`,
    student_name: payload.student_name || "New Student",
    amount: Number(payload.amount || 0),
    student_identifier: payload.student_identifier || "",
    recipient: payload.recipient || "individual",
    semester: payload.semester || "",
    activity: payload.activity || "",
    status: payload.status || "Paid",
    due_date: payload.due_date || new Date().toISOString().split("T")[0],
    method: payload.method || "Bank Transfer",
  };
  adminStore.fees = [nextFee, ...adminStore.fees];
  return clone(nextFee);
}

export function getReportsData() {
  return clone(adminStore.reports);
}

export function getAnnouncementsData() {
  return { announcements: clone(adminStore.announcements) };
}

export function createAnnouncement(payload) {
  const nextAnnouncement = {
    id: payload.id || `ann-${Date.now()}`,
    title: payload.title || "New Announcement",
    body: payload.body || "",
    audience: payload.audience || "All Students",
    priority: payload.priority || "Medium",
    created_at: payload.created_at || new Date().toISOString(),
  };
  adminStore.announcements = [nextAnnouncement, ...adminStore.announcements];
  return clone(nextAnnouncement);
}

export function deleteAnnouncement(id) {
  adminStore.announcements = adminStore.announcements.filter((item) => item.id !== id);
  return { ok: true };
}

export function getSupportData() {
  return clone(adminStore.support);
}

export function createSupportTicket(payload) {
  const nextTicket = {
    id: payload.id || `tk-${Date.now()}`,
    subject: payload.subject || "New Ticket",
    requester: payload.requester || "Admin",
    status: payload.status || "OPEN",
    type: payload.type || "open",
  };
  adminStore.support = [nextTicket, ...adminStore.support];
  return clone(nextTicket);
}
