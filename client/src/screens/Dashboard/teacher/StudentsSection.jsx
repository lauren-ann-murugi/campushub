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
import { teacherService } from "@/services/teacherService";

export function TeacherStudentsSection() {
  const { status, announce } = useStatus();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);

  const [refreshKey, setRefreshKey] = useState(0);
  const load = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    teacherService.listStudents(className ? { class_name: className } : {})
      .then((data) => {
        if (cancelled) return;
        setStudents(data.students || []);
        setClasses(data.classes || []);
      })
      .catch((err) => {
        if (cancelled) return;
        announce("error", errorMessage(err));
        setStudents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [announce, className, refreshKey]);

  const openStudent = async (student) => {
    setSelected(student);
    setResults([]);
    try {
      const data = await teacherService.listResults({ class_name: student.class_name });
      setResults((data.results || []).filter((r) => r.student_id === student.id));
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
        description="Everyone in the classes you teach, straight from the school register."
      >
        <Button variant="secondary" onClick={load}>
          Refresh
        </Button>
      </SectionHeader>

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Students" value={students.length} />
        <StatCard label="Classes" value={classes.length || 0} />
        <StatCard label="Showing" value={filtered.length} hint={className || "All classes"} />
      </div>

      <Card
        title="Class register"
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
            <Field label="Search">
              <Input
                value={search}
                placeholder="Name or admission no."
                onChange={(event) => setSearch(event.target.value)}
              />
            </Field>
          </div>
        }
      >
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Student", "Reg. number", "Class", "Email", ""]}
            rows={filtered}
            empty="No students found for this class."
            renderRow={(student) => (
              <tr key={student.id}>
                <Cell className="font-medium text-[#111827]">{student.name}</Cell>
                <Cell>{student.registration_number}</Cell>
                <Cell>{student.class_name || "—"}</Cell>
                <Cell>{student.email}</Cell>
                <Cell>
                  <Button variant="secondary" onClick={() => openStudent(student)}>
                    View results
                  </Button>
                </Cell>
              </tr>
            )}
          />
        )}
      </Card>

      {selected ? (
        <Card
          title={`${selected.name} — recorded results`}
          description={`${selected.registration_number} · ${selected.class_name || "No class"}`}
          action={
            <Button variant="secondary" onClick={() => setSelected(null)}>
              Close
            </Button>
          }
        >
          <Table
            columns={["Exam", "Subject", "Marks", "Grade"]}
            rows={results}
            empty="No results recorded for this student yet."
            renderRow={(result) => (
              <tr key={result.id}>
                <Cell>{result.exam_title || "—"}</Cell>
                <Cell>{result.subject}</Cell>
                <Cell>
                  {result.marks_obtained}/{result.total_marks} ({result.percentage}%)
                </Cell>
                <Cell className="font-semibold text-[#111827]">{result.grade}</Cell>
              </tr>
            )}
          />
        </Card>
      ) : null}
    </div>
  );
}

export default TeacherStudentsSection;
