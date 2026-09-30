import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { CrudDialog } from "./CrudDialog";
import { pageItems, PaginationControls } from "./PaginationControls";

type Student = Database["public"]["Tables"]["students"]["Row"];
type Course = Database["public"]["Tables"]["courses"]["Row"];

export function CourseRoster({ course, isAdmin }: { course: Course; isAdmin: boolean }) {
  const qc = useQueryClient();
  const [chosen, setChosen] = useState("");
  const [detail, setDetail] = useState<Student | null>(null);
  const [page, setPage] = useState(1);
  const links = useQuery({
    queryKey: ["course_students", course.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_students")
        .select("student_id")
        .eq("course_id", course.id);
      if (error) throw error;
      return data;
    },
  });
  const students = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
  const enrolled = (students.data ?? []).filter((s) =>
    links.data?.some((link) => link.student_id === s.id),
  );
  const available = (students.data ?? []).filter(
    (s) => !links.data?.some((link) => link.student_id === s.id),
  );
  const pageEnrolled = pageItems(enrolled, page);

  async function enroll() {
    if (!chosen) return;
    const { error } = await supabase
      .from("course_students")
      .insert({ course_id: course.id, student_id: chosen });
    if (error) {
      toast.error(error.message);
      return;
    }
    setChosen("");
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["course_students", course.id] }),
      qc.invalidateQueries({ queryKey: ["courses"] }),
    ]);
    toast.success("Estudiante vinculado al curso");
  }
  async function unenroll(student: Student) {
    if (!window.confirm(`¿Desvincular a ${student.name} de ${course.title}?`)) return;
    const { error } = await supabase
      .from("course_students")
      .delete()
      .eq("course_id", course.id)
      .eq("student_id", student.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["course_students", course.id] }),
      qc.invalidateQueries({ queryKey: ["courses"] }),
    ]);
    toast.success("Estudiante desvinculado");
  }

  return (
    <div className="space-y-3 rounded-xl border bg-surface-container-low p-4">
      <h3 className="font-semibold">
        Estudiantes de {course.title} ({enrolled.length})
      </h3>
      {links.isLoading || students.isLoading ? <p role="status">Cargando estudiantes…</p> : null}
      {links.error || students.error ? (
        <p role="alert" className="text-destructive">
          {(links.error ?? students.error)?.message}
        </p>
      ) : null}
      {isAdmin && (
        <div className="flex flex-wrap gap-2">
          <label className="sr-only" htmlFor={`enroll-${course.id}`}>
            Seleccionar estudiante
          </label>
          <select
            id={`enroll-${course.id}`}
            className="form-input min-w-48 flex-1"
            value={chosen}
            onChange={(event) => setChosen(event.target.value)}
          >
            <option value="">Seleccionar estudiante</option>
            {available.map((student) => (
              <option value={student.id} key={student.id}>
                {student.name} · {student.grade}
              </option>
            ))}
          </select>
          <Button onClick={() => void enroll()} disabled={!chosen}>
            Vincular
          </Button>
        </div>
      )}
      <ul className="space-y-2">
        {pageEnrolled.map((student) => (
          <li
            key={student.id}
            className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-lowest p-3"
          >
            <div>
              <strong>{student.name}</strong>
              <p className="text-xs text-on-surface-variant">
                {student.code} · {student.grade} · {student.status}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setDetail(student)}
                aria-label={`Ver expediente de ${student.name}`}
              >
                Ver ficha
              </Button>
              {isAdmin && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void unenroll(student)}
                  aria-label={`Desvincular a ${student.name}`}
                >
                  Quitar
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <PaginationControls page={page} total={enrolled.length} onPageChange={setPage} />
      {!links.isLoading && enrolled.length === 0 && (
        <p className="text-sm text-on-surface-variant">Todavía no hay estudiantes vinculados.</p>
      )}
      {detail && (
        <CrudDialog title={`Ficha de ${detail.name}`} onClose={() => setDetail(null)}>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <dt className="font-semibold">Código</dt>
            <dd>{detail.code}</dd>
            <dt className="font-semibold">Grado</dt>
            <dd>{detail.grade}</dd>
            <dt className="font-semibold">Estado</dt>
            <dd>{detail.status}</dd>
            <dt className="font-semibold">Promedio</dt>
            <dd>{detail.score == null ? "Sin dato" : detail.score}</dd>
            <dt className="font-semibold">Encargado</dt>
            <dd>{detail.tutor || "Sin dato"}</dd>
            <dt className="font-semibold">Teléfono</dt>
            <dd>{detail.phone || "Sin dato"}</dd>
            <dt className="font-semibold">Correo</dt>
            <dd className="break-all">{detail.email || "Sin dato"}</dd>
            <dt className="font-semibold">Observaciones</dt>
            <dd>{detail.alert || "Sin observaciones"}</dd>
          </dl>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setDetail(null)}>Cerrar ficha</Button>
          </div>
        </CrudDialog>
      )}
    </div>
  );
}
