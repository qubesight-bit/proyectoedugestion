import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { answerDashboardQuery } from "@/lib/dashboard-answers.server";

function reply(data: object, status = 200) {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

export async function handleInternalChat(request: Request): Promise<Response> {
  if (
    request.headers.get("origin") &&
    request.headers.get("origin") !== new URL(request.url).origin
  )
    return reply({ error: "Origen no permitido" }, 403);
  if (Number(request.headers.get("content-length")) > 12000)
    return reply({ error: "Solicitud demasiado grande" }, 413);
  const jwt = request.headers.get("authorization")?.match(/^Bearer ([^\s]+)$/)?.[1];
  if (!jwt) return reply({ error: "Iniciá sesión para consultar datos internos." }, 401);
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  const webhook = process.env["N8N_INTERNAL_CHAT_WEBHOOK_URL"];
  const secret = process.env["N8N_CHAT_WEBHOOK_SECRET"];
  if (!url || !key)
    return reply({ error: "El asistente interno aún no está configurado." }, 503);
  let question: unknown;
  try {
    question = ((await request.json()) as { question?: unknown }).question;
  } catch {
    return reply({ error: "Solicitud inválida" }, 400);
  }
  if (typeof question !== "string" || !question.trim() || question.length > 1000)
    return reply({ error: "Escribí una consulta de hasta 1000 caracteres." }, 400);

  const db = createClient<Database>(url, key, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: auth, error: authError } = await db.auth.getUser(jwt);
  if (authError || !auth.user) return reply({ error: "Sesión inválida" }, 401);
  const { data: roles, error: roleError } = await db
    .from("user_roles")
    .select("role")
    .eq("user_id", auth.user.id);
  if (roleError || !roles?.some(({ role }) => role === "admin" || role === "docente"))
    return reply({ error: "Acceso restringido" }, 403);
  const admin = roles.some(({ role }) => role === "admin");
  try {
    const dashboardAnswer = await answerDashboardQuery(db, question, admin, auth.user.id);
    if (dashboardAnswer) return reply({ reply: dashboardAnswer.slice(0, 8000) });
    if (!webhook || !secret)
      return reply({ error: "El asistente interno aún no está configurado." }, 503);
    try {
      if (new URL(webhook).protocol !== "https:") return reply({ error: "Webhook inválido" }, 503);
    } catch {
      return reply({ error: "Webhook inválido" }, 503);
    }
    const [courses, students, announcements, admissions, teacherProfiles] = await Promise.all([
      db.from("courses").select("id, title, capacity, enrolled, teacher_id"),
      db.from("students").select("status"),
      db
        .from("announcements")
        .select("title, content")
        .order("created_at", { ascending: false })
        .limit(5),
      admin
        ? db.from("admission_requests").select("status")
        : Promise.resolve({ data: [], error: null }),
      admin
        ? Promise.resolve({ data: [], error: null })
        : db.from("teacher_profiles").select("id").eq("user_id", auth.user.id),
    ]);
    const failed = [courses, students, announcements, admissions, teacherProfiles].find(
      (result) => result.error,
    );
    if (failed?.error) throw failed.error;
    const assigned = admin
      ? (courses.data ?? [])
      : (courses.data ?? []).filter((c) =>
          teacherProfiles.data?.some((t) => t.id === c.teacher_id),
        );
    const totalCapacity = assigned.reduce((sum, c) => sum + c.capacity, 0);
    const totalEnrolled = assigned.reduce((sum, c) => sum + c.enrolled, 0);
    const context = {
      role: admin ? "administrador" : "docente",
      dashboard: {
        total_courses: assigned.length,
        total_students: (students.data ?? []).length,
        total_capacity: totalCapacity,
        total_enrolled: totalEnrolled,
        available_seats: Math.max(0, totalCapacity - totalEnrolled),
        occupancy_percent: totalCapacity
          ? Math.round((totalEnrolled / totalCapacity) * 100)
          : 0,
        pending_admissions: admin
          ? (admissions.data ?? []).filter((a) => a.status === "pendiente").length
          : undefined,
      },
      courses: assigned.map((c) => ({
        title: c.title,
        capacity: c.capacity,
        enrolled: c.enrolled,
        available: Math.max(0, c.capacity - c.enrolled),
      })),
      students_by_status: Object.fromEntries(
        [...new Set((students.data ?? []).map((s) => s.status))].map((status) => [
          status,
          (students.data ?? []).filter((s) => s.status === status).length,
        ]),
      ),
      recent_announcements: (announcements.data ?? []).map((a) => ({
        title: a.title,
        content: a.content.slice(0, 500),
      })),
      admissions_by_status: admin
        ? Object.fromEntries(
            [...new Set((admissions.data ?? []).map((a) => a.status))].map((status) => [
              status,
              (admissions.data ?? []).filter((a) => a.status === status).length,
            ]),
          )
        : undefined,
    };

    const result = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-chat-secret": secret },
      body: JSON.stringify({ question: question.trim(), context }),
      signal: AbortSignal.timeout(25000),
    });
    if (!result.ok) return reply({ error: "No se pudo consultar el asistente interno." }, 502);
    const payload = (await result.json()) as { reply?: unknown };
    if (typeof payload.reply !== "string" || !payload.reply.trim())
      return reply({ error: "El asistente respondió sin contenido." }, 502);
    return reply({ reply: payload.reply.slice(0, 4000) });
  } catch (error) {
    console.error("Internal chat error", error);
    return reply({ error: "No se pudieron consultar los datos internos." }, 502);
  }
}
