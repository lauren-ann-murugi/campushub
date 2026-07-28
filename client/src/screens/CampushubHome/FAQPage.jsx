"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Minus, 
  Search, 
  ArrowRight, 
  Sparkles, 
  HelpCircle,
  MessageSquare
} from "lucide-react";

import { PrimaryNavigationSection } from "./sections/PrimaryNavigationSection/PrimaryNavigationSection";
import { SiteFooterSection } from "./sections/SiteFooterSection/SiteFooterSection";

const FAQS_DATA = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I create an account on CampusHub?",
        a: "Click the Register button on the homepage, select your role (student, teacher, or administrator), fill in your details, and verify your email. You'll be taken to your role-specific dashboard automatically.",
      },
      {
        q: "Which roles are supported?",
        a: "CampusHub supports three roles: Student, Teacher, and Administrator. Each role gets a tailored dashboard with relevant features and permissions.",
      },
      {
        q: "Do I need to verify my email?",
        a: "Yes. After registering, a 6-digit verification code is sent to your email. Enter the code to activate your account. If you don't receive it, check your spam folder or contact support.",
      },
    ],
  },
  {
    category: "For Students",
    items: [
      {
        q: "Can I view my attendance and results?",
        a: "Yes. The student dashboard has dedicated Attendance and Results sections where you can view your records, attendance percentage, and exam scores in real time.",
      },
      {
        q: "How do I pay my fees?",
        a: "Visit the Fees section in your dashboard to view outstanding fees, payment history, and status. Contact your school's administration for payment methods.",
      },
      {
        q: "Can I update my profile picture?",
        a: "Yes. Go to Profile, hover over your avatar, and click the camera icon to upload a new picture. You can also remove it anytime.",
      },
    ],
  },
  {
    category: "For Teachers",
    items: [
      {
        q: "How do I take attendance?",
        a: "Navigate to the Attendance page, select your class, then mark each student as Present, Late, or Absent. Use 'Mark all present' for quick entry, then click Save.",
      },
      {
        q: "Can I create and grade exams?",
        a: "Yes. The Exams page lets you create new exams with title, date, and max score. Click 'Enter grades' to record scores for each student. The exam status updates to 'Graded' once saved.",
      },
    ],
  },
  {
    category: "For Administrators",
    items: [
      {
        q: "How do I send notifications to users?",
        a: "Go to the Notifications section in the admin dashboard, click 'New notification', choose your category and target audience, write your message, and hit Send. It appears instantly in users' notification bell.",
      },
      {
        q: "Can I track fee collection?",
        a: "Yes. The Fees section shows collected, pending, and overdue amounts, with a breakdown by class. You can also export reports.",
      },
    ],
  },
  {
    category: "Security & Privacy",
    items: [
      {
        q: "Is my data secure?",
        a: "Yes. CampusHub uses industry-standard encryption and Row Level Security policies. Each user can only access their own data, and admin actions are restricted to administrator accounts.",
      },
      {
        q: "Can I change my password?",
        a: "Yes. Go to Settings in your dashboard, enter your new password, and click Update. We recommend using a strong, unique password.",
      },
    ],
  },
];

export default function FAQPage() {
  const router = useRouter();
  const [openKey, setOpenKey] = useState("0-0");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...FAQS_DATA.map((c) => c.category)];

  // Filter FAQs based on search and selected category filter
  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.map((group, groupIdx) => {
      if (activeCategory !== "All" && group.category !== activeCategory) {
        return null;
      }

      const matchingItems = group.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingItems.length === 0) return null;

      return {
        ...group,
        originalGroupIdx: groupIdx,
        items: matchingItems,
      };
    }).filter(Boolean);
  }, [searchQuery, activeCategory]);

  const toggleAccordion = (key) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900">
      <PrimaryNavigationSection />

      {/* Hero Header */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] opacity-10 [background-size:16px_16px]" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-200 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-blue-300" />
            <span>Help Center</span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h1>

          <p className="mt-4 text-base text-blue-100/90 sm:text-lg max-w-xl mx-auto leading-relaxed">
            Have questions about CampusHub? Search our knowledge base or browse by category below.
          </p>

          {/* Search Bar Input */}
          <div className="mt-8 mx-auto max-w-xl">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. attendance, grades, password)..."
                className="w-full rounded-2xl border border-blue-400/30 bg-white/10 backdrop-blur-md py-4 pl-12 pr-4 text-sm text-white placeholder-blue-200/60 shadow-lg focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Category Pills */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length > 0 ? (
          <div className="space-y-10">
            {filteredFaqs.map((group) => (
              <div key={group.category} className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-600 inline-block" />
                  {group.category}
                </h2>

                <div className="space-y-3">
                  {group.items.map((item, itemIdx) => {
                    const key = `${group.originalGroupIdx}-${itemIdx}`;
                    const isOpen = openKey === key;

                    return (
                      <div
                        key={key}
                        className={`overflow-hidden rounded-2xl border transition-all ${
                          isOpen 
                            ? "border-blue-200 bg-white shadow-md ring-1 ring-blue-500/10" 
                            : "border-slate-200/80 bg-white hover:border-slate-300 shadow-xs"
                        }`}
                      >
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => toggleAccordion(key)}
                          className="flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left transition-colors"
                        >
                          <span className="text-sm font-semibold text-slate-900 sm:text-base">
                            {item.q}
                          </span>
                          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                            isOpen ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                          }`}>
                            {isOpen ? (
                              <Minus className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50">
                            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">No matching questions found</h3>
            <p className="mt-1 text-sm text-slate-500">
              We couldn't find anything matching "{searchQuery}". Try searching another keyword or contact support.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-6 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

      </section>

      {/* Bottom CTA Section */}
      <section className="border-t border-slate-200/80 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <MessageSquare className="h-6 w-6" />
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Still have questions?
          </h2>
          <p className="mt-2 text-base text-slate-600 max-w-md mx-auto">
            Can't find the answer you're looking for? Please reach out to our friendly support team.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/contact")}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-500 hover:shadow-lg"
            >
              <span>Contact Us</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              Sign In to Account
            </button>
          </div>
        </div>
      </section>

      <SiteFooterSection />
    </main>
  );
}