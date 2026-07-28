"use client";

import { useEffect, useState } from "react";

import {
  Banner,
  Button,
  Card,
  Cell,
  Loading,
  SectionHeader,
  StatCard,
  Table,
  errorMessage,
  formatDate,
  formatMoney,
  useStatus,
} from "@/components/portal/PortalUI";
import { teacherService } from "@/services/teacherService";

export function TeacherOverviewSection({ name, onNavigate }) {
  const { status, announce } = useStatus();
  const [overview, setOverview] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([teacherService.getOverview(), teacherService.listSalaries()])
      .then(([overviewData, salaryData]) => {
        if (cancelled) return;
        setOverview(overviewData);
        setSalaries(salaryData.salaries || []);
      })
      .catch((err) => {
        if (!cancelled) announce("error", errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [announce]);

  if (loading) return <Loading label="Loading your classes…" />;

  const stats = overview?.stats || {};

  return (
    <div className="space-y-5">
      <SectionHeader
        title={`Welcome back, ${name}`}
        description={
          overview?.profile?.classes?.length
            ? `You teach ${overview.profile.classes.join(", ")}.`
            : "No classes are assigned to you yet."
        }
      >
        <Button onClick={() => onNavigate?.("attendance")}>Mark attendance</Button>
        <Button variant="secondary" onClick={() => onNavigate?.("exams")}>
          Record results
        </Button>
      </SectionHeader>

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Classes" value={stats.classes ?? 0} />
        <StatCard label="Students" value={stats.students ?? 0} />
        <StatCard
          label="Marked today"
          value={stats.attendance_marked_today ?? 0}
          hint="attendance records"
        />
        <StatCard label="Results recorded" value={stats.results_recorded ?? 0} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card
          title="Announcements from administration"
          description="Posted by the admin portal."
        >
          {overview?.announcements?.length ? (
            <ul className="space-y-3">
              {overview.announcements.map((announcement) => (
                <li key={announcement.id} className="rounded-xl bg-[#f9fafb] px-4 py-3">
                  <p className="text-sm font-semibold text-[#111827]">
                    {announcement.title}
                  </p>
                  <p className="mt-1 text-sm text-[#4b5563]">{announcement.content}</p>
                  <p className="mt-2 text-xs text-[#6b7280]">
                    {announcement.author} · {formatDate(announcement.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#6b7280]">No announcements yet.</p>
          )}
        </Card>

        <Card title="My payslips" description="Salary records issued by administration.">
          <Table
            columns={["Period", "Net pay", "Status", "Paid on"]}
            rows={salaries}
            empty="No salary records yet."
            renderRow={(salary) => (
              <tr key={salary.id}>
                <Cell className="font-medium text-[#111827]">{salary.period}</Cell>
                <Cell>{formatMoney(salary.net_amount)}</Cell>
                <Cell className="capitalize">{salary.status}</Cell>
                <Cell>{formatDate(salary.paid_on)}</Cell>
              </tr>
            )}
          />
        </Card>
      </div>

      <Card title="Recent results you recorded">
        <Table
          columns={["Student", "Subject", "Marks", "Grade", "Recorded"]}
          rows={overview?.recent_results || []}
          empty="No results recorded yet."
          renderRow={(result) => (
            <tr key={result.id}>
              <Cell className="font-medium text-[#111827]">{result.student_name}</Cell>
              <Cell>{result.subject}</Cell>
              <Cell>
                {result.marks_obtained}/{result.total_marks}
              </Cell>
              <Cell>{result.grade}</Cell>
              <Cell>{formatDate(result.recorded_at)}</Cell>
            </tr>
          )}
        />
      </Card>
    </div>
  );
}

export default TeacherOverviewSection;
