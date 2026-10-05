export const APP_SECTIONS = [
  "home",
  "courses",
  "students",
  "records",
  "announcements",
  "newsletter",
  "admissions",
  "teachers",
  "users",
  "supervision",
  "assistant",
  "profile",
] as const;
export type AppSection = (typeof APP_SECTIONS)[number];
export const APP_SECTION_KEY = "edugestion:app-section";

export function savedView(value: string | null): AppSection {
  return APP_SECTIONS.find((section) => section === value) ?? "home";
}
