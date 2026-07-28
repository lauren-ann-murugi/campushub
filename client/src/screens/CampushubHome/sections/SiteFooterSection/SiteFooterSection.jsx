// "use client";

// import React from "react";
// import Link from "next/link";
// import { GraduationCap, Mail, Phone, Twitter, Linkedin, Facebook, Github } from "lucide-react";

// const FOOTER_NAVIGATION = [
//   {
//     title: "Product",
//     links: [
//       { label: "Features", path: "/#features" },
//       { label: "Pricing", path: "/pricing" },
//       { label: "Case Studies", path: "/case-studies" },
//       { label: "Documentation", path: "/docs" },
//     ],
//   },
//   {
//     title: "Legal",
//     links: [
//       { label: "Privacy Policy", path: "/privacy" },
//       { label: "Terms of Service", path: "/terms" },
//       { label: "Cookie Policy", path: "/cookies" },
//       { label: "Compliance", path: "/compliance" },
//     ],
//   },
//   {
//     title: "Company",
//     links: [
//       { label: "About Us", path: "/about" },
//       { label: "Contact Us", path: "/contact" },
//       { label: "FAQ", path: "/faq" },
//       { label: "Careers", path: "/careers" },
//     ],
//   },
// ];

// const SOCIAL_LINKS = [
//   { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
//   { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
//   { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
//   { icon: Github, href: "https://github.com", label: "GitHub" },
// ];

// export const SiteFooterSection = () => {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="w-full border-t border-slate-200/80 bg-slate-900 text-slate-300">
//       <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
//         <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
//           {/* Brand Info & Mission Statement */}
//           <section
//             aria-labelledby="campushub-footer-title"
//             className="flex flex-col items-start gap-4 lg:col-span-4"
//           >
//             <Link
//               href="/"
//               className="inline-flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
//             >
//               <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
//                 <GraduationCap className="h-6 w-6" />
//               </div>
//               <span
//                 id="campushub-footer-title"
//                 className="font-heading text-2xl font-bold tracking-tight text-white"
//               >
//                 CampusHub
//               </span>
//             </Link>

//             <p className="max-w-sm font-body text-sm leading-relaxed text-slate-400">
//               Managing Education, Empowering Success. CampusHub is the next-generation school management system connecting administrators, teachers, students, and parents seamlessly.
//             </p>

//             {/* Quick Contact Micro-Details */}
//             <div className="mt-2 space-y-2 font-body text-xs text-slate-400">
//               <div className="flex items-center gap-2">
//                 <Mail className="h-4 w-4 text-blue-400" />
//                 <span>support@campushub.edu</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Phone className="h-4 w-4 text-emerald-400" />
//                 <span>+1 (800) 555-HUB24</span>
//               </div>
//             </div>

//             {/* Social Links */}
//             <div className="mt-2 flex items-center gap-3">
//               {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
//                 <a
//                   key={label}
//                   href={href}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   aria-label={label}
//                   className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-800/60 text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
//                 >
//                   <Icon className="h-4 w-4" />
//                 </a>
//               ))}
//             </div>
//           </section>

//           {/* Navigation Link Groups */}
//           <nav
//             aria-label="Footer navigation"
//             className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8"
//           >
//             {FOOTER_NAVIGATION.map((group) => (
//               <section key={group.title} aria-labelledby={`${group.title}-links`}>
//                 <h3
//                   id={`${group.title}-links`}
//                   className="font-heading text-xs font-bold uppercase tracking-wider text-slate-200"
//                 >
//                   {group.title}
//                 </h3>
//                 <ul className="mt-4 space-y-2.5">
//                   {group.links.map((link) => (
//                     <li key={link.label}>
//                       {link.path ? (
//                         <Link
//                           href={link.path}
//                           className="font-body text-sm text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
//                         >
//                           {link.label}
//                         </Link>
//                       ) : (
//                         <span className="font-body text-sm text-slate-600 cursor-not-allowed">
//                           {link.label}
//                         </span>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               </section>
//             ))}
//           </nav>
//         </div>

//         {/* Bottom Bar & Copyright */}
//         <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
//           <p className="font-body text-xs text-slate-400">
//             © {currentYear} CampusHub School Management System. All rights reserved.
//           </p>

//           <div className="flex items-center gap-6 font-body text-xs text-slate-400">
//             <Link href="/privacy" className="hover:text-slate-200 transition-colors">
//               Privacy
//             </Link>
//             <Link href="/terms" className="hover:text-slate-200 transition-colors">
//               Terms
//             </Link>
//             <Link href="/security" className="hover:text-slate-200 transition-colors">
//               Security
//             </Link>
//           </div>
//         </div>

//       </div>
//     </footer>
//   );
// };

// export default SiteFooterSection;


"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

// Inline SVG components for social brand icons to avoid missing lucide export errors
const FacebookIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FOOTER_NAVIGATION = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Solutions", href: "/#solutions" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Updates", href: "/#updates" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  },
];

const SOCIAL_LINKS = [
  { name: "Facebook", icon: FacebookIcon, href: "https://facebook.com" },
  { name: "Twitter", icon: TwitterIcon, href: "https://twitter.com" },
  { name: "LinkedIn", icon: LinkedinIcon, href: "https://linkedin.com" },
  { name: "GitHub", icon: GithubIcon, href: "https://github.com" },
];

export const SiteFooterSection = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                CampusHub
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Streamlining campus management with automated scheduling, attendance tracking, and intuitive administrative tools for schools and universities.
            </p>

            <div className="mt-6 flex items-center gap-4">
              {SOCIAL_LINKS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-800/50 text-slate-400 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {FOOTER_NAVIGATION.map((section) => (
              <div key={section.title}>
                <h3 className="font-heading text-sm font-semibold tracking-wider text-white uppercase">
                  {section.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center text-sm text-slate-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CampusHub. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed for seamless school operations.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooterSection;