import { z } from "zod";

export const admissionSchema = z.object({
  student_name: z.string().trim().min(3).max(120),
  student_document: z.string().trim().min(3).max(40),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  desired_level: z.string().trim().min(2).max(80),
  guardian_name: z.string().trim().min(3).max(120),
  guardian_document: z.string().trim().min(3).max(40),
  guardian_email: z.string().trim().email().max(255),
  guardian_phone: z.string().trim().min(7).max(30),
  entry_type: z.enum(["nuevo", "regular", "reingreso"]),
});

const LEVEL_ALIASES: Record<string, string> = {
  "1": "1° Primaria",
  "2": "2° Primaria",
  "3": "3° Primaria",
  "4": "4° Primaria",
  "5": "5° Primaria",
  "6": "6° Primaria",
  maternal: "Maternal",
  interactivo1: "Interactivo I",
  interactivo2: "Interactivo II",
  preparatoria: "Transición",
};

export function admissionFromForm(data: FormData, entryType: string) {
  const rawLevel = String(data.get("est_nivel") ?? "").trim();
  const desiredLevel = LEVEL_ALIASES[rawLevel] ?? rawLevel;

  return admissionSchema.parse({
    student_name: data.get("est_nombre"),
    student_document: data.get("est_id"),
    birth_date: data.get("est_fecha"),
    desired_level: desiredLevel,
    guardian_name: data.get("enc_nombre"),
    guardian_document: data.get("enc_id"),
    guardian_email: data.get("enc_email"),
    guardian_phone: data.get("enc_tel"),
    entry_type: entryType,
  });
}
