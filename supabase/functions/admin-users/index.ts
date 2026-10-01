import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
type Role = "admin" | "docente" | "estudiante";

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const token = (request.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const db = createClient(url, serviceKey, { auth: { persistSession: false } });
    const { data: identity, error: identityError } = await db.auth.getUser(token);
    if (identityError || !identity.user) return json({ error: "Sesión inválida" }, 401);
    const { data: adminRole } = await db.from("user_roles").select("id").eq("user_id", identity.user.id).eq("role", "admin").maybeSingle();
    if (!adminRole) return json({ error: "Se requiere rol administrador" }, 403);

    const body = await request.json().catch(() => ({})) as Record<string, unknown>;
    const action = String(body.action ?? "list");
    if (action === "list") {
      const [{ data: usersData, error: usersError }, { data: roles, error: rolesError }] = await Promise.all([
        db.auth.admin.listUsers({ page: 1, perPage: 200 }),
        db.from("user_roles").select("user_id,role"),
      ]);
      if (usersError || rolesError) throw usersError ?? rolesError;
      return json({ users: usersData.users.map((user) => ({ id: user.id, email: user.email ?? "", fullName: String(user.user_metadata?.full_name ?? ""), createdAt: user.created_at, lastSignInAt: user.last_sign_in_at, role: roles?.find((item) => item.user_id === user.id)?.role ?? "estudiante" })) });
    }

    const role = String(body.role ?? "") as Role;
    if (!["admin", "docente", "estudiante"].includes(role)) return json({ error: "Rol inválido" }, 400);
    if (action === "create") {
      const email = String(body.email ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");
      const fullName = String(body.fullName ?? "").trim();
      if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || fullName.length < 2) return json({ error: "Nombre, correo o contraseña inválidos" }, 400);
      const { data: created, error } = await db.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: fullName } });
      if (error || !created.user) throw error ?? new Error("No se pudo crear el usuario");
      const [profileResult, roleResult] = await Promise.all([
        db.from("profiles").upsert({ id: created.user.id, email, full_name: fullName }),
        db.from("user_roles").insert({ user_id: created.user.id, role }),
      ]);
      if (profileResult.error || roleResult.error) {
        await db.auth.admin.deleteUser(created.user.id);
        throw profileResult.error ?? roleResult.error;
      }
      return json({ created: true, id: created.user.id });
    }
    const userId = String(body.userId ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(userId)) return json({ error: "Usuario inválido" }, 400);
    if (action === "updateRole") {
      if (userId === identity.user.id && role !== "admin") return json({ error: "No puede retirar su propio rol administrador" }, 400);
      const { error: deleteError } = await db.from("user_roles").delete().eq("user_id", userId);
      if (deleteError) throw deleteError;
      const { error } = await db.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
      return json({ updated: true });
    }
    if (action === "delete") {
      if (userId === identity.user.id) return json({ error: "No puede eliminar su propia cuenta" }, 400);
      const { error } = await db.auth.admin.deleteUser(userId);
      if (error) throw error;
      return json({ deleted: true });
    }
    return json({ error: "Acción inválida" }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Error inesperado" }, 500);
  }
});

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
