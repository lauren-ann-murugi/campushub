"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { MenuIcon, XIcon, UserIcon } from "../icons";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#e6e8ea] bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#004ac6] font-bold text-white shadow-sm">
            C
          </div>
          <span className="text-xl font-bold tracking-tight text-[#191c1e]">
            Campus<span className="text-[#004ac6]">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-[#434655] transition-colors hover:text-[#004ac6]"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-[#434655] transition-colors hover:text-[#004ac6]"
          >
            About Us
          </Link>
          <Link
            href="/features"
            className="text-sm font-medium text-[#434655] transition-colors hover:text-[#004ac6]"
          >
            Features
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-[#434655] transition-colors hover:text-[#004ac6]"
          >
            Contact
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link
              href={`/dashboard/${user?.role || "student"}`}
              className="inline-flex items-center gap-2 rounded-lg bg-[#004ac6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003ba6]"
            >
              <UserIcon className="h-4 w-4" /> Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-[#434655] transition-colors hover:bg-[#f7f9fb] hover:text-[#191c1e]"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#004ac6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#003ba6]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-[#434655] hover:bg-[#f7f9fb] md:hidden"
        >
          {mobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#e6e8ea] bg-white px-4 pb-6 pt-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#191c1e] hover:bg-[#f7f9fb]"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#191c1e] hover:bg-[#f7f9fb]"
            >
              About Us
            </Link>
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#191c1e] hover:bg-[#f7f9fb]"
            >
              Features
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#191c1e] hover:bg-[#f7f9fb]"
            >
              Contact
            </Link>
            <div className="mt-2 flex flex-col gap-2 border-t border-[#e6e8ea] pt-4">
              {isAuthenticated ? (
                <Link
                  href={`/dashboard/${user?.role || "student"}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full rounded-lg bg-[#004ac6] py-2.5 text-center text-sm font-medium text-white"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-lg border border-[#c3c6d7] py-2.5 text-center text-sm font-medium text-[#191c1e]"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full rounded-lg bg-[#004ac6] py-2.5 text-center text-sm font-medium text-white"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}