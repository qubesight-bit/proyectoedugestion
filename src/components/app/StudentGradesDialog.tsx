import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { CrudDialog, FormField } from "./CrudDialog";
import { pageItems, PaginationControls } from "./PaginationControls";

type Student = Database["public"]["Tables"]["students"]["Row"];
type Course = Database["public"]["Tables"]["courses"]["Row"];

export function StudentGradesDialog({ student, courses, onClose }: { student: Student; courses: Course[]; onClose: () => void }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const grades = useQuery({
    queryKey: ["student_grades", student.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("student_grades").select("*").eq("student_id", student.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const rows = grades.data ?? [];
  const pageGrades = pageItems(rows, page);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const course_id = String(form.get("course_id") ?? "");
    const period = String(form.get("period") ?? "").trim();
    const grade = Number(form.get("grade"));
    const notes = String(form.get("notes") ?? "").trim();
    if (!course_id || !period || !Number.isFinite(grade) || grade < 0 || grade > 10) {
      toast.error("Seleccioná un curso, período y una nota entre 0 y 10.");
      return;
    }
    setBusy(true);
    const { data: auth } = await supabase.auth.getUser();
    const { error } = await supabase.from("student_grades").upsert(
      { student_id: student.id, course_id, period, grade, notes, recorded_by: auth.user?.id ?? null },
      { onConflict: "student_id,course_id,period" },
    );
    setBusy(false);
    if (error) return void toast.error(error.message);
    formElement.reset();
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["student_grades", student.id] }),
      qc.invalidateQueries({ queryKey: ["students"] }),
    ]);
    toast.success("Nota registrada");
  }

  async function remove(id: string) {
    if (!window.confirm("¿Eliminar esta nota?")) return;
    const { error } = await supabase.from("student_grades").delete().eq("id", id);
    if (error) return void toast.error(error.message);
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["student_grades", student.id] }),
      qc.invalidateQueries({ queryKey: ["students"] }),
    ]);
    toast.success("Nota eliminada");
  }

  return (
    <CrudDialog title={`Notas de ${student.name}`} onClose={onClose}>
      <form className="space-y-3" onSubmit={(event) => void save(event)}>
        <FormField id="grade-course" label="Materia / curso *">
          <select id="grade-course" name="course_id" className="form-input" required defaultValue="">
            <option value="" disabled>Seleccionar curso</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.title} · {course.level}</option>)}
          </select>
        </FormField>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="grade-period" label="Período *">
            <select id="grade-period" name="period" className="form-input" defaultValue="I período">
              <option>I período</option><option>II período</option><option>III período</option><option>Final</option>
            </select>
          </FormField>
          <FormField id="grade-value" label="Nota (0-10) *">
            <input id="grade-value" name="grade" className="form-input" type="number" min="0" max="10" step="0.1" required />
          </FormField>
        </div>
        <FormField id="grade-notes" label="Observación">
          <textarea id="grade-notes" name="notes" className="form-input" rows={2} maxLength={500} />
        </FormField>
        <Button type="submit" disabled={busy || courses.length === 0}>{busy ? "Guardando…" : "Registrar nota"}</Button>
      </form>
      <div className="mt-5 border-t pt-4">
        <h3 className="font-semibold">Historial</h3>
        {grades.isLoading && <p role="status">Cargando notas…</p>}
        {grades.error && <p role="alert" className="text-destructive">{grades.error.message}</p>}
        <ul className="mt-2 space-y-2">
          {pageGrades.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low p-3">
              <div><strong>{courses.find((course) => course.id === item.course_id)?.title ?? "Curso"}: {Number(item.grade).toFixed(1)}</strong><p className="text-xs text-on-surface-variant">{item.period}{item.notes ? ` · ${item.notes}` : ""}</p></div>
              <Button type="button" size="sm" variant="outline" onClick={() => void remove(item.id)}>Eliminar</Button>
            </li>
          ))}
        </ul>
        <PaginationControls page={page} total={rows.length} onPageChange={setPage} />
        {!grades.isLoading && grades.data?.length === 0 && <p className="text-sm text-on-surface-variant">Sin notas registradas.</p>}
      </div>
    </CrudDialog>
  );
}
