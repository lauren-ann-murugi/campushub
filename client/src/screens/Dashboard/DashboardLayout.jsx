"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { LogoMark, LogOutIcon } from "@/components/icons";
import NotificationBell from "@/components/NotificationBell";
import Avatar from "@/components/Avatar";

const ROLE_NAV = {
  student: [
    { id: "overview", label: "Dashboard", Icon: DashboardNavHome },
    { id: "profile", label: "Profile", Icon: DashboardNavUser },
    { id: "attendance", label: "Attendance", Icon: DashboardNavClipboard },
    { id: "results", label: "Results", Icon: DashboardNavChart },
    { id: "timetable", label: "Timetable", Icon: DashboardNavCalendar },
    { id: "fees", label: "Fees", Icon: DashboardNavCard },
    { id: "support", label: "Support", Icon: DashboardNavHelp },
    { id: "settings", label: "Settings", Icon: DashboardNavSettings },
  ],
  teacher: [
    { id: "overview", label: "Dashboard", Icon: DashboardNavHome },
    { id: "attendance", label: "Attendance", Icon: DashboardNavClipboard },
    { id: "students", label: "Students", Icon: DashboardNavUsers },
    { id: "exams", label: "Exams", Icon: DashboardNavClipboard },
    { id: "timetable", label: "Timetable", Icon: DashboardNavCalendar },
    { id: "support", label: "Support", Icon: DashboardNavHelp },
    { id: "settings", label: "Settings", Icon: DashboardNavSettings },
  ],
  administrator: [
    { id: "overview", label: "Dashboard", Icon: DashboardNavHome },
    { id: "students", label: "Students", Icon: DashboardNavUsers },
    { id: "staff", label: "Staff", Icon: DashboardNavBuilding },
    { id: "admissions", label: "Admissions", Icon: DashboardNavUserPlus },
    { id: "attendance", label: "Attendance", Icon: DashboardNavClipboard },
    { id: "exams", label: "Exams", Icon: DashboardNavBook },
    { id: "results", label: "Results", Icon: DashboardNavChart },
    { id: "fees", label: "Fees", Icon: DashboardNavCard },
    { id: "reports", label: "Reports", Icon: DashboardNavFileText },
    { id: "announcements", label: "Announcements", Icon: DashboardNavBell },
    { id: "support", label: "Support", Icon: DashboardNavHelp },
    { id: "profile", label: "Profile", Icon: DashboardNavUser },
    { id: "settings", label: "Settings", Icon: DashboardNavSettings },
  ],
};

const ROLE_LABEL = {
  student: "Student",
  teacher: "Teacher",
  administrator: "Administrator",
};

// SVG Nav Icons
function DashboardNavHome(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardNavUser(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DashboardNavClipboard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M9 14l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardNavChart(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="7" y="12" width="3" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="12" y="8" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
      <rect x="17" y="5" width="3" height="13" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DashboardNavCalendar(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardNavCard(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M2 10h20M6 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DashboardNavHelp(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardNavSettings(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardNavUsers(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardNavBuilding(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect x="4" y="3" width="16" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function DashboardNavBell(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardNavUserPlus(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M19 8v6M22 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardNavBook(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19.5A2.5 2.5 0 016.5 22H20v-5H6.5A2.5 2.5 0 004 19.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DashboardNavFileText(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DashboardLayout({
  role = "administrator",
  activeId,
  onNavigate,
  children,
}) {
  const { user, displayName, signOut, presence = {} } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const navItems = ROLE_NAV[role] || ROLE_NAV.administrator;

  return (
    <div className="flex min-h-screen w-full bg-[#f7f9fb]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-[#e6e8ea] bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 border-b border-[#eceef0] px-6 py-5">
            <LogoMark className="h-8 w-8 shrink-0" />
            <span className="[font-family:'Inter',Helvetica] text-xl font-bold tracking-[-0.50px] text-[#191c1e]">
              CampusHub
            </span>
          </div>

          <div className="border-b border-[#eceef0] px-6 py-4">
            <div className="flex items-center gap-3">
              <Avatar size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#191c1e]">
                  {displayName || user?.email || "Signed in"}
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      presence?.isOnline ? "bg-[#006c49]" : "bg-[#c3c6d7]"
                    }`}
                  />
                  <p className="text-xs text-[#434655]">
                    {presence?.isOnline ? "Online now" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Dashboard navigation">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = activeId === item.id;
                const { Icon } = item;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#004ac60d] text-[#004ac6]"
                          : "text-[#434655] hover:bg-[#f7f9fb] hover:text-[#191c1e]"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-[#eceef0] p-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#434655] hover:bg-[#f7f9fb] hover:text-[#191c1e]"
            >
              <LogOutIcon className="h-5 w-5 shrink-0" />
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/20 lg:hidden"
        />
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e6e8ea] bg-white/90 px-5 py-4 backdrop-blur sm:px-8">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#c3c6d7] text-[#191c1e] lg:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <NotificationBell />
            <Avatar size="sm" />
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden px-5 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}

export function DashboardHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-[#191c1e] sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 [font-family:'Inter',Helvetica] text-base font-normal leading-6 text-[#434655]">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function StatCard({ label, value, trend, icon, accent = "blue" }) {
  const accentBg = {
    blue: "bg-[#004ac60d] text-[#004ac6]",
    green: "bg-[#006c491a] text-[#006c49]",
    amber: "bg-[#f59e0b1a] text-[#f59e0b]",
    red: "bg-[#ef44441a] text-[#ef4444]",
  };
  return (
    <div className="rounded-2xl border border-[#e6e8ea] bg-white p-5 shadow-[0px_1px_2px_#0000000d]">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentBg[accent]}`}>
          {icon}
        </span>
        {trend && (
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${accentBg[accent]}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-bold tracking-[-0.02em] text-[#191c1e]">
        {value}
      </p>
      <p className="mt-1 [font-family:'Inter',Helvetica] text-sm font-normal leading-5 text-[#434655]">
        {label}
      </p>
    </div>
  );
}

export function PanelCard({ title, action, onAction, children }) {
  return (
    <div className="rounded-2xl border border-[#e6e8ea] bg-white shadow-[0px_1px_2px_#0000000d]">
      <div className="flex items-center justify-between border-b border-[#eceef0] px-5 py-4">
        <h3 className="text-base font-semibold text-[#191c1e]">{title}</h3>
        {action && (
          <button
            type="button"
            onClick={onAction}
            className="text-sm font-medium text-[#004ac6] hover:underline"
          >
            {action}
          </button>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function Badge({ children, variant = "blue" }) {
  const styles = {
    blue: "bg-[#004ac60d] text-[#004ac6]",
    green: "bg-[#006c491a] text-[#006c49]",
    amber: "bg-[#f59e0b1a] text-[#f59e0b]",
    red: "bg-[#ef44441a] text-[#ef4444]",
    gray: "bg-[#f7f9fb] text-[#434655]",
  };
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}