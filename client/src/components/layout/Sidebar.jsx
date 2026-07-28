"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavigationByRole } from "../../data/navigation";
import { useAuth } from "../../context/AuthContext";
import { LogOutIcon, ShieldCheckIcon } from "../icons";

export default function Sidebar({ role = "teacher" }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const navItems = getNavigationByRole(role);

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-[#e6e8ea] bg-white">
      {/* Top Header / Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-[#e6e8ea] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#004ac6] font-bold text-white shadow-sm">
          C
        </div>
        <div>
          <h1 className="text-base font-bold text-[#191c1e]">CampusHub</h1>
          <p className="text-[10px] font-semibold tracking-wider text-[#004ac6] uppercase">
            {role} portal
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-wider text-[#434655]/70">
          Navigation
        </p>
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#004ac6] text-white shadow-sm"
                    : "text-[#434655] hover:bg-[#f7f9fb] hover:text-[#191c1e]"
                }`}
              >
                {IconComponent && (
                  <IconComponent className={`h-5 w-5 ${isActive ? "text-white" : "text-[#434655]"}`} />
                )}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="border-t border-[#e6e8ea] p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-[#f7f9fb] p-2.5 border border-[#eceef0]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#004ac6] text-xs font-bold text-white">
            {user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[#191c1e]">
              {user?.name || "Teacher Account"}
            </p>
            <p className="truncate text-[11px] text-[#434655]">
              {user?.email || "teacher@campushub.edu"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e6e8ea] bg-white py-2 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          <LogOutIcon className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}