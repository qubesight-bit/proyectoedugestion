import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Role = "admin" | "docente" | "estudiante";
const ROLES: Role[] = ["admin", "docente", "estudiante"];

export const adminUsers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => (d ?? {}) as Record<string, unknown>)
  .handler(async ({ data: body, context }) => {
    const { data: adminRole } = await context.supabase
      .from("user_roles").select("id").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
    if (!adminRole) throw new Error("Se requiere rol administrador");
    const { supabaseAdmin: db } = await import("@/integrations/supabase/client.server");

    const action = String(body["action"] ?? "list");
    if (action === "list") {
      const [{ data: usersData, error: ue }, { data: roles, error: re }] = await Promise.all([
        db.auth.admin.listUsers({ page: 1, perPage: 200 }),
        db.from("user_roles").select("user_id,role"),
      ]);
      if (ue || re) throw new Error((ue ?? re)!.message);
      return {
        users: usersData.users.map((u) => ({
          id: u.id, email: u.email ?? "", fullName: String(u.user_metadata?.["full_name"] ?? ""),
          createdAt: u.created_at, lastSignInAt: u.last_sign_in_at ?? null,
          role: (roles?.find((r) => r.user_id === u.id)?.role ?? "estudiante") as Role,
        })),
      };
    }

    const role = String(body["role"] ?? "") as Role;
    if (!ROLES.includes(role)) throw new Error("Rol inválido");

    if (action === "create") {
      const email = String(body["email"] ?? "").trim().toLowerCase();
      const password = String(body["password"] ?? "");
      const fullName = String(body["fullName"] ?? "").trim();
      if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || fullName.length < 2)
        throw new Error("Nombre, correo o contraseña inválidos");
      const { data: created, error } = await db.auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { full_name: fullName },
      });
      if (error || !created.user) throw new Error(error?.message ?? "No se pudo crear el usuario");
      const id = created.user.id;
      const p = await db.from("profiles").upsert({ id, email, full_name: fullName });
      await db.from("user_roles").delete().eq("user_id", id);
      const r = await db.from("user_roles").insert({ user_id: id, role });
      if (p.error || r.error) {
        await db.auth.admin.deleteUser(id);
        throw new Error((p.error ?? r.error)!.message);
      }
      return { created: true, id };
    }

    const userId = String(body["userId"] ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(userId)) throw new Error("Usuario inválido");
    if (action === "updateRole") {
      if (userId === context.userId && role !== "admin") throw new Error("No puede retirar su propio rol administrador");
      const d = await db.from("user_roles").delete().eq("user_id", userId);
      if (d.error) throw new Error(d.error.message);
      const i = await db.from("user_roles").insert({ user_id: userId, role });
      if (i.error) throw new Error(i.error.message);
      return { updated: true };
    }
    if (action === "delete") {
      if (userId === context.userId) throw new Error("No puede eliminar su propia cuenta");
      const { error } = await db.auth.admin.deleteUser(userId);
      if (error) throw new Error(error.message);
      return { deleted: true };
    }
    throw new Error("Acción inválida");
  });
