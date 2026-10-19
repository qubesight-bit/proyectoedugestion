import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type ParentTab = "home" | "grades" | "courses" | "communications" | "rewards" | "profile";

const icon = (name: string) => <span aria-hidden="true" className="material-symbols-outlined text-[22px]">{name}</span>;

export function ParentPortal({
  userId,
  email,
  fullName,
  onLogout,
}: {
  userId: string;
  email: string;
  fullName: string;
  onLogout: () => void | Promise<void>;
}) {
  const [tab, setTab] = useState<ParentTab>("home");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const links = useQuery({
    queryKey: ["guardian_students", userId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("guardian_students")
        .select("student_id,relationship")
        .eq("guardian_user_id", userId);
      if (error) throw error;
      return data as Array<{ student_id: string; relationship: string }>;
    },
  });

  const studentIds = (links.data ?? []).map((row) => row.student_id);

  const students = useQuery({
    queryKey: ["parent_students", userId, studentIds.join(",")],
    enabled: studentIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*").in("id", studentIds);
      if (error) throw error;
      return data;
    },
  });

  const activeStudentId = selectedStudentId || students.data?.[0]?.id || "";
  const student = students.data?.find((item) => item.id === activeStudentId) ?? students.data?.[0];

  const grades = useQuery({
    queryKey: ["parent_grades", activeStudentId],
    enabled: Boolean(activeStudentId),
    queryFn: async () => {
      const { data, error } = await supabase.from("student_grades").select("*").eq("student_id", activeStudentId).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const enrollments = useQuery({
    queryKey: ["parent_enrollments", activeStudentId],
    enabled: Boolean(activeStudentId),
    queryFn: async () => {
      const { data, error } = await supabase.from("course_students").select("course_id").eq("student_id", activeStudentId);
      if (error) throw error;
      return data;
    },
  });

  const courseIds = (enrollments.data ?? []).map((row) => row.course_id);
  const courses = useQuery({
    queryKey: ["parent_courses", activeStudentId, courseIds.join(",")],
    enabled: courseIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").in("id", courseIds);
      if (error) throw error;
      return data;
    },
  });

  const announcements = useQuery({
    queryKey: ["parent_announcements"],
    queryFn: async () => {
      const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false }).limit(12);
      if (error) throw error;
      return data;
    },
  });

  const gamification = useQuery({
    queryKey: ["parent_gamification", activeStudentId],
    enabled: Boolean(activeStudentId),
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("student_gamification").select("*").eq("student_id", activeStudentId).maybeSingle();
      if (error) throw error;
      return data as { coins: number; mood: string; streak: number } | null;
    },
  });

  const courseMap = useMemo(() => new Map((courses.data ?? []).map((course) => [course.id, course.title])), [courses.data]);
  const average = grades.data?.length ? grades.data.reduce((sum, row) => sum + Number(row.grade), 0) / grades.data.length : null;

  const nav: Array<[ParentTab, string, string]> = [
    ["home", "home", "Inicio"],
    ["grades", "grading", "Notas"],
    ["courses", "school", "Cursos"],
    ["communications", "campaign", "Comunicados"],
    ["rewards", "emoji_events", "Progreso"],
    ["profile", "account_circle", "Mi perfil"],
  ];

  if (links.isLoading || students.isLoading) return <p role="status" className="p-8">Cargando portal familiar…</p>;

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#f3f7f8] text-[#243746] lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-2 border-r border-white/10 bg-[#567b88] p-4 text-white shadow-xl lg:flex">
        <div className="mb-2 px-2 py-4">
          <p className="text-sm font-semibold text-white">Portal de Padres</p>
          <p className="text-xs text-white/70">Educación Adventista</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {nav.map(([target, symbol, label]) => (
            <Button key={target} type="button" variant="ghost" className={`justify-start gap-3 rounded-xl text-white hover:bg-white/12 hover:text-white ${tab === target ? "bg-white/16 shadow-sm" : ""}`} onClick={() => setTab(target)}>
              {icon(symbol)}{label}
            </Button>
          ))}
        </nav>
        <Button variant="ghost" className="justify-start gap-3 border border-white/20 text-white hover:bg-white/12 hover:text-white" onClick={() => void onLogout()}>{icon("logout")}Cerrar sesión</Button>
      </aside>

      <header className="sticky top-0 z-30 flex min-w-0 items-center gap-3 border-b border-[#dbe5e8] bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:px-5">
        <div className="mr-auto min-w-0">
          <p className="truncate text-sm font-semibold text-[#315b69] sm:text-base">{fullName || "Familia CEAC"}</p>
          <p className="text-xs text-[#7a8c93]">Portal familiar</p>
        </div>
        {students.data && students.data.length > 1 && (
          <select className="form-input max-w-52" value={activeStudentId} onChange={(event) => setSelectedStudentId(event.target.value)}>
            {students.data.map((child) => <option key={child.id} value={child.id}>{child.name}</option>)}
          </select>
        )}
      </header>

      <nav aria-label="Navegación móvil" className="sticky top-[60px] z-20 flex gap-2 overflow-x-auto border-b border-[#dbe5e8] bg-white px-3 py-2 shadow-sm no-scrollbar lg:hidden">
        {nav.map(([target, symbol, label]) => (
          <Button key={target} type="button" variant="ghost" className={`h-10 shrink-0 gap-2 rounded-full px-3 text-[#486d79] ${tab === target ? "bg-[#e7f2f5] text-[#315b69]" : ""}`} onClick={() => setTab(target)}>
            {icon(symbol)}<span className="text-xs sm:text-sm">{label}</span>
          </Button>
        ))}
      </nav>

      <main className="mx-auto min-w-0 max-w-7xl px-3 py-5 pb-24 sm:px-5 sm:py-7 lg:px-8 lg:pb-8">
        {!student ? (
          <section className="rounded-[28px] border border-[#dce7ea] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#18a9e2]">Portal de padres</p>
            <h1 className="mt-2 text-2xl font-bold text-[#315b69]">Todavía no hay estudiantes vinculados</h1>
            <p className="mt-2 text-sm text-[#748890]">Un administrador debe vincular tu cuenta con el expediente de tu hijo o hija.</p>
          </section>
        ) : (
          <>
            {tab === "home" && <section className="space-y-5">
              <div className="rounded-[28px] border border-[#dce7ea] bg-white p-6 shadow-[0_12px_30px_rgba(49,91,105,0.07)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#18a9e2]">Resumen familiar</p>
                <h1 className="mt-2 text-2xl font-bold text-[#315b69]">{student.name}</h1>
                <p className="mt-1 text-sm text-[#748890]">{student.grade} · {student.code}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric iconName="workspace_premium" label="Promedio" value={average === null ? "—" : average.toFixed(1)} />
                <Metric iconName="school" label="Cursos" value={String(courses.data?.length ?? 0)} />
                <Metric iconName="monetization_on" label="Monedas CEAC" value={String(gamification.data?.coins ?? 0)} />
                <Metric iconName="local_fire_department" label="Racha Lumi" value={`${gamification.data?.streak ?? 0} días`} />
              </div>
              <div className="grid gap-4 lg:grid-cols-2">
                <Card title="Notas recientes">
                  {(grades.data ?? []).slice(0, 4).map((row) => <div key={row.id} className="flex items-center justify-between rounded-xl bg-[#f3f7f8] p-3"><span>{courseMap.get(row.course_id) ?? "Curso"} · {row.period}</span><strong className="text-[#315b69]">{Number(row.grade).toFixed(1)}</strong></div>)}
                  {!grades.data?.length && <p className="text-sm text-[#748890]">Aún no hay notas registradas.</p>}
                </Card>
                <Card title="Comunicados recientes">
                  {(announcements.data ?? []).slice(0, 4).map((item) => <div key={item.id} className="rounded-xl bg-[#f3f7f8] p-3"><strong>{item.title}</strong><p className="mt-1 text-sm text-[#748890]">{item.content}</p></div>)}
                </Card>
              </div>
            </section>}

            {tab === "grades" && <section><PageTitle title="Notas" description={`Calificaciones registradas para ${student.name}.`} /><div className="space-y-3">{(grades.data ?? []).map((row) => <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#dce7ea] bg-white p-4 shadow-sm"><div><strong>{courseMap.get(row.course_id) ?? "Curso"}</strong><p className="text-sm text-[#748890]">{row.period}{row.notes ? ` · ${row.notes}` : ""}</p></div><span className="text-2xl font-bold text-[#315b69]">{Number(row.grade).toFixed(1)}</span></div>)}</div></section>}

            {tab === "courses" && <section><PageTitle title="Cursos" description="Materias y horarios asignados." /><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{(courses.data ?? []).map((course) => <article key={course.id} className="rounded-2xl border border-[#dce7ea] bg-white p-5 shadow-sm"><span className="material-symbols-outlined rounded-xl bg-[#e7f4f7] p-2 text-[#315b69]">school</span><h2 className="mt-3 font-bold">{course.title}</h2><p className="text-sm text-[#748890]">{course.teacher || "Docente por confirmar"}</p><p className="mt-3 text-sm">{course.schedule || "Horario por confirmar"}</p><p className="text-sm">{course.room}</p></article>)}</div></section>}

            {tab === "communications" && <section><PageTitle title="Comunicados" description="Información publicada por el centro educativo." /><div className="space-y-3">{(announcements.data ?? []).map((item) => <article key={item.id} className="rounded-2xl border border-[#dce7ea] bg-white p-5 shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-[#18a9e2]">{item.author_name}</p><h2 className="mt-1 font-bold text-[#315b69]">{item.title}</h2><p className="mt-2 text-sm text-[#748890]">{item.content}</p><p className="mt-3 text-xs text-[#8b9aa0]">{new Date(item.created_at).toLocaleDateString("es-CR")}</p></article>)}</div></section>}

            {tab === "rewards" && <section><PageTitle title="Progreso y recompensas" description="Seguimiento de Monedas CEAC y Lumi." /><div className="grid gap-4 lg:grid-cols-3"><Metric iconName="monetization_on" label="Monedas CEAC" value={String(gamification.data?.coins ?? 0)} /><Metric iconName="local_fire_department" label="Racha" value={`${gamification.data?.streak ?? 0} días`} /><Metric iconName="mood" label="Estado de Lumi" value={gamification.data?.mood ?? "feliz"} /></div><p className="mt-4 rounded-2xl border border-[#f0dfb9] bg-[#fffaf0] p-4 text-sm text-[#6f8087]">Este panel es de seguimiento. El canje de premios permanece en la cuenta del estudiante.</p></section>}

            {tab === "profile" && <section><PageTitle title="Mi perfil" description="Datos de la cuenta familiar." /><div className="rounded-2xl border border-[#dce7ea] bg-white p-5 shadow-sm"><Profile label="Nombre" value={fullName || "Familia CEAC"} /><Profile label="Correo" value={email} /><Profile label="Estudiante seleccionado" value={student.name} /><Profile label="Relación" value={links.data?.find((row) => row.student_id === student.id)?.relationship ?? "Encargado"} /></div></section>}
          </>
        )}
      </main>
    </div>
  );
}

function Metric({ iconName, label, value }: { iconName: string; label: string; value: string }) {
  return <div className="rounded-2xl border border-[#dce7ea] bg-white p-4 shadow-sm"><span className="material-symbols-outlined rounded-xl bg-[#e7f4f7] p-2 text-[#315b69]">{iconName}</span><p className="mt-3 text-sm text-[#748890]">{label}</p><p className="text-2xl font-bold text-[#243746]">{value}</p></div>;
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-[#dce7ea] bg-white p-5 shadow-sm"><h2 className="mb-3 font-semibold text-[#315b69]">{title}</h2><div className="space-y-3">{children}</div></div>;
}
function PageTitle({ title, description }: { title: string; description: string }) {
  return <div className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#18a9e2]">Portal familiar</p><h1 className="mt-1 text-2xl font-bold text-[#315b69]">{title}</h1><p className="mt-1 text-sm text-[#748890]">{description}</p></div>;
}
function Profile({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-[#e5ecef] py-3 last:border-0"><p className="text-xs text-[#8b9aa0]">{label}</p><p className="font-semibold text-[#315b69]">{value}</p></div>;
}
