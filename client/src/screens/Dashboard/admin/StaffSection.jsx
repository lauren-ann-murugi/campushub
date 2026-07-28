"use client";

import { useEffect, useState } from "react";

// --- Inline Sub-components ---

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

function Badge({ children, variant = "gray" }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-[#004ac6] border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    gray: "bg-gray-100 text-[#434655] border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${
        styles[variant] || styles.gray
      }`}
    >
      {children}
    </span>
  );
}

function formatLastSeen(lastSeenAt) {
  if (!lastSeenAt) return "Never";
  const date = new Date(lastSeenAt);
  const diffMins = Math.floor((new Date() - date) / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

const ROLE_LABEL = {
  teacher: "Teacher",
  administrator: "Administrator",
};

const ROLE_FILTERS = [
  { value: "All", label: "All Staff" },
  { value: "teacher", label: "Teachers" },
  { value: "administrator", label: "Administrators" },
];

// --- Main Component ---

export function AdminStaffSection() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "teacher",
    department: "Mathematics",
  });

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/staff");
        if (!res.ok) throw new Error("Failed to load staff list");
        const data = await res.json();
        setStaff(data.staff || []);
      } catch (err) {
        // Fallback Mock Data for UI presentation
        setStaff([
          {
            id: "tch-1",
            full_name: "Dr. Robert Chen",
            first_name: "Robert",
            last_name: "Chen",
            staff_id: "TCH-2039",
            role: "teacher",
            department: "Science Dept.",
            subjects: ["Physics", "Chemistry"],
            email: "r.chen@campushub.edu",
            phone: "+1 (555) 019-2834",
            avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            is_online: true,
            last_seen_at: new Date().toISOString(),
            created_at: "2023-01-15T00:00:00Z",
          },
          {
            id: "tch-2",
            full_name: "Sarah Jenkins",
            first_name: "Sarah",
            last_name: "Jenkins",
            staff_id: "TCH-1882",
            role: "teacher",
            department: "Mathematics Dept.",
            subjects: ["Algebra II", "Calculus"],
            email: "s.jenkins@campushub.edu",
            phone: "+1 (555) 018-9921",
            avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
            is_online: true,
            last_seen_at: new Date().toISOString(),
            created_at: "2022-08-20T00:00:00Z",
          },
          {
            id: "tch-3",
            full_name: "Marcus Wright",
            first_name: "Marcus",
            last_name: "Wright",
            staff_id: "TCH-3104",
            role: "teacher",
            department: "Humanities Dept.",
            subjects: ["World History"],
            email: "m.wright@campushub.edu",
            phone: "+1 (555) 012-4438",
            avatar_url: null,
            is_online: false,
            last_seen_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            created_at: "2023-05-10T00:00:00Z",
          },
          {
            id: "tch-4",
            full_name: "Elena Rodriguez",
            first_name: "Elena",
            last_name: "Rodriguez",
            staff_id: "TCH-4011",
            role: "administrator",
            department: "Languages Dept.",
            subjects: ["Spanish I", "Spanish Lit"],
            email: "e.rodriguez@campushub.edu",
            phone: "+1 (555) 016-7782",
            avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            is_online: true,
            last_seen_at: new Date().toISOString(),
            created_at: "2021-11-01T00:00:00Z",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  const displayName = (s) =>
    s.full_name || `${s.first_name ?? ""} ${s.last_name ?? ""}`.trim() || "Unknown";

  const initials = (name) =>
    name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const filtered = staff.filter((s) => {
    const matchFilter = filter === "All" || s.role === filter;
    const name = displayName(s).toLowerCase();
    const dept = (s.department || "").toLowerCase();
    const query = search.toLowerCase();
    const matchSearch = name.includes(query) || dept.includes(query);
    return matchFilter && matchSearch;
  });

  const teacherCount = staff.filter((s) => s.role === "teacher").length;
  const adminCount = staff.filter((s) => s.role === "administrator").length;
  const onlineCount = staff.filter((s) => s.is_online).length;

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStaff),
      });

      const fullName = `${newStaff.first_name} ${newStaff.last_name}`.trim();
      const createdItem = res.ok
        ? await res.json()
        : {
            id: `tch-${Date.now()}`,
            full_name: fullName,
            first_name: newStaff.first_name,
            last_name: newStaff.last_name,
            staff_id: `TCH-${Math.floor(1000 + Math.random() * 9000)}`,
            role: newStaff.role,
            department: `${newStaff.department} Dept.`,
            subjects: [newStaff.department],
            email: newStaff.email,
            phone: newStaff.phone || "+1 (555) 000-0000",
            avatar_url: null,
            is_online: true,
            last_seen_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          };

      setStaff([createdItem, ...staff]);
      setIsAddModalOpen(false);
      setNewStaff({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        role: "teacher",
        department: "Mathematics",
      });
    } catch (err) {
      console.error("Error creating staff record:", err);
    }
  };

  const handleExportCSV = () => {
    const headers = ["ID,Name,Role,Department,Email,Phone,Status\n"];
    const rows = filtered.map(
      (s) =>
        `"${s.staff_id || s.id}","${displayName(s)}","${ROLE_LABEL[s.role] || s.role}","${
          s.department || ""
        }","${s.email || ""}","${s.phone || ""}","${s.is_online ? "Online" : "Offline"}"`
    );
    const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `staff_directory_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <>
      <DashboardHeader
        title="Staff Directory"
        subtitle="Manage teaching staff, assignments, and contact details."
        action={
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#004ac6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#003cb0]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Staff
          </button>
        }
      />

      {/* Overview Stat Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Staff"
          value={String(staff.length)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          accent="blue"
        />
        <StatCard
          label="Teachers"
          value={String(teacherCount)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          }
          accent="green"
        />
        <StatCard
          label="Administrators"
          value={String(adminCount)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0V7m0 4h-4" />
            </svg>
          }
          accent="amber"
        />
        <StatCard
          label="Online Now"
          value={String(onlineCount)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          accent="red"
        />
      </div>

      {/* Main Panel Content */}
      <div className="rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-[0px_1px_2px_#0000000d]">
        {/* Controls Toolbar */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-md">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#434655]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search staff members or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#c3c6d7] bg-white py-2 pl-10 pr-4 text-sm text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Role Filter Tabs */}
            <div className="flex rounded-lg border border-[#e6e8ea] bg-white p-0.5">
              {ROLE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFilter(f.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === f.value
                      ? "bg-[#004ac6] text-white"
                      : "text-[#434655] hover:bg-[#f7f9fb]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex rounded-lg border border-[#e6e8ea] bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md ${
                  viewMode === "grid" ? "bg-gray-100 text-[#004ac6]" : "text-[#434655]"
                }`}
                title="Grid View"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md ${
                  viewMode === "table" ? "bg-gray-100 text-[#004ac6]" : "text-[#434655]"
                }`}
                title="Table View"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Export CSV Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6e8ea] bg-white px-3 py-1.5 text-xs font-semibold text-[#434655] transition-colors hover:bg-[#f7f9fb]"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Directory Content */}
        {loading ? (
          <div className="py-12 text-center text-sm text-[#434655]">Loading staff records...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#434655]">No staff members found.</div>
        ) : viewMode === "grid" ? (
          /* Grid Card Layout */
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => {
              const name = displayName(s);
              return (
                <div
                  key={s.id}
                  className="relative flex flex-col justify-between rounded-xl border border-[#e6e8ea] bg-white p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {s.avatar_url ? (
                        <img
                          src={s.avatar_url}
                          alt={name}
                          className="h-12 w-12 rounded-full object-cover border border-gray-100"
                        />
                      ) : (
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-700">
                          {initials(name)}
                        </span>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-[#191c1e]">{name}</h3>
                        <p className="text-xs text-[#434655]">ID: {s.staff_id || "TCH-0000"}</p>
                      </div>
                    </div>
                    <button type="button" className="text-[#434655] hover:text-[#191c1e]">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Tags / Badges */}
                  <div className="my-3 flex flex-wrap gap-1.5">
                    {s.department && (
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#004ac6]">
                        {s.department}
                      </span>
                    )}
                    {(s.subjects || []).map((subj, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-gray-100 px-2 py-0.5 text-xs text-[#434655]"
                      >
                        {subj}
                      </span>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="mt-2 space-y-1.5 border-t border-[#eceef0] pt-3 text-xs text-[#434655]">
                    {s.email && (
                      <div className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5 text-[#434655]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{s.email}</span>
                      </div>
                    )}
                    {s.phone && (
                      <div className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5 text-[#434655]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{s.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table Layout */
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#eceef0]">
                  <th className="pb-3 text-xs font-medium text-[#434655]">Name</th>
                  <th className="pb-3 text-center text-xs font-medium text-[#434655]">Role</th>
                  <th className="pb-3 text-center text-xs font-medium text-[#434655]">Status</th>
                  <th className="pb-3 text-right text-xs font-medium text-[#434655]">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const name = displayName(s);
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-[#f0f1f3] transition-colors last:border-0 hover:bg-[#f7f9fb]"
                    >
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          {s.avatar_url ? (
                            <img
                              src={s.avatar_url}
                              alt={name}
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#004ac6] text-xs font-semibold text-white">
                              {initials(name) || "S"}
                            </span>
                          )}
                          <div>
                            <p className="text-sm font-medium text-[#191c1e]">{name}</p>
                            <p className="text-xs text-[#434655]">
                              Joined{" "}
                              {new Date(s.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <Badge variant="blue">{ROLE_LABEL[s.role] ?? s.role}</Badge>
                      </td>
                      <td className="py-3 text-center">
                        {s.is_online ? (
                          <Badge variant="green">Online</Badge>
                        ) : (
                          <Badge variant="gray">Offline</Badge>
                        )}
                      </td>
                      <td className="py-3 text-right text-sm text-[#434655]">
                        <span className="inline-flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatLastSeen(s.last_seen_at)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-lg font-bold text-[#191c1e]">Add New Staff Member</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#434655] hover:text-[#191c1e]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#434655]">First Name</label>
                  <input
                    type="text"
                    required
                    value={newStaff.first_name}
                    onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#434655]">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newStaff.last_name}
                    onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#434655]">Email Address</label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#434655]">Role</label>
                  <select
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="administrator">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#434655]">Department</label>
                  <input
                    type="text"
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg border border-[#e6e8ea] px-4 py-2 text-sm font-medium text-[#434655] hover:bg-[#f7f9fb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#004ac6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#003cb0]"
                >
                  Save Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}