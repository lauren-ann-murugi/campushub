
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

// ----------------------------------------------------------------------
// Inline SVG Icons (Zero external package dependencies)
// ----------------------------------------------------------------------

const UserPlusIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.765Z" />
  </svg>
);

const UserCheckIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const ClipboardDocumentListIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-3.123-.225A2.25 2.25 0 0 0 13.001 2H10.998a2.25 2.25 0 0 0-2.15 1.691 48.402 48.402 0 0 0-3.123.225A2.25 2.25 0 0 0 3.75 6.108V17.25A2.25 2.25 0 0 0 6 19.5h3.75" />
  </svg>
);

const CreditCardIcon = ({ className = "h-5 w-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
);

const ShieldCheckIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751A11.959 11.959 0 0 1 12 2.714Z" />
  </svg>
);

const SmileIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm6 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z" />
  </svg>
);

const ZapIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

const SmartphoneIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
  </svg>
);

const ArrowRightIcon = ({ className = "h-4 w-4" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
  </svg>
);

// ----------------------------------------------------------------------
// Main Page Component
// ----------------------------------------------------------------------

export default function CampusHubLandingPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. TOP NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 overflow-hidden">
              <Image 
                src="/Logo.png" 
                alt="CampusHub Logo" 
                fill 
                className="object-contain" 
                priority 
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">CampusHub</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="#features" className="text-[#2563eb] font-semibold transition-colors">
              Features
            </Link>
            <Link href="#about" className="hover:text-slate-900 transition-colors">
              About
            </Link>
            <Link href="/faq" className="hover:text-slate-900 transition-colors">
              FAQ
            </Link>
            <Link href="#contact" className="hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION WITH OPTIMIZED BACKGROUND IMAGE */}
      <section className="relative overflow-hidden bg-slate-950 py-20 lg:py-28 min-h-[600px] flex items-center">
        
        {/* Next.js Optimized Full-Coverage Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/CAMPUSHUB.jpeg"
            alt="Campus Background"
            fill
            priority
            quality={100}
            className="object-cover object-center opacity-90"
          />
        </div>
        
        {/* Balanced Gradient Tint for Perfect Readability & Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/30 z-0 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-12 z-10 w-full">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/60 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-emerald-300 shadow-lg">
                <div className="relative h-4 w-4">
                  <Image src="/Logo.png" alt="CampusHub Icon" fill className="object-contain" />
                </div>
                <span>Next-Generation School Management</span>
              </div>

              {/* Heading */}
              <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-md sm:text-5xl lg:text-[52px] lg:leading-[1.15]">
                Managing Education, <br />
                <span className="text-blue-400">Empowering Success.</span>
              </h1>

              {/* Subheading */}
              <p className="max-w-xl text-base text-slate-100 drop-shadow-sm sm:text-lg leading-relaxed">
                The modern, responsive school management system designed to digitize and simplify school operations, connecting administrators, teachers, and students in one seamless platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="rounded-lg bg-[#2563eb] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/40 hover:bg-blue-600 transition-all"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-white/30 bg-slate-900/60 backdrop-blur-md px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-slate-900/80 transition-all"
                >
                  Login to Portal
                </Link>
              </div>
            </div>

            {/* Right Admin Dashboard Mockup Card (Translucent Glassmorphism) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="w-full max-w-md rounded-2xl border border-white/20 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-xl transition-all hover:bg-slate-900/50">
                
                {/* Card Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Admin Dashboard</h3>
                    <p className="text-xs text-slate-300">Real-time overview</p>
                  </div>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 backdrop-blur-sm border border-blue-400/20">
                    <span className="text-xs font-bold">🔒</span>
                  </div>
                </div>

                {/* Dashboard Metrics */}
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-950/60 p-3.5 border border-white/10 backdrop-blur-md">
                    <p className="text-xs text-slate-300 font-medium flex items-center gap-1">
                      <span>👥</span> Total Students
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-white">2,450</p>
                    <span className="text-[11px] font-semibold text-emerald-400">↗ +12% this term</span>
                  </div>

                  <div className="rounded-xl bg-slate-950/60 p-3.5 border border-white/10 backdrop-blur-md">
                    <p className="text-xs text-slate-300 font-medium flex items-center gap-1">
                      <span>📅</span> Attendance
                    </p>
                    <p className="mt-1 text-2xl font-extrabold text-white">96.8%</p>
                    <span className="text-[11px] font-semibold text-emerald-400">🎯 Above target</span>
                  </div>
                </div>

                {/* Recent Activity List */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white">Recent Activity</p>
                    <button className="text-[11px] font-semibold text-blue-300 hover:underline">View All</button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between rounded-lg bg-slate-950/50 p-2.5 border border-white/5 backdrop-blur-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        <span className="font-medium text-slate-200">Term 2 Exam Schedules Published</span>
                      </div>
                      <span className="text-[10px] text-slate-400">2h ago</span>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-slate-950/50 p-2.5 border border-white/5 backdrop-blur-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-400" />
                        <span className="font-medium text-slate-200">New staff onboarding completed</span>
                      </div>
                      <span className="text-[10px] text-slate-400">5h ago</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. KEY METRICS / STATISTICS BAR */}
      <section className="border-y border-slate-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-2 gap-8 divide-y divide-slate-100 md:grid-cols-4 md:divide-x md:divide-y-0">
            
            <div className="text-center pt-4 md:pt-0">
              <p className="text-4xl font-extrabold text-[#2563eb]">10k+</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Total Students</p>
            </div>

            <div className="text-center pt-4 md:pt-0">
              <p className="text-4xl font-extrabold text-[#2563eb]">500+</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Teachers</p>
            </div>

            <div className="text-center pt-4 md:pt-0">
              <p className="text-4xl font-extrabold text-[#2563eb]">350</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Classes</p>
            </div>

            <div className="text-center pt-4 md:pt-0">
              <p className="text-4xl font-extrabold text-[#2563eb]">98%</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Rate</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. COMPREHENSIVE MANAGEMENT TOOLS (FEATURE GRID) */}
      <section id="features" className="bg-slate-50/50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          
          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-bold text-slate-900">Comprehensive Management Tools</h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Everything you need to run your institution efficiently, neatly organized in one intuitive platform.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Card 1: Student Admissions */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <UserPlusIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">Student Admissions</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Streamline the entire enrollment process from application to registration. Collect documents digitally and manage waitlists effortlessly.
                </p>
              </div>
              <div className="mt-6">
                <Link href="/admissions" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] hover:gap-2 transition-all">
                  <span>Explore Admissions</span>
                  <ArrowRightIcon className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Attendance Management */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
                  <UserCheckIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">Attendance Management</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Track daily attendance, manage leave requests, and automatically notify parents of absences.
                </p>
              </div>
            </div>

            {/* Card 3: Examination Management */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md transition-shadow">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <ClipboardDocumentListIcon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-bold text-slate-900">Examination Management</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Create schedules, manage grading rubrics, and generate comprehensive report cards with a single click.
                </p>
              </div>
            </div>

            {/* Card 4: Fee Management (With Mini Chart Visual) */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-center">
                <div className="sm:col-span-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#2563eb]">
                    <CreditCardIcon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-slate-900">Fee Management</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                    Automate fee collection, send timely payment reminders, track outstanding dues, and generate detailed financial reports securely.
                  </p>
                </div>

                {/* Minimalist Bar Chart Graphic */}
                <div className="flex h-28 w-full items-end justify-center gap-2 rounded-xl bg-slate-50 p-3 sm:col-span-1 border border-slate-100">
                  <div className="w-3.5 rounded-t bg-blue-400 h-12" />
                  <div className="w-3.5 rounded-t bg-blue-600 h-16" />
                  <div className="w-3.5 rounded-t bg-blue-500 h-10" />
                  <div className="w-3.5 rounded-t bg-emerald-500 h-20" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY EDUCATIONAL LEADERS CHOOSE CAMPUSHUB */}
      <section id="about" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Why Educational Leaders Choose CampusHub</h2>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  We combine robust technology with intuitive design to deliver a platform that genuinely makes administration easier, giving staff more time to focus on education.
                </p>
              </div>

              {/* List of Benefits */}
              <ul className="space-y-6 pt-2">
                <li className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <ShieldCheckIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Secure Platform</h3>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                      Enterprise-grade security protecting sensitive student and financial data.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#2563eb]">
                    <SmileIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">User Friendly</h3>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                      Intuitive interfaces that require minimal training for staff and teachers.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                    <ZapIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Fast Performance</h3>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                      Optimized infrastructure ensuring quick load times even during peak periods.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#2563eb]">
                    <SmartphoneIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Responsive Design</h3>
                    <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                      Access the platform seamlessly from desktops, tablets, or smartphones.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Right Tablet Photo Visual */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-2xl">
                <Image
                  src="https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="CampusHub dashboard displayed on a tablet"
                  width={600}
                  height={450}
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. SITE FOOTER */}
      <footer className="border-t border-slate-200/80 bg-slate-100/60 pt-16 pb-8 text-slate-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          
          <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
            
            {/* Column 1: Brand Info */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative h-7 w-7 overflow-hidden">
                  <Image 
                    src="/Logo.png" 
                    alt="CampusHub Logo" 
                    fill 
                    className="object-contain" 
                  />
                </div>
                <span className="text-lg font-bold text-slate-900">CampusHub</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Managing Education, Empowering Success. The comprehensive school management system.
              </p>
            </div>

            {/* Column 2: Product */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Product</p>
              <ul className="space-y-2 text-xs">
                <li><Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link></li>
                <li><Link href="#cases" className="hover:text-slate-900 transition-colors">Case Studies</Link></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Legal</p>
              <ul className="space-y-2 text-xs">
                <li><Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-slate-900 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-900">Company</p>
              <ul className="space-y-2 text-xs">
                <li><Link href="#about" className="hover:text-slate-900 transition-colors">About Us</Link></li>
                <li><Link href="#contact" className="hover:text-slate-900 transition-colors">Contact Us</Link></li>
                <li><Link href="#careers" className="hover:text-slate-900 transition-colors">Careers</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Bar */}
          <div className="mt-12 border-t border-slate-200/60 pt-6 text-center text-[11px] text-slate-400">
            © 2026 CampusHub School Management System. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}