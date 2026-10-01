import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Course = Database["public"]["Tables"]["courses"]["Row"];
type Student = Database["public"]["Tables"]["students"]["Row"];
type Teacher = Database["public"]["Tables"]["teacher_profiles"]["Row"];
type Announcement = Database["public"]["Tables"]["announcements"]["Row"];

type Props = {
  isAdmin: boolean;
  courses: Course[];
  students: Student[];
  teachers: Teacher[];
  announcements: Announcement[];
  loading: boolean;
};

const gradeBands = [
  { label: "Excelente (9–10)", min: 9, max: 10.01, color: "bg-emerald-500" },
  { label: "Bueno (8–8.9)", min: 8, max: 9, color: "bg-blue-500" },
  { label: "Satisfactorio (7–7.9)", min: 7, max: 8, color: "bg-amber-500" },
  { label: "Requiere apoyo (<7)", min: 0, max: 7, color: "bg-rose-500" },
];

export function AnalyticsDashboard({ isAdmin, courses, students, teachers, announcements, loading }: Props) {
  const grades = useQuery({
    queryKey: ["analytics", "student_grades"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_grades")
        .select("id,course_id,student_id,grade,period,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const enrollments = useQuery({
    queryKey: ["analytics", "course_students"],
    queryFn: async () => {
      const { data, error } = await supabase.from("course_students").select("course_id,student_id,enrolled_at");
      if (error) throw error;
      return data;
    },
  });
  const admissions = useQuery({
    queryKey: ["analytics", "admission_requests"],
    enabled: isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admission_requests")
        .select("id,status,desired_level,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const gradeRows = grades.data ?? [];
  const enrollmentRows = enrollments.data ?? [];
  const average = gradeRows.length ? gradeRows.reduce((sum, row) => sum + Number(row.grade), 0) / gradeRows.length : null;
  const passing = gradeRows.filter((row) => Number(row.grade) >= 7).length;
  const atRisk = gradeRows.filter((row) => Number(row.grade) < 7).length;
  const activeStudents = students.filter((student) => student.status === "Activo").length;
  const pendingAdmissions = (admissions.data ?? []).filter((request) => ["pendiente", "en_revision"].includes(request.status)).length;
  const totalCapacity = courses.reduce((sum, course) => sum + course.capacity, 0);
  const occupancy = totalCapacity ? (enrollmentRows.length / totalCapacity) * 100 : 0;

  const coursePerformance = courses
    .map((course) => {
      const values = gradeRows.filter((row) => row.course_id === course.id).map((row) => Number(row.grade));
      return {
        ...course,
        average: values.length ? values.reduce((sum, grade) => sum + grade, 0) / values.length : null,
        graded: values.length,
        enrolledCount: enrollmentRows.filter((row) => row.course_id === course.id).length,
      };
    })
    .sort((a, b) => (b.average ?? -1) - (a.average ?? -1));

  const statusCounts = students.reduce<Record<string, number>>((counts, student) => {
    counts[student.status] = (counts[student.status] ?? 0) + 1;
    return counts;
  }, {});
  const queryError = grades.error ?? enrollments.error ?? admissions.error;

  return (
    <div className="space-y-6">
      {queryError && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-destructive">Algunas analíticas no pudieron cargarse: {queryError.message}</p>}

      <section aria-labelledby="kpi-title">
        <h2 id="kpi-title" className="sr-only">Indicadores principales</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi icon="groups" label="Estudiantes activos" value={loading ? "…" : activeStudents} detail={`${students.length} visibles en total`} />
          <Kpi icon="school" label={isAdmin ? "Cursos registrados" : "Mis cursos"} value={loading ? "…" : courses.length} detail={`${enrollmentRows.length} asignaciones`} />
          <Kpi icon="monitoring" label="Promedio académico" value={grades.isLoading ? "…" : average === null ? "—" : average.toFixed(1)} detail={gradeRows.length ? `${passing} de ${gradeRows.length} notas aprobadas` : "Sin notas registradas"} />
          <Kpi icon={isAdmin ? "assignment" : "warning"} label={isAdmin ? "Solicitudes pendientes" : "Estudiantes bajo 7"} value={isAdmin ? (admissions.isLoading ? "…" : pendingAdmissions) : atRisk} detail={isAdmin ? `${admissions.data?.length ?? 0} solicitudes totales` : "Requieren seguimiento"} />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Distribución de calificaciones" subtitle="Escala institucional de 0 a 10">
          {gradeRows.length ? <div className="space-y-4">{gradeBands.map((band) => {
            const count = gradeRows.filter((row) => Number(row.grade) >= band.min && Number(row.grade) < band.max).length;
            const percentage = (count / gradeRows.length) * 100;
            return <div key={band.label}><div className="mb-1 flex justify-between gap-3 text-sm"><span>{band.label}</span><strong>{count} · {percentage.toFixed(0)}%</strong></div><div className="h-3 overflow-hidden rounded-full bg-surface-container-high" role="meter" aria-label={band.label} aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}><div className={`h-full rounded-full ${band.color}`} style={{ width: `${percentage}%` }} /></div></div>;
          })}</div> : <Empty text="Registrá notas para visualizar su distribución." />}
        </Panel>

        <Panel title="Estado de estudiantes" subtitle="Situación actual de los expedientes visibles">
          {students.length ? <div className="space-y-3">{Object.entries(statusCounts).sort((a, b) => b[1] - a[1]).map(([status, count]) => <div key={status} className="flex items-center justify-between rounded-xl border p-3"><span>{status}</span><strong className="rounded-full bg-primary-fixed px-3 py-1 text-on-primary-fixed">{count}</strong></div>)}<p className="text-sm text-on-surface-variant">{students.filter((student) => student.alert.trim()).length} estudiantes tienen una alerta o seguimiento registrado.</p></div> : <Empty text="No hay estudiantes visibles para este usuario." />}
        </Panel>
      </div>

      <Panel title="Rendimiento y ocupación por curso" subtitle="Promedio, estudiantes asignados y capacidad disponible">
        {coursePerformance.length ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b text-on-surface-variant"><tr><th className="p-3">Curso</th><th className="p-3">Docente</th><th className="p-3">Promedio</th><th className="p-3">Notas</th><th className="p-3">Ocupación</th></tr></thead><tbody>{coursePerformance.map((course) => {
          const percentage = course.capacity ? Math.min(100, (course.enrolledCount / course.capacity) * 100) : 0;
          return <tr key={course.id} className="border-b last:border-0"><td className="p-3"><strong>{course.title}</strong><span className="block text-xs text-on-surface-variant">{course.level}</span></td><td className="p-3">{course.teacher || "Sin asignar"}</td><td className="p-3"><GradeBadge value={course.average} /></td><td className="p-3">{course.graded}</td><td className="p-3"><span>{course.enrolledCount}/{course.capacity}</span><div className="mt-1 h-2 w-32 overflow-hidden rounded-full bg-surface-container-high"><div className="h-full bg-primary" style={{ width: `${percentage}%` }} /></div></td></tr>;
        })}</tbody></table></div> : <Empty text="No hay cursos disponibles." />}
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Horarios" subtitle="Espacios académicos registrados">
          {courses.length ? <ul className="space-y-3">{courses.slice(0, 8).map((course) => <li key={course.id} className="rounded-xl border p-3"><div className="flex flex-wrap items-start justify-between gap-2"><strong>{course.title}</strong><span className="text-xs font-semibold text-primary">{course.room || "Aula por confirmar"}</span></div><p className="mt-1 text-sm">{course.schedule || "Horario por confirmar"}</p><p className="text-xs text-on-surface-variant">{course.teacher || "Docente sin asignar"}</p></li>)}</ul> : <Empty text="No hay horarios registrados." />}
        </Panel>

        <Panel title={isAdmin ? "Gestión institucional" : "Actividad reciente"} subtitle={isAdmin ? "Capacidad, personal y comunicación" : "Comunicaciones para el personal docente"}>
          <div className="grid grid-cols-2 gap-3"><MiniStat label="Ocupación global" value={`${occupancy.toFixed(0)}%`} /><MiniStat label="Docentes" value={teachers.length.toString()} /><MiniStat label="Anuncios" value={announcements.length.toString()} /><MiniStat label="Cursos sin docente" value={courses.filter((course) => !course.teacher_id).length.toString()} /></div>
          <div className="mt-4 border-t pt-4"><h3 className="mb-2 font-semibold">Comunicados recientes</h3>{announcements.length ? <ul className="space-y-2">{announcements.slice(0, 3).map((announcement) => <li key={announcement.id} className="text-sm"><strong>{announcement.title}</strong><span className="block text-xs text-on-surface-variant">{new Date(announcement.created_at).toLocaleDateString("es-CR")}</span></li>)}</ul> : <Empty text="No hay anuncios recientes." />}</div>
        </Panel>
      </div>
    </div>
  );
}

function Kpi({ icon, label, value, detail }: { icon: string; label: string; value: string | number; detail: string }) {
  return <article className="rounded-2xl border bg-surface-container-lowest p-5 shadow-sm"><span aria-hidden="true" className="material-symbols-outlined rounded-xl bg-primary-fixed p-2 text-primary">{icon}</span><p className="mt-4 text-sm text-on-surface-variant">{label}</p><strong className="text-3xl">{value}</strong><p className="mt-1 text-xs text-on-surface-variant">{detail}</p></article>;
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border bg-surface-container-lowest p-5 shadow-sm"><div className="mb-4"><h2 className="text-headline-sm font-semibold">{title}</h2><p className="text-sm text-on-surface-variant">{subtitle}</p></div>{children}</section>;
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-surface-container-low p-3"><strong className="block text-2xl">{value}</strong><span className="text-xs text-on-surface-variant">{label}</span></div>;
}

function GradeBadge({ value }: { value: number | null }) {
  if (value === null) return <span className="text-on-surface-variant">Sin notas</span>;
  const tone = value >= 9 ? "bg-emerald-100 text-emerald-800" : value >= 7 ? "bg-blue-100 text-blue-800" : "bg-rose-100 text-rose-800";
  return <span className={`rounded-full px-2 py-1 font-semibold ${tone}`}>{value.toFixed(1)}</span>;
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">{text}</p>;
}
