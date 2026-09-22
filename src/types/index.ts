/**
 * Global application types for CEAC Platform
 */

export type View =
  | "login"
  | "home"
  | "courses"
  | "students"
  | "teachers"
  | "assistant"
  | "profile"
  | "teacher_home"
  | "teacher_courses"
  | "teacher_grades"
  | "teacher_attendance"
  | "teacher_resources"
  | "admin_supervision";

export type Role = "Administrador" | "Docente";

export type CourseCategory = "all" | "ciencias" | "humanidades" | "artes" | "idiomas";

export interface Course {
  category: CourseCategory | string;
  level: string;
  tag: string;
  title: string;
  teacher: string;
  schedule: string;
  room: string;
  capacityLabel: string;
  occupancy: string;
  note: string;
  count: number;
  icon: string;
  face: string;
}

export interface Student {
  name: string;
  id: string;
  status: string;
  grade: string;
  score: string;
  trend: string;
  tutor: string;
  image: string;
  alert: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  status: string;
  classes: number;
  rating: string;
  image: string;
  alert: string;
}

export interface ChartBar {
  month: string;
  value: string;
  height: string;
  kind: "real" | "estimate";
}

export interface AnnouncementType {
  image: string;
  icon: string;
  label: string;
  date: string;
  title: string;
  text: string;
  owner: string;
  action: string;
}
