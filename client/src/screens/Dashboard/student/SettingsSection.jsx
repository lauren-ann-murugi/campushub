"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../lib/auth";
import { DashboardHeader, PanelCard } from "../DashboardLayout";
import {
  LockIcon,
  BellIcon,
  CheckIcon,
  AlertCircleIcon,
  LogOutIcon,
} from "../../../components/icons";

export function SettingsSection() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Password Form State
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState(null);
  const [pwdSuccess, setPwdSuccess] = useState(null);

  // Notification Toggle State
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(null);

  // Fetch initial notification settings on mount
  useEffect(() => {
    async function loadPreferences() {
      try {
        const res = await fetch("/api/user/preferences");
        if (res.ok) {
          const data = await res.json();
          if (data.emailNotif !== undefined) setEmailNotif(data.emailNotif);
          if (data.pushNotif !== undefined) setPushNotif(data.pushNotif);
          if (data.smsNotif !== undefined) setSmsNotif(data.smsNotif);
        }
      } catch (err) {
        // Fallback silently to default UI toggle state
      }
    }
    loadPreferences();
  }, []);

  // Update notification preference on Python API
  const handleTogglePreference = async (key, value, setter) => {
    setter(value);
    try {
      const updatedPrefs = {
        emailNotif: key === "email" ? value : emailNotif,
        pushNotif: key === "push" ? value : pushNotif,
        smsNotif: key === "sms" ? value : smsNotif,
      };

      const res = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPrefs),
      });

      if (res.ok) {
        setNotifSuccess("Notification preferences updated.");
        setTimeout(() => setNotifSuccess(null), 3000);
      }
    } catch (err) {
      // Revert on failure
      setter(!value);
    }
  };

  // Password update against custom Python API endpoint
  const handlePwdChange = async (e) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (!currentPwd) {
      setPwdError("Please enter your current password.");
      return;
    }
    if (newPwd.length < 6) {
      setPwdError("New password must be at least 6 characters.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("New passwords do not match.");
      return;
    }

    setPwdLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: currentPwd,
          newPassword: newPwd,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update password.");
      }

      setPwdSuccess("Password updated successfully.");
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setTimeout(() => setPwdSuccess(null), 4000);
    } catch (err) {
      setPwdError(err.message || "An error occurred while changing your password.");
    } finally {
      setPwdLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-[#004ac6]" : "bg-[#c3c6d7]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <>
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account security and notification preferences."
      />

      <div className="flex flex-col gap-6">
        {pwdSuccess && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckIcon className="h-4 w-4 shrink-0" /> {pwdSuccess}
          </div>
        )}
        {notifSuccess && (
          <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <CheckIcon className="h-4 w-4 shrink-0" /> {notifSuccess}
          </div>
        )}
        {pwdError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircleIcon className="h-4 w-4 shrink-0" /> {pwdError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Change Password Card */}
          <PanelCard title="Change Password">
            <form onSubmit={handlePwdChange} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="cur-pwd" className="text-sm font-medium text-[#191c1e]">
                  Current password
                </label>
                <input
                  id="cur-pwd"
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-base text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="new-pwd" className="text-sm font-medium text-[#191c1e]">
                  New password
                </label>
                <input
                  id="new-pwd"
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-base text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="conf-pwd" className="text-sm font-medium text-[#191c1e]">
                  Confirm new password
                </label>
                <input
                  id="conf-pwd"
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-base text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                />
              </div>
              <button
                type="submit"
                disabled={pwdLoading}
                className="inline-flex items-center gap-2 self-start rounded-lg bg-[#004ac6] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#003ba6] disabled:opacity-60"
              >
                <LockIcon className="h-4 w-4" /> {pwdLoading ? "Updating..." : "Update password"}
              </button>
            </form>
          </PanelCard>

          {/* Notification Preferences Card */}
          <PanelCard title="Notification Preferences">
            <ul className="flex flex-col gap-4">
              <li className="flex items-center justify-between gap-3 border-b border-[#eceef0] pb-4">
                <div className="flex items-start gap-3">
                  <BellIcon className="mt-0.5 h-5 w-5 text-[#004ac6]" />
                  <div>
                    <p className="text-sm font-medium text-[#191c1e]">Email notifications</p>
                    <p className="text-xs text-[#434655]">Receive updates about classes and results</p>
                  </div>
                </div>
                <Toggle
                  checked={emailNotif}
                  onChange={(val) => handleTogglePreference("email", val, setEmailNotif)}
                />
              </li>
              <li className="flex items-center justify-between gap-3 border-b border-[#eceef0] pb-4">
                <div className="flex items-start gap-3">
                  <BellIcon className="mt-0.5 h-5 w-5 text-[#004ac6]" />
                  <div>
                    <p className="text-sm font-medium text-[#191c1e]">Push notifications</p>
                    <p className="text-xs text-[#434655]">Get alerts on your device</p>
                  </div>
                </div>
                <Toggle
                  checked={pushNotif}
                  onChange={(val) => handleTogglePreference("push", val, setPushNotif)}
                />
              </li>
              <li className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <BellIcon className="mt-0.5 h-5 w-5 text-[#004ac6]" />
                  <div>
                    <p className="text-sm font-medium text-[#191c1e]">SMS notifications</p>
                    <p className="text-xs text-[#434655]">Urgent alerts via text message</p>
                  </div>
                </div>
                <Toggle
                  checked={smsNotif}
                  onChange={(val) => handleTogglePreference("sms", val, setSmsNotif)}
                />
              </li>
            </ul>
          </PanelCard>
        </div>

        {/* Account Details & Action Card */}
        <PanelCard title="Account">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-[#e6e8ea] p-4">
              <div>
                <p className="text-sm font-medium text-[#191c1e]">Email address</p>
                <p className="text-sm text-[#434655]">{user?.email ?? "—"}</p>
              </div>
              <span className="rounded-full bg-[#006c491a] px-2.5 py-1 text-xs font-medium text-[#006c49]">
                Verified
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <div>
                <p className="text-sm font-medium text-red-700">Sign out</p>
                <p className="text-sm text-red-600/80">Sign out of your account on this device</p>
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOutIcon className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </PanelCard>
      </div>
    </>
  );
}