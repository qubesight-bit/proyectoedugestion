import { useState } from "react";
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

type View = "home" | "courses" | "students" | "announcements" | "teachers" | "supervision" | "assistant" | "profile";

const icon = (name: string) => <span aria-hidden="true" className="material-symbols-outlined text-[22px]">{name}</span>;

export function AppExperience() {
  const [view, setView] = useState<View>("home");
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
  const announcements = useQuery({ queryKey: ["announcements"], queryFn: async () => {
    const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } });

  const nav: Array<[View, string, string]> = [
    ["home", "dashboard", "Inicio"], ["courses", "school", "Cursos"],
    ["students", "groups", "Estudiantes"], ["announcements", "campaign", "Anuncios"],
    ["teachers", "person", "Docentes"], ["supervision", "visibility", "Supervisión"],
    ["assistant", "smart_toy", "Asistente IA"], ["profile", "account_circle", "Perfil"],
  ];
  const go = (target: View) => { setAnnouncementRequest(0); setStudentRequest(0); setView(target); setMenuOpen(false); };
  const refresh = async () => {
    await Promise.all([qc.invalidateQueries({ queryKey: ["courses"] }), qc.invalidateQueries({ queryKey: ["students"] }), qc.invalidateQueries({ queryKey: ["announcements"] })]);
    toast.success("Datos actualizados");
  };
  const logOut = async () => {
    await supabase.auth.signOut();
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
        <span>EduGestión</span>
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
    <main id="contenido" className="mx-auto max-w-6xl px-4 py-6 pb-24 md:px-8 md:pb-8">
      {view === "home" && <>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-headline-md font-semibold">Hola{account.data?.fullName ? `, ${account.data.fullName}` : ""}</h1><p className="text-on-surface-variant">Resumen institucional · {new Date().toLocaleDateString("es-CR", { dateStyle: "long" })}</p></div>
          <Button variant="secondary" onClick={() => go("courses")}>Gestionar cursos</Button>
        </div>
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {isAdmin && <Button className="h-16 gap-2 rounded-xl" onClick={() => { go("students"); setStudentRequest((n) => n + 1); }}>{icon("person_add")}Nuevo estudiante</Button>}
          <Button className="h-16 gap-2 rounded-xl" onClick={() => go("courses")}>{icon("school")}Gestionar cursos</Button>
          {isAdmin && <Button className="h-16 gap-2 rounded-xl" onClick={() => { go("announcements"); setAnnouncementRequest((n) => n + 1); }}>{icon("campaign")}Nuevo anuncio</Button>}
        </div>
        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <Metric label="Cursos registrados" value={courses.data?.length} loading={courses.isLoading} onClick={() => go("courses")} />
          <Metric label="Estudiantes activos" value={students.data?.filter((s) => s.status === "Activo").length} loading={students.isLoading} onClick={() => go("students")} />
          <Metric label="Anuncios publicados" value={announcements.data?.length} loading={announcements.isLoading} onClick={() => go("announcements")} />
        </div>
        {[courses, students, announcements].map((q, i) => q.error && <p role="alert" key={i} className="mb-3 text-destructive">Error al cargar {(["cursos", "estudiantes", "anuncios"] as const)[i]}: {q.error.message}</p>)}
        <section aria-labelledby="recent-title" className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between"><h2 id="recent-title" className="text-headline-sm font-semibold">Anuncios recientes</h2><Button variant="ghost" onClick={() => go("announcements")}>Ver todos</Button></div>
          {announcements.isLoading ? <p>Cargando anuncios…</p> : announcements.data?.length ? <ul className="space-y-3">{announcements.data.slice(0, 3).map((a) => <li key={a.id} className="rounded-xl border p-3"><strong>{a.title}</strong><p className="whitespace-pre-wrap text-sm">{a.content}</p><span className="text-xs text-on-surface-variant">{new Date(a.created_at).toLocaleDateString("es-CR")}</span></li>)}</ul> : <p>Todavía no hay anuncios.</p>}
        </section>
      </>}
      {view === "courses" && <CoursesManager isAdmin={isAdmin} />}
      {view === "students" && <StudentsManager key={studentRequest} isAdmin={isAdmin} openNew={studentRequest} />}
      {view === "announcements" && <AnnouncementsManager key={announcementRequest} isAdmin={isAdmin} openNew={announcementRequest} />}
      {view === "teachers" && <Teachers courses={courses.data ?? []} />}
      {view === "supervision" && <Supervision courses={courses.data ?? []} announcements={announcements.data ?? []} />}
      {view === "assistant" && <AssistantChat />}
      {view === "profile" && <ProfilePanel />}
    </main>
    <nav aria-label="Navegación rápida" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t bg-surface-container-lowest p-2 md:hidden">
      {(["home", "courses", "students", "announcements"] as const).map((target) => <Button key={target} type="button" variant="ghost" className="flex h-16 flex-col gap-0 text-xs" aria-label={target} aria-current={view === target ? "page" : undefined} onClick={() => go(target)}>{icon(({home:"dashboard", courses:"school", students:"groups", announcements:"campaign"})[target])}{({home:"Inicio", courses:"Cursos", students:"Alumnos", announcements:"Anuncios"})[target]}</Button>)}
    </nav>
  </div>;
}

function Metric({ label, value, loading, onClick }: { label: string; value: number | undefined; loading: boolean; onClick: () => void }) {
  return <Button variant="secondary" onClick={onClick} className="h-auto flex-col items-start rounded-2xl p-5 text-left"><span className="text-sm">{label}</span><strong className="text-3xl">{loading ? "…" : value ?? "—"}</strong></Button>;
}

function Teachers({ courses }: { courses: Array<{ id: string; title: string; teacher: string }> }) {
  const [search, setSearch] = useState("");
  const names = [...new Set(courses.map((c) => c.teacher.trim()).filter(Boolean))].filter((n) => n.toLowerCase().includes(search.toLowerCase()));
  return <section><h1 className="text-headline-md font-semibold">Docentes de cursos</h1><p className="mb-4 text-on-surface-variant">Docentes registrados como titulares en los cursos.</p><input className="form-input mb-4" type="search" aria-label="Buscar docente" placeholder="Buscar docente" value={search} onChange={(e) => setSearch(e.target.value)} /><ul className="grid gap-3 md:grid-cols-2">{names.map((name) => <li key={name} className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm"><strong>{name}</strong><p className="text-sm">{courses.filter((c) => c.teacher.trim() === name).map((c) => c.title).join(", ")}</p></li>)}</ul>{names.length === 0 && <p>No hay docentes en los cursos registrados.</p>}</section>;
}

function Supervision({ courses, announcements }: { courses: Array<{ id: string; title: string; teacher: string; updated_at: string }>; announcements: Array<{ id: string; title: string; created_at: string }> }) {
  const [filter, setFilter] = useState("todos");
  const items = [
    ...courses.map((c) => ({ id: c.id, kind: "Curso", title: c.title, detail: c.teacher, date: c.updated_at })),
    ...announcements.map((a) => ({ id: a.id, kind: "Anuncio", title: a.title, detail: "", date: a.created_at })),
  ].filter((i) => filter === "todos" || i.kind === filter).sort((a,b) => b.date.localeCompare(a.date));
  return <section><h1 className="text-headline-md font-semibold">Supervisión</h1><p className="mb-4 text-on-surface-variant">Actividad registrada de cursos y anuncios.</p><label className="flex items-center gap-2">Filtrar <select className="form-input mb-4 max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="todos">Todos</option><option value="Curso">Cursos</option><option value="Anuncio">Anuncios</option></select></label><ul className="space-y-3">{items.map((item) => <li key={`${item.kind}-${item.id}`} className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm"><strong>{item.kind}: {item.title}</strong><p>{item.detail}</p><small>{new Date(item.date).toLocaleDateString("es-CR")}</small></li>)}</ul>{items.length === 0 && <p>No hay actividad registrada.</p>}</section>;
}
