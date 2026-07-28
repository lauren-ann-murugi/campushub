"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { SearchIcon, BellIcon, UserIcon } from "../icons";

export default function DashboardNavbar({ activeTitle = "Dashboard" }) {
  const { user } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-[#e6e8ea] bg-white/95 px-6 backdrop-blur">
      {/* Current Section Title */}
      <div>
        <h2 className="text-lg font-bold text-[#191c1e]">{activeTitle}</h2>
      </div>

      {/* Right Tools */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative hidden md:block w-64">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#434655]" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full rounded-xl border border-[#c3c6d7] bg-[#f7f9fb] py-1.5 pl-9 pr-4 text-xs text-[#191c1e] placeholder:text-[#434655]/50 focus:border-[#004ac6] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-xl border border-[#e6e8ea] bg-white p-2 text-[#434655] transition-colors hover:bg-[#f7f9fb]"
          >
            <BellIcon className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#e6e8ea] bg-white p-4 shadow-xl">
              <div className="mb-2 flex items-center justify-between border-b border-[#eceef0] pb-2">
                <h4 className="text-xs font-semibold text-[#191c1e]">Notifications</h4>
                <span className="text-[10px] font-medium text-[#004ac6]">Mark all read</span>
              </div>
              <ul className="flex flex-col gap-2 text-xs">
                <li className="rounded-lg bg-[#f7f9fb] p-2">
                  <p className="font-semibold text-[#191c1e]">New Assignment Submission</p>
                  <p className="text-[#434655]">Ada Okafor submitted Math Ex 3B.</p>
                </li>
                <li className="rounded-lg bg-[#f7f9fb] p-2">
                  <p className="font-semibold text-[#191c1e]">Staff Meeting</p>
                  <p className="text-[#434655]">Scheduled for 3:00 PM in Room 4.</p>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2.5 border-l border-[#e6e8ea] pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#004ac6] text-xs font-bold text-white">
            {user?.name ? user.name[0] : "U"}
          </div>
          <span className="hidden text-xs font-medium text-[#191c1e] sm:inline-block">
            {user?.name || "Teacher"}
          </span>
        </div>
      </div>
    </header>
  );
}