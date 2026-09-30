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
        single: () => Promise.resolve({ data: result.data[0] ?? null, error: null }),
        then: (resolve: (value: typeof result) => void) => resolve(result),
      };
      return { select: () => query };
    },
  };
  return client as unknown as SupabaseClient<Database>;
}

describe("consultas del panel", () => {
  it("lista estudiantes desde Supabase y permite ver una ficha", async () => {
    const db = database({
      students: [
        {
          id: "s1",
          name: "Ana Mora",
          code: "A01",
          grade: "5°",
          status: "Activo",
          score: 95,
          tutor: "María",
          phone: "123",
          email: "a@example.org",
          alert: "",
        },
      ],
      courses: [],
    });
    expect(await answerDashboardQuery(db, "Dame la lista de estudiantes", true, "admin")).toContain(
      "Ana Mora (A01, 5°",
    );
    expect(await answerDashboardQuery(db, "Ficha de Ana Mora", true, "admin")).toContain(
      "Encargado: María",
    );
  });

  it("restringe las solicitudes al administrador", async () => {
    const db = database({
      admission_requests: [
        {
          student_name: "Luis",
          student_document: "X1",
          status: "pendiente",
          desired_level: "Primaria",
        },
      ],
    });
    expect(await answerDashboardQuery(db, "Mostrame las solicitudes", false, "docente")).toContain(
      "Solo administración",
    );
    expect(await answerDashboardQuery(db, "Mostrame las solicitudes", true, "admin")).toContain(
      "Luis",
    );
  });

  it("no expone cursos no asignados al docente", async () => {
    const db = database({
      courses: [
        {
          id: "c1",
          title: "Matemáticas",
          teacher_id: "t1",
          teacher: "Ana",
          enrolled: 2,
          capacity: 10,
          schedule: "Lunes",
        },
      ],
      teacher_profiles: [{ id: "t2", user_id: "docente" }],
    });
    expect(await answerDashboardQuery(db, "Lista de cursos", false, "docente")).toBe(
      "No hay cursos disponibles para tu cuenta.",
    );
  });

  it("lista estudiantes y docentes aunque falten tablas de docentes", async () => {
    const missing = { data: null, error: { code: "PGRST205", message: "missing" } };
    const rows: Record<string, Array<Record<string, unknown>>> = {
      students: [{ id: "s1", name: "Ana Mora", code: "A01", grade: "5°", status: "Activo" }],
      courses: [{ id: "c1", title: "Matemáticas", teacher: "Luis Soto" }],
    };
    const db = {
      from: (table: string) => {
        const result = table in rows ? { data: rows[table], error: null } : missing;
        const query = {
          order: () => query,
          limit: () => Promise.resolve(result),
          eq: () => Promise.resolve(result),
          then: (r: (v: unknown) => void) => r(result),
        };
        return { select: () => query };
      },
    } as unknown as SupabaseClient<Database>;
    expect(await answerDashboardQuery(db, "Dame la lista de estudiantes", true, "admin")).toContain(
      "Ana Mora",
    );
    expect(
      await answerDashboardQuery(db, "Mostrame los docentes y sus cursos", true, "admin"),
    ).toContain("Luis Soto; cursos: Matemáticas");
  });

  it("explica todas las secciones disponibles del panel", async () => {
    const answer = await answerDashboardQuery(
      database({}),
      "¿Qué información del panel podés consultar?",
      true,
      "admin",
    );
    expect(answer).toContain("Cursos:");
    expect(answer).toContain("Solicitudes:");
    expect(answer).toContain("Supervisión:");
    expect(answer).toContain("Perfil:");
  });

  it("devuelve la actividad de supervisión con cursos y anuncios", async () => {
    const answer = await answerDashboardQuery(
      database({
        courses: [
          { id: "c1", title: "Matemáticas", teacher: "Luis", updated_at: "2026-09-30T10:00:00Z" },
        ],
        announcements: [{ id: "a1", title: "Reunión", created_at: "2026-09-30T11:00:00Z" }],
      }),
      "Mostrame la actividad de supervisión",
      true,
      "admin",
    );
    expect(answer).toContain("Anuncio: Reunión");
    expect(answer).toContain("Curso: Matemáticas — Luis");
  });

  it("resume estudiantes y cupos sin depender de n8n", async () => {
    const db = database({
      students: [{ status: "Activo" }, { status: "Activo" }, { status: "Inactivo" }],
      courses: [
        { id: "c1", title: "Primero", capacity: 20, enrolled: 15 },
        { id: "c2", title: "Segundo", capacity: 20, enrolled: 18 },
      ],
    });
    expect(
      await answerDashboardQuery(db, "Resume el estado de los estudiantes", true, "admin"),
    ).toContain("Activo: 2");
    expect(
      await answerDashboardQuery(db, "¿Cuántos cupos quedan en total?", true, "admin"),
    ).toContain("7 cupos libres");
  });
});
