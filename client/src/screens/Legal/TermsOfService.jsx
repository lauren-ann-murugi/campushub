import React from "react";
import Link from "next/link";
import { LogoMark } from "@/components/icons";

const SECTIONS = [
  {
    heading: "1. Acceptance of Terms",
    body: "By accessing or using CampusHub (the \"Service\"), you agree to be bound by these Terms of Service. If you do not agree, you may not access or use the Service. These terms apply to all visitors, students, teachers, and administrators.",
  },
  {
    heading: "2. Description of Service",
    body: "CampusHub is a school management platform that provides role-based portals for students, teachers, and administrators. The Service includes class management, attendance tracking, grading, admissions, fee management, and reporting features. We reserve the right to modify, suspend, or discontinue any part of the Service at any time.",
  },
  {
    heading: "3. Account Registration",
    body: "To use the Service you must register an account using a valid email address, a password, and your first and last name. You must provide accurate and complete information and keep your credentials confidential. You are responsible for all activity that occurs under your account.",
  },
  {
    heading: "4. Roles and Access",
    body: "Access levels are assigned based on your selected role (student, teacher, or administrator). You may only access features and data appropriate to your role. Attempting to access data or features outside your assigned role is prohibited and may result in suspension.",
  },
  {
    heading: "5. Acceptable Use",
    body: "You agree not to misuse the Service, including by uploading harmful content, harassing other users, attempting to gain unauthorized access, or interfering with the Service's operation. You are responsible for the content you submit and must respect the rights of others.",
  },
  {
    heading: "6. Intellectual Property",
    body: "The Service, including its design, software, and content, is owned by CampusHub and protected by intellectual property laws. Content you submit remains yours, but you grant CampusHub a license to host and display it within the Service for the purpose of operating the platform.",
  },
  {
    heading: "7. Termination",
    body: "You may close your account at any time by contacting your institution's administrator. CampusHub may suspend or terminate access if you violate these Terms or if your institution ends its use of the Service. Upon termination, your right to use the Service ceases immediately.",
  },
  {
    heading: "8. Disclaimer and Limitation of Liability",
    body: "The Service is provided \"as is\" without warranties of any kind. To the maximum extent permitted by law, CampusHub shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.",
  },
  {
    heading: "9. Changes to These Terms",
    body: "We may update these Terms from time to time. We will notify users of significant changes. Continued use of the Service after changes constitutes acceptance of the revised Terms.",
  },
  {
    heading: "10. Contact",
    body: "If you have questions about these Terms, please contact your institution's CampusHub administrator or our support team at support@campushub.app.",
  },
];

export const TermsOfService = () => (
  <main className="min-h-screen w-full bg-[#f7f9fb] px-5 py-10 sm:px-8 lg:py-16">
    <div className="mx-auto max-w-3xl">
      <Link href="/" className="inline-flex items-center gap-2">
        <LogoMark className="h-8 w-8 shrink-0" />
        <span className="[font-family:'Inter',Helvetica] text-xl font-bold tracking-[-0.50px] text-[#191c1e]">
          CampusHub
        </span>
      </Link>

      <header className="mt-8">
        <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#191c1e] sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 [font-family:'Inter',Helvetica] text-base font-normal leading-6 text-[#434655]">
          Last updated: July 20, 2026
        </p>
      </header>

      <div className="mt-8 flex flex-col gap-8">
        {SECTIONS.map((s) => (
          <section key={s.heading} className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold tracking-[-0.01em] text-[#191c1e]">
              {s.heading}
            </h2>
            <p className="[font-family:'Inter',Helvetica] text-base font-normal leading-[28.8px] text-[#434655]">
              {s.body}
            </p>
          </section>
        ))}
      </div>

      <div className="mt-12 border-t border-[#e6e8ea] pt-6">
        <Link
          href="/login"
          className="text-sm font-medium text-[#004ac6] hover:underline"
        >
          Back to login
        </Link>
      </div>
    </div>
  </main>
);

export default TermsOfService;