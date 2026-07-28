"use client";

import { useEffect, useState } from "react";

import {
  Badge,
  Banner,
  Button,
  Card,
  Field,
  Input,
  Loading,
  SectionHeader,
  Select,
  StatCard,
  Table,
  Cell,
  errorMessage,
  todayISO,
  useStatus,
} from "@/components/portal/PortalUI";
import { teacherService } from "@/services/teacherService";

const STATUSES = ["present", "absent", "late", "excused"];

export function TeacherAttendanceSection() {
  const { status, announce } = useStatus();
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [date, setDate] = useState(todayISO());
  const [roll, setRoll] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    teacherService
      .listClasses()
      .then((data) => {
        if (cancelled) return;
        const names = (data.classes || []).map((entry) => entry.class_name);
        setClasses(names);
        setClassName((current) => current || names[0] || "");
        if (!names.length) setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        announce("error", errorMessage(err));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [announce]);

  const [refreshKey, setRefreshKey] = useState(0);
  const loadRoll = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    if (!className) return undefined;
    let cancelled = false;

    teacherService
      .getAttendance({ class_name: className, date })
      .then((data) => {
        if (cancelled) return;
        setRoll(data.roll || []);
        setSummary(data.summary || null);
      })
      .catch((err) => {
        if (cancelled) return;
        announce("error", errorMessage(err));
        setRoll([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [announce, className, date, refreshKey]);

  const setStudentStatus = (studentId, value) => {
    setRoll((current) =>
      current.map((entry) =>
        entry.student_id === studentId ? { ...entry, status: value } : entry
      )
    );
  };

  const setStudentNote = (studentId, value) => {
    setRoll((current) =>
      current.map((entry) =>
        entry.student_id === studentId ? { ...entry, note: value } : entry
      )
    );
  };

  const markAll = (value) => {
    setRoll((current) => current.map((entry) => ({ ...entry, status: value })));
  };

  const handleSave = async () => {
    if (!roll.length) return;
    setSaving(true);
    try {
      await teacherService.saveAttendance({
        class_name: className,
        date,
        records: roll.map((entry) => ({
          student_id: entry.student_id,
          status: entry.status,
          note: entry.note,
        })),
      });
      announce("success", `Attendance saved — students in ${className} can see it now.`);
      await loadRoll();
    } catch (err) {
      announce("error", errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const present = roll.filter((entry) => entry.status === "present").length;

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Attendance"
        description="Mark the register for your class. Saved attendance appears in each student's portal immediately."
      >
        <Button onClick={handleSave} disabled={saving || !roll.length}>
          {saving ? "Saving…" : "Save attendance"}
        </Button>
      </SectionHeader>

      <Banner status={status} />

      {!classes.length && !loading ? (
        <Card>
          <p className="text-sm text-[#6b7280]">
            You have no classes assigned yet. An administrator can assign your classes
            from the Staff page.
          </p>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students" value={roll.length} hint={className || "—"} />
        <StatCard label="Present today" value={present} />
        <StatCard label="Absent today" value={roll.length - present} />
        <StatCard
          label="Class attendance rate"
          value={`${summary?.rate ?? 0}%`}
          hint={`${summary?.total_days ?? 0} records`}
        />
      </div>

      <Card
        title="Register"
        description={date}
        action={
          <div className="flex flex-wrap items-end gap-2">
            <Field label="Class">
              <Select
                value={className}
                onChange={(event) => setClassName(event.target.value)}
                options={classes}
                placeholder={classes.length ? undefined : "No classes"}
              />
            </Field>
            <Field label="Date">
              <Input
                type="date"
                value={date}
                max={todayISO()}
                onChange={(event) => setDate(event.target.value)}
              />
            </Field>
          </div>
        }
      >
        <div className="mb-3 flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => markAll("present")} disabled={!roll.length}>
            Mark all present
          </Button>
          <Button variant="secondary" onClick={() => markAll("absent")} disabled={!roll.length}>
            Mark all absent
          </Button>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Student", "Reg. number", "Status", "Note", "Saved"]}
            rows={roll}
            empty="No students in this class yet."
            renderRow={(entry) => (
              <tr key={entry.student_id}>
                <Cell className="font-medium text-[#111827]">{entry.student_name}</Cell>
                <Cell>{entry.registration_number}</Cell>
                <Cell>
                  <Select
                    value={entry.status}
                    onChange={(event) =>
                      setStudentStatus(entry.student_id, event.target.value)
                    }
                    options={STATUSES.map((value) => ({
                      value,
                      label: value[0].toUpperCase() + value.slice(1),
                    }))}
                  />
                </Cell>
                <Cell>
                  <Input
                    value={entry.note || ""}
                    placeholder="Optional"
                    onChange={(event) =>
                      setStudentNote(entry.student_id, event.target.value)
                    }
                  />
                </Cell>
                <Cell>
                  <Badge value={entry.saved ? "saved" : "unsaved"} />
                </Cell>
              </tr>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export default TeacherAttendanceSection;
