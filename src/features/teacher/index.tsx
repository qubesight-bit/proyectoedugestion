import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";

const teacherCourses = [
  { id: "MAT-4A", name: "Matemáticas 4A", room: "Aula 102", students: 28, progress: 40 },
  { id: "FIS-5B", name: "Física 5B", room: "Laboratorio 2", students: 24, progress: 80 },
  { id: "QUI-3A", name: "Química 3A", room: "Laboratorio 1", students: 22, progress: 65 },
];

const initialGrades = [
  { student: "Camilo Morales", course: "Matemáticas 4A", grade: 88 },
  { student: "Valentina Ríos", course: "Matemáticas 4A", grade: 94 },
  { student: "Matías Herrera", course: "Física 5B", grade: 79 },
];

const initialAttendance = [
  { student: "Camilo Morales", status: "Presente" },
  { student: "Valentina Ríos", status: "Presente" },
  { student: "Matías Herrera", status: "Ausente" },
];

const resources = [
  { id: 1, title: "Guía de ejercicios - Matemáticas 4A", type: "PDF", date: "22 Sep" },
  { id: 2, title: "Presentación - Cinemática", type: "PPT", date: "20 Sep" },
  { id: 3, title: "Práctica - Química 3A", type: "DOC", date: "18 Sep" },
];

export function TeacherDashboardView() {
  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div>
        <h1 className="text-headline-md font-semibold">Hola, Prof. Ana García 👋</h1>
        <p className="mt-1 text-body-sm text-on-surface-variant">Resumen de tu jornada académica.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <TeacherMetric icon="school" label="Cursos activos" value="3" />
        <TeacherMetric icon="groups" label="Estudiantes" value="74" />
        <TeacherMetric icon="grading" label="Pendientes por calificar" value="6" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
          <h2 className="text-headline-sm font-semibold">Mis cursos activos</h2>
          <div className="mt-4 flex flex-col gap-4">
            {teacherCourses.map((course) => (
              <div key={course.id}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{course.name}</p>
                    <p className="text-body-sm text-on-surface-variant">{course.room} · {course.students} estudiantes</p>
                  </div>
                  <span className="text-label-sm font-semibold text-primary">{course.progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
          <h2 className="text-headline-sm font-semibold">Próximas clases</h2>
          <div className="mt-4 flex flex-col gap-3">
            {[
              ["10:00", "Matemáticas 4A", "Aula 102"],
              ["12:00", "Física 5B", "Laboratorio 2"],
              ["14:30", "Química 3A", "Laboratorio 1"],
            ].map(([time, course, room]) => (
              <div key={time} className="flex items-center gap-3 rounded-xl bg-surface-container p-3">
                <div className="rounded-lg bg-primary-fixed px-3 py-2 font-bold text-on-primary-fixed">{time}</div>
                <div>
                  <p className="font-semibold">{course}</p>
                  <p className="text-body-sm text-on-surface-variant">{room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TeacherCoursesView() {
  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div>
        <h1 className="text-headline-md font-semibold">Mis Cursos</h1>
        <p className="text-body-sm text-on-surface-variant">Cursos asignados para el ciclo lectivo.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teacherCourses.map((course) => (
          <article key={course.id} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-on-primary-fixed">
                <Icon name="menu_book" />
              </div>
              <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-label-sm font-semibold">Activo</span>
            </div>
            <h2 className="mt-4 text-title-lg font-bold">{course.name}</h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">{course.room}</p>
            <p className="mt-3 text-body-sm">{course.students} estudiantes matriculados</p>
            <Button className="mt-4 w-full rounded-xl" variant="secondary">Ver detalle</Button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function TeacherGradesView() {
  const [grades, setGrades] = useState(initialGrades);
  const average = useMemo(
    () => Math.round(grades.reduce((sum, item) => sum + item.grade, 0) / grades.length),
    [grades],
  );

  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-headline-md font-semibold">Calificaciones</h1>
          <p className="text-body-sm text-on-surface-variant">Edición local para demostración Front End.</p>
        </div>
        <span className="rounded-full bg-primary-fixed px-3 py-1 text-label-sm font-semibold">Promedio {average}</span>
      </div>

      <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
        {grades.map((item, index) => (
          <div key={item.student} className="grid gap-3 border-b border-outline-variant/30 p-4 last:border-0 md:grid-cols-[1fr_1fr_120px] md:items-center">
            <div>
              <p className="font-semibold">{item.student}</p>
              <p className="text-body-sm text-on-surface-variant">{item.course}</p>
            </div>
            <span className="text-body-sm text-on-surface-variant">Nota final</span>
            <input
              aria-label={`Nota de ${item.student}`}
              className="h-10 rounded-xl bg-surface-container px-3 outline-none ring-primary focus:ring-2"
              min="0"
              max="100"
              type="number"
              value={item.grade}
              onChange={(event) => {
                const grade = Number(event.target.value);
                setGrades((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, grade } : row));
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export function TeacherAttendanceView() {
  const [attendance, setAttendance] = useState(initialAttendance);

  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div>
        <h1 className="text-headline-md font-semibold">Asistencia</h1>
        <p className="text-body-sm text-on-surface-variant">Matemáticas 4A · Registro de hoy.</p>
      </div>

      <div className="rounded-2xl bg-surface-container-lowest shadow-sm">
        {attendance.map((item, index) => (
          <div key={item.student} className="flex flex-col gap-3 border-b border-outline-variant/30 p-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{item.student}</p>
              <p className="text-body-sm text-on-surface-variant">Estado actual: {item.status}</p>
            </div>
            <div className="flex gap-2">
              {["Presente", "Ausente"].map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={item.status === status ? "default" : "secondary"}
                  onClick={() => setAttendance((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, status } : row))}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TeacherResourcesView() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState(resources);
  const [notice, setNotice] = useState("");
  const filtered = items.filter((resource) => resource.title.toLowerCase().includes(query.toLowerCase()));

  const addDemoResource = () => {
    const nextId = Math.max(...items.map((item) => item.id)) + 1;
    setItems((current) => [
      { id: nextId, title: `Nuevo material ${nextId}`, type: "PDF", date: "Hoy" },
      ...current,
    ]);
    setNotice("Recurso agregado localmente");
    window.setTimeout(() => setNotice(""), 2200);
  };

  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-headline-md font-semibold">Recursos</h1>
          <p className="text-body-sm text-on-surface-variant">Materiales simulados almacenados en el Front End.</p>
        </div>
        <Button className="rounded-xl" onClick={addDemoResource}>
          <Icon name="upload_file" className="text-[20px]" />
          Agregar recurso demo
        </Button>
      </div>

      {notice && (
        <div className="rounded-xl bg-tertiary-fixed px-4 py-3 text-sm font-semibold text-on-tertiary-fixed">
          {notice}
        </div>
      )}

      <div className="flex h-11 items-center gap-2 rounded-xl bg-surface-container-low px-3">
        <Icon name="search" className="text-[20px]" />
        <input
          className="min-w-0 flex-1 bg-transparent outline-none"
          placeholder="Buscar recurso"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((resource) => (
          <article key={resource.id} className="flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed text-on-primary-fixed">
              <Icon name="description" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-semibold">{resource.title}</h2>
              <p className="text-body-sm text-on-surface-variant">{resource.type} · {resource.date}</p>
            </div>
            <Button variant="ghost" size="icon" aria-label="Ver recurso"><Icon name="visibility" /></Button>
          </article>
        ))}
      </div>
    </section>
  );
}

function TeacherMetric({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
      <Icon name={icon} className="text-[28px] text-primary" />
      <p className="mt-3 text-body-sm text-on-surface-variant">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
