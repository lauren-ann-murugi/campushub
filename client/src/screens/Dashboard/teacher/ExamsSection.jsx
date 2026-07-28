"use client";

import { useEffect, useState } from "react";

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

const EMPTY_FORM = {
  student_id: "",
  exam_title: "",
  subject: "",
  term: "Term 1",
  marks_obtained: "",
  total_marks: "100",
};

export function TeacherExamsSection() {
  const { status, announce } = useStatus();
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const load = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      teacherService.listStudents(className ? { class_name: className } : {}),
      teacherService.listResults(className ? { class_name: className } : {}),
    ])
      .then(([studentData, resultData]) => {
        if (cancelled) return;
        setStudents(studentData.students || []);
        setClasses(studentData.classes || []);
        setResults(resultData.results || []);
        setSummary(resultData.summary || null);
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

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (result) => {
    setEditingId(result.id);
    setForm({
      student_id: String(result.student_id),
      exam_title: result.exam_title,
      subject: result.subject,
      term: result.term || "Term 1",
      marks_obtained: String(result.marks_obtained),
      total_marks: String(result.total_marks),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!editingId && !form.student_id) {
      announce("error", "Select the student this result belongs to.");
      return;
    }
    if (!form.subject.trim()) {
      announce("error", "Subject is required.");
      return;
    }

    const marks = Number(form.marks_obtained);
    const total = Number(form.total_marks);
    if (!Number.isFinite(marks) || !Number.isFinite(total) || total <= 0) {
      announce("error", "Marks must be numbers and the total must be above zero.");
      return;
    }
    if (marks < 0 || marks > total) {
      announce("error", `Marks obtained must be between 0 and ${total}.`);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        exam_title: form.exam_title.trim(),
        subject: form.subject.trim(),
        term: form.term,
        marks_obtained: marks,
        total_marks: total,
      };

      if (editingId) {
        await teacherService.updateResult(editingId, payload);
        announce("success", "Result updated — the student sees the new mark.");
      } else {
        await teacherService.createResult({
          ...payload,
          student_id: Number(form.student_id),
        });
        announce("success", "Result published to the student portal.");
      }

      resetForm();
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (result) => {
    try {
      await teacherService.deleteResult(result.id);
      announce("success", "Result removed from the student portal.");
      if (editingId === result.id) resetForm();
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Exams and results"
        description="Marks you record here appear under Results in the student portal and in the admin portal."
      >
        <Select
          value={className}
          onChange={(event) => setClassName(event.target.value)}
          options={classes}
          placeholder="All my classes"
        />
      </SectionHeader>

      <Banner status={status} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Results recorded" value={summary?.exams ?? 0} />
        <StatCard label="Class average" value={`${summary?.average ?? 0}%`} />
        <StatCard label="Top subject" value={summary?.best_subject || "—"} />
      </div>

      <Card
        title={editingId ? "Edit result" : "Record a result"}
        description={
          editingId
            ? "Update the mark and the student's portal reflects it immediately."
            : "Enter a mark for one of your students."
        }
      >
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Student">
            <Select
              value={form.student_id}
              onChange={update("student_id")}
              disabled={Boolean(editingId)}
              placeholder="Select a student"
              options={students.map((student) => ({
                value: String(student.id),
                label: `${student.name} · ${student.registration_number}`,
              }))}
            />
          </Field>
          <Field label="Exam">
            <Input
              value={form.exam_title}
              onChange={update("exam_title")}
              placeholder="Mid-term exam"
            />
          </Field>
          <Field label="Subject">
            <Input value={form.subject} onChange={update("subject")} placeholder="Mathematics" />
          </Field>
          <Field label="Term">
            <Select
              value={form.term}
              onChange={update("term")}
              options={["Term 1", "Term 2", "Term 3"]}
            />
          </Field>
          <Field label="Marks obtained">
            <Input
              type="number"
              value={form.marks_obtained}
              onChange={update("marks_obtained")}
              min="0"
            />
          </Field>
          <Field label="Out of">
            <Input
              type="number"
              value={form.total_marks}
              onChange={update("total_marks")}
              min="1"
            />
          </Field>

          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Update result" : "Publish result"}
            </Button>
            {editingId ? (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card title="Published results">
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Student", "Exam", "Subject", "Marks", "Grade", ""]}
            rows={results}
            empty="No results recorded yet."
            renderRow={(result) => (
              <tr key={result.id}>
                <Cell className="font-medium text-[#111827]">{result.student_name}</Cell>
                <Cell>{result.exam_title || "—"}</Cell>
                <Cell>{result.subject}</Cell>
                <Cell>
                  {result.marks_obtained}/{result.total_marks} ({result.percentage}%)
                </Cell>
                <Cell className="font-semibold text-[#111827]">{result.grade}</Cell>
                <Cell>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => startEdit(result)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(result)}>
                      Delete
                    </Button>
                  </div>
                </Cell>
              </tr>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export const TeacherExamSection = TeacherExamsSection;

export default TeacherExamsSection;
