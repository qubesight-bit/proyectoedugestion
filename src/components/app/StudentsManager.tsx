import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { fieldErrors, studentSchema } from "@/lib/validation";
import { CrudDialog, FormField } from "./CrudDialog";
import { StudentGradesDialog } from "./StudentGradesDialog";

type Student = Database["public"]["Tables"]["students"]["Row"];
const GRADES = ["Maternal", "Interactivo I", "Interactivo II", "Transición", "1° Primaria", "2° Primaria", "3° Primaria", "4° Primaria", "5° Primaria", "6° Primaria"];
const STATUSES = ["Activo", "Doc. Pendiente", "En Observación", "Retirado Temporal"];

export function StudentsManager({ isAdmin, openNew = 0 }: { isAdmin: boolean; openNew?: number }) {
  const qc = useQueryClient();
  const { data = [], isLoading, error } = useQuery({ queryKey: ["students"], queryFn: async () => {
    const { data, error } = await supabase.from("students").select("*").order("created_at");
    if (error) throw error;
    return data;
  } });
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Student | "new" | null>(openNew > 0 && isAdmin ? "new" : null);
  const [grading, setGrading] = useState<Student | null>(null);
  const courses = useQuery({ queryKey: ["courses"], queryFn: async () => {
    const { data, error } = await supabase.from("courses").select("*").order("title");
    if (error) throw error;
    return data;
  } });
  const links = useQuery({ queryKey: ["course_students", "all"], queryFn: async () => {
    const { data, error } = await supabase.from("course_students").select("course_id, student_id");
    if (error) throw error;
    return data;
  } });
  const teachers = useQuery({ queryKey: ["teacher_profiles"], queryFn: async () => {
    const { data, error } = await supabase.from("teacher_profiles").select("*").order("full_name");
    if (error) throw error;
    return data;
  } });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id).select("id").single();
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Estudiante eliminado");
      qc.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const term = q.trim().toLowerCase();
  const shown = data.filter((s) => !term || String(s.name ?? "").toLowerCase().includes(term) || String(s.code ?? "").toLowerCase().includes(term));

  return (
    <section className="flex flex-col gap-4 py-4 animate-edu-rise" aria-labelledby="students-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 id="students-title" className="text-headline-md font-semibold">Directorio de Estudiantes</h1>
          <p className="text-body-sm text-on-surface-variant">{data.length} registrados</p>
        </div>
        {isAdmin && (
          <Button className="rounded-xl" onClick={() => setEditing("new")}>
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">person_add</span>
            Nuevo estudiante
          </Button>
        )}
      </div>
      <label htmlFor="student-search" className="sr-only">Buscar estudiante</label>
      <input
        id="student-search"
        type="search"
        placeholder="Buscar por nombre o código"
        className="form-input h-11"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {isLoading && <p role="status">Cargando estudiantes…</p>}
      {error && <p role="alert" className="text-destructive">{(error as Error).message}</p>}
      {!isLoading && shown.length === 0 && <p className="text-on-surface-variant">Sin resultados.</p>}
      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((s) => {
          const studentCourses = (courses.data ?? []).filter((course) => links.data?.some((link) => link.student_id === s.id && link.course_id === course.id));
          const courseTeachers = [...new Set(studentCourses.map((course) => teachers.data?.find((teacher) => teacher.id === course.teacher_id)?.full_name ?? course.teacher).filter(Boolean))];
          return (
          <li key={s.id} className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex gap-3">
              {s.image ? (
                <img src={s.image} alt={`Foto de ${s.name}`} className="h-14 w-14 rounded-2xl object-cover" />
              ) : (
                <div aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-headline-sm font-bold text-on-primary-fixed">
                  {String(s.name ?? "?").charAt(0)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{s.name}</h2>
                <p className="text-body-sm text-on-surface-variant">{s.code} • {s.grade}</p>
                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-label-sm font-semibold ${s.status === "Activo" ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-secondary-container text-on-secondary-container"}`}>
                  {s.status}
                </span>
              </div>
              {s.score != null && (
                <p className="text-right"><span className="block text-headline-sm font-bold">{Number(s.score).toFixed(1)}</span><span className="text-label-sm text-on-surface-variant">Promedio</span></p>
              )}
            </div>
            {s.alert && <p className="rounded-lg bg-destructive/10 p-2 text-body-sm text-destructive">{s.alert}</p>}
            <p className="text-sm"><strong>Cursos:</strong> {studentCourses.map((course) => course.title).join(", ") || "Sin asignar"}</p>
            <p className="text-sm"><strong>Docente(s):</strong> {courseTeachers.join(", ") || "Sin asignar"}</p>
            <div className="mt-auto flex flex-wrap gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setGrading(s)}>Notas por curso</Button>
            {isAdmin && (
              <div className="mt-auto flex gap-2">
                <Button variant="secondary" className="flex-1 rounded-xl" aria-label={`Editar ${s.name}`} onClick={() => setEditing(s)}>Editar</Button>
                <Button
                  variant="destructive"
                  className="rounded-xl"
                  aria-label={`Eliminar ${s.name}`}
                  disabled={remove.isPending}
                  onClick={() => confirm(`¿Eliminar a ${s.name}?`) && remove.mutate(s.id)}
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[20px]">delete</span>
                </Button>
              </div>
            )}
            </div>
          </li>
        )})}
      </ul>
      {editing && (
        <StudentForm
          student={editing === "new" ? null : editing}
          courses={courses.data ?? []}
          onClose={() => setEditing(null)}
          onSave={async (v, courseId) => {
            const { data: auth } = await supabase.auth.getUser();
            const { data: saved, error } = editing === "new"
              ? await supabase.from("students").insert({ ...(v as Database["public"]["Tables"]["students"]["Insert"]), created_by: auth.user?.id ?? null }).select("id").single()
              : await supabase.from("students").update(v as Database["public"]["Tables"]["students"]["Update"]).eq("id", editing.id).select("id").single();
            if (error) throw error;
            if (courseId && saved) {
              const { error: linkError } = await supabase.from("course_students").upsert({ course_id: courseId, student_id: saved.id });
              if (linkError) throw linkError;
            }
            toast.success(editing === "new" ? "Estudiante registrado" : "Estudiante actualizado");
            await Promise.all([qc.invalidateQueries({ queryKey: ["students"] }), qc.invalidateQueries({ queryKey: ["course_students"] })]);
            setEditing(null);
          }}
        />
      )}
      {grading && <StudentGradesDialog student={grading} courses={(courses.data ?? []).filter((course) => links.data?.some((link) => link.student_id === grading.id && link.course_id === course.id))} onClose={() => setGrading(null)} />}
    </section>
  );
}

function StudentForm({ student, courses, onClose, onSave }: { student: Student | null; courses: Database["public"]["Tables"]["courses"]["Row"][]; onClose: () => void; onSave: (v: Record<string, unknown>, courseId: string) => Promise<void> }) {
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, unknown>;
    const values = { ...raw, score: raw["score"] === "" ? null : raw["score"] };
    const errs = fieldErrors(studentSchema, values);
    setErrors(errs);
    if (errs) return;
    setBusy(true);
    try {
      await onSave(studentSchema.parse(values), String(raw["course_id"] ?? ""));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const f = (name: string) => ({ id: `s-${name}`, name, "aria-invalid": !!errors?.[name], "aria-describedby": errors?.[name] ? `s-${name}-error` : undefined, className: "form-input" });

  return (
    <CrudDialog title={student ? "Editar estudiante" : "Nuevo estudiante"} onClose={onClose}>
      <form noValidate className="flex flex-col gap-3" onSubmit={submit}>
        <FormField id="s-name" label="Nombre completo *" error={errors?.["name"]}>
          <input {...f("name")} defaultValue={student?.name} />
        </FormField>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="s-grade" label="Grado *" error={errors?.["grade"]}>
            <select {...f("grade")} defaultValue={student?.grade ?? GRADES[0]}>
              {student?.grade && !GRADES.includes(student.grade) && <option>{student.grade}</option>}
              {GRADES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </FormField>
          <FormField id="s-status" label="Estado *" error={errors?.["status"]}>
            <select {...f("status")} defaultValue={student?.status ?? "Activo"}>
              {STATUSES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </FormField>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="s-tutor" label="Encargado" error={errors?.["tutor"]}>
            <input {...f("tutor")} defaultValue={student?.tutor} />
          </FormField>
          <FormField id="s-phone" label="Teléfono" error={errors?.["phone"]}>
            <input {...f("phone")} type="tel" defaultValue={student?.phone} />
          </FormField>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="s-email" label="Correo" error={errors?.["email"]}>
            <input {...f("email")} type="email" defaultValue={student?.email} />
          </FormField>
          <FormField id="s-score" label="Promedio (0-10)" error={errors?.["score"]}>
            <input {...f("score")} type="number" step="0.1" min={0} max={10} defaultValue={student?.score ?? ""} />
          </FormField>
        </div>
        <FormField id="s-alert" label="Observación / alerta" error={errors?.["alert"]}>
          <input {...f("alert")} defaultValue={student?.alert} />
        </FormField>
        <FormField id="s-course" label="Asignar a curso (define su docente encargado)">
          <select id="s-course" name="course_id" className="form-input" defaultValue="">
            <option value="">Sin nueva asignación</option>
            {courses.map((course) => <option key={course.id} value={course.id}>{course.title} · {course.level} · {course.teacher || "Sin docente"}</option>)}
          </select>
        </FormField>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={busy}>{busy ? "Guardando…" : "Guardar"}</Button>
        </div>
      </form>
    </CrudDialog>
  );
}
