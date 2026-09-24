import { z } from "zod";

export const COURSE_CATEGORIES = ["ciencias", "humanidades", "artes", "idiomas"] as const;

export const courseSchema = z.object({
  title: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres").max(120),
  category: z.enum(COURSE_CATEGORIES),
  level: z.string().trim().min(1, "Selecciona un nivel").max(60),
  tag: z.string().trim().max(60).default(""),
  teacher: z.string().trim().min(1, "Indica el docente").max(120),
  schedule: z.string().trim().max(120).default(""),
  room: z.string().trim().max(120).default(""),
  capacity: z.coerce.number().int().min(1, "El cupo mínimo es 1").max(500),
  enrolled: z.coerce.number().int().min(0).max(500).default(0),
  note: z.string().trim().max(240).default(""),
});
export type CourseInput = z.infer<typeof courseSchema>;

export const studentSchema = z.object({
  name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres").max(120),
  grade: z.string().trim().min(1, "Selecciona el grado").max(60),
  status: z.string().trim().min(1).max(40),
  score: z.coerce.number().min(0).max(10).nullable().default(null),
  tutor: z.string().trim().max(120).default(""),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[0-9+\-\s()]*$/, "Teléfono inválido")
    .default(""),
  email: z.union([z.literal(""), z.string().trim().email("Correo inválido").max(255)]).default(""),
  alert: z.string().trim().max(160).default(""),
});
export type StudentInput = z.infer<typeof studentSchema>;

export const announcementSchema = z.object({
  title: z.string().trim().min(3, "El título debe tener al menos 3 caracteres").max(140),
  content: z.string().trim().min(1, "Escribe el contenido").max(2000),
  author_name: z.string().trim().max(120).default("Dirección"),
});
export type AnnouncementInput = z.infer<typeof announcementSchema>;

export const idSchema = z.object({ id: z.string().uuid() });

/** Returns the first validation message per field, or null when valid. */
export function fieldErrors<T extends z.ZodTypeAny>(schema: T, data: unknown) {
  const res = schema.safeParse(data);
  if (res.success) return null;
  const out: Record<string, string> = {};
  for (const issue of res.error.issues) {
    const k = String(issue.path[0] ?? "form");
    if (!out[k]) out[k] = issue.message;
  }
  return out;
}

export function occupancyPercent(enrolled: number, capacity: number) {
  if (capacity <= 0) return 0;
  return Math.min(100, Math.round((enrolled / capacity) * 100));
}

export type AppRole = "admin" | "docente" | "estudiante";
export function roleLabel(roles: AppRole[]): "Administrador" | "Docente" | "Estudiante" | null {
  if (roles.includes("admin")) return "Administrador";
  if (roles.includes("docente")) return "Docente";
  if (roles.includes("estudiante")) return "Estudiante";
  return null;
}
export function canManage(roles: AppRole[]) {
  return roles.includes("admin");
}
