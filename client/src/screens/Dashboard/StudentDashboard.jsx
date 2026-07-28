"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { DashboardLayout } from "./DashboardLayout";
import { OverviewSection } from "./student/OverviewSection";
import { ProfileSection } from "./student/ProfileSection";
import { AttendanceSection } from "./student/AttendanceSection";
import { ResultsSection } from "./student/ResultsSection";
import { TimetableSection } from "./student/TimetableSection";
import { FeesSection } from "./student/FeesSection";
import { SupportSection } from "./student/SupportSection";
import { SettingsSection } from "./student/SettingsSection";

export default function StudentDashboard() {
  const { displayName, user } = useAuth();
  const [active, setActive] = useState("overview");

  // Fallback name if displayName hasn't loaded yet
  const studentName = displayName || user?.email?.split("@")[0] || "Student";

  return (
    <DashboardLayout role="student" activeId={active} onNavigate={setActive}>
      {active === "overview" && (
        <OverviewSection name={studentName} onNavigate={setActive} />
      )}
      {active === "profile" && <ProfileSection />}
      {active === "attendance" && <AttendanceSection />}
      {active === "results" && <ResultsSection />}
      {active === "timetable" && <TimetableSection />}
      {active === "fees" && <FeesSection />}
      {active === "support" && <SupportSection />}
      {active === "settings" && <SettingsSection />}
    </DashboardLayout>
  );
}