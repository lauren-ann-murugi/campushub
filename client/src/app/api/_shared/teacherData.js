const clone = (value) => JSON.parse(JSON.stringify(value));

const defaultOverview = {
  classes: [
    { name: "JSS 3A — Mathematics", students: 32, time: "08:00", room: "Room 7", color: "#004ac6" },
    { name: "SS 2B — Mathematics", students: 28, time: "10:00", room: "Room 12", color: "#006c49" },
    { name: "SS 1A — Mathematics", students: 30, time: "13:00", room: "Room 9", color: "#f59e0b" },
  ],
  pendingGrading: [
    { title: "JSS 3A — Quiz 3", submitted: 28, total: 32 },
    { title: "SS 2B — Assignment 5", submitted: 22, total: 28 },
    { title: "SS 1A — Term Test", submitted: 30, total: 30 },
  ],
  attendanceToday: [
    { name: "JSS 3A", present: 30, total: 32 },
    { name: "SS 2B", present: 27, total: 28 },
    { name: "SS 1A", present: 29, total: 30 },
  ],
  upcomingExams: [
    { name: "JSS 3A Midterm", date: "Jul 25", students: 32 },
    { name: "SS 2B Quiz 4", date: "Jul 28", students: 28 },
    { name: "SS 1A End of Term", date: "Aug 02", students: 30 },
  ],
};

const defaultExams = [
  { id: "e1", title: "Midterm Exam", class: "JSS 3A", date: "Jul 25", maxScore: 100, status: "scheduled" },
  { id: "e2", title: "Quiz 4", class: "SS 2B", date: "Jul 28", maxScore: 20, status: "scheduled" },
  { id: "e3", title: "Assignment 5", class: "SS 2B", date: "Jul 14", maxScore: 50, status: "graded" },
  { id: "e4", title: "Term Test", class: "SS 1A", date: "Jul 12", maxScore: 100, status: "graded" },
];

const defaultRoster = {
  "JSS 3A": [
    { id: "s1", name: "Ada Okafor" },
    { id: "s2", name: "Bola Adeyemi" },
    { id: "s3", name: "Chidi Eze" },
    { id: "s4", name: "Doris Ojo" },
    { id: "s5", name: "Emeka Nwosu" },
  ],
  "SS 2B": [
    { id: "s6", name: "Fatima Bello" },
    { id: "s7", name: "Grace Okon" },
    { id: "s8", name: "Henry Obi" },
    { id: "s9", name: "Ifeoma Okoro" },
  ],
  "SS 1A": [
    { id: "s10", name: "John Adeleke" },
    { id: "s11", name: "Kemi Lawal" },
    { id: "s12", name: "Lola Bello" },
  ],
};

const defaultTimetable = {
  Monday: [
    { id: "t1", time: "08:00 AM - 09:30 AM", subject: "Mathematics", class: "JSS 3A", room: "Room 7", students: 32, color: "#004ac6" },
    { id: "t2", time: "10:00 AM - 11:30 AM", subject: "Mathematics", class: "SS 2B", room: "Room 12", students: 28, color: "#006c49" },
  ],
  Tuesday: [
    { id: "t3", time: "08:00 AM - 09:30 AM", subject: "Mathematics", class: "SS 2B", room: "Room 12", students: 28, color: "#006c49" },
  ],
  Wednesday: [
    { id: "t4", time: "08:00 AM - 09:30 AM", subject: "Mathematics", class: "SS 1A", room: "Room 9", students: 30, color: "#f59e0b" },
  ],
  Thursday: [
    { id: "t5", time: "10:00 AM - 11:30 AM", subject: "Mathematics", class: "SS 1A", room: "Room 9", students: 30, color: "#f59e0b" },
  ],
  Friday: [
    { id: "t6", time: "01:00 PM - 02:30 PM", subject: "Mathematics", class: "JSS 3A", room: "Room 7", students: 32, color: "#004ac6" },
  ],
};

const teacherStore = {
  exams: clone(defaultExams),
  roster: clone(defaultRoster),
  timetable: clone(defaultTimetable),
  preferences: { emailNotif: true, pushNotif: true, smsNotif: false },
  gradesByExam: {},
};

function buildClassSummaries(timetable) {
  const slotList = Object.values(timetable || {}).flat();
  return slotList.map((slot) => ({
    name: `${slot.class} — ${slot.subject}`,
    students: slot.students || 0,
    time: slot.time.split(" - ")[0],
    room: slot.room || "Room 1",
    color: slot.color || "#004ac6",
  }));
}

function buildPendingGrading(exams) {
  return exams
    .filter((exam) => exam.status !== "graded")
    .slice(0, 3)
    .map((exam) => ({
      title: `${exam.class} — ${exam.title}`,
      submitted: exam.status === "scheduled" ? 24 : 18,
      total: exam.maxScore >= 20 ? 30 : 28,
    }));
}

function buildAttendanceToday() {
  return [
    { name: "JSS 3A", present: 30, total: 32 },
    { name: "SS 2B", present: 27, total: 28 },
    { name: "SS 1A", present: 29, total: 30 },
  ];
}

function buildUpcomingExams(exams) {
  return exams.map((exam) => ({
    name: `${exam.class} ${exam.title}`,
    date: exam.date,
    students: exam.class === "JSS 3A" ? 32 : exam.class === "SS 2B" ? 28 : 30,
  }));
}

export function getTeacherOverviewData() {
  return {
    classes: buildClassSummaries(teacherStore.timetable),
    pendingGrading: buildPendingGrading(teacherStore.exams),
    attendanceToday: buildAttendanceToday(),
    upcomingExams: buildUpcomingExams(teacherStore.exams),
  };
}

export function getTeacherExamsData() {
  return {
    exams: clone(teacherStore.exams),
    roster: clone(teacherStore.roster),
  };
}

export function addTeacherExam(exam) {
  const newExam = {
    id: exam.id || `e${Date.now()}`,
    title: exam.title,
    class: exam.class,
    date: exam.date,
    maxScore: Number(exam.maxScore || 100),
    status: exam.status || "scheduled",
  };
  teacherStore.exams = [newExam, ...teacherStore.exams];
  if (!teacherStore.roster[newExam.class]) {
    teacherStore.roster[newExam.class] = [];
  }
  return clone(teacherStore.exams);
}

export function getTeacherGrades(examId) {
  const existing = teacherStore.gradesByExam[examId];
  if (existing) return clone(existing);

  const exam = teacherStore.exams.find((item) => item.id === examId);
  if (!exam) return [];

  const classRoster = teacherStore.roster[exam.class] || [];
  return classRoster.map((student) => ({
    studentId: student.id,
    name: student.name,
    score: "",
  }));
}

export function saveTeacherGrades(examId, grades) {
  teacherStore.gradesByExam[examId] = clone(grades);
  const exam = teacherStore.exams.find((item) => item.id === examId);
  if (exam) {
    exam.status = "graded";
  }
  return { ok: true, examId };
}

export function getTeacherTimetableData() {
  return clone(teacherStore.timetable);
}

export function upsertTeacherTimetableSlot(day, slot) {
  const daySlots = teacherStore.timetable[day] || [];
  const existingIndex = daySlots.findIndex((item) => item.id === slot.id);
  const nextSlot = {
    ...slot,
    id: slot.id || `t_${Date.now()}`,
    students: Number(slot.students || 0),
  };

  if (existingIndex >= 0) {
    daySlots[existingIndex] = nextSlot;
  } else {
    daySlots.push(nextSlot);
  }

  teacherStore.timetable[day] = daySlots;
  return clone(teacherStore.timetable);
}

export function deleteTeacherTimetableSlot(slotId) {
  Object.keys(teacherStore.timetable).forEach((day) => {
    teacherStore.timetable[day] = (teacherStore.timetable[day] || []).filter((slot) => slot.id !== slotId);
  });
  return clone(teacherStore.timetable);
}

export function getUserPreferences() {
  return clone(teacherStore.preferences);
}

export function updateUserPreferences(nextPreferences) {
  teacherStore.preferences = { ...teacherStore.preferences, ...nextPreferences };
  return clone(teacherStore.preferences);
}
