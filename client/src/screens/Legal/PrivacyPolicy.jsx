import React from "react";
import Link from "next/link";
import { LogoMark } from "@/components/icons";

const SECTIONS = [
  {
    heading: "1. Information We Collect",
    body: "We collect information you provide when registering an account, including your first name, last name, email address, selected role, and password. We also collect information generated through your use of the Service, such as class enrollment, attendance records, grades, and activity logs.",
  },
  {
    heading: "2. How We Use Your Information",
    body: "We use your information to operate and improve the Service, to provide role-based access to features, to communicate with you about your account, to maintain security, and to comply with legal obligations. We do not sell your personal information to third parties.",
  },
  {
    heading: "3. Sharing of Information",
    body: "Your information is shared with authorized staff within your institution for the purpose of operating the school platform. We may share information with service providers who help us deliver the Service under appropriate confidentiality obligations, or when required by law.",
  },
  {
    heading: "4. Data Security",
    body: "We use reasonable technical and organizational measures to protect your information, including encryption in transit and at rest, role-based access controls, and row-level security in our database. No method of transmission or storage is completely secure, but we work to protect your data.",
  },
  {
    heading: "5. Your Rights",
    body: "You have the right to access, correct, or request deletion of your personal information. You may also object to certain processing of your data. To exercise these rights, contact your institution's administrator or our support team. We will respond within a reasonable timeframe.",
  },
  {
    heading: "6. Data Retention",
    body: "We retain your information for as long as your account is active or as needed to provide the Service. When your account is closed, we will remove or anonymize your personal information within a reasonable period, except where retention is required by law.",
  },
  {
    heading: "7. Children's Privacy",
    body: "CampusHub is designed for use by educational institutions and their members, including students. For users under the age of 16, the institution and parents or guardians are responsible for providing consent. We handle student data with care and in line with applicable data protection laws.",
  },
  {
    heading: "8. Cookies and Local Storage",
    body: "The Service uses local storage to keep you signed in and to remember your preferences. We do not use cookies for advertising. You can clear local storage through your browser settings, which will sign you out of the Service.",
  },
  {
    heading: "9. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time. We will notify users of significant changes. Continued use of the Service after changes constitutes acceptance of the revised policy.",
  },
  {
    heading: "10. Contact",
    body: "If you have questions about this Privacy Policy or how your data is handled, please contact your institution's CampusHub administrator or our support team at privacy@campushub.app.",
  },
];

export const PrivacyPolicy = () => (
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
          Privacy Policy
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

export default PrivacyPolicy;