import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";

type GradeRow = {
  id: string;
  student: string;
  course: string;
  evaluation: string;
  grade: number;
};

const initialRows: GradeRow[] = [
  { id: "g1", student: "Camilo Andrés Morales", course: "Matemáticas", evaluation: "I Parcial", grade: 88 },
  { id: "g2", student: "Camilo Andrés Morales", course: "Matemáticas", evaluation: "Proyecto", grade: 95 },
  { id: "g3", student: "Valentina Sofía Ríos", course: "Español", evaluation: "I Parcial", grade: 91 },
  { id: "g4", student: "Valentina Sofía Ríos", course: "Español", evaluation: "Proyecto", grade: 94 },
  { id: "g5", student: "Matías Herrera Vera", course: "Ciencias", evaluation: "I Parcial", grade: 79 },
  { id: "g6", student: "Sofía Rodríguez Chaves", course: "Matemáticas", evaluation: "II Parcial", grade: 96 },
  { id: "g7", student: "Daniel Vargas Solano", course: "Ciencias", evaluation: "Laboratorio", grade: 89 },
  { id: "g8", student: "Lucía Fernández Mora", course: "Español", evaluation: "Tarea", grade: 82 },
];

const students = [
  "Camilo Andrés Morales",
  "Valentina Sofía Ríos",
  "Matías Herrera Vera",
  "Sofía Rodríguez Chaves",
  "Daniel Vargas Solano",
  "Lucía Fernández Mora",
  "Samuel Jiménez Brenes",
  "Mariana López Quesada",
  "Gabriel Soto Araya",
  "Isabella Méndez Castro",
];

const courses = ["Matemáticas", "Español", "Ciencias", "Estudios Sociales", "Inglés"];
const evaluations = ["I Parcial", "II Parcial", "Proyecto", "Tarea", "Laboratorio", "Quiz"];

export function GradebookView({ title = "Calificaciones", subtitle = "Asigná notas específicas por estudiante." }: { title?: string; subtitle?: string }) {
  const [rows, setRows] = useState<GradeRow[]>(initialRows);
  const [studentFilter, setStudentFilter] = useState("Todos");
  const [courseFilter, setCourseFilter] = useState("Todos");
  const [notice, setNotice] = useState("");

  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          (studentFilter === "Todos" || row.student === studentFilter) &&
          (courseFilter === "Todos" || row.course === courseFilter),
      ),
    [rows, studentFilter, courseFilter],
  );

  const addRow = () => {
    const next: GradeRow = {
      id: `g${Date.now()}`,
      student: students[0],
      course: courses[0],
      evaluation: evaluations[0],
      grade: 0,
    };
    setRows((current) => [next, ...current]);
    setNotice("Nueva calificación agregada");
    window.setTimeout(() => setNotice(""), 1800);
  };

  const update = (id: string, patch: Partial<GradeRow>) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const remove = (id: string) => setRows((current) => current.filter((row) => row.id !== id));

  const average = filtered.length
    ? Math.round(filtered.reduce((sum, row) => sum + row.grade, 0) / filtered.length)
    : 0;

  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-headline-md font-semibold">{title}</h1>
          <p className="text-body-sm text-on-surface-variant">{subtitle}</p>
        </div>
        <Button className="rounded-xl" onClick={addRow}>
          <Icon name="add" className="text-[20px]" />
          Agregar nota
        </Button>
      </div>

      {notice && (
        <div className="rounded-xl bg-tertiary-fixed px-4 py-3 text-sm font-semibold text-on-tertiary-fixed">
          {notice}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <select className="form-input" value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)}>
          <option>Todos</option>
          {students.map((student) => <option key={student}>{student}</option>)}
        </select>
        <select className="form-input" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
          <option>Todos</option>
          {courses.map((course) => <option key={course}>{course}</option>)}
        </select>
        <div className="flex items-center justify-center rounded-xl bg-primary-fixed px-4 font-semibold text-on-primary-fixed">
          Promedio: {average}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest shadow-sm">
        <div className="min-w-[850px]">
          <div className="grid grid-cols-[1.5fr_1fr_1fr_110px_56px] gap-3 border-b border-outline-variant/30 px-4 py-3 text-label-sm font-semibold text-on-surface-variant">
            <span>Estudiante</span>
            <span>Materia</span>
            <span>Evaluación</span>
            <span>Nota</span>
            <span />
          </div>

          {filtered.map((row) => (
            <div key={row.id} className="grid grid-cols-[1.5fr_1fr_1fr_110px_56px] items-center gap-3 border-b border-outline-variant/20 px-4 py-3 last:border-0">
              <select className="form-input" value={row.student} onChange={(e) => update(row.id, { student: e.target.value })}>
                {students.map((student) => <option key={student}>{student}</option>)}
              </select>
              <select className="form-input" value={row.course} onChange={(e) => update(row.id, { course: e.target.value })}>
                {courses.map((course) => <option key={course}>{course}</option>)}
              </select>
              <select className="form-input" value={row.evaluation} onChange={(e) => update(row.id, { evaluation: e.target.value })}>
                {evaluations.map((evaluation) => <option key={evaluation}>{evaluation}</option>)}
              </select>
              <input
                className="form-input"
                type="number"
                min="0"
                max="100"
                value={row.grade}
                onChange={(e) => update(row.id, { grade: Math.max(0, Math.min(100, Number(e.target.value))) })}
              />
              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => remove(row.id)} aria-label="Eliminar nota">
                <Icon name="delete" className="text-[19px]" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
