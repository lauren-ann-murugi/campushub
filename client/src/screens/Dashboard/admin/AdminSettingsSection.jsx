"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Globe,
  Lock,
  Pencil,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Info,
} from "lucide-react";



const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export function AdminSettingsSection() {
  // --- Personal Info State ---
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "Chief Administrator",
    avatarUrl: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const fileInputRef = useRef(null);

  // --- Security State ---
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // --- Notifications State ---
  const [notifications, setNotifications] = useState({
    systemAlerts: true,
    newAdmissions: false,
    dailyReports: true,
  });

  // --- Global Settings State ---
  const [globalSettings, setGlobalSettings] = useState({
    academicYear: "2024 - 2025",
    timezone: "UTC-5 (Eastern Time)",
  });
  const [savingGlobal, setSavingGlobal] = useState(false);

  // 1. Fetch real admin settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      setProfileLoading(true);
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
        const response = await fetch(`${API_BASE_URL}/admin/settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.personalInfo) setPersonalInfo(data.personalInfo);
          if (data.notifications) setNotifications(data.notifications);
          if (data.globalSettings) setGlobalSettings(data.globalSettings);
          if (data.is2FAEnabled !== undefined) setIs2FAEnabled(data.is2FAEnabled);
        }
      } catch (err) {
        console.warn("Could not fetch settings from API, using default input state.", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 2. Handle Personal Info Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess("");
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const response = await fetch(`${API_BASE_URL}/admin/settings/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(personalInfo),
      });

      if (!response.ok) throw new Error("Failed to update profile information.");
      setProfileSuccess("Personal information updated successfully!");
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // 3. Handle Avatar File Change
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const response = await fetch(`${API_BASE_URL}/admin/settings/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPersonalInfo((prev) => ({ ...prev, avatarUrl: data.avatarUrl }));
      }
    } catch (err) {
      console.error("Failed to upload avatar", err);
    }
  };

  // 4. Handle Password Update
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }

    setSavingPassword(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      const response = await fetch(`${API_BASE_URL}/admin/settings/password`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update password.");
      }

      setPasswordSuccess("Password updated successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  // 5. Handle Notification Toggles
  const handleToggleNotification = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      await fetch(`${API_BASE_URL}/admin/settings/notifications`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Failed to update notification preference", err);
    }
  };

  // 6. Handle Global Settings Update
  const handleGlobalSettingsChange = async (key, value) => {
    const updated = { ...globalSettings, [key]: value };
    setGlobalSettings(updated);
    setSavingGlobal(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
      await fetch(`${API_BASE_URL}/admin/settings/global`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error("Failed to save global settings", err);
    } finally {
      setSavingGlobal(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="text-sm font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your profile, security preferences, and system-wide configurations.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns: Personal Info & Security */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Personal Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Top Banner Gradient */}
            <div className="h-28 bg-gradient-to-r from-blue-500 via-indigo-400 to-indigo-200 relative">
              <div className="px-6 pt-5">
                <h2 className="text-lg font-bold text-slate-900 font-serif">
                  Personal Information
                </h2>
              </div>

              {/* Avatar Container with Edit Button */}
              <div className="absolute left-6 -bottom-10 flex items-end gap-3">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-sm">
                    {personalInfo.avatarUrl ? (
                      <img
                        src={personalInfo.avatarUrl}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-700 text-white flex items-center justify-center text-xl font-bold">
                        {personalInfo.firstName ? personalInfo.firstName.charAt(0) : "S"}
                        {personalInfo.lastName ? personalInfo.lastName.charAt(0) : "J"}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-colors"
                  >
                    <Pencil size={12} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Allowed file formats text aligned with avatar */}
            <div className="pt-3 pb-2 px-6 flex items-center justify-start pl-28">
              <span className="text-[11px] font-medium text-slate-400">
                Allowed: JPG, PNG
              </span>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSaveProfile} className="p-6 pt-2 space-y-4">
              {profileSuccess && (
                <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200">
                  <CheckCircle2 size={16} />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={personalInfo.firstName}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, firstName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={personalInfo.lastName}
                    onChange={(e) =>
                      setPersonalInfo({ ...personalInfo, lastName: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={personalInfo.email}
                  onChange={(e) =>
                    setPersonalInfo({ ...personalInfo, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role/Title
                </label>
                <input
                  type="text"
                  readOnly
                  value={personalInfo.role}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 bg-slate-100 cursor-not-allowed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-5 py-2.5 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {savingProfile && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Security & Password */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lock size={18} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Security & Password
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Password Change Form */}
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                {passwordError && (
                  <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg border border-red-200">
                    <AlertCircle size={15} />
                    <span>{passwordError}</span>
                  </div>
                )}
                {passwordSuccess && (
                  <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200">
                    <CheckCircle2 size={15} />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, currentPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirmPassword: e.target.value })
                    }
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors disabled:opacity-50"
                >
                  {savingPassword && <Loader2 size={14} className="animate-spin" />}
                  <span>Update Password</span>
                </button>
              </form>

              {/* Two-Factor Authentication Box */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Add an extra layer of security.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {is2FAEnabled
                    ? "Two-Factor Authentication is currently enabled for your account."
                    : "Currently disabled. We highly recommend enabling 2FA for administrative accounts."}
                </p>

                <button
                  type="button"
                  onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                  className="w-full sm:w-auto px-4 py-2 border border-slate-300 bg-white text-blue-700 hover:bg-slate-50 text-xs font-semibold rounded-lg shadow-2xs transition-colors"
                >
                  {is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Notifications & Global Settings */}
        <div className="space-y-6">
          
          {/* Card 3: Notifications */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Bell size={18} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Notifications
              </h2>
            </div>

            <div className="space-y-5">
              {/* Toggle 1: System Alerts */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">System Alerts</h3>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Critical system updates and downtime notices.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification("systemAlerts")}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.systemAlerts ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      notifications.systemAlerts ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: New Admissions */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">New Admissions</h3>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Notify when a new student application is submitted.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification("newAdmissions")}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.newAdmissions ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      notifications.newAdmissions ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Daily Reports */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-800">Daily Reports</h3>
                  <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                    Receive automated attendance and fee summaries.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification("dailyReports")}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.dailyReports ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      notifications.dailyReports ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Global Settings */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Globe size={18} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Global Settings
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year
                </label>
                <select
                  value={globalSettings.academicYear}
                  onChange={(e) =>
                    handleGlobalSettingsChange("academicYear", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2023 - 2024">2023 - 2024</option>
                  <option value="2024 - 2025">2024 - 2025</option>
                  <option value="2025 - 2026">2025 - 2026</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Timezone
                </label>
                <select
                  value={globalSettings.timezone}
                  onChange={(e) =>
                    handleGlobalSettingsChange("timezone", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
                  <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
                  <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
                  <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                </select>
              </div>

              {/* Note Banner */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-start gap-2">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-900 leading-snug">
                  Global settings changes require a super-admin confirmation token.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminSettingsSection;