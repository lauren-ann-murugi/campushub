"use client";

import React from "react";
import { Users, GraduationCap, School, CheckCircle2 } from "lucide-react";

const STATISTICS = [
  {
    value: "10k+",
    label: "Active Students",
    description: "Enrolled across all programs",
    icon: Users,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    value: "500+",
    label: "Expert Educators",
    description: "Verified teaching staff",
    icon: GraduationCap,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  {
    value: "350",
    label: "Active Classes",
    description: "Managed simultaneously",
    icon: School,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    value: "98%",
    label: "Attendance Rate",
    description: "Daily automated tracking",
    icon: CheckCircle2,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
];

export const SchoolPlatformStatisticsSection = () => {
  return (
    <section
      aria-label="School platform statistics"
      className="relative w-full border-y border-slate-200/80 bg-gradient-to-b from-white via-slate-50/50 to-white py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {STATISTICS.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`group relative flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-1 ${
                  /* Responsive Divider Border Rules */
                  index !== 0
                    ? "lg:border-l lg:border-slate-200/80 lg:pl-8"
                    : ""
                } ${
                  index % 2 !== 0
                    ? "border-l border-slate-200/80 pl-6 lg:border-l-0"
                    : ""
                }`}
              >
                {/* Micro Icon Badge */}
                <div
                  className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl border shadow-2xs transition-transform duration-300 group-hover:scale-110 ${stat.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Stat Metric Value */}
                <dd className="font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  <span className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-800 bg-clip-text text-transparent">
                    {stat.value}
                  </span>
                </dd>

                {/* Primary Metric Label */}
                <dt className="mt-2 font-heading text-sm font-bold uppercase tracking-wider text-slate-800 sm:text-base">
                  {stat.label}
                </dt>

                {/* Supporting Metric Description */}
                <p className="mt-1 font-body text-xs text-slate-500 sm:text-sm">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};

export default SchoolPlatformStatisticsSection;