"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Play 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const SchoolManagementHeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50 py-16 sm:py-24 lg:py-32">
      {/* Decorative Glow Elements */}
      <div 
        className="absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/2 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Column: Value Proposition & Call to Actions */}
          <div className="flex flex-col items-start lg:col-span-7">
            
            {/* Pill Announcement Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-600 border border-blue-100/80 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>Next-Gen School Management Platform</span>
            </div>

            {/* Headline */}
            <h1 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.15]">
              Streamline Campus Operations. <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Empower Educators & Students.
              </span>
            </h1>

            {/* Paragraph Subtitle */}
            <p className="mt-6 font-body text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl max-w-2xl">
              CampusHub digitizes modern school workflows—unifying admissions, attendance, examinations, fee tracking, and announcements into a single secure platform.
            </p>

            {/* Key Value Checklist */}
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-slate-700 font-body text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Centralized Student & Teacher Portals</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Automated Fee & Result Publishing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Real-Time Attendance Analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Role-Based Data Security</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Button
                onClick={() => router.push("/register")}
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 font-body text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/35 active:scale-[0.98]"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border-slate-300 bg-white px-7 font-body text-base font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900"
              >
                <span>Sign In to Dashboard</span>
              </Button>
            </div>

            {/* Trust Indicator */}
            <div className="mt-10 flex items-center gap-6 pt-6 border-t border-slate-200/80 w-full">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>FERPA & Data Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Users className="h-4 w-4 text-emerald-600" />
                <span>Multi-User Role Control</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Container & Floating Feature Widgets */}
          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-lg">
              
              {/* Decorative Background Plate */}
              <div 
                className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-blue-600 to-emerald-400 opacity-20 blur-xl transition-all duration-500 hover:opacity-30" 
                aria-hidden="true" 
              />

              {/* Main Image Wrapper */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
                <div className="relative h-[380px] w-full sm:h-[460px]">
                  <Image
                    src="/hero-image.png"
                    alt="CampusHub School Management Dashboard Overview"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    priority
                    className="object-cover object-top transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Overlay Floating Stat Card 1 - Attendance Rate */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:bottom-6 sm:right-auto rounded-xl border border-slate-100 bg-white/95 p-4 shadow-lg backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg. Attendance</p>
                      <p className="font-heading text-lg font-bold text-slate-900">98.4% Recorded</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SchoolManagementHeroSection;