"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Banner,
  Card,
  Cell,
  Loading,
  SectionHeader,
  Table,
  errorMessage,
  useStatus,
} from "@/components/portal/PortalUI";
import { studentService } from "@/services/studentService";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TimetableSection() {
  const { status, announce } = useStatus();
  const [entries, setEntries] = useState([]);
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    studentService
      .getTimetable()
      .then((data) => {
        if (cancelled) return;
        setEntries(data.entries || []);
        setClassName(data.class_name || "");
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

  const byDay = useMemo(() => {
    const grouped = new Map(DAYS.map((day) => [day, []]));
    entries.forEach((entry) => {
      if (!grouped.has(entry.day)) grouped.set(entry.day, []);
      grouped.get(entry.day).push(entry);
    });
    return [...grouped.entries()].filter(([, lessons]) => lessons.length);
  }, [entries]);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Timetable"
        description={
          className
            ? `Weekly schedule for ${className}, maintained by your teachers.`
            : "You have not been assigned to a class yet."
        }
      />

      <Banner status={status} />

      {loading ? (
        <Loading />
      ) : byDay.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {byDay.map(([day, lessons]) => (
            <Card key={day} title={day}>
              <Table
                columns={["Time", "Subject", "Room", "Teacher"]}
                rows={lessons}
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
          ))}
        </div>
      ) : (
        <Card>
          <p className="text-sm text-[#6b7280]">
            No lessons have been scheduled for your class yet.
          </p>
        </Card>
      )}
    </div>
  );
}

export const StudentTimetableSection = TimetableSection;

export default TimetableSection;
