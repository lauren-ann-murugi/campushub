"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

import { PrimaryNavigationSection } from "./sections/PrimaryNavigationSection/PrimaryNavigationSection";
import { SchoolManagementHeroSection } from "./sections/SchoolManagementHeroSection/SchoolManagementHeroSection";
import { SchoolPlatformStatisticsSection } from "./sections/SchoolPlatformStatisticsSection";
import { SchoolManagementFeaturesSection } from "./sections/SchoolManagementFeaturesSection/SchoolManagementFeaturesSection";
import { CampusHubBenefitsSection } from "./sections/CampusHubBenefitsSection/CampusHubBenefitsSection";
import { SiteFooterSection } from "./sections/SiteFooterSection/SiteFooterSection";

export default function CampushubHome() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Track scroll depth to display back-to-top floating control
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Sticky Global Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
        <PrimaryNavigationSection />
      </header>

      {/* Core Page Sections */}
      <main className="relative flex flex-col w-full">
        {/* 1. Hero Banner */}
        <section className="relative w-full">
          <SchoolManagementHeroSection />
        </section>

        {/* 2. Platform Key Metrics & Statistics */}
        <section className="relative w-full border-y border-slate-200/80 bg-white py-12 shadow-xs">
          <SchoolPlatformStatisticsSection />
        </section>

        {/* 3. Detailed Feature Showcase */}
        <section className="relative w-full py-16 md:py-24">
          <SchoolManagementFeaturesSection />
        </section>

        {/* 4. Value Proposition & Key Benefits */}
        <section className="relative w-full border-t border-slate-200/80 bg-slate-100/60 py-16 md:py-24">
          <CampusHubBenefitsSection />
        </section>
      </main>

      {/* Global Site Footer */}
      <SiteFooterSection />

      {/* Back to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-105 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}