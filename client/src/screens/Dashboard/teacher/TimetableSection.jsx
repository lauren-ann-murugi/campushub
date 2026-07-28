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
  Table,
  errorMessage,
  useStatus,
} from "@/components/portal/PortalUI";
import { teacherService } from "@/services/teacherService";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const EMPTY_FORM = {
  class_name: "",
  day: "Monday",
  subject: "",
  start_time: "08:00",
  end_time: "09:00",
  room: "",
};

export function TeacherTimetableSection() {
  const { status, announce } = useStatus();
  const [entries, setEntries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filterClass, setFilterClass] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const load = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    teacherService.getTimetable(filterClass ? { class_name: filterClass } : {})
      .then((data) => {
        if (cancelled) return;
        setEntries(data.entries || []);
        setClasses(data.classes || []);
        setForm((current) => ({
          ...current,
          class_name: current.class_name || filterClass || (data.classes || [])[0] || "",
        }));
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

  const resetForm = () => {
    setForm({ ...EMPTY_FORM, class_name: classes[0] || "" });
    setEditingId(null);
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setForm({
      class_name: entry.class_name,
      day: entry.day,
      subject: entry.subject,
      start_time: entry.start_time,
      end_time: entry.end_time,
      room: entry.room,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.class_name) {
      announce("error", "Select the class this lesson belongs to.");
      return;
    }
    if (!form.subject.trim()) {
      announce("error", "Subject is required.");
      return;
    }
    if (form.end_time <= form.start_time) {
      announce("error", "End time must be after the start time.");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, subject: form.subject.trim(), room: form.room.trim() };
      if (editingId) {
        await teacherService.updateTimetableEntry(editingId, payload);
        announce("success", "Timetable updated for the class.");
      } else {
        await teacherService.createTimetableEntry(payload);
        announce("success", `Lesson added — ${form.class_name} students can see it now.`);
      }
      resetForm();
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry) => {
    try {
      await teacherService.deleteTimetableEntry(entry.id);
      announce("success", "Lesson removed from the class timetable.");
      if (editingId === entry.id) resetForm();
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Timetable"
        description="The class timetable students see in their portal."
      >
        <Select
          value={filterClass}
          onChange={(event) => setFilterClass(event.target.value)}
          options={classes}
          placeholder="All my classes"
        />
      </SectionHeader>

      <Banner status={status} />

      <Card title={editingId ? "Edit lesson" : "Add a lesson"}>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Class">
            <Select
              value={form.class_name}
              onChange={update("class_name")}
              options={classes}
              placeholder="Select a class"
            />
          </Field>
          <Field label="Day">
            <Select value={form.day} onChange={update("day")} options={DAYS} />
          </Field>
          <Field label="Subject">
            <Input value={form.subject} onChange={update("subject")} placeholder="Mathematics" />
          </Field>
          <Field label="Starts">
            <Input type="time" value={form.start_time} onChange={update("start_time")} />
          </Field>
          <Field label="Ends">
            <Input type="time" value={form.end_time} onChange={update("end_time")} />
          </Field>
          <Field label="Room">
            <Input value={form.room} onChange={update("room")} placeholder="Room 12" />
          </Field>

          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-3">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Update lesson" : "Add lesson"}
            </Button>
            {editingId ? (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card title="Weekly schedule">
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Day", "Time", "Class", "Subject", "Room", ""]}
            rows={entries}
            empty="No lessons scheduled yet."
            renderRow={(entry) => (
              <tr key={entry.id}>
                <Cell className="font-medium text-[#111827]">{entry.day}</Cell>
                <Cell>
                  {entry.start_time} – {entry.end_time}
                </Cell>
                <Cell>{entry.class_name}</Cell>
                <Cell>{entry.subject}</Cell>
                <Cell>{entry.room || "—"}</Cell>
                <Cell>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => startEdit(entry)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(entry)}>
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

export default TeacherTimetableSection;
