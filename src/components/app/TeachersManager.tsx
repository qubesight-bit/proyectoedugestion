import { useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { CrudDialog, FormField } from "./CrudDialog";

type Teacher = Database["public"]["Tables"]["teacher_profiles"]["Row"];
type Course = Database["public"]["Tables"]["courses"]["Row"];

export function TeachersManager({
  isAdmin,
  userId,
  courses,
}: {
  isAdmin: boolean;
  userId: string;
  courses: Course[];
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Teacher | "new" | null>(null);
  const [search, setSearch] = useState("");
  const teachers = useQuery({
    queryKey: ["teacher_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("teacher_profiles")
        .select("*")
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });
  const accounts = useQuery({
    queryKey: ["teacher_accounts"],
    enabled: isAdmin,
    queryFn: async () => {
      const [{ data: roles, error: roleError }, { data: profiles, error: profileError }] =
        await Promise.all([
          supabase.from("user_roles").select("user_id").eq("role", "docente"),
          supabase.from("profiles").select("id, email, full_name"),
        ]);
      if (roleError || profileError) throw roleError ?? profileError;
      return (profiles ?? []).filter((p) => roles?.some((r) => r.user_id === p.id));
    },
  });
  const legacy = (teachers.error as { code?: string } | null)?.code === "42P01";
  const visible = (teachers.data ?? []).filter((teacher) =>
    teacher.full_name.toLowerCase().includes(search.toLowerCase()),
  );
  const myProfile = (teachers.data ?? []).find((teacher) => teacher.user_id === userId);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const full_name = String(data["full_name"] ?? "").trim();
    if (full_name.length < 2) {
      toast.error("Indicá el nombre del docente.");
      return;
    }
    const values = {
      full_name,
      email: String(data["email"] ?? "").trim(),
      phone: String(data["phone"] ?? "").trim(),
      specialty: String(data["specialty"] ?? "").trim(),
      bio: String(data["bio"] ?? "").trim(),
      user_id: data["user_id"] ? String(data["user_id"]) : null,
    };
    const { error } =
      editing && editing !== "new"
        ? await supabase
            .from("teacher_profiles")
            .update(values)
            .eq("id", editing.id)
            .select("id")
            .single()
        : await supabase.from("teacher_profiles").insert(values).select("id").single();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Docente guardado");
    setEditing(null);
    await qc.invalidateQueries({ queryKey: ["teacher_profiles"] });
  }

  async function remove(teacher: Teacher) {
    if (
      !window.confirm(
        `¿Eliminar el perfil de ${teacher.full_name}? Los cursos conservarán su nombre.`,
      )
    )
      return;
    const { error } = await supabase
      .from("teacher_profiles")
      .delete()
      .eq("id", teacher.id)
      .select("id")
      .single();
    if (error) {
      toast.error(error.message);
      return;
    }
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["teacher_profiles"] }),
      qc.invalidateQueries({ queryKey: ["courses"] }),
    ]);
    toast.success("Perfil docente eliminado");
  }

  return (
    <section className="space-y-5" aria-labelledby="teachers-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-primary">
            Equipo académico
          </p>
          <h1 id="teachers-title" className="text-headline-md font-semibold">
            Docentes
          </h1>
          <p className="text-on-surface-variant">
            Perfiles, cursos asignados y acceso al panel docente.
          </p>
        </div>
        {isAdmin && !legacy && <Button onClick={() => setEditing("new")}>Añadir docente</Button>}
      </div>
      {!isAdmin && (
        <div className="rounded-2xl border border-primary/20 bg-primary-fixed p-5">
          <h2 className="font-semibold">Mi panel docente</h2>
          <p>
            {myProfile
              ? `${myProfile.full_name} · ${courses.filter((c) => c.teacher_id === myProfile.id).length} cursos asignados`
              : "Pedí a administración que vincule tu cuenta a un perfil docente."}
          </p>
        </div>
      )}
      <label className="block max-w-md">
        <span className="sr-only">Buscar docente</span>
        <input
          className="form-input"
          type="search"
          placeholder="Buscar docente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </label>
      {teachers.isLoading && <p role="status">Cargando docentes…</p>}
      {teachers.error && (
        <p role="alert" className="text-destructive">
          {teachers.error.message}
        </p>
      )}
      {legacy && (
        <div role="status" className="rounded-xl border p-4">
          <p>
            Los perfiles editables se habilitan al aplicar la migración en Supabase. Los docentes de
            los cursos existentes aparecen abajo.
          </p>
          <ul className="mt-3 list-disc pl-5">
            {[...new Set(courses.map((course) => course.teacher).filter(Boolean))].map((name) => (
              <li key={name}>
                {name}:{" "}
                {courses
                  .filter((course) => course.teacher === name)
                  .map((course) => course.title)
                  .join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ul className="grid gap-4 md:grid-cols-2">
        {visible.map((teacher) => {
          const assigned = courses.filter((course) => course.teacher_id === teacher.id);
          return (
            <li
              key={teacher.id}
              className="rounded-2xl border bg-surface-container-lowest p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-fixed text-xl font-bold text-on-primary-fixed"
                >
                  {teacher.full_name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">{teacher.full_name}</h2>
                  <p className="text-sm text-on-surface-variant">
                    {teacher.specialty || "Docente"}
                  </p>
                </div>
              </div>
              {teacher.bio && <p className="mt-3 text-sm">{teacher.bio}</p>}
              <p className="mt-3 text-sm">
                {assigned.length} curso{assigned.length === 1 ? "" : "s"}:{" "}
                {assigned.map((course) => course.title).join(", ") || "Sin asignaciones"}
              </p>
              {teacher.email && <p className="text-sm">{teacher.email}</p>}
              {isAdmin && (
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setEditing(teacher)}
                    aria-label={`Editar ${teacher.full_name}`}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => void remove(teacher)}
                    aria-label={`Eliminar ${teacher.full_name}`}
                  >
                    Eliminar
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {!teachers.isLoading && !legacy && visible.length === 0 && (
        <p>No hay docentes registrados.</p>
      )}
      {editing && (
        <CrudDialog
          title={editing === "new" ? "Nuevo docente" : "Editar docente"}
          onClose={() => setEditing(null)}
        >
          <form className="space-y-3" onSubmit={(e) => void save(e)}>
            <FormField id="t-name" label="Nombre completo *">
              <input
                id="t-name"
                name="full_name"
                required
                minLength={2}
                maxLength={120}
                className="form-input"
                defaultValue={editing === "new" ? "" : editing.full_name}
              />
            </FormField>
            <FormField id="t-specialty" label="Especialidad">
              <input
                id="t-specialty"
                name="specialty"
                maxLength={120}
                className="form-input"
                defaultValue={editing === "new" ? "" : editing.specialty}
              />
            </FormField>
            <FormField id="t-email" label="Correo">
              <input
                id="t-email"
                name="email"
                type="email"
                className="form-input"
                defaultValue={editing === "new" ? "" : editing.email}
              />
            </FormField>
            <FormField id="t-phone" label="Teléfono">
              <input
                id="t-phone"
                name="phone"
                type="tel"
                className="form-input"
                defaultValue={editing === "new" ? "" : editing.phone}
              />
            </FormField>
            <FormField id="t-bio" label="Descripción">
              <textarea
                id="t-bio"
                name="bio"
                rows={3}
                className="form-input"
                defaultValue={editing === "new" ? "" : editing.bio}
              />
            </FormField>
            <FormField id="t-user" label="Cuenta docente para acceder a sus cursos">
              <select
                id="t-user"
                name="user_id"
                className="form-input"
                defaultValue={editing === "new" ? "" : (editing.user_id ?? "")}
              >
                <option value="">Sin vincular</option>
                {accounts.data?.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.full_name || account.email || account.id}
                  </option>
                ))}
              </select>
            </FormField>
            <p className="text-xs text-on-surface-variant">
              La cuenta debe existir en Supabase Auth y tener el rol docente.
            </p>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </CrudDialog>
      )}
    </section>
  );
}
