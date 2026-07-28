// "use client";

// import React from "react";
// import Link from "next/link";
// import { 
//   ArrowRight, 
//   GraduationCap, 
//   Presentation, 
//   ShieldCheck, 
//   BarChart3, 
//   Sparkles 
// } from "lucide-react";

// import { PrimaryNavigationSection } from "./sections/PrimaryNavigationSection/PrimaryNavigationSection";
// import { SiteFooterSection } from "./sections/SiteFooterSection/SiteFooterSection";

// const VALUES = [
//   { 
//     title: "Student-First", 
//     desc: "Every feature is crafted to remove friction and enhance student academic performance.", 
//     icon: GraduationCap 
//   },
//   { 
//     title: "Empower Educators", 
//     desc: "Automate administrative paperwork so teachers can dedicate their energy to instruction.", 
//     icon: Presentation 
//   },
//   { 
//     title: "Data-Driven Insights", 
//     desc: "Equip leadership with real-time analytics to make fast, informed institutional decisions.", 
//     icon: BarChart3 
//   },
//   { 
//     title: "Enterprise Security", 
//     desc: "Protect sensitive student records with end-to-end encryption and compliance standards.", 
//     icon: ShieldCheck 
//   },
// ];

// const MILESTONES = [
//   { year: "2024", title: "CampusHub Founded", desc: "Launched with a dedicated mission to digitize educational workflows across schools." },
//   { year: "2025", title: "1,000+ Active Students", desc: "Onboarded our first milestone cohort across 5 pioneer partner institutions." },
//   { year: "2026", title: "Platform 2.0 Ecosystem", desc: "Unveiled real-time role-based portals for students, teachers, parents, and admins." },
// ];

// const STATS = [
//   { label: "Partner Schools", value: "12+" },
//   { label: "Active Students", value: "2,450" },
//   { label: "Empowered Teachers", value: "48+" },
//   { label: "Platform Uptime", value: "99.9%" },
// ];

// export default function AboutPage() {
//   return (
//     <main className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900">
//       <PrimaryNavigationSection />

//       {/* Hero Section */}
//       <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 py-20 text-white md:py-28">
//         <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />
        
//         <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
//           <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-200 backdrop-blur-md">
//             <Sparkles className="h-3.5 w-3.5 text-blue-300" />
//             <span>About CampusHub</span>
//           </div>

//           <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl lg:leading-tight">
//             Transforming School Management for the Digital Age
//           </h1>

//           <p className="mt-6 max-w-2xl text-lg text-blue-100/90 leading-relaxed font-normal">
//             CampusHub is an all-in-one platform connecting administrators, educators, students, and parents — bringing simplicity, speed, and transparency to everyday operations.
//           </p>
//         </div>
//       </section>

//       {/* Mission & Stats */}
//       <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
//         <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
//           <div className="lg:col-span-6">
//             <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//               Our Mission
//             </h2>
//             <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
//               We believe every school deserves modern, intuitive tools. From attendance tracking and gradebooks to fee management and timetabling, CampusHub centralizes your core operations into one seamless ecosystem.
//             </p>
//             <p className="mt-3 text-base leading-relaxed text-slate-600 sm:text-lg">
//               Our ultimate objective is simple: reduce administrative burden so teachers can focus on teaching, and students can thrive.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-4 lg:col-span-6">
//             {STATS.map((s) => (
//               <div 
//                 key={s.label} 
//                 className="rounded-2xl border border-slate-200/80 bg-white p-6 text-center shadow-xs transition-shadow hover:shadow-md"
//               >
//                 <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">{s.value}</p>
//                 <p className="mt-2 text-sm font-medium text-slate-500">{s.label}</p>
//               </div>
//             ))}
//           </div>

//         </div>
//       </section>

//       {/* Values Section */}
//       <section className="border-y border-slate-200/80 bg-white py-16 md:py-24">
//         <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//               What We Stand For
//             </h2>
//             <p className="mt-3 text-slate-600 max-w-xl mx-auto">
//               Our foundational principles shape every feature we build and every institution we support.
//             </p>
//           </div>

//           <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
//             {VALUES.map((v) => {
//               const Icon = v.icon;
//               return (
//                 <div 
//                   key={v.title} 
//                   className="group rounded-2xl border border-slate-200/70 bg-slate-50/50 p-6 transition-all hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-slate-100"
//                 >
//                   <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
//                     <Icon className="h-6 w-6" />
//                   </div>
//                   <h3 className="mb-2 text-lg font-semibold text-slate-900">{v.title}</h3>
//                   <p className="text-sm leading-relaxed text-slate-600">{v.desc}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       {/* Timeline Section */}
//       <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 md:py-24">
//         <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//           Our Journey
//         </h2>

//         <div className="relative space-y-8 before:absolute before:inset-0 before:left-6 sm:before:left-1/2 before:-ml-px before:h-full before:w-0.5 before:bg-slate-200">
//           {MILESTONES.map((m) => (
//             <div key={m.year} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              
//               {/* Timeline Badge */}
//               <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 border-slate-50 bg-blue-600 text-xs font-bold text-white shadow-md z-10 sm:mx-auto">
//                 {m.year}
//               </div>

//               {/* Card Container */}
//               <div className="w-[calc(100%-4rem)] sm:w-[calc(50%-2.5rem)] rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
//                 <h3 className="text-base font-semibold text-slate-900">{m.title}</h3>
//                 <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.desc}</p>
//               </div>

//             </div>
//           ))}
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="bg-slate-900 py-16 text-white md:py-20">
//         <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
//           <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
//             Ready to Modernize Your Campus?
//           </h2>
//           <p className="mt-4 text-base text-slate-300 sm:text-lg">
//             Join forward-thinking schools transforming their operational efficiency today.
//           </p>
          
//           <div className="mt-8 flex justify-center">
//             <Link
//               href="/login"
//               className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
//             >
//               <span>Get Started</span>
//               <ArrowRight className="h-5 w-5" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       <SiteFooterSection />
//     </main>
//   );
// }







"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowRight, 
  GraduationCap, 
  Monitor, 
  ArrowRightCircle, 
  ShieldCheck 
} from "lucide-react";

import { PrimaryNavigationSection } from "./sections/PrimaryNavigationSection/PrimaryNavigationSection";
import { SiteFooterSection } from "./sections/SiteFooterSection/SiteFooterSection";

const VALUES = [
  { 
    title: "Student-First", 
    desc: "Every feature is designed to help students succeed academically.", 
    icon: GraduationCap 
  },
  { 
    title: "Empower Educators", 
    desc: "Give teachers the tools to focus on teaching, not paperwork.", 
    icon: Monitor 
  },
  { 
    title: "Data-Driven", 
    desc: "Make informed decisions with real-time analytics and reports.", 
    icon: ArrowRightCircle 
  },
  { 
    title: "Secure & Private", 
    desc: "Student data is protected with industry-standard security.", 
    icon: ShieldCheck 
  },
];

const MILESTONES = [
  { 
    year: "2024", 
    title: "CampusHub Founded", 
    desc: "Started with a mission to digitize school management in Africa." 
  },
  { 
    year: "2025", 
    title: "1,000+ Students", 
    desc: "Onboarded our first 1,000 students across 5 partner schools." 
  },
  { 
    year: "2026", 
    title: "Platform 2.0", 
    desc: "Launched role-based dashboards for students, teachers, and admins." 
  },
];

const STATS = [
  { label: "Schools", value: "12+" },
  { label: "Students", value: "2,450" },
  { label: "Teachers", value: "48" },
  { label: "Uptime", value: "99.9%" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-white font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Navigation Bar */}
      <PrimaryNavigationSection />

      {/* 1. HERO SECTION WITH BACKGROUND IMAGE */}
      <section className="relative min-h-[420px] overflow-hidden bg-blue-700 py-16 lg:py-24 flex items-center">
        {/* Next.js Background Image Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/CAMPUSHUB.jpeg"
            alt="Campus Background"
            fill
            priority
            quality={90}
            className="object-cover object-center opacity-15 mix-blend-overlay"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12 w-full">
          <div className="max-w-2xl text-white">
            <span className="text-xs font-semibold tracking-wide text-blue-200">
              About CampusHub
            </span>

            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight">
              Transforming School Management for the Digital Age
            </h1>

            <p className="mt-4 text-sm text-blue-100/90 leading-relaxed sm:text-base">
              CampusHub is an all-in-one platform that connects administrators, teachers, and students — making school operations seamless, transparent, and efficient.
            </p>
          </div>
        </div>
      </section>

      {/* 2. OUR MISSION & STATS */}
      <section className="bg-slate-50/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column - Text */}
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Our Mission
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We believe every school deserves modern tools to manage their operations. From attendance tracking to exam grading, fee collection to timetabling — CampusHub brings it all together in one intuitive platform. Our goal is to reduce administrative overhead so educators can focus on what matters most: teaching and student development.
              </p>
            </div>

            {/* Right Column - Stats Grid */}
            <div className="grid grid-cols-2 gap-4 lg:col-span-6">
              {STATS.map((s) => (
                <div 
                  key={s.label} 
                  className="rounded-xl border border-slate-200/80 bg-white p-6 text-center shadow-xs"
                >
                  <p className="text-2xl font-extrabold text-[#2563eb] sm:text-3xl">{s.value}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. WHAT WE STAND FOR */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              What We Stand For
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div 
                  key={v.title} 
                  className="rounded-xl border border-slate-200/70 bg-slate-50/50 p-6 transition-all hover:bg-white hover:shadow-md"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100/60 text-[#2563eb]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-2 text-sm font-bold text-slate-900">{v.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-500">{v.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. OUR JOURNEY (TIMELINE) */}
      <section className="bg-slate-50/50 py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-12">
          
          <h2 className="mb-12 text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Our Journey
          </h2>

          <div className="relative space-y-6 before:absolute before:inset-0 before:left-5 before:h-full before:w-0.5 before:bg-slate-200">
            {MILESTONES.map((m) => (
              <div key={m.year} className="relative flex items-center gap-6">
                
                {/* Year Circle Badge */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white shadow-xs z-10">
                  {m.year}
                </div>

                {/* Content Card */}
                <div className="w-full rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="bg-white py-16 text-slate-900 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Ready to Get Started?
          </h2>
          <p className="mt-3 text-xs text-slate-500 sm:text-sm">
            Join the schools already using CampusHub to simplify their operations.
          </p>
          
          <div className="mt-6 flex justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Site Footer */}
      <SiteFooterSection />
    </div>
  );
}