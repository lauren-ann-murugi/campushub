"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#e6e8ea] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#004ac6] font-bold text-white">
                C
              </div>
              <span className="text-lg font-bold text-[#191c1e]">
                Campus<span className="text-[#004ac6]">Hub</span>
              </span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-[#434655]">
              Streamlining portal communication, administrative task efficiency, and student performance tracking in one unified modern workspace.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#191c1e]">Platform</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-[#434655]">
              <li><Link href="/features" className="hover:text-[#004ac6]">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-[#004ac6]">Pricing</Link></li>
              <li><Link href="/dashboards" className="hover:text-[#004ac6]">Dashboards</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#191c1e]">Support</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-[#434655]">
              <li><Link href="/help" className="hover:text-[#004ac6]">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-[#004ac6]">Contact Us</Link></li>
              <li><Link href="/docs" className="hover:text-[#004ac6]">Documentation</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#191c1e]">Legal</h4>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-[#434655]">
              <li><Link href="/privacy" className="hover:text-[#004ac6]">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#004ac6]">Terms of Service</Link></li>
              <li><Link href="/security" className="hover:text-[#004ac6]">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#eceef0] pt-6 sm:flex-row">
          <p className="text-xs text-[#434655]">
            &copy; {new Date().getFullYear()} CampusHub Inc. All rights reserved.
          </p>
          <div className="mt-4 flex gap-4 text-xs text-[#434655] sm:mt-0">
            <span>Powered by Python & Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}