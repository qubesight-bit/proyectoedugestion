import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { CrudDialog, FormField } from "./CrudDialog";

type Role = "admin" | "docente" | "estudiante" | "padre";
type Account = { id: string; email: string; fullName: string; role: Role; createdAt: string; lastSignInAt: string | null };

async function invoke(body: Record<string, unknown>): Promise<any> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("Sesión inválida. Cerrá sesión e ingresá nuevamente.");

  const { data, error } = await supabase.functions.invoke("admin-users", {
    body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
}

export function AdminUsersManager() {
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [linkParentId, setLinkParentId] = useState("");
  const [linkStudentId, setLinkStudentId] = useState("");
  const users = useQuery({ queryKey: ["admin-users"], queryFn: async () => (await invoke({ action: "list" })).users as Account[] });
  const students = useQuery({
    queryKey: ["students", "parent-linking"],
    queryFn: async () => {
      const { data, error } = await supabase.from("students").select("id,name,code,grade").is("archived_at", null).order("name");
      if (error) throw error;
      return data;
    },
  });
  const guardianLinks = useQuery({
    queryKey: ["guardian_students", "admin"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).from("guardian_students").select("guardian_user_id,student_id,relationship,created_at").order("created_at");
      if (error) throw error;
      return data as Array<{ guardian_user_id: string; student_id: string; relationship: string; created_at: string }>;
    },
  });
  const linkMutation = useMutation({
    mutationFn: async ({ guardianUserId, studentId }: { guardianUserId: string; studentId: string }) => {
      const { error } = await (supabase as any).from("guardian_students").upsert({
        guardian_user_id: guardianUserId,
        student_id: studentId,
        relationship: "Encargado",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Estudiante vinculado al encargado");
      setLinkStudentId("");
      void qc.invalidateQueries({ queryKey: ["guardian_students", "admin"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const unlinkMutation = useMutation({
    mutationFn: async ({ guardianUserId, studentId }: { guardianUserId: string; studentId: string }) => {
      const { error } = await (supabase as any).from("guardian_students").delete().eq("guardian_user_id", guardianUserId).eq("student_id", studentId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Vínculo eliminado");
      void qc.invalidateQueries({ queryKey: ["guardian_students", "admin"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-users"] });
  const roleMutation = useMutation({ mutationFn: ({ userId, role }: { userId: string; role: Role }) => invoke({ action: "updateRole", userId, role }), onSuccess: () => { toast.success("Rol actualizado"); void refresh(); }, onError: (error: Error) => toast.error(error.message) });
  const deleteMutation = useMutation({ mutationFn: (userId: string) => invoke({ action: "delete", userId, role: "estudiante" }), onSuccess: () => { toast.success("Cuenta eliminada"); void refresh(); }, onError: (error: Error) => toast.error(error.message) });

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      await invoke({ action: "create", fullName: form.get("fullName"), email: form.get("email"), password: form.get("password"), role: form.get("role"), studentId: form.get("studentId"), relationship: form.get("relationship") });
      toast.success("Usuario creado y confirmado"); setCreating(false); await refresh();
    } catch (error) { toast.error((error as Error).message); }
  }

  return <section className="space-y-5" aria-labelledby="users-title">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-widest text-primary">Seguridad y acceso</p><h1 id="users-title" className="text-headline-md font-semibold">Usuarios y roles</h1><p className="text-on-surface-variant">Registro interno de administradores, docentes, estudiantes y padres/encargados.</p></div><Button onClick={() => setCreating(true)}>Crear usuario</Button></div>
    {users.isLoading && <p role="status">Cargando usuarios…</p>}{users.error && <p role="alert" className="text-destructive">{users.error.message}. Verifique que la función admin-users esté desplegada.</p>}
    <div className="overflow-x-auto rounded-2xl border bg-surface-container-lowest"><table className="w-full min-w-[720px] text-left"><thead className="border-b"><tr><th className="p-3">Nombre</th><th className="p-3">Correo</th><th className="p-3">Rol</th><th className="p-3">Creación</th><th className="p-3">Acciones</th></tr></thead><tbody>{users.data?.map((user) => <tr key={user.id} className="border-b last:border-0"><td className="p-3 font-semibold">{user.fullName || "Sin nombre"}</td><td className="p-3">{user.email}</td><td className="p-3"><label className="sr-only" htmlFor={`role-${user.id}`}>Rol de {user.email}</label><select id={`role-${user.id}`} className="form-input min-w-36" value={user.role} disabled={roleMutation.isPending} onChange={(event) => roleMutation.mutate({ userId: user.id, role: event.target.value as Role })}><option value="admin">Administrador</option><option value="docente">Docente</option><option value="estudiante">Estudiante</option><option value="padre">Padre / Encargado</option></select></td><td className="p-3">{new Date(user.createdAt).toLocaleDateString("es-CR")}</td><td className="p-3"><Button variant="destructive" size="sm" disabled={deleteMutation.isPending} onClick={() => confirm(`¿Eliminar definitivamente la cuenta ${user.email}?`) && deleteMutation.mutate(user.id)}>Eliminar</Button></td></tr>)}</tbody></table></div>
    <section className="rounded-2xl border bg-surface-container-lowest p-5">
      <div className="mb-4">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Familias</p>
        <h2 className="text-lg font-semibold">Vínculos padre / estudiante</h2>
        <p className="text-sm text-on-surface-variant">Un encargado puede tener uno o varios estudiantes asociados.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <select className="form-input" value={linkParentId} onChange={(event) => setLinkParentId(event.target.value)}>
          <option value="">Seleccionar padre / encargado</option>
          {(users.data ?? []).filter((user) => user.role === "padre").map((user) => <option key={user.id} value={user.id}>{user.fullName || user.email}</option>)}
        </select>
        <select className="form-input" value={linkStudentId} onChange={(event) => setLinkStudentId(event.target.value)}>
          <option value="">Seleccionar estudiante</option>
          {(students.data ?? []).map((student) => <option key={student.id} value={student.id}>{student.name} · {student.code}</option>)}
        </select>
        <Button type="button" disabled={!linkParentId || !linkStudentId || linkMutation.isPending} onClick={() => linkMutation.mutate({ guardianUserId: linkParentId, studentId: linkStudentId })}>Vincular</Button>
      </div>
      <div className="mt-4 space-y-2">
        {(guardianLinks.data ?? []).map((link) => {
          const parent = users.data?.find((user) => user.id === link.guardian_user_id);
          const student = students.data?.find((item) => item.id === link.student_id);
          return <div key={`${link.guardian_user_id}-${link.student_id}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-container-low p-3">
            <div><strong>{parent?.fullName || parent?.email || "Encargado"}</strong><p className="text-sm text-on-surface-variant">{student?.name || "Estudiante"} · {link.relationship}</p></div>
            <Button variant="outline" size="sm" disabled={unlinkMutation.isPending} onClick={() => unlinkMutation.mutate({ guardianUserId: link.guardian_user_id, studentId: link.student_id })}>Quitar vínculo</Button>
          </div>;
        })}
        {!guardianLinks.isLoading && !(guardianLinks.data ?? []).length && <p className="text-sm text-on-surface-variant">Todavía no hay vínculos familiares registrados.</p>}
      </div>
    </section>
    {creating && <CrudDialog title="Crear usuario" onClose={() => setCreating(false)}><form className="flex flex-col gap-3" onSubmit={create}><FormField id="user-name" label="Nombre completo *"><input id="user-name" name="fullName" minLength={2} required className="form-input" /></FormField><FormField id="user-email" label="Correo *"><input id="user-email" name="email" type="email" required className="form-input" /></FormField><FormField id="user-password" label="Contraseña temporal *"><input id="user-password" name="password" type="password" minLength={8} required className="form-input" autoComplete="new-password" /></FormField><FormField id="user-role" label="Rol *"><select id="user-role" name="role" className="form-input"><option value="docente">Docente</option><option value="admin">Administrador</option><option value="estudiante">Estudiante</option><option value="padre">Padre / Encargado</option></select></FormField>
<FormField id="user-student" label="Vincular estudiante (solo para padres)">
  <select id="user-student" name="studentId" className="form-input" defaultValue="">
    <option value="">Sin vincular por ahora</option>
    {(students.data ?? []).map((student) => <option key={student.id} value={student.id}>{student.name} · {student.code} · {student.grade}</option>)}
  </select>
</FormField>
<FormField id="user-relationship" label="Relación familiar">
  <select id="user-relationship" name="relationship" className="form-input" defaultValue="Encargado">
    <option>Madre</option><option>Padre</option><option>Encargado</option><option>Tutor legal</option>
  </select>
</FormField>
<p className="text-sm text-on-surface-variant">La cuenta queda confirmada y puede iniciar sesión inmediatamente. Si el rol es Padre / Encargado, podés vincular un estudiante desde este mismo formulario.</p><div className="flex justify-end gap-2"><Button type="button" variant="secondary" onClick={() => setCreating(false)}>Cancelar</Button><Button type="submit">Crear cuenta</Button></div></form></CrudDialog>}
  </section>;
}
