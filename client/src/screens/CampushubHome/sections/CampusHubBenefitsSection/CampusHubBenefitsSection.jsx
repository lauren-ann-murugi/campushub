"use client";

import React from "react";
import Image from "next/image";
import { 
  ShieldCheck, 
  Smile, 
  Zap, 
  Smartphone, 
  CheckCircle2 
} from "lucide-react";

// Local Benefit Items Data Configuration
const benefits = [
  {
    title: "Secure Platform",
    description:
      "Enterprise-grade security protecting sensitive student records and financial transactions.",
    icon: ShieldCheck,
    badgeBg: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    title: "User Friendly",
    description:
      "Intuitive interfaces designed to require minimal training for administrators, teachers, and students.",
    icon: Smile,
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    title: "Fast Performance",
    description:
      "Optimized cloud infrastructure ensuring ultra-fast load times even during peak exam results periods.",
    icon: Zap,
    badgeBg: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    title: "Responsive Design",
    description:
      "Seamless operational access across all desktops, tablets, and mobile devices.",
    icon: Smartphone,
    badgeBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
];

export const CampusHubBenefitsSection = () => {
  return (
    <section className="w-full bg-slate-50/50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* Left Column: Heading, Subtitle & Interactive Feature Cards */}
          <article className="flex flex-col items-start lg:col-span-7">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-600 border border-blue-100 shadow-xs">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Why Educational Leaders Choose CampusHub</span>
            </div>

            {/* Section Header */}
            <header className="mt-4 flex flex-col gap-3">
              <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Managing Education, <br className="hidden sm:inline" />
                <span className="text-blue-600">Empowering Success.</span>
              </h2>
              <p className="font-body text-base leading-relaxed text-slate-600 sm:text-lg max-w-2xl">
                We combine robust technology with intuitive design to deliver a platform that genuinely simplifies administration—giving your staff more time to focus on student success.
              </p>
            </header>

            {/* Benefits Grid */}
            <ul className="mt-8 grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
              {benefits.map((benefit) => {
                const IconComponent = benefit.icon;
                return (
                  <li
                    key={benefit.title}
                    className="group flex flex-col items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${benefit.badgeBg} transition-transform duration-300 group-hover:scale-105`}>
                      <IconComponent className="h-6 w-6 shrink-0" />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-slate-900">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 font-body text-sm leading-relaxed text-slate-600">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </article>

          {/* Right Column: Layered Visual Presentation Card */}
          <div className="flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md">
              <div className="relative mx-auto h-[420px] w-full sm:h-[500px]">
                
                {/* Decorative Rotating Background Plates */}
                <div
                  className="absolute inset-0 h-full w-full rotate-3 rounded-3xl bg-blue-600/10 transition-transform duration-500 hover:rotate-6"
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0 h-full w-full -rotate-3 rounded-3xl bg-emerald-500/10 transition-transform duration-500 hover:-rotate-6"
                  aria-hidden="true"
                />

                {/* Primary Next.js Image Container */}
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
                  <Image
                    src="https://images.pexels.com/photos/5212329/pexels-photo-5212329.jpeg?auto=compress&cs=tinysrgb&w=900"
                    alt="CampusHub school management platform displayed on a screen"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    priority
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CampusHubBenefitsSection;