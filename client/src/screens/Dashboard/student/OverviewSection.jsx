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
import { studentService } from "@/services/studentService";

export function OverviewSection({ name, onNavigate }) {
  const { status, announce } = useStatus();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    studentService
      .getDashboard()
      .then((response) => {
        if (!cancelled) setData(response);
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

  if (loading) return <Loading label="Loading your dashboard…" />;

  const attendance = data?.attendance_summary || {};
  const results = data?.results_summary || {};
  const fees = data?.fees_summary || {};

  return (
    <div className="space-y-5">
      <SectionHeader
        title={`Hello, ${name}`}
        description={
          data?.profile?.class_name
            ? `${data.profile.class_name} · ${data.profile.registration_number}`
            : "You have not been assigned to a class yet."
        }
      >
        <Button variant="secondary" onClick={() => onNavigate?.("timetable")}>
          View timetable
        </Button>
      </SectionHeader>

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Attendance"
          value={`${attendance.rate ?? 0}%`}
          hint={`${attendance.total_days ?? 0} days recorded`}
        />
        <StatCard
          label="Average score"
          value={`${results.average ?? 0}%`}
          hint={`${results.exams ?? 0} results`}
        />
        <StatCard label="Fee balance" value={formatMoney(fees.balance)} />
        <StatCard label="Days absent" value={attendance.absent ?? 0} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Today's classes">
          <Table
            columns={["Time", "Subject", "Room", "Teacher"]}
            rows={data?.today_classes || []}
            empty="No lessons scheduled for today."
            renderRow={(entry) => (
              <tr key={entry.id}>
                <Cell className="font-medium text-[#111827]">
                  {entry.start_time} – {entry.end_time}
                </Cell>
                <Cell>{entry.subject}</Cell>
                <Cell>{entry.room || "—"}</Cell>
                <Cell>{entry.teacher || "—"}</Cell>
              </tr>
            )}
          />
        </Card>

        <Card title="Announcements">
          {data?.announcements?.length ? (
            <ul className="space-y-3">
              {data.announcements.map((announcement) => (
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
      </div>

      <Card
        title="Latest results"
        action={
          <Button variant="secondary" onClick={() => onNavigate?.("results")}>
            All results
          </Button>
        }
      >
        <Table
          columns={["Exam", "Subject", "Marks", "Grade"]}
          rows={data?.recent_results || []}
          empty="Your teachers have not published any results yet."
          renderRow={(result) => (
            <tr key={result.id}>
              <Cell className="font-medium text-[#111827]">{result.exam_title || "—"}</Cell>
              <Cell>{result.subject}</Cell>
              <Cell>
                {result.marks_obtained}/{result.total_marks} ({result.percentage}%)
              </Cell>
              <Cell className="font-semibold text-[#111827]">{result.grade}</Cell>
            </tr>
          )}
        />
      </Card>
    </div>
  );
}

export default OverviewSection;
