"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Banner,
  Button,
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
  useStatus,
} from "@/components/portal/PortalUI";
import { adminService } from "@/services/adminService";

const EMPTY_FORM = {
  name: "",
  email: "",
  registration_number: "",
  class_name: "",
  course: "",
  year_of_study: "1",
};

export function AdminStudentsSection() {
  const { status, announce } = useStatus();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const load = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    adminService.listStudents(filterClass ? { class_name: filterClass } : {})
      .then((data) => {
        if (cancelled) return;
        setStudents(data.students || []);
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
  }, [announce, filterClass, refreshKey]);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.registration_number.trim()) {
      announce("error", "Name, email and registration number are required.");
      return;
    }

    setSaving(true);
    try {
      await adminService.createStudent({
        name: form.name.trim(),
        email: form.email.trim(),
        registration_number: form.registration_number.trim(),
        class_name: form.class_name.trim(),
        course: form.course.trim(),
        year_of_study: Number(form.year_of_study) || 1,
      });
      announce("success", "Student enrolled and given portal access.");
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const changeClass = async (student, className) => {
    if (className === (student.class_name || "")) return;
    try {
      await adminService.updateStudent(student.id, { class_name: className });
      announce("success", `${student.name} moved to ${className || "no class"}.`);
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return students;
    return students.filter((student) =>
      [student.name, student.email, student.registration_number]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [search, students]);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Students"
        description="Everyone enrolled in the school, with the class that drives their timetable and announcements."
      />

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Students" value={students.length} />
        <StatCard label="Classes" value={classes.length} />
        <StatCard label="Showing" value={filtered.length} hint={filterClass || "All classes"} />
      </div>

      <Card title="Enrol a student">
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Full name">
            <Input value={form.name} onChange={update("name")} />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={update("email")} />
          </Field>
          <Field label="Registration number">
            <Input
              value={form.registration_number}
              onChange={update("registration_number")}
              placeholder="ADM-2026-014"
            />
          </Field>
          <Field label="Class" hint="Type a new class name or pick an existing one below.">
            <Input
              value={form.class_name}
              onChange={update("class_name")}
              list="admin-class-options"
              placeholder="Grade 10A"
            />
            <datalist id="admin-class-options">
              {classes.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </Field>
          <Field label="Course">
            <Input value={form.course} onChange={update("course")} />
          </Field>
          <Field label="Year of study">
            <Input
              type="number"
              min="1"
              value={form.year_of_study}
              onChange={update("year_of_study")}
            />
          </Field>

          <div className="flex items-end sm:col-span-2 lg:col-span-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Enrolling…" : "Enrol student"}
            </Button>
          </div>
        </form>
      </Card>

      <Card
        title="Enrolled students"
        action={
          <div className="flex flex-wrap items-end gap-2">
            <Field label="Class">
              <Select
                value={filterClass}
                onChange={(event) => setFilterClass(event.target.value)}
                options={classes}
                placeholder="All classes"
              />
            </Field>
            <Field label="Search">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name or reg. number"
              />
            </Field>
          </div>
        }
      >
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Student", "Reg. number", "Course", "Year", "Class"]}
            rows={filtered}
            empty="No students match this filter."
            renderRow={(student) => (
              <tr key={student.id}>
                <Cell className="font-medium text-[#111827]">
                  {student.name}
                  <span className="block text-xs text-[#6b7280]">{student.email}</span>
                </Cell>
                <Cell>{student.registration_number}</Cell>
                <Cell>{student.course || "—"}</Cell>
                <Cell>{student.year_of_study}</Cell>
                <Cell>
                  <Input
                    defaultValue={student.class_name || ""}
                    list="admin-class-options"
                    onBlur={(event) => changeClass(student, event.target.value.trim())}
                  />
                </Cell>
              </tr>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export default AdminStudentsSection;
