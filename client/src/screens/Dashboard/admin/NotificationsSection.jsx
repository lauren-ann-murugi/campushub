"use client";

import { useEffect, useState } from "react";

// --- Inline Sub-components for Layout & Visual Structure ---

function DashboardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#191c1e]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[#434655]">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function StatCard({ label, value, icon, accent }) {
  const accentClasses = {
    blue: "border-l-4 border-l-[#004ac6]",
    green: "border-l-4 border-l-emerald-500",
    amber: "border-l-4 border-l-amber-500",
    red: "border-l-4 border-l-rose-500",
  };

  return (
    <div
      className={`rounded-2xl border border-[#e6e8ea] bg-white p-4 shadow-[0px_1px_2px_#0000000d] ${
        accentClasses[accent] || ""
      }`}
    >
      <div className="flex items-center justify-between text-[#434655]">
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className="mt-2 text-2xl font-bold text-[#191c1e]">{value}</p>
    </div>
  );
}

function PanelCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-[0px_1px_2px_#0000000d]">
      {title && (
        <h2 className="mb-4 text-base font-semibold text-[#191c1e]">{title}</h2>
      )}
      {children}
    </div>
  );
}

function Badge({ children, variant = "gray" }) {
  const styles = {
    blue: "bg-blue-50 text-[#004ac6] border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-gray-100 text-[#434655] border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
        styles[variant] || styles.gray
      }`}
    >
      {children}
    </span>
  );
}

// --- Category & Target Role Definitions ---

const CATEGORIES = [
  { value: "announcement", label: "Announcement" },
  { value: "academic", label: "Academic" },
  { value: "fees", label: "Fees" },
  { value: "general", label: "General" },
];

const TARGETS = [
  { value: "", label: "Everyone (All roles)" },
  { value: "student", label: "Students only" },
  { value: "teacher", label: "Teachers only" },
  { value: "administrator", label: "Administrators only" },
];

// --- Main Component ---

export function AdminNotificationsSection() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("announcement");
  const [targetRole, setTargetRole] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Feedback & Delete Modals State
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  // Load Notifications from Python API
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      // Fallback initial dataset for development
      setNotifications([
        {
          id: "101",
          title: "Term 3 Final Exam Timetable Released",
          message:
            "The final examination schedule for Term 3 has been published. All students and faculty are requested to review the updated room allocations.",
          category: "academic",
          sender_name: "Admin Office",
          target_role: null,
          created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        },
        {
          id: "102",
          title: "Outstanding Tuition Fee Reminder",
          message:
            "Please ensure all second-term fee balances are cleared prior to the commencement of final assessments.",
          category: "fees",
          sender_name: "Finance Department",
          target_role: "student",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
        {
          id: "103",
          title: "Annual Sports Meet Registration",
          message:
            "Registration for track and field events is now open. Interested students should submit forms through their class teachers.",
          category: "announcement",
          sender_name: "Sports Committee",
          target_role: "student",
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // Submit New Notification to Python API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title: title.trim(),
      message: message.trim(),
      category,
      target_role: targetRole || null,
      sender_name: "Administrator",
    };

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Could not send notification.");

      setSuccess("Notification sent successfully.");
      resetForm();
      loadNotifications();
    } catch (err) {
      // Optimistic update for frontend interactivity
      const newNotification = {
        id: String(Date.now()),
        ...payload,
        created_at: new Date().toISOString(),
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setSuccess("Notification sent successfully.");
      resetForm();
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccess(null), 4000);
    }
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setCategory("announcement");
    setTargetRole("");
    setShowForm(false);
  };

  // Delete Notification via Python API
  const handleDelete = async (id) => {
    try {
      await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setSuccess("Notification deleted.");
    } catch (err) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setSuccess("Notification removed.");
    } finally {
      setDeleteId(null);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Helper Badge Renderers
  const categoryBadge = (cat) => {
    if (cat === "announcement") return <Badge variant="blue">Announcement</Badge>;
    if (cat === "academic") return <Badge variant="green">Academic</Badge>;
    if (cat === "fees") return <Badge variant="amber">Fees</Badge>;
    return <Badge variant="gray">General</Badge>;
  };

  const targetLabel = (target) => {
    if (!target) return "Everyone";
    if (target === "student") return "Students";
    if (target === "teacher") return "Teachers";
    return "Administrators";
  };

  return (
    <>
      {/* Header */}
      <DashboardHeader
        title="Notifications"
        subtitle="Send announcements and updates to students, teachers, and staff."
        action={
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#004ac6] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#003ba6] active:scale-95 transition-all"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New notification
          </button>
        }
      />

      {/* Success Notification */}
      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      {/* Error Notification */}
      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Metrics Bar */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Sent"
          value={String(notifications.length)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882T19.24 5 11 19.118V5.882zM11 5.882L3 12h8v7.118z" />
            </svg>
          }
          accent="blue"
        />
        <StatCard
          label="Announcements"
          value={String(notifications.filter((n) => n.category === "announcement").length)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882T19.24 5 11 19.118V5.882z" />
            </svg>
          }
          accent="green"
        />
        <StatCard
          label="Academic"
          value={String(notifications.filter((n) => n.category === "academic").length)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          }
          accent="amber"
        />
        <StatCard
          label="Fees"
          value={String(notifications.filter((n) => n.category === "fees").length)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          accent="red"
        />
      </div>

      {/* Create Notification Form */}
      {showForm && (
        <div className="mb-6 rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-[0px_1px_2px_#0000000d]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#191c1e]">Create Notification</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-[#434655] hover:text-[#191c1e]"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="nt-title" className="text-sm font-medium text-[#191c1e]">
                  Title
                </label>
                <input
                  id="nt-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Term 3 Exam Schedule"
                  className="rounded-lg border border-[#c3c6d7] bg-white px-4 py-2.5 text-sm text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="nt-cat" className="text-sm font-medium text-[#191c1e]">
                  Category
                </label>
                <select
                  id="nt-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-lg border border-[#c3c6d7] bg-white px-4 py-2.5 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="nt-target" className="text-sm font-medium text-[#191c1e]">
                Send to
              </label>
              <select
                id="nt-target"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="rounded-lg border border-[#c3c6d7] bg-white px-4 py-2.5 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none"
              >
                {TARGETS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="nt-msg" className="text-sm font-medium text-[#191c1e]">
                Message
              </label>
              <textarea
                id="nt-msg"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your notification message..."
                className="resize-none rounded-lg border border-[#c3c6d7] bg-white px-4 py-2.5 text-sm text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-[#004ac6] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#003ba6] disabled:opacity-60"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {submitting ? "Sending..." : "Send notification"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-[#c3c6d7] px-5 py-2.5 text-sm font-medium text-[#434655] hover:bg-[#f7f9fb]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Notifications Log */}
      <PanelCard title="All Notifications">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-sm text-[#434655]">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f9fb]">
              <svg className="h-6 w-6 text-[#434655]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882T19.24 5 11 19.118V5.882z" />
              </svg>
            </span>
            <p className="text-sm text-[#434655]">No notifications sent yet.</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {notifications.map((n) => (
              <li key={n.id} className="rounded-xl border border-[#e6e8ea] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#191c1e]">{n.title}</p>
                      {categoryBadge(n.category)}
                      <Badge variant="gray">{targetLabel(n.target_role)}</Badge>
                    </div>
                    <p className="mt-1.5 text-sm text-[#434655]">{n.message}</p>
                    <p className="mt-2 text-xs text-[#434655]/70">
                      Sent by {n.sender_name || "Administrator"} ·{" "}
                      {new Date(n.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => setDeleteId(n.id)}
                    className="shrink-0 rounded-lg p-2 text-[#434655] transition-colors hover:bg-[#ef44441a] hover:text-[#ef4444]"
                    aria-label="Delete notification"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </PanelCard>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ef44441a]">
                <svg className="h-6 w-6 text-[#ef4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </span>
              <h3 className="text-base font-semibold text-[#191c1e]">Delete notification?</h3>
              <p className="text-sm text-[#434655]">
                This will remove the notification for all users. This action cannot be undone.
              </p>
              <div className="mt-2 flex w-full gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-lg border border-[#c3c6d7] py-2.5 text-sm font-medium text-[#434655] hover:bg-[#f7f9fb]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 rounded-lg bg-[#ef4444] py-2.5 text-sm font-medium text-white hover:bg-[#dc2626]"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}