import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  CalendarIcon,
  ClipboardIcon,
  SettingsIcon,
} from "../components/icons";

export const TEACHER_NAVIGATION = [
  { name: "Overview", href: "/dashboard/teacher", icon: HomeIcon },
  { name: "Students", href: "/dashboard/teacher/students", icon: UsersIcon },
  { name: "Classes", href: "/dashboard/teacher/classes", icon: BookOpenIcon },
  { name: "Timetable", href: "/dashboard/teacher/timetable", icon: CalendarIcon },
  { name: "Grades", href: "/dashboard/teacher/grades", icon: ClipboardIcon },
  { name: "Settings", href: "/dashboard/teacher/settings", icon: SettingsIcon },
];

export const STUDENT_NAVIGATION = [
  { name: "Overview", href: "/dashboard/student", icon: HomeIcon },
  { name: "My Subjects", href: "/dashboard/student/subjects", icon: BookOpenIcon },
  { name: "Timetable", href: "/dashboard/student/timetable", icon: CalendarIcon },
  { name: "Grades", href: "/dashboard/student/grades", icon: ClipboardIcon },
  { name: "Settings", href: "/dashboard/student/settings", icon: SettingsIcon },
];

export function getNavigationByRole(role) {
  if (role === "student") return STUDENT_NAVIGATION;
  return TEACHER_NAVIGATION;
}