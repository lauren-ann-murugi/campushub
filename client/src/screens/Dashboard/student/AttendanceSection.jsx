"use client";

import { useEffect, useState } from "react";

import {
  Badge,
  Banner,
  Card,
  Cell,
  Loading,
  SectionHeader,
  StatCard,
  Table,
  errorMessage,
  formatDate,
  useStatus,
} from "@/components/portal/PortalUI";
import { studentService } from "@/services/studentService";

export function AttendanceSection() {
  const { status, announce } = useStatus();
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    studentService
      .getAttendance()
      .then((data) => {
        if (cancelled) return;
        setRecords(data.records || []);
        setSummary(data.summary || {});
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

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Attendance"
        description="Marked by your class teacher. Updates appear here as soon as they save the register."
      />

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Attendance rate" value={`${summary.rate ?? 0}%`} />
        <StatCard label="Present" value={summary.present ?? 0} />
        <StatCard label="Absent" value={summary.absent ?? 0} />
        <StatCard label="Late" value={summary.late ?? 0} />
      </div>

      <Card title="Daily record">
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Date", "Class", "Status", "Note", "Marked by"]}
            rows={records}
            empty="No attendance has been marked for you yet."
            renderRow={(record) => (
              <tr key={record.id}>
                <Cell className="font-medium text-[#111827]">{formatDate(record.date)}</Cell>
                <Cell>{record.class_name || "—"}</Cell>
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

export default AttendanceSection;
