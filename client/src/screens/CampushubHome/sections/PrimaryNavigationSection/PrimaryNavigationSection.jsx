// // "use client";

// // import React, { useState, useEffect } from "react";
// // import Link from "next/link";
// // import Image from "next/image";
// // import { usePathname, useRouter } from "next/navigation";
// // import { Menu, X, ArrowRight, GraduationCap } from "lucide-react";
// // import { Button } from "@/components/ui/button";

// // const NAV_LINKS = [
// //   { label: "Features", href: "/#features" },
// //   { label: "About", href: "/about" },
// //   { label: "FAQ", href: "/faq" },
// //   { label: "Contact", href: "/contact" },
// // ];

// // export const PrimaryNavigationSection = () => {
// //   const pathname = usePathname();
// //   const router = useRouter();
// //   const [menuOpen, setMenuOpen] = useState(false);
// //   const [scrolled, setScrolled] = useState(false);

// //   // Monitor scroll state for subtle glassmorphism elevation
// //   useEffect(() => {
// //     const handleScroll = () => {
// //       setScrolled(window.scrollY > 10);
// //     };
// //     window.addEventListener("scroll", handleScroll);
// //     return () => window.removeEventListener("scroll", handleScroll);
// //   }, []);

// //   // Close mobile drawer on route change
// //   useEffect(() => {
// //     setMenuOpen(false);
// //   }, [pathname]);

// //   return (
// //     <header
// //       className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
// //         scrolled
// //           ? "border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-md"
// //           : "border-slate-100 bg-white/95 backdrop-blur-xs"
// //       }`}
// //     >
// //       <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        
// //         {/* Brand Logo */}
// //         <Link
// //           href="/"
// //           className="group inline-flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
// //         >
// //           <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
// //             <GraduationCap className="h-6 w-6" />
// //           </div>
// //           <span className="font-heading text-2xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
// //             CampusHub
// //           </span>
// //         </Link>

// //         {/* Desktop Navigation Links */}
// //         <nav aria-label="Primary Navigation" className="hidden md:block">
// //           <ul className="flex items-center gap-8">
// //             {NAV_LINKS.map(({ label, href }) => {
// //               const isActive = pathname === href;
// //               return (
// //                 <li key={label}>
// //                   <Link
// //                     href={href}
// //                     className={`relative py-1 font-body text-sm font-medium transition-colors hover:text-blue-600 ${
// //                       isActive ? "text-blue-600 font-semibold" : "text-slate-600"
// //                     }`}
// //                   >
// //                     {label}
// //                     {isActive && (
// //                       <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
// //                     )}
// //                   </Link>
// //                 </li>
// //               );
// //             })}
// //           </ul>
// //         </nav>

// //         {/* Desktop Auth Call to Actions */}
// //         <div className="hidden items-center gap-3 md:flex">
// //           <Button
// //             variant="ghost"
// //             onClick={() => router.push("/login")}
// //             className="font-body text-sm font-medium text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
// //           >
// //             Sign In
// //           </Button>

// //           <Button
// //             onClick={() => router.push("/register")}
// //             className="group relative inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-body text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]"
// //           >
// //             <span>Register</span>
// //             <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
// //           </Button>
// //         </div>

// //         {/* Mobile Hamburger Toggle Button */}
// //         <button
// //           type="button"
// //           aria-label="Toggle navigation menu"
// //           aria-expanded={menuOpen}
// //           onClick={() => setMenuOpen((prev) => !prev)}
// //           className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 md:hidden"
// //         >
// //           {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
// //         </button>
// //       </div>

// //       {/* Mobile Navigation Drawer */}
// //       {menuOpen && (
// //         <div className="animate-in slide-in-from-top-2 duration-200 border-b border-slate-200 bg-white/95 px-4 pb-6 pt-2 backdrop-blur-lg md:hidden">
// //           <nav aria-label="Mobile Navigation">
// //             <ul className="flex flex-col space-y-1">
// //               {NAV_LINKS.map(({ label, href }) => {
// //                 const isActive = pathname === href;
// //                 return (
// //                   <li key={label}>
// //                     <Link
// //                       href={href}
// //                       onClick={() => setMenuOpen(false)}
// //                       className={`flex w-full items-center justify-between rounded-lg px-4 py-3 font-body text-base font-medium transition-colors ${
// //                         isActive
// //                           ? "bg-blue-50 text-blue-600 font-semibold"
// //                           : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
// //                       }`}
// //                     >
// //                       <span>{label}</span>
// //                       {isActive && (
// //                         <span className="h-2 w-2 rounded-full bg-blue-600" />
// //                       )}
// //                     </Link>
// //                   </li>
// //                 );
// //               })}
// //             </ul>
// //           </nav>

// //           <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-100">
// //             <Button
// //               variant="outline"
// //               onClick={() => {
// //                 setMenuOpen(false);
// //                 router.push("/login");
// //               }}
// //               className="w-full justify-center rounded-xl border-slate-200 font-body text-base font-medium text-slate-700"
// //             >
// //               Sign In
// //             </Button>
            
// //             <Button
// //               onClick={() => {
// //                 setMenuOpen(false);
// //                 router.push("/register");
// //               }}
// //               className="w-full justify-center gap-2 rounded-xl bg-blue-600 font-body text-base font-semibold text-white hover:bg-blue-700"
// //             >
// //               <span>Get Started</span>
// //               <ArrowRight className="h-4 w-4" />
// //             </Button>
// //           </div>
// //         </div>
// //       )}
// //     </header>
// //   );
// // };

// // export default PrimaryNavigationSection;





// "use client";

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { Menu, X, ArrowRight, GraduationCap } from "lucide-react";
// import { Button } from "@/components/ui/Button";

// const NAV_LINKS = [
//   { label: "Features", href: "/#features" },
//   { label: "About", href: "/about" },
//   { label: "FAQ", href: "/faq" },
//   { label: "Contact", href: "/contact" },
// ];

// export const PrimaryNavigationSection = () => {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   // Monitor scroll state for navbar background elevation
//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 10);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Close mobile menu whenever path changes
//   useEffect(() => {
//     setMenuOpen(false);
//   }, [pathname]);

//   // Smooth scroll handler for anchor links
//   const handleNavClick = (e, href) => {
//     setMenuOpen(false);

//     if (href.startsWith("/#")) {
//       const targetId = href.replace("/#", "");

//       // If we are already on the homepage, scroll smoothly taking header height into account
//       if (pathname === "/") {
//         e.preventDefault();
//         const element = document.getElementById(targetId);
//         if (element) {
//           const headerOffset = 80; // Match h-20 header height
//           const elementPosition = element.getBoundingClientRect().top;
//           const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

//           window.scrollTo({
//             top: offsetPosition,
//             behavior: "smooth",
//           });
//         }
//       }
//     }
//   };

//   // Exact matching for routes to prevent false active underlines
//   const isLinkActive = (href) => {
//     if (href.startsWith("/#")) {
//       return false; // Prevent anchor link from staying permanently active on home page
//     }
//     return pathname === href || pathname.startsWith(`${href}/`);
//   };

//   return (
//     <header
//       className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
//         scrolled
//           ? "border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-md"
//           : "border-slate-100 bg-white/95 backdrop-blur-xs"
//       }`}
//     >
//       <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        
//         {/* Brand Logo */}
//         <Link
//           href="/"
//           className="group inline-flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
//         >
//           <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
//             <GraduationCap className="h-6 w-6" />
//           </div>
//           <span className="font-heading text-2xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
//             CampusHub
//           </span>
//         </Link>

//         {/* Desktop Navigation */}
//         <nav aria-label="Primary Navigation" className="hidden md:block">
//           <ul className="flex items-center gap-8">
//             {NAV_LINKS.map(({ label, href }) => {
//               const active = isLinkActive(href);
//               return (
//                 <li key={label}>
//                   <Link
//                     href={href}
//                     onClick={(e) => handleNavClick(e, href)}
//                     className={`relative py-1 font-body text-sm font-medium transition-colors hover:text-blue-600 ${
//                       active ? "text-blue-600 font-semibold" : "text-slate-600"
//                     }`}
//                   >
//                     {label}
//                     {active && (
//                       <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
//                     )}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//         </nav>

//         {/* Desktop Call To Actions */}
//         <div className="hidden items-center gap-3 md:flex">
//           <Button
//             variant="ghost"
//             onClick={() => router.push("/login")}
//             className="font-body text-sm font-medium text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
//           >
//             Sign In
//           </Button>

//           <Button
//             onClick={() => router.push("/register")}
//             className="group relative inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-body text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]"
//           >
//             <span>Register</span>
//             <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
//           </Button>
//         </div>

//         {/* Mobile Menu Toggle Button */}
//         <button
//           type="button"
//           aria-label="Toggle navigation menu"
//           aria-expanded={menuOpen}
//           onClick={() => setMenuOpen((prev) => !prev)}
//           className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 md:hidden"
//         >
//           {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//         </button>
//       </div>

//       {/* Mobile Drawer */}
//       {menuOpen && (
//         <div className="animate-in slide-in-from-top-2 duration-200 border-b border-slate-200 bg-white/95 px-4 pb-6 pt-2 backdrop-blur-lg md:hidden">
//           <nav aria-label="Mobile Navigation">
//             <ul className="flex flex-col space-y-1">
//               {NAV_LINKS.map(({ label, href }) => {
//                 const active = isLinkActive(href);
//                 return (
//                   <li key={label}>
//                     <Link
//                       href={href}
//                       onClick={(e) => handleNavClick(e, href)}
//                       className={`flex w-full items-center justify-between rounded-lg px-4 py-3 font-body text-base font-medium transition-colors ${
//                         active
//                           ? "bg-blue-50 text-blue-600 font-semibold"
//                           : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
//                       }`}
//                     >
//                       <span>{label}</span>
//                       {active && (
//                         <span className="h-2 w-2 rounded-full bg-blue-600" />
//                       )}
//                     </Link>
//                   </li>
//                 );
//               })}
//             </ul>
//           </nav>

//           <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-100">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setMenuOpen(false);
//                 router.push("/login");
//               }}
//               className="w-full justify-center rounded-xl border-slate-200 font-body text-base font-medium text-slate-700"
//             >
//               Sign In
//             </Button>
            
//             <Button
//               onClick={() => {
//                 setMenuOpen(false);
//                 router.push("/register");
//               }}
//               className="w-full justify-center gap-2 rounded-xl bg-blue-600 font-body text-base font-semibold text-white hover:bg-blue-700"
//             >
//               <span>Get Started</span>
//               <ArrowRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default PrimaryNavigationSection;








"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, GraduationCap } from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export const PrimaryNavigationSection = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll state for navbar background elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu whenever route path changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Smooth scroll handler for anchor links
  const handleNavClick = (e, href) => {
    setMenuOpen(false);

    if (href && href.startsWith("/#")) {
      const targetId = href.replace("/#", "");

      // If we are already on the homepage, scroll smoothly taking header height into account
      if (pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 80; // Matches h-20 header height
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    }
  };

  // Exact matching for routes to prevent false active underlines
  const isLinkActive = (href) => {
    if (href.startsWith("/#")) {
      return false; // Prevent anchor link from staying permanently active on home page
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-md"
          : "border-slate-100 bg-white/95 backdrop-blur-xs"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-20">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-heading text-2xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
            CampusHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary Navigation" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isLinkActive(href);
              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={(e) => handleNavClick(e, href)}
                    className={`relative py-1 font-body text-sm font-medium transition-colors hover:text-blue-600 ${
                      active ? "text-blue-600 font-semibold" : "text-slate-600"
                    }`}
                  >
                    {label}
                    {active && (
                      <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop Call To Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/login">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 font-body text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100/80 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Sign In
            </button>
          </Link>

          <Link href="/register">
            <button
              type="button"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-body text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <span>Register</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="animate-in slide-in-from-top-2 duration-200 border-b border-slate-200 bg-white/95 px-4 pb-6 pt-2 backdrop-blur-lg md:hidden">
          <nav aria-label="Mobile Navigation">
            <ul className="flex flex-col space-y-1">
              {NAV_LINKS.map(({ label, href }) => {
                const active = isLinkActive(href);
                return (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={(e) => handleNavClick(e, href)}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-3 font-body text-base font-medium transition-colors ${
                        active
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{label}</span>
                      {active && (
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-slate-100">
            <Link href="/login" onClick={() => setMenuOpen(false)} className="w-full">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-xl border border-slate-200 px-4 py-2.5 font-body text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Sign In
              </button>
            </Link>

            <Link href="/register" onClick={() => setMenuOpen(false)} className="w-full">
              <button
                type="button"
                className="w-full inline-flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-body text-base font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PrimaryNavigationSection;