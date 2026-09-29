import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { answerDashboardQuery } from "@/lib/dashboard-answers.server";

function database(rows: Record<string, Array<Record<string, unknown>>>) {
  const client = {
    from: (table: string) => {
      const result = { data: rows[table] ?? [], error: null };
      const query = {
        order: () => query,
        limit: () => Promise.resolve(result),
        eq: () => Promise.resolve(result),
      };
      return { select: () => query };
    },
  };
  return client as unknown as SupabaseClient<Database>;
}

describe("consultas del panel", () => {
  it("lista estudiantes desde Supabase y permite ver una ficha", async () => {
    const db = database({
      students: [{ id: "s1", name: "Ana Mora", code: "A01", grade: "5°", status: "Activo", score: 95, tutor: "María", phone: "123", email: "a@example.org", alert: "", }],
      courses: [],
    });
    expect(await answerDashboardQuery(db, "Dame la lista de estudiantes", true, "admin"))
      .toContain("Ana Mora (A01, 5°");
    expect(await answerDashboardQuery(db, "Ficha de Ana Mora", true, "admin"))
      .toContain("Encargado: María");
  });

  it("restringe las solicitudes al administrador", async () => {
    const db = database({ admission_requests: [{ student_name: "Luis", student_document: "X1", status: "pendiente", desired_level: "Primaria" }] });
    expect(await answerDashboardQuery(db, "Mostrame las solicitudes", false, "docente"))
      .toContain("Solo administración");
    expect(await answerDashboardQuery(db, "Mostrame las solicitudes", true, "admin"))
      .toContain("Luis");
  });

  it("no expone cursos no asignados al docente", async () => {
    const db = database({
      courses: [{ id: "c1", title: "Matemáticas", teacher_id: "t1", teacher: "Ana", enrolled: 2, capacity: 10, schedule: "Lunes" }],
      teacher_profiles: [{ id: "t2", user_id: "docente" }],
    });
    expect(await answerDashboardQuery(db, "Lista de cursos", false, "docente"))
      .toBe("No hay cursos disponibles para tu cuenta.");
  });
});
