import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";

const studentCourses = [
  { id: "MAT-4A", name: "Matemáticas", teacher: "Prof. Carlos Menéndez", schedule: "Lun y Mié · 08:00", room: "Aula 204", progress: 72 },
  { id: "ESP-4A", name: "Español", teacher: "Prof. Patricia Valenzuela", schedule: "Mar y Jue · 10:00", room: "Aula 108", progress: 81 },
  { id: "CIE-4A", name: "Ciencias", teacher: "Dr. Roberto Salgado", schedule: "Vie · 08:30", room: "Laboratorio 3", progress: 64 },
];

const studentGrades = [
  { course: "Matemáticas", teacher: "Prof. Carlos Menéndez", first: 88, second: 92, project: 95 },
  { course: "Español", teacher: "Prof. Patricia Valenzuela", first: 91, second: 89, project: 94 },
  { course: "Ciencias", teacher: "Dr. Roberto Salgado", first: 84, second: 87, project: 90 },
];

const teacherMessages = [
  { id: 1, from: "Prof. Carlos Menéndez", subject: "Matemáticas", date: "Hoy · 09:15", text: "Recuerden entregar la práctica de fracciones antes del viernes.", unread: true },
  { id: 2, from: "Prof. Patricia Valenzuela", subject: "Español", date: "Ayer · 14:20", text: "Ya está disponible la guía para el próximo control de lectura.", unread: false },
  { id: 3, from: "Dr. Roberto Salgado", subject: "Ciencias", date: "Lun · 11:05", text: "El laboratorio de esta semana requiere traer bata y cuaderno.", unread: true },
];

const tasks = [
  { id: 1, title: "Práctica de fracciones", course: "Matemáticas", due: "Viernes", done: false },
  { id: 2, title: "Control de lectura", course: "Español", due: "Martes", done: false },
  { id: 3, title: "Informe de laboratorio", course: "Ciencias", due: "Jueves", done: true },
];

export function StudentHomeView({ onNavigate }: { onNavigate: (target: "student_courses" | "student_grades" | "student_messages" | "student_chatbot" | "student_tasks") => void }) {
  const average = Math.round(
    studentGrades.reduce((sum, grade) => sum + (grade.first + grade.second + grade.project) / 3, 0) /
      studentGrades.length,
  );

  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
        <p className="text-body-sm text-on-surface-variant">Portal del estudiante</p>
        <h1 className="mt-1 text-headline-md font-semibold">Hola, Camilo 👋</h1>
        <p className="mt-1 text-body-sm text-on-surface-variant">4° Primaria A · EST-2024-089</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StudentMetric icon="school" label="Cursos activos" value="3" />
        <StudentMetric icon="workspace_premium" label="Promedio" value={String(average)} />
        <StudentMetric icon="task_alt" label="Tareas pendientes" value="2" />
        <StudentMetric icon="mark_email_unread" label="Mensajes nuevos" value="2" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-sm font-semibold">Próximas clases</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("student_courses")}>Ver cursos</Button>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {studentCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="flex items-center gap-3 rounded-xl bg-surface-container p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-on-primary-fixed">
                  <Icon name="menu_book" className="text-[20px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{course.name}</p>
                  <p className="truncate text-body-sm text-on-surface-variant">{course.schedule} · {course.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-sm font-semibold">Mensajes recientes</h2>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("student_messages")}>Ver todos</Button>
          </div>
          <div className="mt-4 flex flex-col gap-3">
            {teacherMessages.slice(0, 2).map((message) => (
              <div key={message.id} className="rounded-xl bg-surface-container p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{message.from}</p>
                  {message.unread && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                </div>
                <p className="text-body-sm text-primary">{message.subject}</p>
                <p className="mt-1 line-clamp-2 text-body-sm text-on-surface-variant">{message.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <QuickStudentAction icon="grading" label="Mis notas" onClick={() => onNavigate("student_grades")} />
        <QuickStudentAction icon="task" label="Tareas" onClick={() => onNavigate("student_tasks")} />
        <QuickStudentAction icon="forum" label="Mensajes" onClick={() => onNavigate("student_messages")} />
        <QuickStudentAction icon="smart_toy" label="Chatbot" onClick={() => onNavigate("student_chatbot")} />
      </div>
    </section>
  );
}

export function StudentCoursesView() {
  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div>
        <h1 className="text-headline-md font-semibold">Mis Cursos</h1>
        <p className="text-body-sm text-on-surface-variant">Materias inscritas y progreso del período.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {studentCourses.map((course) => (
          <article key={course.id} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-on-primary-fixed">
                <Icon name="school" />
              </div>
              <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-label-sm font-semibold">Activo</span>
            </div>
            <h2 className="mt-4 text-title-lg font-bold">{course.name}</h2>
            <p className="text-body-sm text-on-surface-variant">{course.teacher}</p>
            <div className="mt-4 space-y-1 text-body-sm text-on-surface-variant">
              <p>{course.schedule}</p>
              <p>{course.room}</p>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex justify-between text-label-sm">
                <span>Progreso</span>
                <span>{course.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                <div className="h-full rounded-full bg-primary" style={{ width: `${course.progress}%` }} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function StudentGradesView() {
  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div>
        <h1 className="text-headline-md font-semibold">Mis Notas</h1>
        <p className="text-body-sm text-on-surface-variant">Resumen de evaluaciones por materia.</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
        {studentGrades.map((grade) => {
          const average = Math.round((grade.first + grade.second + grade.project) / 3);
          return (
            <div key={grade.course} className="grid gap-3 border-b border-outline-variant/30 p-4 last:border-0 md:grid-cols-[1.4fr_repeat(4,1fr)] md:items-center">
              <div>
                <p className="font-semibold">{grade.course}</p>
                <p className="text-body-sm text-on-surface-variant">{grade.teacher}</p>
              </div>
              <GradeCell label="I Parcial" value={grade.first} />
              <GradeCell label="II Parcial" value={grade.second} />
              <GradeCell label="Proyecto" value={grade.project} />
              <GradeCell label="Promedio" value={average} strong />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function StudentMessagesView() {
  const [messages, setMessages] = useState(teacherMessages);

  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div>
        <h1 className="text-headline-md font-semibold">Mensajes de Profesores</h1>
        <p className="text-body-sm text-on-surface-variant">Avisos académicos y recordatorios.</p>
      </div>
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <button
            type="button"
            key={message.id}
            className="rounded-2xl bg-surface-container-lowest p-4 text-left shadow-sm"
            onClick={() => setMessages((current) => current.map((item) => item.id === message.id ? { ...item, unread: false } : item))}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{message.from}</p>
                <p className="text-body-sm font-semibold text-primary">{message.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                {message.unread && <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground">Nuevo</span>}
                <span className="text-xs text-on-surface-variant">{message.date}</span>
              </div>
            </div>
            <p className="mt-3 text-body-sm text-on-surface-variant">{message.text}</p>
          </button>
        ))}
      </div>
    </section>
  );
}

export function StudentTasksView() {
  const [items, setItems] = useState(tasks);

  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div>
        <h1 className="text-headline-md font-semibold">Tareas y Entregas</h1>
        <p className="text-body-sm text-on-surface-variant">Organizá tus pendientes académicos.</p>
      </div>

      <div className="rounded-2xl bg-surface-container-lowest shadow-sm">
        {items.map((task) => (
          <div key={task.id} className="flex items-center gap-3 border-b border-outline-variant/30 p-4 last:border-0">
            <button
              type="button"
              className={`flex h-8 w-8 items-center justify-center rounded-full ${task.done ? "bg-tertiary text-on-tertiary" : "bg-surface-container-high"}`}
              onClick={() => setItems((current) => current.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))}
              aria-label={task.done ? "Marcar pendiente" : "Marcar completada"}
            >
              <Icon name={task.done ? "check" : "radio_button_unchecked"} className="text-[18px]" />
            </button>
            <div className="min-w-0 flex-1">
              <p className={`font-semibold ${task.done ? "line-through opacity-60" : ""}`}>{task.title}</p>
              <p className="text-body-sm text-on-surface-variant">{task.course} · Entrega: {task.due}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StudentChatbotView() {
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "¡Hola, Camilo! Soy el asistente académico de CEAC. Puedo ayudarte con horarios, cursos, tareas y dudas generales." },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    const value = input.trim();
    if (!value) return;
    const nextId = messages.length + 1;
    setMessages((current) => [
      ...current,
      { id: nextId, from: "student", text: value },
      { id: nextId + 1, from: "bot", text: demoBotReply(value) },
    ]);
    setInput("");
  };

  return (
    <section className="flex min-h-[calc(100vh-9rem)] flex-col gap-4 px-4 py-4 animate-edu-rise">
      <div>
        <h1 className="text-headline-md font-semibold">Asistente Académico</h1>
        <p className="text-body-sm text-on-surface-variant">Chatbot de demostración Front End.</p>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-body-sm ${message.from === "student" ? "ml-auto bg-primary text-primary-foreground" : "bg-surface-container text-on-surface"}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
      >
        <input
          className="h-12 min-w-0 flex-1 rounded-xl bg-surface-container-low px-4 outline-none ring-primary focus:ring-2"
          placeholder="Preguntá sobre horarios, tareas o cursos..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <Button type="submit" className="h-12 rounded-xl px-4">
          <Icon name="send" />
        </Button>
      </form>
    </section>
  );
}

export function StudentProfileView() {
  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div>
        <h1 className="text-headline-md font-semibold">Mi Perfil</h1>
        <p className="text-body-sm text-on-surface-variant">Información académica del estudiante.</p>
      </div>
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-on-primary-fixed">
            <Icon name="person" className="text-[34px]" />
          </div>
          <div>
            <h2 className="text-title-lg font-bold">Camilo Andrés Morales</h2>
            <p className="text-body-sm text-on-surface-variant">EST-2024-089 · 4° Primaria A</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ProfileField label="Estado" value="Activo" />
          <ProfileField label="Promedio general" value="9.1 / 10" />
          <ProfileField label="Asistencia" value="96%" />
          <ProfileField label="Tutor registrado" value="M. Morales" />
        </div>
      </div>
    </section>
  );
}

function demoBotReply(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes("nota")) return "Podés revisar todas tus calificaciones en la sección Mis Notas.";
  if (normalized.includes("tarea")) return "Tenés 2 tareas pendientes esta semana. Revisá la sección Tareas para ver las fechas.";
  if (normalized.includes("horario") || normalized.includes("clase")) return "Tu próxima clase es Matemáticas, lunes y miércoles a las 08:00 en el Aula 204.";
  if (normalized.includes("mensaje")) return "Tenés 2 mensajes nuevos de profesores.";
  return "Puedo orientarte sobre tus cursos, notas, tareas, horarios y mensajes. Esta respuesta es simulada para la demo Front End.";
}

function StudentMetric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <Icon name={icon} className="text-[26px] text-primary" />
      <p className="mt-2 text-body-sm text-on-surface-variant">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickStudentAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <Button variant="secondary" className="h-24 flex-col gap-2 rounded-2xl" onClick={onClick}>
      <Icon name={icon} className="text-[28px]" />
      <span className="text-sm font-semibold">{label}</span>
    </Button>
  );
}

function GradeCell({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div>
      <p className="text-xs text-on-surface-variant">{label}</p>
      <p className={strong ? "text-lg font-bold text-primary" : "font-semibold"}>{value}</p>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-container p-4">
      <p className="text-body-sm text-on-surface-variant">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
