import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CoursesManager } from "./CoursesManager";
import { StudentsManager } from "./StudentsManager";
import { AnnouncementsManager } from "./AnnouncementsManager";
import { ProfilePanel } from "./ProfilePanel";
import { AssistantChat } from "./AssistantChat";
import { useAccount } from "./useAccount";
import { TeachersManager } from "./TeachersManager";
import { AdmissionsManager } from "./AdmissionsManager";
import { APP_SECTION_KEY, savedView, type AppSection } from "@/lib/app-section";
import { assignedCourses } from "@/lib/academic";
import { pageItems, PaginationControls } from "./PaginationControls";
import { AnalyticsDashboard } from "./AnalyticsDashboard";

type View = AppSection;

const icon = (name: string) => <span aria-hidden="true" className="material-symbols-outlined text-[22px]">{name}</span>;

export function AppExperience() {
  const [view, setView] = useState<View>(() => {
    try { return savedView(window.localStorage.getItem(APP_SECTION_KEY)); } catch { return "home"; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(APP_SECTION_KEY, view); } catch { /* Private browsing may block storage. */ }
  }, [view]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcementRequest, setAnnouncementRequest] = useState(0);
  const [studentRequest, setStudentRequest] = useState(0);
  const account = useAccount();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const isAdmin = account.isAdmin;

  const courses = useQuery({ queryKey: ["courses"], queryFn: async () => {
    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } });
  const students = useQuery({ queryKey: ["students"], queryFn: async () => {
    const { data, error } = await supabase.from("students").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } });
  const teacherProfiles = useQuery({ queryKey: ["teacher_profiles"], queryFn: async () => {
    const { data, error } = await supabase.from("teacher_profiles").select("id, user_id");
    if (error) throw error;
    return data;
  } });
  useEffect(() => {
    if (!account.isLoading && !isAdmin && view === "admissions") setView("home");
  }, [account.isLoading, isAdmin, view]);
  const ownCourseCount = teacherProfiles.error ? courses.data?.length : assignedCourses(courses.data ?? [], teacherProfiles.data ?? [], account.data?.userId ?? "").length;
  const announcements = useQuery({ queryKey: ["announcements"], queryFn: async () => {
    const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } });

  const nav: Array<[View, string, string]> = [
    ["home", "dashboard", "Inicio"], ["courses", "school", "Cursos"],
    ["students", "groups", "Estudiantes"], ["announcements", "campaign", "Anuncios"],
    ["teachers", "person", "Docentes"], ...(isAdmin ? [["admissions", "assignment", "Solicitudes"] as [View, string, string]] : []), ["supervision", "visibility", "Supervisión"],
    ["assistant", "search", "Consultas"], ["profile", "account_circle", "Perfil"],
  ];
  const go = (target: View) => { setAnnouncementRequest(0); setStudentRequest(0); setView(target); setMenuOpen(false); };
  const refresh = async () => {
    await Promise.all([
      "courses", "students", "student_documents", "announcements", "teacher_profiles", "course_students", "admission_requests", "analytics",
    ].map((key) => qc.invalidateQueries({ queryKey: [key] })));
    toast.success("Datos actualizados");
  };
  const logOut = async () => {
    await supabase.auth.signOut();
    try { window.localStorage.removeItem(APP_SECTION_KEY); } catch { /* Storage may be unavailable. */ }
    qc.clear();
    await navigate({ to: "/auth", replace: true });
  };

  if (account.isLoading) return <p role="status" className="p-8">Cargando cuenta…</p>;
  if (account.error || !account.label || account.label === "Estudiante") return (
    <div className="mx-auto max-w-lg p-8" role="alert">
      <p>No se pudo verificar el acceso: {account.error?.message ?? "Esta cuenta no tiene el rol de administrador o docente."}</p>
      <Button className="mt-4" onClick={logOut}>Volver al inicio de sesión</Button>
    </div>
  );

  return <div className="min-h-screen bg-surface text-on-surface md:pl-64">
    <aside className={`${menuOpen ? "flex" : "hidden"} fixed inset-y-0 left-0 z-50 w-64 flex-col gap-2 border-r bg-surface-container-lowest p-4 shadow-lg md:flex`}>
      <div className="flex items-center justify-between gap-2 px-2 py-4 font-bold text-primary">
        <span>Centro Educativo Adventista</span>
        <Button className="md:hidden" variant="ghost" size="icon" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}>{icon("close")}</Button>
      </div>
      <nav aria-label="Secciones de la plataforma" className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {nav.map(([target, symbol, label]) => <Button key={target} type="button" variant={view === target ? "secondary" : "ghost"} className="justify-start gap-3 rounded-xl" aria-current={view === target ? "page" : undefined} onClick={() => go(target)}>{icon(symbol)}{label}</Button>)}
      </nav>
      <Button variant="outline" className="justify-start gap-3" onClick={logOut}>{icon("logout")}Cerrar sesión</Button>
    </aside>
    {menuOpen && <button type="button" className="fixed inset-0 z-40 bg-black/40 md:hidden" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />}
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-surface-container-lowest px-4 py-3 shadow-sm">
      <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}>{icon("menu")}</Button>
      <button type="button" className="mr-auto text-left font-semibold" onClick={() => go("home")}>Centro Educativo Adventista de Cartago</button>
      <Button variant="ghost" size="icon" aria-label="Actualizar datos" onClick={refresh}>{icon("refresh")}</Button>
      <Button variant="ghost" size="icon" aria-label="Ver anuncios" onClick={() => go("announcements")}>{icon("notifications")}</Button>
      <Button variant="ghost" size="icon" aria-label="Ver perfil" onClick={() => go("profile")}>{icon("account_circle")}</Button>
    </header>
    <main id="app-contenido" className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:pb-8">
      {view === "home" && (isAdmin ? <>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-headline-md font-semibold">Hola{account.data?.fullName ? `, ${account.data.fullName}` : ""}</h1><p className="text-on-surface-variant">Resumen institucional · {new Date().toLocaleDateString("es-CR", { dateStyle: "long" })}</p></div>
          <Button variant="secondary" onClick={() => go("courses")}>Gestionar cursos</Button>
        </div>
        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          {isAdmin && <Button className="h-16 gap-2 rounded-xl" onClick={() => { go("students"); setStudentRequest((n) => n + 1); }}>{icon("person_add")}Nuevo estudiante</Button>}
          <Button className="h-16 gap-2 rounded-xl" onClick={() => go("courses")}>{icon("school")}Gestionar cursos</Button>
          {isAdmin && <Button className="h-16 gap-2 rounded-xl" onClick={() => { go("announcements"); setAnnouncementRequest((n) => n + 1); }}>{icon("campaign")}Nuevo anuncio</Button>}
          <Button variant="secondary" className="h-16 gap-2 rounded-xl" onClick={() => go("assistant")}>{icon("smart_toy")}Asistente interno</Button>
        </div>

        {[courses, students, announcements].map((q, i) => q.error && <p role="alert" key={i} className="mb-3 text-destructive">Error al cargar {(["cursos", "estudiantes", "anuncios"] as const)[i]}: {q.error.message}</p>)}
        <AnalyticsDashboard
          isAdmin
          courses={courses.data ?? []}
          students={students.data ?? []}
          teachers={teacherProfiles.data ?? []}
          announcements={announcements.data ?? []}
          loading={courses.isLoading || students.isLoading || teacherProfiles.isLoading || announcements.isLoading}
        />
      </> : <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Panel docente</p><h1 className="text-headline-md font-semibold">Hola{account.data?.fullName ? `, ${account.data.fullName}` : ""}</h1><p>Analíticas de tus cursos, estudiantes y horarios autorizados.</p></div>
          <Button onClick={() => go("courses")}>Ver mis cursos ({ownCourseCount ?? 0})</Button>
        </div>
        <AnalyticsDashboard
          isAdmin={false}
          courses={courses.data ?? []}
          students={students.data ?? []}
          teachers={teacherProfiles.data ?? []}
          announcements={announcements.data ?? []}
          loading={courses.isLoading || students.isLoading || teacherProfiles.isLoading || announcements.isLoading}
        />
      </section>)}
      {view === "courses" && <CoursesManager isAdmin={isAdmin} userId={account.data!.userId} />}
      {view === "students" && <StudentsManager key={studentRequest} isAdmin={isAdmin} openNew={studentRequest} />}
      {view === "announcements" && <AnnouncementsManager key={announcementRequest} isAdmin={isAdmin} openNew={announcementRequest} />}
      {view === "teachers" && <TeachersManager isAdmin={isAdmin} userId={account.data!.userId} courses={courses.data ?? []} />}
      {view === "admissions" && isAdmin && <AdmissionsManager />}
      {view === "supervision" && <Supervision courses={courses.data ?? []} announcements={announcements.data ?? []} />}
      {view === "assistant" && <AssistantChat isAdmin={isAdmin} userId={account.data!.userId} />}
      {view === "profile" && <ProfilePanel />}
    </main>
    <nav aria-label="Navegación rápida" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-surface-container-lowest p-2 md:hidden">
      {(["home", "courses", "students", "announcements"] as const).map((target) => <Button key={target} type="button" variant="ghost" className="flex h-16 flex-col gap-0 text-xs" aria-label={({home:"Inicio", courses:"Cursos", students:"Alumnos", announcements:"Anuncios"})[target]} aria-current={view === target ? "page" : undefined} onClick={() => go(target)}>{icon(({home:"dashboard", courses:"school", students:"groups", announcements:"campaign"})[target])}{({home:"Inicio", courses:"Cursos", students:"Alumnos", announcements:"Anuncios"})[target]}</Button>)}
    </nav>
  </div>;
}

function Supervision({ courses, announcements }: { courses: Array<{ id: string; title: string; teacher: string; updated_at: string }>; announcements: Array<{ id: string; title: string; created_at: string }> }) {
  const [filter, setFilter] = useState("todos");
  const [page, setPage] = useState(1);
  const items = [
    ...courses.map((c) => ({ id: c.id, kind: "Curso", title: c.title, detail: c.teacher, date: c.updated_at })),
    ...announcements.map((a) => ({ id: a.id, kind: "Anuncio", title: a.title, detail: "", date: a.created_at })),
  ].filter((i) => filter === "todos" || i.kind === filter).sort((a,b) => b.date.localeCompare(a.date));
  useEffect(() => setPage(1), [filter]);
  const pageActivity = pageItems(items, page);
  return <section><h1 className="text-headline-md font-semibold">Supervisión</h1><p className="mb-4 text-on-surface-variant">Actividad registrada de cursos y anuncios.</p><label className="flex items-center gap-2">Filtrar <select className="form-input mb-4 max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="todos">Todos</option><option value="Curso">Cursos</option><option value="Anuncio">Anuncios</option></select></label><ul className="space-y-3">{pageActivity.map((item) => <li key={`${item.kind}-${item.id}`} className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm"><strong>{item.kind}: {item.title}</strong><p>{item.detail}</p><small>{new Date(item.date).toLocaleDateString("es-CR")}</small></li>)}</ul>{items.length === 0 && <p>No hay actividad registrada.</p>}<div className="mt-4"><PaginationControls page={page} total={items.length} onPageChange={setPage} /></div></section>;
}
