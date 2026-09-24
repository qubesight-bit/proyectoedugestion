import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteCourse, listCourses, saveCourse } from "@/lib/data.functions";
import { COURSE_CATEGORIES, courseSchema, fieldErrors, occupancyPercent } from "@/lib/validation";
import { CrudDialog, FormField } from "./CrudDialog";

type Course = Awaited<ReturnType<typeof listCourses>>[number];
const LEVELS = ["1° de Secundaria", "2° de Secundaria", "3° de Secundaria", "4° de Secundaria", "5° de Secundaria"];
const CAT_LABEL: Record<string, string> = { ciencias: "Ciencias", humanidades: "Humanidades", artes: "Artes", idiomas: "Idiomas" };

export function CoursesManager({ isAdmin }: { isAdmin: boolean }) {
  const qc = useQueryClient();
  const list = useServerFn(listCourses);
  const save = useServerFn(saveCourse);
  const del = useServerFn(deleteCourse);
  const { data = [], isLoading, error } = useQuery({ queryKey: ["courses"], queryFn: () => list() });
  const [filter, setFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Course | "new" | null>(null);

  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Curso eliminado");
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const shown = data.filter((c) => filter === "all" || c.category === filter);

  return (
    <section className="flex flex-col gap-4 py-4 animate-edu-rise" aria-labelledby="courses-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-label-sm font-semibold uppercase text-primary">Gestión Académica</p>
          <h1 id="courses-title" className="text-headline-md font-semibold">Cursos</h1>
        </div>
        {isAdmin && (
          <Button className="rounded-xl" onClick={() => setEditing("new")}>
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">add</span>
            Crear curso
          </Button>
        )}
      </div>

      <div role="group" aria-label="Filtrar por área" className="flex gap-2 overflow-x-auto no-scrollbar">
        {["all", ...COURSE_CATEGORIES].map((c) => (
          <Button
            key={c}
            size="sm"
            variant={filter === c ? "default" : "secondary"}
            aria-pressed={filter === c}
            className="shrink-0 rounded-full"
            onClick={() => setFilter(c)}
          >
            {c === "all" ? "Todos" : CAT_LABEL[c]}
          </Button>
        ))}
      </div>

      {isLoading && <p role="status">Cargando cursos…</p>}
      {error && <p role="alert" className="text-destructive">{(error as Error).message}</p>}
      {!isLoading && shown.length === 0 && <p className="text-on-surface-variant">No hay cursos en esta categoría.</p>}

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {shown.map((c) => {
          const pct = occupancyPercent(c.enrolled, c.capacity);
          return (
            <li key={c.id} className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-secondary-container px-2 py-0.5 text-label-sm font-semibold text-on-secondary-container">{c.level}</span>
                <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-label-sm font-semibold text-on-primary-fixed">{CAT_LABEL[c.category] ?? c.category}</span>
              </div>
              <h2 className="text-headline-sm font-semibold">{c.title}</h2>
              <div className="flex items-center gap-3">
                {c.face && <img src={c.face} alt={`Foto de ${c.teacher}`} className="h-10 w-10 rounded-full object-cover" />}
                <div className="text-body-sm">
                  <p className="font-semibold">{c.teacher}</p>
                  <p className="text-on-surface-variant">{c.schedule}</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-body-sm">
                  <span>Ocupación</span>
                  <span>{c.enrolled} / {c.capacity} ({pct}%)</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-surface-container-high" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Ocupación de ${c.title}`}>
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
              {isAdmin && (
                <div className="mt-auto flex gap-2">
                  <Button variant="secondary" className="flex-1 rounded-xl" onClick={() => setEditing(c)} aria-label={`Editar ${c.title}`}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    className="rounded-xl"
                    aria-label={`Eliminar ${c.title}`}
                    disabled={remove.isPending}
                    onClick={() => confirm(`¿Eliminar el curso "${c.title}"?`) && remove.mutate(c.id)}
                  >
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">delete</span>
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {editing && (
        <CourseForm
          course={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (values) => {
            await save({ data: values });
            toast.success(editing === "new" ? "Curso creado" : "Curso actualizado");
            qc.invalidateQueries({ queryKey: ["courses"] });
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

function CourseForm({
  course,
  onClose,
  onSave,
}: {
  course: Course | null;
  onClose: () => void;
  onSave: (v: Record<string, unknown>) => Promise<void>;
}) {
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, unknown>;
    const errs = fieldErrors(courseSchema, values);
    setErrors(errs);
    if (errs) return;
    setBusy(true);
    try {
      await onSave({ ...courseSchema.parse(values), ...(course ? { id: course.id } : {}) });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const f = (name: string) => ({ id: `c-${name}`, name, "aria-invalid": !!errors?.[name], "aria-describedby": errors?.[name] ? `c-${name}-error` : undefined, className: "form-input" });

  return (
    <CrudDialog title={course ? "Editar curso" : "Nuevo curso"} onClose={onClose}>
      <form noValidate className="flex flex-col gap-3" onSubmit={submit}>
        <FormField id="c-title" label="Nombre de la asignatura *" error={errors?.title}>
          <input {...f("title")} defaultValue={course?.title} />
        </FormField>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="c-level" label="Nivel *" error={errors?.level}>
            <select {...f("level")} defaultValue={course?.level ?? LEVELS[0]}>
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </FormField>
          <FormField id="c-category" label="Área *" error={errors?.category}>
            <select {...f("category")} defaultValue={course?.category ?? "ciencias"}>
              {COURSE_CATEGORIES.map((c) => <option key={c} value={c}>{CAT_LABEL[c]}</option>)}
            </select>
          </FormField>
        </div>
        <FormField id="c-teacher" label="Docente titular *" error={errors?.teacher}>
          <input {...f("teacher")} defaultValue={course?.teacher} />
        </FormField>
        <FormField id="c-schedule" label="Días y horario" error={errors?.schedule}>
          <input {...f("schedule")} defaultValue={course?.schedule} />
        </FormField>
        <FormField id="c-room" label="Aula" error={errors?.room}>
          <input {...f("room")} defaultValue={course?.room} />
        </FormField>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="c-capacity" label="Cupo máximo *" error={errors?.capacity}>
            <input {...f("capacity")} type="number" min={1} defaultValue={course?.capacity ?? 30} />
          </FormField>
          <FormField id="c-enrolled" label="Matriculados" error={errors?.enrolled}>
            <input {...f("enrolled")} type="number" min={0} defaultValue={course?.enrolled ?? 0} />
          </FormField>
        </div>
        <input type="hidden" name="tag" value={course?.tag ?? ""} />
        <input type="hidden" name="note" value={course?.note ?? ""} />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={busy}>{busy ? "Guardando…" : "Guardar"}</Button>
        </div>
      </form>
    </CrudDialog>
  );
}
