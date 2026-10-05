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
import { AdminUsersManager } from "./AdminUsersManager";
import { StudentRecordsManager } from "./StudentRecordsManager";
import { StudentPortal } from "./StudentPortal";
import { NewsletterManager } from "./NewsletterManager";

type View = AppSection;

const icon = (name: string) => <span aria-hidden="true" className="material-symbols-outlined text-[22px]">{name}</span>;

export function AppExperience() {
  const [view, setView] = useState<View>(() => {
    try { return savedView(window.localStorage.getItem(APP_SECTION_KEY)); } catch { return "home"; }
  });
  useEffect(() => {
    try { window.localStorage.setItem(APP_SECTION_KEY, view); } catch { /* Private browsing may block storage. */ }
  }, [view]);
  const [announcementRequest, setAnnouncementRequest] = useState(0);
  const [studentRequest, setStudentRequest] = useState(0);
  const account = useAccount();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const isAdmin = account.isAdmin;
  const isStudent = account.roles.includes("estudiante");

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
    const { data, error } = await supabase.from("teacher_profiles").select("*");
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
    ["students", "groups", "Estudiantes"], ["records", "folder_open", "Expedientes"], ["announcements", "campaign", "Anuncios"], ["newsletter", "newspaper", "Newsletter"],
    ["teachers", "person", "Docentes"], ...(isAdmin ? [["users", "manage_accounts", "Usuarios"] as [View, string, string], ["admissions", "assignment", "Solicitudes"] as [View, string, string]] : []), ["supervision", "visibility", "Supervisión"],
    ["assistant", "search", "Consultas"], ["profile", "account_circle", "Perfil"],
  ];
  const go = (target: View) => { setAnnouncementRequest(0); setStudentRequest(0); setView(target); };
  const refresh = async () => {
    await Promise.all([
      "courses", "students", "student_documents", "announcements", "newsletter", "teacher_profiles", "course_students", "admission_requests", "analytics",
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
  if (account.error || !account.label) return (
    <div className="mx-auto max-w-lg p-8" role="alert">
      <p>No se pudo verificar el acceso: {account.error?.message ?? "Esta cuenta no tiene un rol válido."}</p>
      <Button className="mt-4" onClick={logOut}>Volver al inicio de sesión</Button>
    </div>
  );

  if (isStudent) {
    return (
      <StudentPortal
        userId={account.data!.userId}
        email={account.data!.email}
        fullName={account.data!.fullName}
        onLogout={logOut}
      />
    );
  }

  return <div className="min-h-screen min-w-0 overflow-x-hidden bg-[#f3f7f8] text-[#243746] lg:pl-64">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col gap-2 border-r border-white/10 bg-[#567b88] p-4 text-white shadow-xl lg:flex">
      <div className="mb-2 flex items-center gap-3 px-2 py-4">
        <div className="grid h-10 w-14 grid-cols-3 overflow-hidden rounded-md border border-white/15">
          <span className="bg-[#6f8f99]" />
          <span className="bg-[#64779a]" />
          <span className="bg-[#f4b51f]" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-white">Educación</p>
          <p className="text-sm font-semibold leading-tight text-white">Adventista</p>
        </div>
      </div>
      <nav aria-label="Secciones de la plataforma" className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {nav.map(([target, symbol, label]) => <Button key={target} type="button" variant="ghost" className={`justify-start gap-3 rounded-xl text-white hover:bg-white/12 hover:text-white ${view === target ? "bg-white/16 shadow-sm" : ""}`} aria-current={view === target ? "page" : undefined} onClick={() => go(target)}>{icon(symbol)}{label}</Button>)}
      </nav>
      <Button variant="ghost" className="justify-start gap-3 border border-white/20 text-white hover:bg-white/12 hover:text-white" onClick={logOut}>{icon("logout")}Cerrar sesión</Button>
    </aside>


    <header className="sticky top-0 z-30 flex min-w-0 items-center gap-2 border-b border-[#dbe5e8] bg-white/95 px-3 py-3 shadow-sm backdrop-blur sm:px-5">
      <button type="button" className="mr-auto min-w-0 text-left" onClick={() => go("home")}>
        <span className="block truncate text-sm font-semibold text-[#315b69] sm:text-base">Centro Educativo Adventista de Cartago</span>
        <span className="hidden text-xs text-[#7a8c93] sm:block">{isAdmin ? "Panel administrativo" : "Panel docente"}</span>
      </button>
      <Button variant="ghost" size="icon" aria-label="Actualizar datos" onClick={refresh}>{icon("refresh")}</Button>
      <Button variant="ghost" size="icon" aria-label="Ver anuncios" onClick={() => go("announcements")}>{icon("notifications")}</Button>
      <Button variant="ghost" size="icon" aria-label="Ver perfil" onClick={() => go("profile")}>{icon("account_circle")}</Button>
    </header>
    <nav aria-label="Navegación móvil y tablet" className="sticky top-[60px] z-20 flex gap-2 overflow-x-auto border-b border-[#dbe5e8] bg-white px-3 py-2 shadow-sm no-scrollbar lg:hidden">
      {nav.map(([target, symbol, label]) => <Button
        key={target}
        type="button"
        variant="ghost"
        className={`h-10 shrink-0 gap-2 rounded-full px-3 text-[#486d79] ${view === target ? "bg-[#e7f2f5] text-[#315b69]" : ""}`}
        aria-current={view === target ? "page" : undefined}
        onClick={() => go(target)}
      >{icon(symbol)}<span className="text-xs sm:text-sm">{label}</span></Button>)}
      <Button type="button" variant="outline" className="h-10 shrink-0 gap-2 rounded-full px-3" onClick={logOut}>{icon("logout")}<span className="text-xs sm:text-sm">Salir</span></Button>
    </nav>
    <main id="app-contenido" className="mx-auto min-w-0 max-w-7xl px-3 py-5 pb-24 sm:px-5 sm:py-7 lg:px-8 lg:pb-8">
      {view === "home" && (isAdmin ? <>
        <section className="mb-6 overflow-hidden rounded-[28px] border border-[#dce7ea] bg-white shadow-[0_12px_35px_rgba(49,91,105,0.08)]">
          <div className="flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#18a9e2]">Bienvenida</p>
              <h1 className="text-2xl font-bold tracking-tight text-[#243746] sm:text-3xl">Hola{account.data?.fullName ? `, ${account.data.fullName}` : ""}</h1>
              <p className="mt-2 text-sm text-[#73868e]">Aquí tenés un resumen de lo más importante en tu institución · {new Date().toLocaleDateString("es-CR", { dateStyle: "long" })}</p>
            </div>
            <div className="rounded-2xl border border-[#f3ddb0] bg-[#fff9ec] px-5 py-4 lg:max-w-sm">
              <p className="text-sm italic leading-6 text-[#64779a]">“Formando mente, carácter y un propósito eterno.”</p>
              <div className="mt-3 h-1 w-12 rounded-full bg-[#f4b51f]" />
            </div>
          </div>
        </section>
        <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {isAdmin && <Button className="h-14 gap-2 rounded-2xl bg-[#315b69] text-white shadow-sm hover:bg-[#294e5a]" onClick={() => { go("students"); setStudentRequest((n) => n + 1); }}>{icon("person_add")}Nuevo estudiante</Button>}
          <Button className="h-14 gap-2 rounded-2xl bg-[#18a9e2] text-white shadow-sm hover:bg-[#128fc0]" onClick={() => go("courses")}>{icon("school")}Gestionar cursos</Button>
          {isAdmin && <Button className="h-14 gap-2 rounded-2xl bg-[#f4b51f] text-[#243746] shadow-sm hover:bg-[#e5a716]" onClick={() => { go("announcements"); setAnnouncementRequest((n) => n + 1); }}>{icon("campaign")}Nuevo anuncio</Button>}
          <Button variant="outline" className="h-14 gap-2 rounded-2xl border-[#cbdbe0] bg-white text-[#64779a] shadow-sm hover:bg-[#f4f8f9]" onClick={() => go("assistant")}>{icon("smart_toy")}Asistente interno</Button>
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
      {view === "records" && <StudentRecordsManager />}
      {view === "announcements" && <AnnouncementsManager key={announcementRequest} isAdmin={isAdmin} openNew={announcementRequest} />}
      {view === "newsletter" && <NewsletterManager isAdmin={isAdmin} />}
      {view === "teachers" && <TeachersManager isAdmin={isAdmin} userId={account.data!.userId} courses={courses.data ?? []} />}
      {view === "users" && isAdmin && <AdminUsersManager />}
      {view === "admissions" && isAdmin && <AdmissionsManager />}
      {view === "supervision" && <Supervision courses={courses.data ?? []} announcements={announcements.data ?? []} />}
      {view === "assistant" && <AssistantChat isAdmin={isAdmin} userId={account.data!.userId} />}
      {view === "profile" && <ProfilePanel />}
    </main>

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
