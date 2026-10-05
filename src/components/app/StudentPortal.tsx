import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { NewsletterManager } from "./NewsletterManager";

type PortalTab = "home" | "courses" | "grades" | "messages" | "tasks" | "newsletter" | "chat" | "profile";

const fallbackCourses = [
  { id: "mock-mat", title: "Matemáticas", teacher: "Prof. Carlos Menéndez", schedule: "Lun y Mié · 08:00", room: "Aula 204" },
  { id: "mock-esp", title: "Español", teacher: "Prof. Patricia Valenzuela", schedule: "Mar y Jue · 10:00", room: "Aula 108" },
  { id: "mock-cie", title: "Ciencias", teacher: "Dr. Roberto Salgado", schedule: "Vie · 08:30", room: "Laboratorio 3" },
];

const fallbackGrades = [
  { id: "g1", course: "Matemáticas", period: "I período", grade: 8.8, notes: "Buen progreso" },
  { id: "g2", course: "Español", period: "I período", grade: 9.1, notes: "Excelente trabajo" },
  { id: "g3", course: "Ciencias", period: "I período", grade: 8.4, notes: "Reforzar laboratorio" },
];

const fallbackMessages = [
  { id: 1, from: "Prof. Carlos Menéndez", subject: "Matemáticas", text: "Recordá entregar la práctica antes del viernes.", unread: true },
  { id: 2, from: "Prof. Patricia Valenzuela", subject: "Español", text: "La guía del control de lectura ya está disponible.", unread: false },
  { id: 3, from: "Dr. Roberto Salgado", subject: "Ciencias", text: "Para el laboratorio traé bata y cuaderno.", unread: true },
];

const fallbackTasks = [
  { id: 1, title: "Práctica de fracciones", course: "Matemáticas", due: "Viernes", done: false },
  { id: 2, title: "Control de lectura", course: "Español", due: "Martes", done: false },
  { id: 3, title: "Informe de laboratorio", course: "Ciencias", due: "Jueves", done: true },
];

const icon = (name: string) => <span aria-hidden="true" className="material-symbols-outlined text-[22px]">{name}</span>;

export function StudentPortal({
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
  const [tab, setTab] = useState<PortalTab>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages, setMessages] = useState(fallbackMessages);
  const [tasks, setTasks] = useState(fallbackTasks);
  const [chat, setChat] = useState([{ id: 1, from: "bot", text: "Hola. Soy el asistente académico de CEAC. Podés preguntarme por notas, cursos, tareas u horarios." }]);
  const [input, setInput] = useState("");

  const student = useQuery({
    queryKey: ["student_portal_profile", email],
    enabled: Boolean(email),
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*").eq("email", email).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const grades = useQuery({
    queryKey: ["student_portal_grades", student.data?.id],
    enabled: Boolean(student.data?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("student_grades").select("*").eq("student_id", student.data!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const enrollments = useQuery({
    queryKey: ["student_portal_courses", student.data?.id],
    enabled: Boolean(student.data?.id),
    queryFn: async () => {
      const { data, error } = await supabase.from("course_students").select("course_id").eq("student_id", student.data!.id);
      if (error) throw error;
      const ids = data.map((row) => row.course_id);
      if (!ids.length) return [];
      const { data: courses, error: courseError } = await supabase.from("courses").select("*").in("id", ids);
      if (courseError) throw courseError;
      return courses;
    },
  });

  const courseMap = useMemo(() => new Map((enrollments.data ?? []).map((course) => [course.id, course.title])), [enrollments.data]);
  const shownCourses = enrollments.data?.length ? enrollments.data : fallbackCourses;
  const shownGrades = grades.data?.length
    ? grades.data.map((row) => ({ id: row.id, course: courseMap.get(row.course_id) ?? "Curso", period: row.period, grade: Number(row.grade), notes: row.notes }))
    : fallbackGrades;
  const average = shownGrades.length ? shownGrades.reduce((sum, row) => sum + row.grade, 0) / shownGrades.length : 0;
  const displayName = student.data?.name || fullName || "Estudiante";
  const studentCode = student.data?.code || "EST-DEMO-001";
  const gradeLevel = student.data?.grade || "Estudiante CEAC";

  const nav: Array<[PortalTab, string, string]> = [
    ["home", "home", "Inicio"],
    ["courses", "school", "Mis cursos"],
    ["grades", "grading", "Mis notas"],
    ["messages", "forum", "Mensajes"],
    ["tasks", "task", "Tareas"],
    ["newsletter", "newspaper", "Newsletter"],
    ["chat", "smart_toy", "Chatbot"],
    ["profile", "account_circle", "Mi perfil"],
  ];

  const go = (target: PortalTab) => { setTab(target); setMenuOpen(false); };

  const sendChat = () => {
    const value = input.trim();
    if (!value) return;
    const id = Date.now();
    const lower = value.toLowerCase();
    const reply = lower.includes("nota")
      ? `Tu promedio visible actualmente es ${average.toFixed(1)}.`
      : lower.includes("tarea")
        ? `Tenés ${tasks.filter((task) => !task.done).length} tareas pendientes.`
        : lower.includes("curso") || lower.includes("horario")
          ? `Tenés ${shownCourses.length} cursos activos en el portal.`
          : "Puedo ayudarte con tus cursos, notas, tareas, horarios y mensajes.";
    setChat((current) => [...current, { id, from: "student", text: value }, { id: id + 1, from: "bot", text: reply }]);
    setInput("");
  };

  return <div className="min-h-screen min-w-0 overflow-x-hidden bg-surface text-on-surface lg:pl-64">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r bg-surface-container-lowest p-4 shadow-lg lg:flex">
      <div className="px-2 py-4"><p className="font-bold text-primary">Portal del Estudiante</p><p className="text-xs text-on-surface-variant">CEAC</p></div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {nav.map(([target, symbol, label]) => <Button key={target} variant={tab === target ? "secondary" : "ghost"} className="justify-start gap-3 rounded-xl" onClick={() => go(target)}>{icon(symbol)}{label}</Button>)}
      </nav>
      <Button variant="outline" className="justify-start gap-3" onClick={() => void onLogout()}>{icon("logout")}Cerrar sesión</Button>
    </aside>

    {menuOpen && <div className="fixed inset-0 z-[100] lg:hidden">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)} />
      <aside role="dialog" aria-modal="true" aria-label="Menú del estudiante" className="absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] flex-col border-r bg-surface-container-lowest p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-2 px-2 py-4">
          <div><p className="font-bold text-primary">Portal del Estudiante</p><p className="text-xs text-on-surface-variant">CEAC</p></div>
          <Button type="button" variant="ghost" size="icon" aria-label="Cerrar menú" onClick={() => setMenuOpen(false)}>{icon("close")}</Button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {nav.map(([target, symbol, label]) => <Button key={target} variant={tab === target ? "secondary" : "ghost"} className="justify-start gap-3 rounded-xl" onClick={() => go(target)}>{icon(symbol)}{label}</Button>)}
        </nav>
        <Button variant="outline" className="justify-start gap-3" onClick={() => void onLogout()}>{icon("logout")}Cerrar sesión</Button>
      </aside>
    </div>}

    <header className="sticky top-0 z-30 flex min-w-0 items-center gap-2 border-b bg-surface-container-lowest px-3 py-3 shadow-sm sm:px-4">
      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{icon("menu")}</Button>
      <div className="mr-auto min-w-0"><p className="truncate text-sm font-semibold sm:text-base">{displayName}</p><p className="truncate text-xs text-on-surface-variant">{gradeLevel}</p></div>
      <Button variant="ghost" size="icon" onClick={() => go("messages")} aria-label="Mensajes">{icon("notifications")}</Button>
      <Button variant="ghost" size="icon" onClick={() => go("profile")} aria-label="Perfil">{icon("account_circle")}</Button>
    </header>

    <main className="mx-auto min-w-0 max-w-6xl px-3 py-4 pb-24 sm:px-5 sm:py-6 lg:px-8 lg:pb-8">
      {tab === "home" && <section className="space-y-5">
        <div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Portal del estudiante</p><h1 className="text-headline-md font-semibold">Hola, {displayName}</h1><p className="text-on-surface-variant">{gradeLevel} · {studentCode}</p></div>
        <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 lg:grid-cols-4">
          <Metric iconName="school" label="Cursos" value={String(shownCourses.length)} />
          <Metric iconName="workspace_premium" label="Promedio" value={average.toFixed(1)} />
          <Metric iconName="task_alt" label="Tareas pendientes" value={String(tasks.filter((task) => !task.done).length)} />
          <Metric iconName="mark_email_unread" label="Mensajes nuevos" value={String(messages.filter((message) => message.unread).length)} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card title="Próximos cursos">{shownCourses.slice(0, 3).map((course: any) => <div key={course.id} className="rounded-xl bg-surface-container p-3"><strong>{course.title}</strong><p className="text-sm text-on-surface-variant">{course.teacher} · {course.schedule}</p></div>)}</Card>
          <Card title="Mensajes recientes">{messages.slice(0, 3).map((message) => <button key={message.id} className="w-full rounded-xl bg-surface-container p-3 text-left" onClick={() => { setMessages((current) => current.map((item) => item.id === message.id ? { ...item, unread: false } : item)); go("messages"); }}><strong>{message.from}</strong><p className="text-sm text-primary">{message.subject}</p><p className="text-sm text-on-surface-variant">{message.text}</p></button>)}</Card>
        </div>
      </section>}

      {tab === "courses" && <section><h1 className="text-headline-md font-semibold">Mis cursos</h1><p className="mb-5 text-on-surface-variant">Materias y horarios asignados.</p><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{shownCourses.map((course: any) => <article key={course.id} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm"><div className="mb-3 text-primary">{icon("school")}</div><h2 className="font-bold">{course.title}</h2><p className="text-sm text-on-surface-variant">{course.teacher}</p><p className="mt-3 text-sm">{course.schedule}</p><p className="text-sm">{course.room}</p></article>)}</div></section>}

      {tab === "grades" && <section><h1 className="text-headline-md font-semibold">Mis notas</h1><p className="mb-5 text-on-surface-variant">Calificaciones registradas por tus profesores.</p><div className="space-y-3">{shownGrades.map((row) => <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm"><div><strong>{row.course}</strong><p className="text-sm text-on-surface-variant">{row.period}{row.notes ? ` · ${row.notes}` : ""}</p></div><span className="text-2xl font-bold text-primary">{row.grade.toFixed(1)}</span></div>)}</div></section>}

      {tab === "messages" && <section><h1 className="text-headline-md font-semibold">Mensajes de profesores</h1><p className="mb-5 text-on-surface-variant">Avisos y recordatorios académicos.</p><div className="space-y-3">{messages.map((message) => <button key={message.id} className="w-full rounded-2xl bg-surface-container-lowest p-4 text-left shadow-sm" onClick={() => setMessages((current) => current.map((item) => item.id === message.id ? { ...item, unread: false } : item))}><div className="flex justify-between gap-3"><strong>{message.from}</strong>{message.unread && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Nuevo</span>}</div><p className="text-sm font-semibold text-primary">{message.subject}</p><p className="mt-2 text-sm text-on-surface-variant">{message.text}</p></button>)}</div></section>}

      {tab === "tasks" && <section><h1 className="text-headline-md font-semibold">Tareas y entregas</h1><p className="mb-5 text-on-surface-variant">Pendientes académicos de demostración.</p><div className="space-y-3">{tasks.map((task) => <div key={task.id} className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm"><button className={`flex h-9 w-9 items-center justify-center rounded-full ${task.done ? "bg-primary text-primary-foreground" : "bg-surface-container-high"}`} onClick={() => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))}>{icon(task.done ? "check" : "radio_button_unchecked")}</button><div><strong className={task.done ? "line-through opacity-60" : ""}>{task.title}</strong><p className="text-sm text-on-surface-variant">{task.course} · {task.due}</p></div></div>)}</div></section>}

      {tab === "newsletter" && <NewsletterManager isAdmin={false} />}

      {tab === "chat" && <section className="flex min-h-[70vh] flex-col"><h1 className="text-headline-md font-semibold">Chatbot académico</h1><p className="mb-4 text-on-surface-variant">Consultas rápidas del estudiante.</p><div className="flex flex-1 flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">{chat.map((message) => <div key={message.id} className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.from === "student" ? "ml-auto bg-primary text-primary-foreground" : "bg-surface-container"}`}>{message.text}</div>)}</div><form className="mt-3 flex gap-2" onSubmit={(event) => { event.preventDefault(); sendChat(); }}><input className="form-input flex-1" value={input} onChange={(event) => setInput(event.target.value)} placeholder="Preguntá por notas, tareas o cursos…" /><Button type="submit">{icon("send")}</Button></form></section>}

      {tab === "profile" && <section><h1 className="text-headline-md font-semibold">Mi perfil</h1><div className="mt-5 rounded-2xl bg-surface-container-lowest p-5 shadow-sm"><h2 className="text-xl font-bold">{displayName}</h2><p className="text-on-surface-variant">{studentCode}</p><div className="mt-5 grid gap-3 md:grid-cols-2"><Profile label="Correo" value={email} /><Profile label="Grado" value={gradeLevel} /><Profile label="Estado" value={student.data?.status || "Activo"} /><Profile label="Tutor" value={student.data?.tutor || "Tutor de demostración"} /></div></div></section>}
    </main>

    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-surface-container-lowest p-1 lg:hidden">
      {([["home","home","Inicio"],["courses","school","Cursos"],["grades","grading","Notas"],["messages","forum","Mensajes"],["chat","smart_toy","Chat"]] as Array<[PortalTab,string,string]>).map(([target, symbol, label]) => <Button key={target} variant="ghost" className="flex h-16 flex-col gap-0 text-xs" onClick={() => go(target)}>{icon(symbol)}{label}</Button>)}
    </nav>
  </div>;
}

function Metric({ iconName, label, value }: { iconName: string; label: string; value: string }) {
  return <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm"><div className="text-primary">{icon(iconName)}</div><p className="mt-2 text-sm text-on-surface-variant">{label}</p><p className="text-2xl font-bold">{value}</p></div>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm"><h2 className="mb-3 font-semibold">{title}</h2><div className="space-y-3">{children}</div></div>;
}

function Profile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-surface-container p-4"><p className="text-sm text-on-surface-variant">{label}</p><p className="font-semibold">{value}</p></div>;
}
