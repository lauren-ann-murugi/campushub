"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader, PanelCard, Badge } from "../DashboardLayout";
import {
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
  AlertCircleIcon,
} from "../../../components/icons";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const INITIAL_TIMETABLE = {
  Monday: [
    { id: "t1", time: "08:00 AM - 09:30 AM", subject: "Mathematics", class: "JSS 3A", room: "Room 7", students: 32, color: "#004ac6" },
    { id: "t2", time: "10:00 AM - 11:30 AM", subject: "Mathematics", class: "SS 2B", room: "Room 12", students: 28, color: "#006c49" },
    { id: "t3", time: "01:00 PM - 02:30 PM", subject: "Mathematics", class: "SS 1A", room: "Room 9", students: 30, color: "#f59e0b" },
  ],
  Tuesday: [
    { id: "t4", time: "08:00 AM - 09:30 AM", subject: "Mathematics", class: "SS 2B", room: "Room 12", students: 28, color: "#006c49" },
    { id: "t5", time: "10:00 AM - 11:30 AM", subject: "Mathematics", class: "JSS 3A", room: "Room 7", students: 32, color: "#004ac6" },
  ],
  Wednesday: [
    { id: "t6", time: "08:00 AM - 09:30 AM", subject: "Mathematics", class: "SS 1A", room: "Room 9", students: 30, color: "#f59e0b" },
    { id: "t7", time: "10:00 AM - 11:30 AM", subject: "Mathematics", class: "JSS 3A", room: "Room 7", students: 32, color: "#004ac6" },
    { id: "t8", time: "01:00 PM - 02:30 PM", subject: "Mathematics", class: "SS 2B", room: "Room 12", students: 28, color: "#006c49" },
  ],
  Thursday: [
    { id: "t9", time: "08:00 AM - 09:30 AM", subject: "Mathematics", class: "SS 2B", room: "Room 12", students: 28, color: "#006c49" },
    { id: "t10", time: "10:00 AM - 11:30 AM", subject: "Mathematics", class: "SS 1A", room: "Room 9", students: 30, color: "#f59e0b" },
  ],
  Friday: [
    { id: "t11", time: "08:00 AM - 09:30 AM", subject: "Mathematics", class: "JSS 3A", room: "Room 7", students: 32, color: "#004ac6" },
    { id: "t12", time: "10:00 AM - 11:30 AM", subject: "Mathematics", class: "SS 1A", room: "Room 9", students: 30, color: "#f59e0b" },
    { id: "t13", time: "01:00 PM - 02:30 PM", subject: "Mathematics", class: "SS 2B", room: "Room 12", students: 28, color: "#006c49" },
  ],
};

const COLOR_OPTIONS = [
  { label: "Blue", value: "#004ac6" },
  { label: "Green", value: "#006c49" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Red", value: "#dc2626" },
];

export function TeacherTimetableSection() {
  const [timetable, setTimetable] = useState(INITIAL_TIMETABLE);
  const [day, setDay] = useState("Monday");
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null); // null if creating new
  
  // Form State
  const [formSubject, setFormSubject] = useState("");
  const [formClass, setFormClass] = useState("");
  const [formRoom, setFormRoom] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formStudents, setFormStudents] = useState(30);
  const [formColor, setFormColor] = useState("#004ac6");
  const [formError, setFormError] = useState(null);

  // Load timetable dynamically from Python Backend API
  useEffect(() => {
    async function loadTimetable() {
      try {
        setLoading(true);
        const res = await fetch("/api/teacher/timetable");
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data === "object") {
            setTimetable(data);
          }
        }
      } catch (err) {
        // Silently fallback to preset timetable when server offline
      } finally {
        setLoading(false);
      }
    }
    loadTimetable();
  }, []);

  const slots = timetable[day] || [];

  // Open modal for Adding new Slot
  const handleOpenAdd = () => {
    setEditingSlot(null);
    setFormSubject("Mathematics");
    setFormClass("JSS 3A");
    setFormRoom("Room 1");
    setFormTime("08:00 AM - 09:30 AM");
    setFormStudents(30);
    setFormColor("#004ac6");
    setFormError(null);
    setShowModal(true);
  };

  // Open modal for Editing Slot
  const handleOpenEdit = (slot) => {
    setEditingSlot(slot);
    setFormSubject(slot.subject);
    setFormClass(slot.class);
    setFormRoom(slot.room);
    setFormTime(slot.time);
    setFormStudents(slot.students);
    setFormColor(slot.color || "#004ac6");
    setFormError(null);
    setShowModal(true);
  };

  // Delete a class slot
  const handleDeleteSlot = async (slotId) => {
    const updatedDaySlots = timetable[day].filter((s) => s.id !== slotId);
    const updatedTimetable = { ...timetable, [day]: updatedDaySlots };
    setTimetable(updatedTimetable);

    try {
      await fetch(`/api/teacher/timetable/${slotId}`, {
        method: "DELETE",
      });
    } catch (err) {
      // Local state active fallback
    }
  };

  // Save changes (Add or Update)
  const handleSaveSlot = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formSubject.trim() || !formClass.trim() || !formRoom.trim() || !formTime.trim()) {
      setFormError("All fields are required.");
      return;
    }

    const payload = {
      id: editingSlot ? editingSlot.id : `t_${Date.now()}`,
      subject: formSubject.trim(),
      class: formClass.trim(),
      room: formRoom.trim(),
      time: formTime.trim(),
      students: Number(formStudents) || 0,
      color: formColor,
    };

    let updatedDaySlots = [];
    if (editingSlot) {
      updatedDaySlots = timetable[day].map((s) => (s.id === editingSlot.id ? payload : s));
    } else {
      updatedDaySlots = [...timetable[day], payload];
    }

    const updatedTimetable = { ...timetable, [day]: updatedDaySlots };
    setTimetable(updatedTimetable);

    try {
      await fetch("/api/teacher/timetable", {
        method: editingSlot ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, slot: payload }),
      });
    } catch (err) {
      // Keep UI responsive even if server fails
    }

    setShowModal(false);
  };

  return (
    <>
      <DashboardHeader
        title="Timetable"
        subtitle="Your teaching schedule for the week."
        action={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-[#004ac6] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#003ba6]"
          >
            <PlusIcon className="h-4 w-4" /> Add Class Slot
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {DAYS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setDay(d)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              day === d
                ? "bg-[#004ac6] text-white"
                : "border border-[#e6e8ea] bg-white text-[#434655] hover:bg-[#f7f9fb]"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PanelCard title={`${day}'s Classes`}>
            {loading ? (
              <div className="py-12 text-center text-sm text-[#434655]">
                Loading timetable...
              </div>
            ) : slots.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#434655]">
                No classes scheduled for {day}.
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {slots.map((s) => (
                  <li
                    key={s.id || s.time}
                    className="group relative flex flex-col gap-3 rounded-xl border border-[#e6e8ea] p-4 sm:flex-row sm:items-center"
                  >
                    <span
                      className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold text-white px-1 text-center"
                      style={{ backgroundColor: s.color || "#004ac6" }}
                    >
                      {s.time.split(" - ")[0]}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#191c1e]">
                        {s.subject} — {s.class}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#434655]">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-3.5 w-3.5" /> {s.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-3.5 w-3.5" /> {s.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <UsersIcon className="h-3.5 w-3.5" /> {s.students} students
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(s)}
                        className="rounded-md p-1.5 text-[#434655] hover:bg-[#f7f9fb] hover:text-[#004ac6] transition-colors"
                        title="Edit slot"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSlot(s.id)}
                        className="rounded-md p-1.5 text-[#434655] hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete slot"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      <span
                        className="h-3 w-3 rounded-full hidden sm:inline-block ml-1"
                        style={{ backgroundColor: s.color || "#004ac6" }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </PanelCard>
        </div>

        <div>
          <PanelCard title="Weekly Overview">
            <ul className="flex flex-col gap-3">
              {DAYS.map((d) => (
                <li key={d} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#191c1e]">{d}</span>
                  <Badge variant={(timetable[d] || []).length >= 3 ? "blue" : "gray"}>
                    {(timetable[d] || []).length} classes
                  </Badge>
                </li>
              ))}
            </ul>
          </PanelCard>

          <div className="mt-6 rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-[0px_1px_2px_#0000000d]">
            <h3 className="text-sm font-semibold text-[#191c1e]">My Assigned Classes</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {[
                { name: "JSS 3A", color: "#004ac6" },
                { name: "SS 2B", color: "#006c49" },
                { name: "SS 1A", color: "#f59e0b" },
              ].map((c) => (
                <li key={c.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-sm text-[#434655]">{c.name} — Mathematics</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Add / Edit Timetable Slot Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#191c1e]">
                {editingSlot ? `Edit Class (${day})` : `Add Class Slot (${day})`}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-[#434655] hover:text-[#191c1e]"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                <AlertCircleIcon className="h-4 w-4" /> {formError}
              </div>
            )}

            <form onSubmit={handleSaveSlot} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tt-subject" className="text-sm font-medium text-[#191c1e]">
                    Subject
                  </label>
                  <input
                    id="tt-subject"
                    type="text"
                    required
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="rounded-lg border border-[#c3c6d7] bg-white px-3 py-2 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tt-class" className="text-sm font-medium text-[#191c1e]">
                    Class
                  </label>
                  <input
                    id="tt-class"
                    type="text"
                    required
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    placeholder="e.g. JSS 3A"
                    className="rounded-lg border border-[#c3c6d7] bg-white px-3 py-2 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tt-room" className="text-sm font-medium text-[#191c1e]">
                    Room
                  </label>
                  <input
                    id="tt-room"
                    type="text"
                    required
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="e.g. Room 7"
                    className="rounded-lg border border-[#c3c6d7] bg-white px-3 py-2 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="tt-students" className="text-sm font-medium text-[#191c1e]">
                    Students Count
                  </label>
                  <input
                    id="tt-students"
                    type="number"
                    min="1"
                    required
                    value={formStudents}
                    onChange={(e) => setFormStudents(e.target.value)}
                    className="rounded-lg border border-[#c3c6d7] bg-white px-3 py-2 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="tt-time" className="text-sm font-medium text-[#191c1e]">
                  Time Slot (AM/PM)
                </label>
                <input
                  id="tt-time"
                  type="text"
                  required
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  placeholder="e.g. 08:00 AM - 09:30 AM"
                  className="rounded-lg border border-[#c3c6d7] bg-white px-3 py-2 text-sm text-[#191c1e] focus:border-[#004ac6] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#191c1e]">
                  Color Accent
                </label>
                <div className="flex items-center gap-3">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setFormColor(c.value)}
                      className={`h-7 w-7 rounded-full transition-transform ${
                        formColor === c.value ? "scale-125 ring-2 ring-offset-2 ring-[#004ac6]" : ""
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 rounded-lg border border-[#c3c6d7] py-2 text-sm font-medium text-[#434655] transition-colors hover:bg-[#f7f9fb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 rounded-lg bg-[#004ac6] py-2 text-sm font-medium text-white transition-colors hover:bg-[#003ba6]"
                >
                  {editingSlot ? "Update Slot" : "Add Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}