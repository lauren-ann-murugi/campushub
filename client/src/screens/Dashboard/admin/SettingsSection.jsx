"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { adminService } from "@/services/adminService";
import {
  AlertTriangle,
  Bell,
  Building2,
  CalendarRange,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  LogOut,
  RotateCcw,
  Save,
  ShieldCheck,
} from "lucide-react";

const ACADEMIC_YEARS = ["2024/2025", "2025/2026", "2026/2027"];
const TERMS = ["Term 1", "Term 2", "Term 3"];
const TIMEZONES = ["Africa/Nairobi", "Africa/Lagos", "Europe/London", "UTC"];

const PROFILE_FIELDS = [
  "school_name",
  "school_email",
  "school_phone",
  "school_address",
  "academic_year",
  "current_term",
  "timezone",
];

const NOTIFICATION_FIELDS = [
  {
    key: "email_notifications",
    label: "Email notifications",
    description: "Send admissions, fees and results updates by email",
  },
  {
    key: "sms_notifications",
    label: "SMS notifications",
    description: "Text urgent alerts to staff and guardians",
  },
  {
    key: "push_notifications",
    label: "Push notifications",
    description: "Show in-app alerts in the notification bell",
  },
  {
    key: "weekly_digest",
    label: "Weekly digest",
    description: "Email a Monday summary of campus activity",
  },
];

const SECURITY_FIELDS = [
  {
    key: "two_factor_required",
    label: "Require email verification code",
    description: "Every sign-in must be confirmed with a 6-digit code",
  },
  {
    key: "allow_self_registration",
    label: "Allow self registration",
    description: "Let students and teachers create their own accounts",
  },
  {
    key: "maintenance_mode",
    label: "Maintenance mode",
    description: "Temporarily block portal access for non-administrators",
  },
];

const DEFAULT_SETTINGS = {
  school_name: "",
  school_email: "",
  school_phone: "",
  school_address: "",
  academic_year: ACADEMIC_YEARS[1],
  current_term: TERMS[0],
  timezone: TIMEZONES[0],
  email_notifications: true,
  sms_notifications: false,
  push_notifications: true,
  weekly_digest: true,
  two_factor_required: true,
  allow_self_registration: true,
  maintenance_mode: false,
  session_timeout_minutes: 30,
};

function Toggle({ checked, disabled, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-[#2563eb]" : "bg-[#d1d5db]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function SettingsCard({ title, description, icon: Icon, children, footer }) {
  return (
    <section className="rounded-2xl border border-[#e5e7eb] bg-white shadow-xs">
      <header className="flex items-start gap-3 border-b border-[#f3f4f6] p-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eff6ff] text-[#2563eb]">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-[#111827]">{title}</h2>
          <p className="text-xs text-[#6b7280]">{description}</p>
        </div>
      </header>
      <div className="p-5">{children}</div>
      {footer && (
        <footer className="flex items-center justify-end gap-3 border-t border-[#f3f4f6] bg-[#f9fafb] px-5 py-4">
          {footer}
        </footer>
      )}
    </section>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-semibold text-[#374151]">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#e5e7eb] bg-white px-3.5 py-2.5 text-sm text-[#111827] placeholder-[#9ca3af] outline-none transition-all focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20";

export function AdminSettingsSection() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [saved, setSaved] = useState(DEFAULT_SETTINGS);
  const [form, setForm] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingSecurity, setSavingSecurity] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(null);
  const [status, setStatus] = useState({ type: null, message: "" });

  // Password form
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState({ type: null, message: "" });

  const announce = useCallback((type, message) => {
    setStatus({ type, message });
    if (type === "success") {
      setTimeout(() => setStatus((current) => (current.message === message ? { type: null, message: "" } : current)), 4000);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const data = await adminService.getSettings();
        if (cancelled) return;
        const merged = { ...DEFAULT_SETTINGS, ...data };
        setSaved(merged);
        setForm(merged);
      } catch (err) {
        if (!cancelled) {
          announce(
            "error",
            err?.status === 401
              ? "Your session expired. Sign in again to manage settings."
              : err?.message || "Could not load settings."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSettings();
    return () => {
      cancelled = true;
    };
  }, [announce]);

  const profileDirty = useMemo(
    () => PROFILE_FIELDS.some((field) => form[field] !== saved[field]),
    [form, saved]
  );

  const securityDirty = useMemo(
    () =>
      SECURITY_FIELDS.some(({ key }) => form[key] !== saved[key]) ||
      Number(form.session_timeout_minutes) !== Number(saved.session_timeout_minutes),
    [form, saved]
  );

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const persist = async (payload) => {
    const updated = await adminService.updateSettings(payload);
    const merged = { ...DEFAULT_SETTINGS, ...updated };
    setSaved(merged);
    setForm((current) => ({ ...merged, ...pickDirtyOverrides(current, merged, payload) }));
    return merged;
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    if (!form.school_name.trim()) {
      announce("error", "School name is required.");
      return;
    }
    if (form.school_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.school_email)) {
      announce("error", "Enter a valid school email address.");
      return;
    }

    setSavingProfile(true);
    try {
      await persist(Object.fromEntries(PROFILE_FIELDS.map((field) => [field, form[field]])));
      announce("success", "School profile saved.");
    } catch (err) {
      announce("error", err?.message || "Could not save the school profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSecuritySave = async () => {
    const timeout = Number(form.session_timeout_minutes);
    if (!Number.isInteger(timeout) || timeout < 5 || timeout > 480) {
      announce("error", "Session timeout must be a whole number between 5 and 480 minutes.");
      return;
    }

    setSavingSecurity(true);
    try {
      await persist({
        ...Object.fromEntries(SECURITY_FIELDS.map(({ key }) => [key, form[key]])),
        session_timeout_minutes: timeout,
      });
      announce("success", "Security and access settings saved.");
    } catch (err) {
      announce("error", err?.message || "Could not save security settings.");
    } finally {
      setSavingSecurity(false);
    }
  };

  const handleNotificationToggle = async (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setPendingToggle(key);
    try {
      await persist({ [key]: value });
      announce("success", "Notification preferences updated.");
    } catch (err) {
      setForm((current) => ({ ...current, [key]: saved[key] }));
      announce("error", err?.message || "Could not update notification preferences.");
    } finally {
      setPendingToggle(null);
    }
  };

  const handleReset = () => {
    setForm(saved);
    announce("success", "Unsaved changes discarded.");
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setPasswordStatus({ type: null, message: "" });

    if (!passwords.current) {
      setPasswordStatus({ type: "error", message: "Enter your current password." });
      return;
    }
    if (passwords.next.length < 8) {
      setPasswordStatus({ type: "error", message: "New password must be at least 8 characters." });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPasswordStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    setSavingPassword(true);
    try {
      await adminService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setPasswords({ current: "", next: "", confirm: "" });
      setPasswordStatus({ type: "success", message: "Password updated successfully." });
    } catch (err) {
      setPasswordStatus({ type: "error", message: err?.message || "Could not update the password." });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#e5e7eb] bg-white p-12 text-sm text-[#6b7280] shadow-xs">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading settings…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {status.message && (
        <div
          role="status"
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]"
              : "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          {status.message}
        </div>
      )}

      <SettingsCard
        title="School Profile"
        description="Details shown across the portal and on official documents."
        icon={Building2}
        footer={
          <>
            <button
              type="button"
              onClick={handleReset}
              disabled={!profileDirty && !securityDirty}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-3.5 py-2 text-xs font-semibold text-[#374151] transition-all hover:bg-[#f3f4f6] disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Discard changes
            </button>
            <button
              type="submit"
              form="school-profile-form"
              disabled={savingProfile || !profileDirty}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {savingProfile ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {savingProfile ? "Saving…" : "Save changes"}
            </button>
          </>
        }
      >
        <form id="school-profile-form" onSubmit={handleProfileSave} className="grid grid-cols-2 gap-5">
          <Field label="School name" htmlFor="school_name">
            <input
              id="school_name"
              className={inputClass}
              value={form.school_name}
              onChange={(e) => updateField("school_name", e.target.value)}
              placeholder="CampusHub Main Campus"
            />
          </Field>
          <Field label="Contact email" htmlFor="school_email">
            <input
              id="school_email"
              type="email"
              className={inputClass}
              value={form.school_email}
              onChange={(e) => updateField("school_email", e.target.value)}
              placeholder="admin@campushub.edu"
            />
          </Field>
          <Field label="Contact phone" htmlFor="school_phone">
            <input
              id="school_phone"
              className={inputClass}
              value={form.school_phone}
              onChange={(e) => updateField("school_phone", e.target.value)}
              placeholder="+254 700 000 000"
            />
          </Field>
          <Field label="Physical address" htmlFor="school_address">
            <input
              id="school_address"
              className={inputClass}
              value={form.school_address}
              onChange={(e) => updateField("school_address", e.target.value)}
              placeholder="123 Campus Road"
            />
          </Field>
        </form>
      </SettingsCard>

      <SettingsCard
        title="Academic Calendar"
        description="Active academic year, term and reporting timezone."
        icon={CalendarRange}
      >
        <div className="grid grid-cols-3 gap-5">
          <Field label="Academic year" htmlFor="academic_year">
            <select
              id="academic_year"
              className={inputClass}
              value={form.academic_year}
              onChange={(e) => updateField("academic_year", e.target.value)}
            >
              {ACADEMIC_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Current term" htmlFor="current_term">
            <select
              id="current_term"
              className={inputClass}
              value={form.current_term}
              onChange={(e) => updateField("current_term", e.target.value)}
            >
              {TERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Timezone" htmlFor="timezone">
            <select
              id="timezone"
              className={inputClass}
              value={form.timezone}
              onChange={(e) => updateField("timezone", e.target.value)}
            >
              {TIMEZONES.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <p className="mt-4 text-xs text-[#6b7280]">
          Calendar changes are saved together with the school profile.
        </p>
      </SettingsCard>

      <div className="grid grid-cols-2 gap-6">
        <SettingsCard
          title="Notifications"
          description="Preferences apply to every administrator alert."
          icon={Bell}
        >
          <ul className="divide-y divide-[#f3f4f6]">
            {NOTIFICATION_FIELDS.map(({ key, label, description }) => (
              <li key={key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{label}</p>
                  <p className="text-xs text-[#6b7280]">{description}</p>
                </div>
                <Toggle
                  label={label}
                  checked={Boolean(form[key])}
                  disabled={pendingToggle === key}
                  onChange={(value) => handleNotificationToggle(key, value)}
                />
              </li>
            ))}
          </ul>
        </SettingsCard>

        <SettingsCard
          title="Security & Access"
          description="Control how users sign in and reach the portal."
          icon={ShieldCheck}
          footer={
            <button
              type="button"
              onClick={handleSecuritySave}
              disabled={savingSecurity || !securityDirty}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {savingSecurity ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {savingSecurity ? "Saving…" : "Save security settings"}
            </button>
          }
        >
          <ul className="divide-y divide-[#f3f4f6]">
            {SECURITY_FIELDS.map(({ key, label, description }) => (
              <li key={key} className="flex items-center justify-between gap-4 py-3.5 first:pt-0">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{label}</p>
                  <p className="text-xs text-[#6b7280]">{description}</p>
                </div>
                <Toggle label={label} checked={Boolean(form[key])} onChange={(value) => updateField(key, value)} />
              </li>
            ))}
            <li className="flex items-center justify-between gap-4 pt-3.5">
              <div>
                <p className="text-sm font-semibold text-[#111827]">Session timeout</p>
                <p className="text-xs text-[#6b7280]">Minutes of inactivity before sign-out (5–480)</p>
              </div>
              <input
                type="number"
                min={5}
                max={480}
                aria-label="Session timeout in minutes"
                value={form.session_timeout_minutes}
                onChange={(e) => updateField("session_timeout_minutes", e.target.value)}
                className={`${inputClass} w-24 text-center`}
              />
            </li>
          </ul>
        </SettingsCard>
      </div>

      <SettingsCard
        title="Password"
        description="Update the password for your administrator account."
        icon={LockKeyhole}
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowPasswords((visible) => !visible)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#e5e7eb] bg-white px-3.5 py-2 text-xs font-semibold text-[#374151] transition-all hover:bg-[#f3f4f6]"
            >
              {showPasswords ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showPasswords ? "Hide passwords" : "Show passwords"}
            </button>
            <button
              type="submit"
              form="password-form"
              disabled={savingPassword}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {savingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LockKeyhole className="h-3.5 w-3.5" />}
              {savingPassword ? "Updating…" : "Update password"}
            </button>
          </>
        }
      >
        {passwordStatus.message && (
          <div
            role="status"
            className={`mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
              passwordStatus.type === "success"
                ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d]"
                : "border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]"
            }`}
          >
            {passwordStatus.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0" />
            )}
            {passwordStatus.message}
          </div>
        )}
        <form id="password-form" onSubmit={handlePasswordSubmit} className="grid grid-cols-3 gap-5">
          <Field label="Current password" htmlFor="current-password">
            <input
              id="current-password"
              type={showPasswords ? "text" : "password"}
              className={inputClass}
              value={passwords.current}
              onChange={(e) => setPasswords((current) => ({ ...current, current: e.target.value }))}
              placeholder="••••••••"
            />
          </Field>
          <Field label="New password" htmlFor="new-password">
            <input
              id="new-password"
              type={showPasswords ? "text" : "password"}
              className={inputClass}
              value={passwords.next}
              onChange={(e) => setPasswords((current) => ({ ...current, next: e.target.value }))}
              placeholder="At least 8 characters"
            />
          </Field>
          <Field label="Confirm new password" htmlFor="confirm-password">
            <input
              id="confirm-password"
              type={showPasswords ? "text" : "password"}
              className={inputClass}
              value={passwords.confirm}
              onChange={(e) => setPasswords((current) => ({ ...current, confirm: e.target.value }))}
              placeholder="••••••••"
            />
          </Field>
        </form>
      </SettingsCard>

      <SettingsCard
        title="Account"
        description="The administrator account signed in on this device."
        icon={LogOut}
      >
        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#e5e7eb] p-4">
          <div>
            <p className="text-sm font-semibold text-[#111827]">{user?.email || "Administrator"}</p>
            <p className="text-xs text-[#6b7280]">
              Signed in as {user?.role || "administrator"}
              {saved.updated_at ? ` · settings last saved ${new Date(saved.updated_at).toLocaleString()}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#fecaca] bg-white px-4 py-2 text-xs font-semibold text-[#dc2626] transition-all hover:bg-[#fef2f2]"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}

// Keeps edits the administrator is still working on after a partial save.
function pickDirtyOverrides(current, merged, payload) {
  const savedKeys = new Set(Object.keys(payload));
  return Object.fromEntries(
    Object.keys(merged)
      .filter((key) => !savedKeys.has(key) && current[key] !== merged[key])
      .map((key) => [key, current[key]])
  );
}

export default AdminSettingsSection;
