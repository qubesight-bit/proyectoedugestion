import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getCampusWeather } from "@/services/external/weather.service";

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
  { label: "Excelente", min: 9, max: 10.01, color: "#10b981" },
  { label: "Bueno", min: 8, max: 9, color: "#3b82f6" },
  { label: "Satisfactorio", min: 7, max: 8, color: "#f59e0b" },
  { label: "Requiere apoyo", min: 0, max: 7, color: "#f43f5e" },
];
const chartColors = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6", "#f43f5e", "#06b6d4"];

export function AnalyticsDashboard({ isAdmin, courses, students, teachers, announcements, loading }: Props) {
  const weather = useQuery({ queryKey: ["external", "campus-weather"], queryFn: ({ signal }) => getCampusWeather(signal), staleTime: 15 * 60 * 1000, retry: 1 });
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
  const currentStudents = students.filter((student) => !student.archived_at);
  const archivedStudents = students.length - currentStudents.length;
  const average = gradeRows.length ? gradeRows.reduce((sum, row) => sum + Number(row.grade), 0) / gradeRows.length : null;
  const passing = gradeRows.filter((row) => Number(row.grade) >= 7).length;
  const atRisk = gradeRows.filter((row) => Number(row.grade) < 7).length;
  const activeStudents = currentStudents.filter((student) => student.status === "Activo").length;
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

  const statusCounts = currentStudents.reduce<Record<string, number>>((counts, student) => {
    counts[student.status] = (counts[student.status] ?? 0) + 1;
    return counts;
  }, {});
  const gradeDistribution = gradeBands.map((band) => ({
    name: band.label,
    value: gradeRows.filter((row) => Number(row.grade) >= band.min && Number(row.grade) < band.max).length,
    color: band.color,
  }));
  const studentStatusData = Object.entries(statusCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], index) => ({ name, value, color: chartColors[index % chartColors.length] }));
  const courseChartData = coursePerformance
    .filter((course) => course.average !== null)
    .slice(0, 8)
    .map((course) => ({
      name: course.title.length > 18 ? course.title.slice(0, 18) + "…" : course.title,
      promedio: Number(course.average?.toFixed(1)),
    }));
  const queryError = grades.error ?? enrollments.error ?? admissions.error;

  return (
    <div className="space-y-6">
      {queryError && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-destructive">Algunas analíticas no pudieron cargarse: {queryError.message}</p>}

      <aside className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-surface-container-lowest p-4" aria-label="Información externa del campus">
        <div><p className="text-xs font-bold uppercase tracking-wider text-primary">Servicio externo · Open-Meteo</p><p className="font-semibold">Condiciones actuales en Cartago</p></div>
        {weather.isLoading ? <p role="status">Consultando clima…</p> : weather.data ? <p><span aria-hidden="true" className="material-symbols-outlined align-middle">partly_cloudy_day</span> <strong>{weather.data.temperature.toFixed(1)} °C</strong> · {weather.data.description} · sensación {weather.data.apparentTemperature.toFixed(1)} °C</p> : <p className="text-sm text-on-surface-variant">El servicio externo no está disponible temporalmente.</p>}
      </aside>

      <section aria-labelledby="kpi-title">
        <h2 id="kpi-title" className="sr-only">Indicadores principales</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi icon="groups" label="Estudiantes activos" value={loading ? "…" : activeStudents} detail={`${currentStudents.length} vigentes${isAdmin && archivedStudents ? ` · ${archivedStudents} archivados` : ""}`} />
          <Kpi icon="school" label={isAdmin ? "Cursos registrados" : "Mis cursos"} value={loading ? "…" : courses.length} detail={`${enrollmentRows.length} asignaciones`} />
          <Kpi icon="monitoring" label="Promedio académico" value={grades.isLoading ? "…" : average === null ? "—" : average.toFixed(1)} detail={gradeRows.length ? `${passing} de ${gradeRows.length} notas aprobadas` : "Sin notas registradas"} />
          <Kpi icon={isAdmin ? "assignment" : "warning"} label={isAdmin ? "Solicitudes pendientes" : "Estudiantes bajo 7"} value={isAdmin ? (admissions.isLoading ? "…" : pendingAdmissions) : atRisk} detail={isAdmin ? `${admissions.data?.length ?? 0} solicitudes totales` : "Requieren seguimiento"} />
        </div>
      </section>

      <SectionHeading eyebrow="Rendimiento académico" title="¿Cómo avanzan las calificaciones?" description="Lectura visual del desempeño general y comparación de promedios entre cursos." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Distribución de calificaciones" subtitle="Cantidad de notas en cada rango">
          {gradeRows.length ? <ChartFrame label="Gráfica de pastel de distribución de calificaciones"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={gradeDistribution} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={58} outerRadius={92} paddingAngle={3} label={({ value }) => value}>{gradeDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value, name) => [String(value) + " notas", name]} /><Legend verticalAlign="bottom" /></PieChart></ResponsiveContainer></ChartFrame> : <Empty text="Registrá notas para visualizar su distribución." />}
        </Panel>

        <Panel title="Promedio por curso" subtitle="Comparación de los cursos con notas registradas">
          {courseChartData.length ? <ChartFrame label="Gráfica de barras de promedio por curso"><ResponsiveContainer width="100%" height="100%"><BarChart data={courseChartData} margin={{ top: 10, right: 10, left: -15, bottom: 55 }}><CartesianGrid strokeDasharray="3 3" opacity={0.25} /><XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={70} fontSize={11} /><YAxis domain={[0, 10]} tickCount={6} fontSize={12} /><Tooltip /><Bar dataKey="promedio" name="Promedio" fill="#2563eb" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></ChartFrame> : <Empty text="Todavía no hay promedios por curso." />}
        </Panel>
      </div>

      <SectionHeading eyebrow="Detalle académico" title="Rendimiento y ocupación por curso" description="Datos exactos para identificar grupos fuertes, cupos disponibles y cursos que necesitan seguimiento." />
      <Panel title="Rendimiento y ocupación por curso" subtitle="Promedio, estudiantes asignados y capacidad disponible">
        {coursePerformance.length ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b text-on-surface-variant"><tr><th className="p-3">Curso</th><th className="p-3">Docente</th><th className="p-3">Promedio</th><th className="p-3">Notas</th><th className="p-3">Ocupación</th></tr></thead><tbody>{coursePerformance.map((course) => {
          const percentage = course.capacity ? Math.min(100, (course.enrolledCount / course.capacity) * 100) : 0;
          return <tr key={course.id} className="border-b last:border-0"><td className="p-3"><strong>{course.title}</strong><span className="block text-xs text-on-surface-variant">{course.level}</span></td><td className="p-3">{course.teacher || "Sin asignar"}</td><td className="p-3"><GradeBadge value={course.average} /></td><td className="p-3">{course.graded}</td><td className="p-3"><span>{course.enrolledCount}/{course.capacity}</span><div className="mt-1 h-2 w-32 overflow-hidden rounded-full bg-surface-container-high"><div className="h-full bg-primary" style={{ width: `${percentage}%` }} /></div></td></tr>;
        })}</tbody></table></div> : <Empty text="No hay cursos disponibles." />}
      </Panel>

      <SectionHeading eyebrow="Matrícula y operación" title="Estudiantes, capacidad y horarios" description="Distribución de expedientes, uso de cupos y organización de la jornada académica." />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Estado de estudiantes" subtitle="Distribución de los expedientes visibles">
          {currentStudents.length ? <><ChartFrame label="Gráfica de pastel del estado de estudiantes"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={studentStatusData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={92} label={({ value }) => value}>{studentStatusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip formatter={(value, name) => [String(value) + " estudiantes", name]} /><Legend verticalAlign="bottom" /></PieChart></ResponsiveContainer></ChartFrame><p className="mt-3 text-sm text-on-surface-variant">{currentStudents.filter((student) => student.alert.trim()).length} estudiantes tienen una alerta o seguimiento registrado.</p></> : <Empty text="No hay estudiantes visibles para este usuario." />}
        </Panel>

        <Panel title="Ocupación por curso" subtitle="Estudiantes asignados frente a capacidad">
          {courses.length ? <ChartFrame label="Gráfica de barras de ocupación por curso"><ResponsiveContainer width="100%" height="100%"><BarChart data={coursePerformance.slice(0, 8).map((course) => ({ name: course.title.length > 18 ? course.title.slice(0, 18) + "…" : course.title, estudiantes: course.enrolledCount, capacidad: course.capacity }))} margin={{ top: 10, right: 10, left: -15, bottom: 55 }}><CartesianGrid strokeDasharray="3 3" opacity={0.25} /><XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={70} fontSize={11} /><YAxis allowDecimals={false} fontSize={12} /><Tooltip /><Legend verticalAlign="top" /><Bar dataKey="estudiantes" name="Matriculados" fill="#10b981" radius={[6, 6, 0, 0]} /><Bar dataKey="capacidad" name="Capacidad" fill="#bfdbfe" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></ChartFrame> : <Empty text="No hay cursos para calcular ocupación." />}
        </Panel>
      </div>

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

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="border-l-4 border-primary pl-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p><h2 className="text-2xl font-semibold">{title}</h2><p className="max-w-3xl text-sm text-on-surface-variant">{description}</p></div>;
}

function ChartFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="h-80 w-full" role="img" aria-label={label}>{children}</div>;
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
