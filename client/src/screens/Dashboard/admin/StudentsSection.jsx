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
      {action && <div className="flex items-center gap-3">{action}</div>}
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

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Inactive: "bg-gray-100 text-gray-700 border-gray-200",
    Suspended: "bg-rose-100 text-rose-800 border-rose-200",
  };

  const dots = {
    Active: "bg-emerald-500",
    Inactive: "bg-gray-400",
    Suspended: "bg-rose-500",
  };

  const label = status || "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        styles[label] || styles.Active
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[label] || dots.Active}`} />
      {label}
    </span>
  );
}

// --- Main Component ---

export function AdminStudentsSection() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    class_section: "Grade 10 - A",
    guardian_name: "",
    guardian_phone: "",
    guardian_relation: "Mother",
    status: "Active",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/students");
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();
        setStudents(data.students || []);
      } catch (err) {
        // Mock fallback data matching UI Design
        setStudents([
          {
            id: "STU-2023-0142",
            full_name: "Alexander James",
            first_name: "Alexander",
            last_name: "James",
            dob: "12 May 2008",
            class_section: "Grade 10 - A",
            guardian_name: "Sarah James",
            guardian_relation: "Mother",
            guardian_phone: "+1 (555) 123-4567",
            status: "Active",
            avatar_url: null,
            created_at: "2023-08-15T00:00:00Z",
          },
          {
            id: "STU-2023-0188",
            full_name: "Maya Patel",
            first_name: "Maya",
            last_name: "Patel",
            dob: "03 Aug 2007",
            class_section: "Grade 11 - Sci",
            guardian_name: "Raj Patel",
            guardian_relation: "Father",
            guardian_phone: "+1 (555) 987-6543",
            status: "Active",
            avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            created_at: "2023-08-18T00:00:00Z",
          },
          {
            id: "STU-2022-0056",
            full_name: "Lucas Chen",
            first_name: "Lucas",
            last_name: "Chen",
            dob: "22 Nov 2006",
            class_section: "Grade 12 - Arts",
            guardian_name: "Wei Chen",
            guardian_relation: "Mother",
            guardian_phone: "+1 (555) 444-5555",
            status: "Inactive",
            avatar_url: null,
            created_at: "2022-09-01T00:00:00Z",
          },
          {
            id: "STU-2024-0012",
            full_name: "Emma Roberts",
            first_name: "Emma",
            last_name: "Roberts",
            dob: "15 Jan 2009",
            class_section: "Grade 9 - B",
            guardian_name: "Tom Roberts",
            guardian_relation: "Father",
            guardian_phone: "+1 (555) 222-3333",
            status: "Suspended",
            avatar_url: null,
            created_at: "2024-01-10T00:00:00Z",
          },
          {
            id: "STU-2023-0201",
            full_name: "Omar Hassan",
            first_name: "Omar",
            last_name: "Hassan",
            dob: "09 Sep 2007",
            class_section: "Grade 11 - Com",
            guardian_name: "Fatima Hassan",
            guardian_relation: "Mother",
            guardian_phone: "+1 (555) 777-8888",
            status: "Active",
            avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            created_at: "2023-08-25T00:00:00Z",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
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

  // Search & Filter Logic
  const filtered = students.filter((s) => {
    const name = displayName(s).toLowerCase();
    const id = s.id.toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = name.includes(query) || id.includes(query);

    const matchesClass =
      selectedClass === "All Classes" || s.class_section === selectedClass;
    const matchesStatus =
      selectedStatus === "All Statuses" || s.status === selectedStatus;

    return matchesSearch && matchesClass && matchesStatus;
  });

  // Table Select Checkbox Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filtered.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleDeleteStudent = async (id) => {
    if (!confirm("Are you sure you want to remove this student record?")) return;
    try {
      await fetch(`/api/admin/students?id=${id}`, { method: "DELETE" });
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const handleAddStudentSubmit = async (e) => {
    e.preventDefault();
    const fullName = `${newStudent.first_name} ${newStudent.last_name}`.trim();
    const generatedId = `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord = {
      id: generatedId,
      full_name: fullName,
      first_name: newStudent.first_name,
      last_name: newStudent.last_name,
      dob: newStudent.dob || "01 Jan 2008",
      class_section: newStudent.class_section,
      guardian_name: newStudent.guardian_name,
      guardian_relation: newStudent.guardian_relation,
      guardian_phone: newStudent.guardian_phone || "+1 (555) 000-0000",
      status: newStudent.status,
      avatar_url: null,
      created_at: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });

      const saved = res.ok ? await res.json() : newRecord;
      setStudents([saved, ...students]);
      setIsAddModalOpen(false);
      setNewStudent({
        first_name: "",
        last_name: "",
        dob: "",
        class_section: "Grade 10 - A",
        guardian_name: "",
        guardian_phone: "",
        guardian_relation: "Mother",
        status: "Active",
      });
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  const handleExportCSV = () => {
    const headers = ["Student ID,Name,DOB,Class,Guardian Contact,Status\n"];
    const rows = filtered.map(
      (s) =>
        `"${s.id}","${displayName(s)}","${s.dob || ""}","${s.class_section || ""}","${
          s.guardian_name ? `${s.guardian_name} (${s.guardian_relation || ""}) ${s.guardian_phone}` : ""
        }","${s.status || "Active"}"`
    );
    const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student_directory_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <>
      <DashboardHeader
        title="Manage Students"
        subtitle="View, filter, and manage student records across all grades."
        action={
          <>
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#c3c6d7] bg-white px-4 py-2 text-sm font-semibold text-[#191c1e] shadow-sm transition-colors hover:bg-[#f7f9fb]"
            >
              <svg className="h-4 w-4 text-[#434655]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#004ac6] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#003cb0]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </button>
          </>
        }
      />

      {/* Top Stat Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Students"
          value={String(students.length)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
          }
          accent="blue"
        />
        <StatCard
          label="Active Enrollments"
          value={String(students.filter((s) => s.status === "Active").length)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          accent="green"
        />
        <StatCard
          label="Visible in View"
          value={String(filtered.length)}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          accent="amber"
        />
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-[0px_1px_2px_#0000000d]">
        {/* Filters and Search Bar Row */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border border-[#c3c6d7] bg-white px-3 py-2 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none"
            >
              <option value="All Classes">All Classes</option>
              <option value="Grade 9 - B">Grade 9 - B</option>
              <option value="Grade 10 - A">Grade 10 - A</option>
              <option value="Grade 11 - Sci">Grade 11 - Sci</option>
              <option value="Grade 11 - Com">Grade 11 - Com</option>
              <option value="Grade 12 - Arts">Grade 12 - Arts</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-lg border border-[#c3c6d7] bg-white px-3 py-2 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div className="relative flex-1 sm:max-w-xs">
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
              placeholder="Filter this list..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[#c3c6d7] bg-white py-2 pl-9 pr-4 text-sm text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
            />
          </div>
        </div>

        {/* Selected Items Bulk Action Banner */}
        {selectedIds.length > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 px-4 py-2 text-xs font-semibold text-[#004ac6]">
            <span>{selectedIds.length} student(s) selected</span>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete ${selectedIds.length} selected students?`)) {
                  setStudents((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
                  setSelectedIds([]);
                }
              }}
              className="text-rose-600 hover:underline"
            >
              Delete Selected
            </button>
          </div>
        )}

        {/* Directory Table */}
        {loading ? (
          <div className="py-12 text-center text-sm text-[#434655]">Loading student records...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-[#434655]">No students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eceef0] text-[11px] font-bold tracking-wider text-[#434655] uppercase">
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === filtered.length && filtered.length > 0}
                      className="rounded border-gray-300 text-[#004ac6] focus:ring-[#004ac6]"
                    />
                  </th>
                  <th className="py-3 px-3">Student ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Class / Section</th>
                  <th className="py-3 px-3">Guardian Contact</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const name = displayName(s);
                  const isChecked = selectedIds.includes(s.id);

                  return (
                    <tr
                      key={s.id}
                      className="border-b border-[#f0f1f3] text-sm transition-colors last:border-0 hover:bg-[#f7f9fb]"
                    >
                      <td className="py-3 px-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSelectOne(s.id)}
                          className="rounded border-gray-300 text-[#004ac6] focus:ring-[#004ac6]"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono text-xs font-semibold text-[#434655]">
                        #{s.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          {s.avatar_url ? (
                            <img
                              src={s.avatar_url}
                              alt={name}
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#004ac6]">
                              {initials(name)}
                            </span>
                          )}
                          <div>
                            <p className="font-semibold text-[#191c1e]">{name}</p>
                            <p className="text-[11px] text-[#434655]">
                              DOB: {s.dob || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-medium text-[#191c1e]">
                        {s.class_section || "Unassigned"}
                      </td>
                      <td className="py-3 px-3">
                        {s.guardian_name ? (
                          <div>
                            <p className="text-xs font-medium text-[#191c1e]">
                              {s.guardian_name}{" "}
                              {s.guardian_relation && `(${s.guardian_relation})`}
                            </p>
                            <p className="text-[11px] text-[#434655]">{s.guardian_phone}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-[#434655]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2 text-[#434655]">
                          <button
                            type="button"
                            title="View Profile"
                            className="rounded p-1 hover:bg-gray-100 hover:text-[#004ac6]"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            title="Edit Student"
                            className="rounded p-1 hover:bg-gray-100 hover:text-[#004ac6]"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 210.3H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(s.id)}
                            title="Delete Student"
                            className="rounded p-1 hover:bg-rose-50 hover:text-rose-600"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer Pagination Controls */}
        <div className="mt-4 flex flex-col gap-3 pt-3 border-t border-[#eceef0] sm:flex-row sm:items-center sm:justify-between text-xs text-[#434655]">
          <p>
            Showing <span className="font-semibold text-[#191c1e]">1</span> to{" "}
            <span className="font-semibold text-[#191c1e]">{filtered.length}</span> of{" "}
            <span className="font-semibold text-[#191c1e]">{students.length}</span> students
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="rounded p-1 text-gray-300 cursor-not-allowed"
            >
              ‹
            </button>
            <button
              type="button"
              className="h-7 w-7 rounded bg-[#004ac6] text-xs font-semibold text-white"
            >
              1
            </button>
            <button
              type="button"
              className="h-7 w-7 rounded text-xs font-medium text-[#434655] hover:bg-gray-100"
            >
              2
            </button>
            <button
              type="button"
              className="h-7 w-7 rounded text-xs font-medium text-[#434655] hover:bg-gray-100"
            >
              3
            </button>
            <span className="px-1 text-gray-400">...</span>
            <button
              type="button"
              className="h-7 w-7 rounded text-xs font-medium text-[#434655] hover:bg-gray-100"
            >
              25
            </button>
            <button
              type="button"
              className="rounded p-1 text-[#434655] hover:bg-gray-100"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#eceef0]">
              <h3 className="text-lg font-bold text-[#191c1e]">Add New Student</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#434655] hover:text-[#191c1e]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#434655]">First Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.first_name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, first_name: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#434655]">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.last_name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, last_name: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#434655]">Date of Birth</label>
                  <input
                    type="text"
                    placeholder="e.g. 12 May 2008"
                    value={newStudent.dob}
                    onChange={(e) => setNewStudent({ ...newStudent, dob: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#434655]">Class / Section</label>
                  <select
                    value={newStudent.class_section}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, class_section: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  >
                    <option value="Grade 9 - B">Grade 9 - B</option>
                    <option value="Grade 10 - A">Grade 10 - A</option>
                    <option value="Grade 11 - Sci">Grade 11 - Sci</option>
                    <option value="Grade 11 - Com">Grade 11 - Com</option>
                    <option value="Grade 12 - Arts">Grade 12 - Arts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-[#434655]">Guardian Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.guardian_name}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, guardian_name: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#434655]">Relation</label>
                  <select
                    value={newStudent.guardian_relation}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, guardian_relation: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Guardian">Guardian</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#434655]">Guardian Phone</label>
                  <input
                    type="text"
                    value={newStudent.guardian_phone}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, guardian_phone: e.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#434655]">Status</label>
                  <select
                    value={newStudent.status}
                    onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#c3c6d7] p-2 text-sm text-[#191c1e]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-[#eceef0]">
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
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}