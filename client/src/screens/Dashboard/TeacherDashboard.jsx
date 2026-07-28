"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "./DashboardLayout";
import { TeacherOverviewSection } from "./teacher/OverviewSection";
import { TeacherAttendanceSection } from "./teacher/AttendanceSection";
import { TeacherStudentsSection } from "./teacher/StudentsSection";
import { TeacherExamSection } from "./teacher/ExamSection";
import { TeacherTimetableSection } from "./teacher/TimetableSection";
import { SupportSection } from "./student/SupportSection";
import { SettingsSection } from "./student/SettingsSection";

export default function TeacherDashboard() {
  const { displayName, user } = useAuth();
  const [active, setActive] = useState("overview");

  // Fallback teacher name if displayName is loading
  const teacherName = displayName || user?.email?.split("@")[0] || "Teacher";

  return (
    <DashboardLayout role="teacher" activeId={active} onNavigate={setActive}>
      {active === "overview" && (
        <TeacherOverviewSection name={teacherName} onNavigate={setActive} />
      )}
      {active === "attendance" && <TeacherAttendanceSection />}
      {active === "students" && <TeacherStudentsSection />}
      {active === "exams" && <TeacherExamSection />}
      {active === "timetable" && <TeacherTimetableSection />}
      {active === "support" && <SupportSection />}
      {active === "settings" && <SettingsSection />}
    </DashboardLayout>
  );
}