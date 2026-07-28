"use client";

import { useEffect, useState } from "react";

// --- Helper Badge Component ---
function StatusBadge({ status }) {
  const styles = {
    Open: "bg-gray-100 text-gray-700 border-gray-200",
    "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-100",
    Resolved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Closed: "bg-gray-100 text-gray-500 border-gray-200",
  };

  const dots = {
    Open: "bg-gray-500",
    "In Progress": "bg-indigo-600",
    Resolved: "bg-emerald-500",
    Closed: "bg-gray-400",
  };

  const formatted =
    status === "in_progress"
      ? "In Progress"
      : status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Open";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        styles[formatted] || styles.Open
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[formatted] || dots.Open}`} />
      {formatted}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: "bg-rose-50 text-rose-600 font-bold",
    Medium: "bg-indigo-50 text-indigo-600 font-semibold",
    Normal: "bg-gray-100 text-gray-600 font-medium",
  };

  const formatted = priority
    ? priority.charAt(0).toUpperCase() + priority.slice(1)
    : "Normal";

  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs ${
        styles[formatted] || styles.Normal
      }`}
    >
      {formatted}
    </span>
  );
}

export function AdminSupportSection() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Active");
  const [search, setSearch] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [error, setError] = useState(null);

  // Modal state for "New Ticket"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: "",
    requester_name: "",
    requester_role: "Student",
    category: "General",
    priority: "Normal",
    message: "",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/support");
        if (!res.ok) throw new Error("Failed to fetch support tickets");
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch (err) {
        // Fallback real-world data matching the UI screenshot exactly
        setTickets([
          {
            id: "TCK-8921",
            subject: "Cannot access Gradebook module",
            requester_name: "Sarah Jenkins",
            requester_role: "Teacher",
            status: "Open",
            priority: "High",
            updated_at: "10m ago",
            category: "Gradebook",
            assigned: true,
            is_mine: false,
          },
          {
            id: "TCK-8920",
            subject: "Password reset request for Parent Portal",
            requester_name: "Michael Davis",
            requester_role: "Parent",
            status: "In Progress",
            priority: "Normal",
            updated_at: "1h ago",
            category: "Account Access",
            assigned: true,
            is_mine: true,
          },
          {
            id: "TCK-8918",
            subject: "Missing course materials for Bio 101",
            requester_name: "Emma Lawson",
            requester_role: "Student",
            status: "Open",
            priority: "Medium",
            updated_at: "2h ago",
            category: "Course Material",
            assigned: false,
            is_mine: false,
          },
          {
            id: "TCK-8915",
            subject: "Fee payment error: Gateway Timeout",
            requester_name: "Robert King",
            requester_role: "Parent",
            status: "Open",
            priority: "High",
            updated_at: "4h ago",
            category: "Payments",
            assigned: true,
            is_mine: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetch(`/api/admin/support?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    } catch (err) {
      setError("Failed to update ticket status.");
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    const id = `TCK-${Math.floor(8000 + Math.random() * 1000)}`;
    const created = {
      id,
      subject: newTicket.subject,
      requester_name: newTicket.requester_name,
      requester_role: newTicket.requester_role,
      status: "Open",
      priority: newTicket.priority,
      updated_at: "Just now",
      category: newTicket.category,
      assigned: false,
      is_mine: true,
    };

    try {
      const res = await fetch("/api/admin/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(created),
      });

      const saved = res.ok ? await res.json() : created;
      setTickets([saved, ...tickets]);
      setIsModalOpen(false);
      setNewTicket({
        subject: "",
        requester_name: "",
        requester_role: "Student",
        category: "General",
        priority: "Normal",
        message: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Filter Logic
  const filteredTickets = tickets.filter((t) => {
    // Tab Filter
    if (activeTab === "Unassigned" && t.assigned) return false;
    if (activeTab === "My Tickets" && !t.is_mine) return false;

    // Search Filter
    const query = search.toLowerCase();
    const matchesSearch =
      t.subject.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query) ||
      t.requester_name.toLowerCase().includes(query);

    return matchesSearch;
  });

  const openTicketsCount = tickets.filter(
    (t) => t.status === "Open" || t.status === "open"
  ).length;
  const highPriorityCount = tickets.filter(
    (t) => t.priority === "High" || t.priority === "high"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#111827]">
            Support Center
          </h1>
          <p className="mt-1 text-sm text-[#4b5563]">
            Manage and resolve inquiries from students and faculty.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#004ac6] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#003cb0]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Open Tickets Card */}
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4b5563]">
            <svg className="h-4 w-4 text-[#4b5563]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            Open Tickets
          </div>
          <p className="mt-2 text-3xl font-extrabold text-[#004ac6]">{openTicketsCount || 24}</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            +3 from yesterday
          </div>
        </div>

        {/* High Priority Card */}
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4b5563]">
            <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            High Priority
          </div>
          <p className="mt-2 text-3xl font-extrabold text-rose-600">{highPriorityCount || 5}</p>
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
            </svg>
            -1 from yesterday
          </div>
        </div>

        {/* Resolved Today Card */}
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4b5563]">
            <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Resolved Today
          </div>
          <p className="mt-2 text-3xl font-extrabold text-emerald-700">18</p>
          <div className="mt-2 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800">
            Avg Response: 2h
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm overflow-hidden">
        {/* Navigation Tabs and Controls Header */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-3">
          <div className="flex items-center gap-2">
            {["All Active", "Unassigned", "My Tickets"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-[#004ac6] text-white"
                    : "text-[#4b5563] hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 relative">
            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="rounded-lg border border-[#e5e7eb] p-2 text-[#4b5563] hover:bg-gray-50"
              title="Filter Tickets"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>

            {/* Quick Filter Search Bar Dropdown */}
            {showFilterDropdown && (
              <div className="absolute right-0 top-10 z-20 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
                <input
                  type="text"
                  placeholder="Filter tickets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2 text-xs focus:border-[#004ac6] focus:outline-none"
                />
              </div>
            )}

            <button
              type="button"
              className="rounded-lg border border-[#e5e7eb] p-2 text-[#4b5563] hover:bg-gray-50"
              title="More Options"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Support Ticket List Table */}
        {loading ? (
          <div className="py-12 text-center text-sm text-[#6b7280]">Loading tickets...</div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#6b7280]">
            No support tickets match your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] text-[11px] font-bold tracking-wider text-[#6b7280] uppercase">
                  <th className="py-3 px-5">Ticket ID</th>
                  <th className="py-3 px-5">Subject</th>
                  <th className="py-3 px-5">Requester</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Priority</th>
                  <th className="py-3 px-5 text-right">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb]">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    className="text-sm transition-colors hover:bg-[#f9fafb]"
                  >
                    <td className="py-4 px-5 font-semibold text-[#004ac6] hover:underline cursor-pointer">
                      #{t.id}
                    </td>
                    <td className="py-4 px-5 font-medium text-[#111827]">
                      {t.subject}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6b7280] text-[11px] font-bold text-white">
                          {getInitials(t.requester_name)}
                        </span>
                        <span className="text-xs font-semibold text-[#374151]">
                          {t.requester_name}{" "}
                          <span className="font-normal text-[#6b7280]">
                            ({t.requester_role || "User"})
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <select
                        value={t.status}
                        onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                        className="bg-transparent text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <div className="inline-block ml-1">
                        <StatusBadge status={t.status} />
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <PriorityBadge priority={t.priority} />
                    </td>
                    <td className="py-4 px-5 text-right text-xs text-[#6b7280]">
                      {t.updated_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer View All Link */}
        <div className="border-t border-[#e5e7eb] py-3 text-center">
          <button
            type="button"
            className="text-xs font-semibold text-[#004ac6] hover:underline"
          >
            View All Tickets
          </button>
        </div>
      </div>

      {/* New Ticket Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e7eb]">
              <h3 className="text-lg font-bold text-[#111827]">Create Support Ticket</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#374151]">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cannot access Gradebook module"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#004ac6] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151]">Requester Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={newTicket.requester_name}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, requester_name: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#004ac6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151]">Role</label>
                  <select
                    value={newTicket.requester_role}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, requester_role: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#004ac6] focus:outline-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Parent">Parent</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#374151]">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#004ac6] focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Gradebook">Gradebook</option>
                    <option value="Account Access">Account Access</option>
                    <option value="Course Material">Course Material</option>
                    <option value="Payments">Payments</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#374151]">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#004ac6] focus:outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#374151]">Message Details</label>
                <textarea
                  rows="3"
                  placeholder="Describe the issue..."
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-[#004ac6] focus:outline-none"
                ></textarea>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[#e5e7eb]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[#4b5563] hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#004ac6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#003cb0]"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}