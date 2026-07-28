"use client";

import { useEffect, useState } from "react";

import {
  Badge,
  Banner,
  Card,
  Cell,
  Field,
  Input,
  Loading,
  SectionHeader,
  Select,
  StatCard,
  Table,
  errorMessage,
  formatDate,
  todayISO,
  useStatus,
} from "@/components/portal/PortalUI";
import { adminService } from "@/services/adminService";

/** Read-only admin views of what teachers record and students see. */

export function AdminAttendanceSection() {
  const { status, announce } = useStatus();
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [date, setDate] = useState(todayISO());
  const [loading, setLoading] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);
  const load = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    adminService.viewAttendance({ class_name: className, date })
      .then((data) => {
        if (cancelled) return;
        setRecords(data.records || []);
        setSummary(data.summary || {});
        setClasses(data.classes || []);
      })
      .catch((err) => {
        if (cancelled) return;
        announce("error", errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [announce, className, date, refreshKey]);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Attendance"
        description="Every register saved by your teachers, across all classes."
      />

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Records" value={summary.total_days ?? 0} />
        <StatCard label="Present" value={summary.present ?? 0} />
        <StatCard label="Absent" value={summary.absent ?? 0} />
        <StatCard label="Attendance rate" value={`${summary.rate ?? 0}%`} />
      </div>

      <Card
        title="Attendance records"
        action={
          <div className="flex flex-wrap items-end gap-2">
            <Field label="Class">
              <Select
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                options={classes}
                placeholder="All classes"
              />
            </Field>
            <Field label="Date">
              <Input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </Field>
          </div>
        }
      >
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Date", "Student", "Class", "Status", "Note", "Marked by"]}
            rows={records}
            empty="No attendance has been recorded for this filter."
            renderRow={(record) => (
              <tr key={record.id}>
                <Cell>{formatDate(record.date)}</Cell>
                <Cell className="font-medium text-[#111827]">{record.student_name}</Cell>
                <Cell>{record.class_name}</Cell>
                <Cell>
                  <Badge value={record.status} />
                </Cell>
                <Cell>{record.note || "—"}</Cell>
                <Cell>{record.marked_by || "—"}</Cell>
              </tr>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export function AdminResultsSection() {
  const { status, announce } = useStatus();
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({});
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);
  const load = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    adminService.viewResults({ class_name: className })
      .then((data) => {
        if (cancelled) return;
        setResults(data.results || []);
        setSummary(data.summary || {});
        setClasses(data.classes || []);
      })
      .catch((err) => {
        if (cancelled) return;
        announce("error", errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [announce, className, refreshKey]);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Results"
        description="Exam results published by teachers, exactly as students see them."
      />

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Results" value={summary.exams ?? 0} />
        <StatCard label="Average" value={`${summary.average ?? 0}%`} />
        <StatCard label="Top subject" value={summary.best_subject || "—"} />
      </div>

      <Card
        title="Published results"
        action={
          <Field label="Class">
            <Select
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              options={classes}
              placeholder="All classes"
            />
          </Field>
        }
      >
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Student", "Class", "Exam", "Subject", "Marks", "Grade", "Teacher"]}
            rows={results}
            empty="No results have been published yet."
            renderRow={(result) => (
              <tr key={result.id}>
                <Cell className="font-medium text-[#111827]">{result.student_name}</Cell>
                <Cell>{result.class_name || "—"}</Cell>
                <Cell>{result.exam_title || "—"}</Cell>
                <Cell>{result.subject}</Cell>
                <Cell>
                  {result.marks_obtained}/{result.total_marks} ({result.percentage}%)
                </Cell>
                <Cell className="font-semibold text-[#111827]">{result.grade}</Cell>
                <Cell>{result.recorded_by || "—"}</Cell>
              </tr>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export function AdminTimetableSection() {
  const { status, announce } = useStatus();
  const [entries, setEntries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [loading, setLoading] = useState(true);

  const [refreshKey, setRefreshKey] = useState(0);
  const load = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    adminService.viewTimetable({ class_name: className })
      .then((data) => {
        if (cancelled) return;
        setEntries(data.entries || []);
        setClasses(data.classes || []);
      })
      .catch((err) => {
        if (cancelled) return;
        announce("error", errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [announce, className, refreshKey]);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Timetable"
        description="Lessons scheduled by teachers for every class."
      />

      <Banner status={status} />

      <Card
        title="Class timetables"
        action={
          <Field label="Class">
            <Select
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              options={classes}
              placeholder="All classes"
            />
          </Field>
        }
      >
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Class", "Day", "Time", "Subject", "Room", "Teacher"]}
            rows={entries}
            empty="No lessons have been scheduled yet."
            renderRow={(entry) => (
              <tr key={entry.id}>
                <Cell className="font-medium text-[#111827]">{entry.class_name}</Cell>
                <Cell>{entry.day}</Cell>
                <Cell>
                  {entry.start_time} – {entry.end_time}
                </Cell>
                <Cell>{entry.subject}</Cell>
                <Cell>{entry.room || "—"}</Cell>
                <Cell>{entry.teacher || "—"}</Cell>
              </tr>
            )}
          />
        )}
      </Card>
    </div>
  );
}
