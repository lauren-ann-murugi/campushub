"use client";

import React, { useState, useEffect, useRef } from "react";

export function ProfileSection() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddGuardian, setShowAddGuardian] = useState(false);

  // Form edit state
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    program: "",
    gradeYear: "",
    enrollmentDate: "",
    academicStanding: "",
    email: "",
    phone: "",
    address: "",
    guardians: [],
  });

  // Guardian form state
  const [newGuardian, setNewGuardian] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/student/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
        setFormData(data);
      } catch (err) {
        // Fallback default data structured exactly matching the provided design image
        const initialData = {
          fullName: "Alex Mercer",
          studentId: "2024-89X1",
          avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
          program: "B.Sc. Computer Science",
          gradeYear: "Junior (3rd Year)",
          enrollmentDate: "September 1, 2022",
          academicStanding: "Good Standing",
          email: "a.mercer@campushub.edu",
          phone: "+1 (555) 123-4567",
          address: "North Campus Dorms, Room 402\nUniversity City, ST 12345",
          guardians: [
            {
              id: "g1",
              name: "Sarah Mercer",
              relationship: "Mother / Primary Contact",
              phone: "+1 (555) 987-6543",
              email: "s.mercer@example.com",
              initials: "SM",
            },
          ],
        };
        setProfile(initialData);
        setFormData(initialData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updated = await res.json();
      setProfile(updated);
    } catch (err) {
      // Local fallback sync
      setProfile(formData);
    } finally {
      setSaving(false);
      setIsEditing(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatarUrl: imageUrl }));
    setProfile((prev) => ({ ...prev, avatarUrl: imageUrl }));
  };

  const handleAddGuardian = (e) => {
    e.preventDefault();
    if (!newGuardian.name) return;

    const initials = newGuardian.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const guardianObj = {
      id: Date.now().toString(),
      ...newGuardian,
      initials: initials || "G",
    };

    const updatedGuardians = [...(profile.guardians || []), guardianObj];
    setProfile((prev) => ({ ...prev, guardians: updatedGuardians }));
    setFormData((prev) => ({ ...prev, guardians: updatedGuardians }));
    setNewGuardian({ name: "", relationship: "", phone: "", email: "" });
    setShowAddGuardian(false);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500">
        Loading profile info...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-2 sm:p-4">
      {/* Top Banner Header / Profile Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <img
                src={profile?.avatarUrl}
                alt={profile?.fullName}
                className="h-24 w-24 rounded-full border-2 border-white object-cover shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                {profile?.fullName}
              </h2>
              <div className="flex items-center justify-center gap-1.5 text-sm text-slate-500 sm:justify-start">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" />
                </svg>
                <span>Student ID: {profile?.studentId}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center justify-center rounded-xl bg-[#004ac6] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#003899] shadow-sm active:scale-[0.98]"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Grid: Academic Details & Contact Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Academic Details Section (2 cols) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center gap-2.5">
            <svg className="h-5 w-5 text-[#004ac6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Academic Details
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200/80 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Program
              </p>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">
                {profile?.program}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Current Grade / Year
              </p>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">
                {profile?.gradeYear}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Enrollment Date
              </p>
              <p className="mt-1.5 text-sm font-semibold text-slate-900">
                {profile?.enrollmentDate}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Academic Standing
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  {profile?.academicStanding}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info Section (1 col) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2.5">
            <svg className="h-5 w-5 text-[#004ac6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" />
            </svg>
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Contact
            </h3>
          </div>

          <div className="space-y-4 text-xs text-slate-600">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Institutional Email</p>
                <p className="text-xs font-semibold text-slate-800">{profile?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Phone Number</p>
                <p className="text-xs font-semibold text-slate-800">{profile?.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Term Address</p>
                <p className="whitespace-pre-line text-xs font-semibold text-slate-800">
                  {profile?.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guardian Information Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2.5">
          <svg className="h-5 w-5 text-[#004ac6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-base font-bold text-slate-900 font-serif">
            Guardian Information
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {profile?.guardians?.map((g) => (
            <div
              key={g.id || g.name}
              className="flex items-start gap-4 rounded-xl border border-slate-200/80 p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400 font-bold text-white shadow-sm">
                {g.initials}
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-sm font-bold text-slate-900">{g.name}</p>
                <p className="text-[#64748b]">{g.relationship}</p>
                <div className="pt-2 space-y-1 text-slate-600">
                  <p className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {g.phone}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {g.email}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Add Secondary Guardian Card */}
          <button
            type="button"
            onClick={() => setShowAddGuardian(true)}
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 p-6 text-center transition-colors hover:border-slate-300 hover:bg-slate-50/50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="mt-2 text-xs font-bold text-slate-800">
              Add Secondary Guardian
            </p>
            <p className="mt-1 text-[11px] text-slate-500 max-w-xs">
              Add another contact for emergency or administrative purposes.
            </p>
          </button>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                Edit Profile Information
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#004ac6] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Program</label>
                  <input
                    type="text"
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#004ac6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Grade / Year</label>
                  <input
                    type="text"
                    name="gradeYear"
                    value={formData.gradeYear}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#004ac6] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#004ac6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Institutional Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-slate-50 text-slate-500"
                    disabled
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Term Address</label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#004ac6] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#004ac6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#003899] disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD SECONDARY GUARDIAN MODAL */}
      {showAddGuardian && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Add Secondary Guardian
              </h3>
              <button
                type="button"
                onClick={() => setShowAddGuardian(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGuardian} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  value={newGuardian.name}
                  onChange={(e) => setNewGuardian({ ...newGuardian, name: e.target.value })}
                  placeholder="e.g. Robert Mercer"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#004ac6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Relationship</label>
                <input
                  type="text"
                  required
                  value={newGuardian.relationship}
                  onChange={(e) => setNewGuardian({ ...newGuardian, relationship: e.target.value })}
                  placeholder="e.g. Father / Secondary Contact"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#004ac6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newGuardian.phone}
                  onChange={(e) => setNewGuardian({ ...newGuardian, phone: e.target.value })}
                  placeholder="e.g. +1 (555) 111-2222"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#004ac6] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  required
                  value={newGuardian.email}
                  onChange={(e) => setNewGuardian({ ...newGuardian, email: e.target.value })}
                  placeholder="e.g. r.mercer@example.com"
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#004ac6] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddGuardian(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#004ac6] px-4 py-2 text-xs font-semibold text-white hover:bg-[#003899]"
                >
                  Save Guardian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}