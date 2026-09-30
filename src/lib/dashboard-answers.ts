import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
const show = (value: string | null | undefined) => value?.trim() || "Sin dato";
/** Tables/columns that may be absent in the connected project resolve to empty data instead of failing the whole answer. */
type Result<T> = { data: T[] | null; error: { code?: string; message: string } | null };
const MISSING = new Set(["PGRST205", "PGRST204", "42703", "42P01"]);
export async function optional<T>(query: PromiseLike<Result<T>>): Promise<Result<T>> {
  const result = await query;
  if (result.error && MISSING.has(result.error.code ?? "")) return { data: [], error: null };
  return result;
}
const cap = (rows: string[], total: number) =>
  `${rows.join("\n")}${total > rows.length ? `\nMostrando ${rows.length} de ${total}; consultá la sección del panel para ver el resto.` : ""}`;
const countsBy = <T>(rows: T[], value: (row: T) => string) =>
  Object.entries(
    rows.reduce<Record<string, number>>((counts, row) => {
      const key = value(row) || "Sin estado";
      counts[key] = (counts[key] ?? 0) + 1;
      return counts;
    }, {}),
  )
    .map(([label, count]) => `${label}: ${count}`)
    .join("; ");

/** Answer records from the authenticated database. Personal details never go to n8n/Groq. */
export async function answerDashboardQuery(
  db: SupabaseClient<Database>,
  question: string,
  admin: boolean,
  userId: string,
): Promise<string | null> {
  const q = normalize(question);
  const details =
    /ficha|detalle|informacion|expediente|telefono|correo|contacto|encargado|promedio|observacion|nota|biografia/.test(
      q,
    );
  const matches = (name: string, code?: string) =>
    q.includes(normalize(name)) || (!!code && q.includes(normalize(code)));

  if (
    /que (informacion|datos|secciones).*consult|que puedes|que podes|a que.*acceso|ayuda.*panel/.test(
      q,
    )
  ) {
    return `Puedo consultar datos actuales de estas secciones según tu rol:\n• Cursos: lista, cupos, horarios, aulas y docente asignado.\n• Estudiantes: lista, curso y ficha individual.\n• Anuncios: publicaciones recientes.\n• Docentes: perfiles y cursos relacionados.\n${admin ? "• Solicitudes: ingresos, estados y detalle de cada solicitud.\n" : ""}• Supervisión: actividad reciente de cursos y anuncios.\n• Perfil: nombre, correo y rol.\n\nEjemplos: “lista de estudiantes”, “ficha de Ana”, “cursos con menos cupos”, “actividad de supervisión” o “mostrame mi perfil”.`;
  }

  if (
    /todo.*(panel|dashboard)|resumen.*(general|panel|dashboard)|estado.*(general|panel|dashboard)/.test(
      q,
    )
  ) {
    const [courses, students, announcements, admissions, teachers] = await Promise.all([
      db.from("courses").select("id, capacity, enrolled"),
      db.from("students").select("id, status"),
      db.from("announcements").select("id"),
      admin
        ? optional(db.from("admission_requests").select("status"))
        : Promise.resolve({ data: [], error: null }),
      optional(db.from("teacher_profiles").select("id, user_id")),
    ]);
    const failed = [courses, students, announcements, admissions, teachers].find(
      (result) => result.error,
    );
    if (failed?.error) throw failed.error;
    const visibleCourses = courses.data ?? [];
    const capacity = visibleCourses.reduce((sum, course) => sum + course.capacity, 0);
    const enrolled = visibleCourses.reduce((sum, course) => sum + course.enrolled, 0);
    return `Resumen actual del panel:\nCursos: ${visibleCourses.length}\nEstudiantes accesibles: ${(students.data ?? []).length}\nDocentes registrados: ${(teachers.data ?? []).length}\nAnuncios: ${(announcements.data ?? []).length}\nCupos: ${enrolled}/${capacity} ocupados; ${Math.max(0, capacity - enrolled)} libres.${admin ? `\nSolicitudes: ${(admissions.data ?? []).length}; ${(admissions.data ?? []).filter((row) => row.status === "pendiente").length} pendientes.` : ""}`;
  }

  if (/estudiant|alumn|matriculad/.test(q) && /resum|estado|cuant|total|estadistic/.test(q)) {
    const { data, error } = await db.from("students").select("status");
    if (error) throw error;
    const rows = data ?? [];
    return rows.length
      ? `Estudiantes accesibles: ${rows.length}. ${countsBy(rows, (row) => row.status)}.`
      : "No hay estudiantes registrados a los que tengas acceso.";
  }

  if (/\bcurso|cupo|matricula/.test(q) && /\btotal|\bcuant|resum|menor|mayor|estadistic/.test(q)) {
    const [{ data, error }, { data: profiles, error: profileError }] = await Promise.all([
      db.from("courses").select("*").order("title"),
      admin
        ? Promise.resolve({ data: [], error: null })
        : optional(db.from("teacher_profiles").select("id").eq("user_id", userId)),
    ]);
    if (error || profileError) throw error ?? profileError;
    const rows = admin
      ? (data ?? [])
      : (data ?? []).filter((course) =>
          (profiles ?? []).some((profile) => profile.id === course.teacher_id),
        );
    if (!rows.length) return "No hay cursos disponibles para tu cuenta.";
    if (/menor|mayor/.test(q)) {
      const direction = /mayor/.test(q) ? -1 : 1;
      return `Cursos ordenados por cupos libres:\n${[...rows]
        .sort((a, b) => direction * (a.capacity - a.enrolled - (b.capacity - b.enrolled)))
        .map(
          (course, index) =>
            `${index + 1}. ${course.title}: ${Math.max(0, course.capacity - course.enrolled)} cupos libres`,
        )
        .join("\n")}`;
    }
    const capacity = rows.reduce((sum, course) => sum + course.capacity, 0);
    const enrolled = rows.reduce((sum, course) => sum + course.enrolled, 0);
    return `${rows.length} cursos. ${enrolled}/${capacity} matrículas registradas; ${Math.max(0, capacity - enrolled)} cupos libres en total.`;
  }

  if (/solicitud|admision|nuevo ingreso/.test(q) && /cuant|total|resum|estadistic|estado/.test(q)) {
    if (!admin) return "Solo administración puede consultar las solicitudes de ingreso.";
    const { data, error } = await optional(db.from("admission_requests").select("status"));
    if (error) throw error;
    const rows = data ?? [];
    return rows.length
      ? `Solicitudes de ingreso: ${rows.length}. ${countsBy(rows, (row) => row.status)}.`
      : "Todavía no hay solicitudes de ingreso.";
  }

  if (/solicitud|admision|nuevo ingreso/.test(q) && !/cuant|total|resum|estadistic/.test(q)) {
    if (!admin) return "Solo administración puede consultar las solicitudes de ingreso.";
    const { data, error } = await db
      .from("admission_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(101);
    if (error && MISSING.has(error.code ?? ""))
      return "Las solicitudes de ingreso todavía no están habilitadas en la base de datos.";
    if (error) throw error;
    const rows = data ?? [];
    const selected = rows.filter((row) => matches(row.student_name, row.student_document));
    if (details && selected.length === 1) {
      const r = selected[0]!;
      return `Solicitud de ${r.student_name}\nEstado: ${r.status}\nIngreso: ${r.entry_type}\nNivel: ${r.desired_level}\nDocumento: ${r.student_document}\nNacimiento: ${r.birth_date}\nEncargado: ${r.guardian_name} (${r.guardian_document})\nCorreo: ${r.guardian_email}\nTeléfono: ${r.guardian_phone}\nNota: ${show(r.admin_note)}`;
    }
    if (!rows.length) return "Todavía no hay solicitudes de ingreso.";
    const filtered = /pendient/.test(q) ? rows.filter((r) => r.status === "pendiente") : rows;
    return filtered.length
      ? `Solicitudes de ingreso (${filtered.length}${rows.length === 101 ? "+" : ""}):\n${cap(
          filtered
            .slice(0, 40)
            .map((r, i) => `${i + 1}. ${r.student_name} — ${r.desired_level}, ${r.status}`),
          filtered.length,
        )}`
      : "No hay solicitudes pendientes.";
  }

  if (/docent|profesor|maestr/.test(q) && !/estudiant|alumn/.test(q)) {
    const [{ data, error }, { data: courses, error: courseError }] = await Promise.all([
      optional(db.from("teacher_profiles").select("*").order("full_name").limit(101)),
      db.from("courses").select("*"),
    ]);
    if (error || courseError) throw error ?? courseError;
    if (!(data ?? []).length && admin) {
      const names = [...new Set((courses ?? []).map((c) => c.teacher).filter(Boolean))].sort();
      return names.length
        ? `Docentes (${names.length}):\n${names
            .map(
              (name, i) =>
                `${i + 1}. ${name}; cursos: ${(courses ?? [])
                  .filter((c) => c.teacher === name)
                  .map((c) => c.title)
                  .join(", ")}`,
            )
            .join("\n")}`
        : "No hay docentes registrados.";
    }
    const teachers = admin ? (data ?? []) : (data ?? []).filter((t) => t.user_id === userId);
    const selected = teachers.filter((t) => matches(t.full_name));
    if (details && selected.length === 1) {
      const t = selected[0]!;
      return `${t.full_name}\nEspecialidad: ${show(t.specialty)}\nCorreo: ${show(t.email)}\nTeléfono: ${show(t.phone)}\nBiografía: ${show(t.bio)}\nCursos: ${
        (courses ?? [])
          .filter((c) => c.teacher_id === t.id)
          .map((c) => c.title)
          .join(", ") || "Ninguno"
      }`;
    }
    return teachers.length
      ? `Docentes (${teachers.length}${(data ?? []).length === 101 ? "+" : ""}):\n${cap(
          teachers.slice(0, 50).map(
            (t, i) =>
              `${i + 1}. ${t.full_name} — ${show(t.specialty)}; cursos: ${
                (courses ?? [])
                  .filter((c) => c.teacher_id === t.id)
                  .map((c) => c.title)
                  .join(", ") || "ninguno"
              }`,
          ),
          teachers.length,
        )}`
      : "No hay docentes asignados a tu cuenta.";
  }

  if (
    (/estudiant|alumn|matriculad/.test(q) ||
      (/ficha|expediente/.test(q) && !/docent|profesor|curso/.test(q))) &&
    !/resum|estado|cuant|total|estadistic/.test(q)
  ) {
    const [{ data: students, error }, { data: courses, error: courseError }] = await Promise.all([
      db.from("students").select("*").order("name").limit(1001),
      db.from("courses").select("*"),
    ]);
    if (error || courseError) throw error ?? courseError;
    const visible = students ?? []; // RLS already limits teacher access to assigned students.
    const course = (courses ?? []).find((c) => q.includes(normalize(c.title)));
    let filtered = visible;
    if (course) {
      if (!admin) {
        const { data: profiles, error: profileError } = await optional(
          db.from("teacher_profiles").select("id").eq("user_id", userId),
        );
        if (profileError) throw profileError;
        if (!(profiles ?? []).some((p) => p.id === course.teacher_id))
          return "No tenés acceso a ese curso.";
      }
      const { data: links, error: linkError } = await db
        .from("course_students")
        .select("student_id")
        .eq("course_id", course.id);
      if (linkError && MISSING.has(linkError.code ?? ""))
        return `Todavía no hay matrículas por curso registradas para ${course.title}.`;
      if (linkError) throw linkError;
      const ids = new Set((links ?? []).map((link) => link.student_id));
      filtered = visible.filter((student) => ids.has(student.id));
    } else if (/\bcurso\b/.test(q)) {
      return "Indicá el nombre exacto del curso para consultar sus estudiantes.";
    }
    const selected = filtered.filter((student) => matches(student.name, student.code));
    if (/ficha|expediente/.test(q) && selected.length !== 1)
      return "Indicá el nombre o código de un estudiante al que tengas acceso para ver su ficha.";
    if (details && selected.length === 1) {
      const s = selected[0]!;
      return `Ficha de ${s.name}\nCódigo: ${s.code}\nGrado: ${s.grade}\nEstado: ${s.status}\nPromedio: ${s.score ?? "Sin dato"}\nEncargado: ${show(s.tutor)}\nTeléfono: ${show(s.phone)}\nCorreo: ${show(s.email)}\nObservaciones: ${show(s.alert)}`;
    }
    return filtered.length
      ? `Estudiantes${course ? ` de ${course.title}` : " a los que tenés acceso"} (${filtered.length}${visible.length === 1001 ? "+" : ""}):\n${cap(
          filtered
            .slice(0, 50)
            .map((s, i) => `${i + 1}. ${s.name} (${s.code}, ${s.grade}, ${s.status})`),
          filtered.length,
        )}`
      : "No hay estudiantes registrados a los que tengas acceso en esta consulta.";
  }

  if (/\bcurso|cupo|horario|aula/.test(q) && !/\btotal|\bcuant|resum|menor|mayor/.test(q)) {
    const [{ data, error }, { data: profiles, error: profileError }] = await Promise.all([
      db.from("courses").select("*").order("title").limit(101),
      admin
        ? Promise.resolve({ data: [], error: null })
        : optional(db.from("teacher_profiles").select("id").eq("user_id", userId)),
    ]);
    if (error || profileError) throw error ?? profileError;
    const courses = admin
      ? (data ?? [])
      : (data ?? []).filter((c) => (profiles ?? []).some((p) => p.id === c.teacher_id));
    const selected = courses.filter((c) => matches(c.title));
    if (details && selected.length === 1) {
      const c = selected[0]!;
      return `${c.title}\nNivel: ${c.level}\nDocente: ${c.teacher}\nHorario: ${show(c.schedule)}\nAula: ${show(c.room)}\nCapacidad: ${c.capacity}\nMatriculados: ${c.enrolled}\nCupos libres: ${Math.max(0, c.capacity - c.enrolled)}\nNota: ${show(c.note)}`;
    }
    return courses.length
      ? `Cursos (${courses.length}):\n${cap(
          courses
            .slice(0, 50)
            .map(
              (c, i) =>
                `${i + 1}. ${c.title} — ${c.teacher}; ${c.enrolled}/${c.capacity} matriculados; ${c.schedule}`,
            ),
          courses.length,
        )}`
      : "No hay cursos disponibles para tu cuenta.";
  }

  if (/supervision|actividad/.test(q)) {
    const [
      { data: courses, error: courseError },
      { data: announcements, error: announcementError },
    ] = await Promise.all([
      db.from("courses").select("id, title, teacher, updated_at"),
      db.from("announcements").select("id, title, created_at"),
    ]);
    if (courseError || announcementError) throw courseError ?? announcementError;
    const activity = [
      ...(courses ?? []).map((course) => ({
        kind: "Curso",
        title: course.title,
        detail: course.teacher,
        date: course.updated_at,
      })),
      ...(announcements ?? []).map((announcement) => ({
        kind: "Anuncio",
        title: announcement.title,
        detail: "",
        date: announcement.created_at,
      })),
    ].sort((a, b) => b.date.localeCompare(a.date));
    return activity.length
      ? `Actividad de supervisión (${activity.length}):\n${cap(
          activity
            .slice(0, 30)
            .map(
              (item, index) =>
                `${index + 1}. ${item.kind}: ${item.title}${item.detail ? ` — ${item.detail}` : ""} (${new Date(item.date).toLocaleDateString("es-CR")})`,
            ),
          activity.length,
        )}`
      : "No hay actividad registrada en Supervisión.";
  }

  if (/anuncio|aviso|publicacion/.test(q) && !/resum|cuant|total/.test(q)) {
    const { data, error } = await db
      .from("announcements")
      .select("title, content, created_at")
      .order("created_at", { ascending: false })
      .limit(51);
    if (error) throw error;
    return data?.length
      ? `Anuncios recientes:\n${cap(
          data
            .slice(0, 20)
            .map(
              (a, i) =>
                `${i + 1}. ${a.title} (${new Date(a.created_at).toLocaleDateString("es-CR")}): ${a.content}`,
            ),
          data.length,
        )}`
      : "No hay anuncios publicados.";
  }

  if (/\bperfil|mi cuenta/.test(q)) {
    const { data, error } = await db
      .from("profiles")
      .select("full_name, email")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return `Tu perfil: ${show(data.full_name)}\nCorreo: ${show(data.email)}\nRol: ${admin ? "administrador" : "docente"}.`;
  }
  return null;
}
