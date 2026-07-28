"use client";

import React, { useState, useEffect } from "react";
import { DashboardHeader, PanelCard, Badge } from "../DashboardLayout";
import { ClockIcon, MapPinIcon } from "../../../components/icons";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const DEFAULT_TIMETABLE = {
  Monday: [
    { time: "08:00 - 09:30", subject: "English Literature", room: "Room 12", teacher: "Ms. Bello", color: "#004ac6" },
    { time: "10:00 - 11:30", subject: "Mathematics 201", room: "Room 7", teacher: "Mr. Adeyemi", color: "#006c49" },
    { time: "12:30 - 14:00", subject: "Biology", room: "Lab 3", teacher: "Dr. Eze", color: "#f59e0b" },
    { time: "14:30 - 16:00", subject: "Self Study", room: "Library", teacher: "—", color: "#434655" },
  ],
  Tuesday: [
    { time: "08:00 - 09:30", subject: "Computer Science", room: "Lab 1", teacher: "Mr. Okafor", color: "#7c3aed" },
    { time: "10:00 - 11:30", subject: "Physics", room: "Room 5", teacher: "Dr. Ojo", color: "#0891b2" },
    { time: "12:30 - 14:00", subject: "Mathematics 201", room: "Room 7", teacher: "Mr. Adeyemi", color: "#006c49" },
  ],
  Wednesday: [
    { time: "08:00 - 09:30", subject: "English Literature", room: "Room 12", teacher: "Ms. Bello", color: "#004ac6" },
    { time: "10:00 - 11:30", subject: "Mathematics 201", room: "Room 7", teacher: "Mr. Adeyemi", color: "#006c49" },
    { time: "12:30 - 14:00", subject: "Computer Science", room: "Lab 1", teacher: "Mr. Okafor", color: "#7c3aed" },
    { time: "14:30 - 16:00", subject: "Physical Education", room: "Gym", teacher: "Coach Bello", color: "#0891b2" },
  ],
  Thursday: [
    { time: "08:00 - 09:30", subject: "Biology", room: "Lab 3", teacher: "Dr. Eze", color: "#f59e0b" },
    { time: "10:00 - 11:30", subject: "English Literature", room: "Room 12", teacher: "Ms. Bello", color: "#004ac6" },
    { time: "12:30 - 14:00", subject: "Physics", room: "Room 5", teacher: "Dr. Ojo", color: "#0891b2" },
  ],
  Friday: [
    { time: "08:00 - 09:30", subject: "Computer Science", room: "Lab 1", teacher: "Mr. Okafor", color: "#7c3aed" },
    { time: "10:00 - 11:30", subject: "Mathematics 201", room: "Room 7", teacher: "Mr. Adeyemi", color: "#006c49" },
    { time: "12:30 - 14:00", subject: "Biology", room: "Lab 3", teacher: "Dr. Eze", color: "#f59e0b" },
    { time: "14:30 - 16:00", subject: "Club Activity", room: "Hall A", teacher: "—", color: "#434655" },
  ],
};

const SUBJECT_LIST = [
  { name: "Mathematics 201", color: "#006c49" },
  { name: "English Literature", color: "#004ac6" },
  { name: "Computer Science", color: "#7c3aed" },
  { name: "Biology", color: "#f59e0b" },
  { name: "Physics", color: "#0891b2" },
];

export function TimetableSection() {
  const [day, setDay] = useState("Monday");
  const [timetable, setTimetable] = useState(DEFAULT_TIMETABLE);
  const [loading, setLoading] = useState(true);

  // Load timetable dynamically from Python Backend API
  useEffect(() => {
    async function loadTimetable() {
      try {
        const res = await fetch("/api/timetable");
        if (res.ok) {
          const data = await res.json();
          if (data && Object.keys(data).length > 0) {
            setTimetable(data);
          }
        }
      } catch (err) {
        // Fallback silently to default timetable state
      } finally {
        setLoading(false);
      }
    }

    loadTimetable();
  }, []);

  const slots = timetable[day] || [];

  return (
    <>
      <DashboardHeader
        title="Timetable"
        subtitle="Your weekly class schedule for this term."
      />

      {/* Day Selector Buttons */}
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
        {/* Classes List Card */}
        <div className="lg:col-span-2">
          <PanelCard title={`${day}'s Classes`}>
            {loading ? (
              <div className="flex items-center justify-center py-12 text-sm text-[#434655]">
                Loading timetable...
              </div>
            ) : slots.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#434655]">
                No classes scheduled for {day}.
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {slots.map((s, i) => (
                  <li
                    key={i}
                    className="flex flex-col gap-3 rounded-xl border border-[#e6e8ea] p-4 transition-colors hover:border-[#c3c6d7] sm:flex-row sm:items-center"
                  >
                    <span
                      className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white"
                      style={{ backgroundColor: s.color || "#004ac6" }}
                    >
                      {s.time.split(" - ")[0]}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#191c1e]">{s.subject}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#434655]">
                        <span className="flex items-center gap-1">
                          <ClockIcon className="h-3.5 w-3.5" /> {s.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPinIcon className="h-3.5 w-3.5" /> {s.room}
                        </span>
                        <span>{s.teacher}</span>
                      </div>
                    </div>
                    <span
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: s.color || "#004ac6" }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </PanelCard>
        </div>

        {/* Sidebar Summary */}
        <div>
          <PanelCard title="Weekly Overview">
            <ul className="flex flex-col gap-3">
              {DAYS.map((d) => {
                const count = timetable[d] ? timetable[d].length : 0;
                return (
                  <li key={d} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#191c1e]">{d}</span>
                    <Badge variant={count >= 4 ? "blue" : "gray"}>
                      {count} classes
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </PanelCard>

          <div className="mt-6 rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-[0px_1px_2px_#0000000d]">
            <h3 className="text-sm font-semibold text-[#191c1e]">Subjects This Term</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {SUBJECT_LIST.map((s) => (
                <li key={s.name} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-[#434655]">{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}