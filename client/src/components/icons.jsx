import React from "react";

export const LogoMark = ({ className, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true" {...props}>
    <rect width="32" height="32" rx="8" fill="#004ac6" />
    <path d="M16 7L25 12V20L16 25L7 20V12L16 7Z" stroke="#fff" strokeWidth="2" strokeLinejoin="round" />
    <path d="M11 14.5L16 17L21 14.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 17V22" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ArrowRight = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TrendUp = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M3 17l6-6 4 4 7-7M14 8h7v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UsersIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ClipboardCheck = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
    <path d="M9 14l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const FileText = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GraduationCap = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M22 10L12 5 2 10l10 5 10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M6 12v5c0 1 2.5 3 6 3s6-2 6-3v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Wallet = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M21 12V7H5a2 2 0 010-4h14v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 5v14a2 2 0 002 2h16v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 12a2 2 0 000 4h4v-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const ShieldCheck = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Smile = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 9h.01M15 9h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Zap = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const Smartphone = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M12 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Sparkle = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

export const BookOpen = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M12 6.5C10.5 5 7 4.5 4 5v13c3-.5 6.5 0 8 1.5 1.5-1.5 5-2 8-1.5V5c-3-.5-6.5 0-8 1.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 6.5v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Presentation = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M3 4h18M4 4v10a2 2 0 002 2h12a2 2 0 002-2V4M12 16v4M9 20h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BuildingIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <rect x="4" y="3" width="16" height="18" rx="1" stroke="currentColor" strokeWidth="2" />
    <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ShieldKeyIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="2" />
    <path d="M12 13v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CheckCircle = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MoreHorizontal = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <circle cx="5" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="19" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// --- New icons for student portal ---

export const HomeIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UserIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const CalendarIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BookIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20V3H6.5A2.5 2.5 0 004 5.5v14z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 19.5A2.5 2.5 0 016.5 22H20v-5H6.5A2.5 2.5 0 004 19.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UserPlus = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M19 8v6M22 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BarChartIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="7" y="12" width="3" height="6" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="12" y="8" width="3" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
    <rect x="17" y="5" width="3" height="13" rx="1" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const CreditCardIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
    <path d="M6 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const HelpCircleIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SettingsIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LogOutIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BellIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.7 21a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LockIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PlusIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SendIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const XIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChevronDown = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EditIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SaveIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ClockIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AlertCircleIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const DownloadIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MailIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M22 7l-10 5L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MapPinIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const PhoneIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SearchIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CameraIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const TrashIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const MegaphoneIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M3 11l18-5v12L3 14v-3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.6 16.8a3 3 0 11-5.8-1.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ActivityIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ImageIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="2" />
    <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MinusIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ShieldIcon = ({ className, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" {...props}>
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);