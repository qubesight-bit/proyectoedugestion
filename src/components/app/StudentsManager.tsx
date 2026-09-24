import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteStudent, listStudents, saveStudent } from "@/lib/data.functions";
import { fieldErrors, studentSchema } from "@/lib/validation";
import { CrudDialog, FormField } from "./CrudDialog";

type Student = Awaited<ReturnType<typeof listStudents>>[number];
const GRADES = ["1° Primaria 'A'", "2° Primaria 'A'", "3° Primaria 'B'", "4° Primaria 'A'", "1° Secundaria 'A'", "1° Secundaria 'C'", "2° Secundaria 'B'"];
const STATUSES = ["Activo", "Doc. Pendiente", "En Observación", "Retirado Temporal"];

export function StudentsManager({ isAdmin }: { isAdmin: boolean }) {
  const qc = useQueryClient();
  const list = useServerFn(listStudents);
  const save = useServerFn(saveStudent);
  const del = useServerFn(deleteStudent);
  const { data = [], isLoading, error } = useQuery({ queryKey: ["students"], queryFn: () => list() });
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Student | "new" | null>(null);

  const remove = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Estudiante eliminado");
      qc.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const term = q.trim().toLowerCase();
  const shown = data.filter((s) => !term || s.name.toLowerCase().includes(term) || s.code.toLowerCase().includes(term));

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
        {shown.map((s) => (
          <li key={s.id} className="flex flex-col gap-3 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex gap-3">
              {s.image ? (
                <img src={s.image} alt={`Foto de ${s.name}`} className="h-14 w-14 rounded-2xl object-cover" />
              ) : (
                <div aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-headline-sm font-bold text-on-primary-fixed">
                  {s.name.charAt(0)}
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
          </li>
        ))}
      </ul>
      {editing && (
        <StudentForm
          student={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={async (v) => {
            await save({ data: v });
            toast.success(editing === "new" ? "Estudiante registrado" : "Estudiante actualizado");
            qc.invalidateQueries({ queryKey: ["students"] });
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}

function StudentForm({ student, onClose, onSave }: { student: Student | null; onClose: () => void; onSave: (v: Record<string, unknown>) => Promise<void> }) {
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, unknown>;
    const values = { ...raw, score: raw.score === "" ? null : raw.score };
    const errs = fieldErrors(studentSchema, values);
    setErrors(errs);
    if (errs) return;
    setBusy(true);
    try {
      await onSave({ ...studentSchema.parse(values), ...(student ? { id: student.id } : {}) });
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
        <FormField id="s-name" label="Nombre completo *" error={errors?.name}>
          <input {...f("name")} defaultValue={student?.name} />
        </FormField>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="s-grade" label="Grado *" error={errors?.grade}>
            <select {...f("grade")} defaultValue={student?.grade ?? GRADES[0]}>
              {GRADES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </FormField>
          <FormField id="s-status" label="Estado *" error={errors?.status}>
            <select {...f("status")} defaultValue={student?.status ?? "Activo"}>
              {STATUSES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </FormField>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="s-tutor" label="Encargado" error={errors?.tutor}>
            <input {...f("tutor")} defaultValue={student?.tutor} />
          </FormField>
          <FormField id="s-phone" label="Teléfono" error={errors?.phone}>
            <input {...f("phone")} type="tel" defaultValue={student?.phone} />
          </FormField>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField id="s-email" label="Correo" error={errors?.email}>
            <input {...f("email")} type="email" defaultValue={student?.email} />
          </FormField>
          <FormField id="s-score" label="Promedio (0-10)" error={errors?.score}>
            <input {...f("score")} type="number" step="0.1" min={0} max={10} defaultValue={student?.score ?? ""} />
          </FormField>
        </div>
        <FormField id="s-alert" label="Observación / alerta" error={errors?.alert}>
          <input {...f("alert")} defaultValue={student?.alert} />
        </FormField>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={busy}>{busy ? "Guardando…" : "Guardar"}</Button>
        </div>
      </form>
    </CrudDialog>
  );
}
