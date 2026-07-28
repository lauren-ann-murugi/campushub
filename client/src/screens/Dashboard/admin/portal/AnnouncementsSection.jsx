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
  Textarea,
  errorMessage,
  formatDate,
  useStatus,
} from "@/components/portal/PortalUI";
import { adminService } from "@/services/adminService";

const AUDIENCES = [
  { value: "all", label: "Everyone (teachers and students)" },
  { value: "teachers", label: "Teachers only" },
  { value: "students", label: "All students" },
  { value: "class", label: "A specific class" },
];

const EMPTY_FORM = { title: "", content: "", audience: "all", class_name: "" };

export function AdminAnnouncementsSection() {
  const { status, announce } = useStatus();
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);
  const load = () => setRefreshKey((key) => key + 1);

  useEffect(() => {
    let cancelled = false;

    adminService.listAnnouncements()
      .then((data) => {
        if (cancelled) return;
        setAnnouncements(data.announcements || []);
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
  }, [announce, refreshKey]);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      announce("error", "A title and a message are both required.");
      return;
    }
    if (form.audience === "class" && !form.class_name) {
      announce("error", "Choose the class that should receive this announcement.");
      return;
    }

    setSaving(true);
    try {
      await adminService.createAnnouncement({
        title: form.title.trim(),
        content: form.content.trim(),
        audience: form.audience,
        class_name: form.audience === "class" ? form.class_name : "",
      });
      announce(
        "success",
        form.audience === "teachers"
          ? "Announcement sent to the teacher portal."
          : form.audience === "class"
          ? `Announcement sent to ${form.class_name}.`
          : "Announcement sent to the teacher and student portals."
      );
      setForm(EMPTY_FORM);
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (announcement) => {
    try {
      await adminService.deleteAnnouncement(announcement.id);
      announce("success", "Announcement withdrawn from all portals.");
      await load();
    } catch (err) {
      announce("error", errorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Announcements"
        description="Anything you post here appears in the teacher and student portals immediately."
      />

      <Banner status={status} />

      <Card title="New announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title">
              <Input
                value={form.title}
                onChange={update("title")}
                placeholder="Prize giving day"
              />
            </Field>
            <Field label="Send to">
              <Select
                value={form.audience}
                onChange={update("audience")}
                options={AUDIENCES}
              />
            </Field>
          </div>

          {form.audience === "class" ? (
            <Field label="Class">
              <Select
                value={form.class_name}
                onChange={update("class_name")}
                options={classes}
                placeholder="Select a class"
              />
            </Field>
          ) : null}

          <Field label="Message">
            <Textarea
              rows={4}
              value={form.content}
              onChange={update("content")}
              placeholder="Write the announcement…"
            />
          </Field>

          <Button type="submit" disabled={saving}>
            {saving ? "Sending…" : "Send announcement"}
          </Button>
        </form>
      </Card>

      <Card title="Published announcements">
        {loading ? (
          <Loading />
        ) : (
          <Table
            columns={["Title", "Audience", "Message", "Posted", ""]}
            rows={announcements}
            empty="No announcements have been sent yet."
            renderRow={(announcement) => (
              <tr key={announcement.id}>
                <Cell className="font-medium text-[#111827]">{announcement.title}</Cell>
                <Cell className="capitalize">
                  {announcement.audience === "class"
                    ? announcement.class_name
                    : announcement.audience}
                </Cell>
                <Cell className="max-w-sm">{announcement.content}</Cell>
                <Cell>
                  {formatDate(announcement.created_at)}
                  <span className="block text-xs text-[#6b7280]">
                    {announcement.author}
                  </span>
                </Cell>
                <Cell>
                  <Button variant="danger" onClick={() => handleDelete(announcement)}>
                    Delete
                  </Button>
                </Cell>
              </tr>
            )}
          />
        )}
      </Card>
    </div>
  );
}

export default AdminAnnouncementsSection;
