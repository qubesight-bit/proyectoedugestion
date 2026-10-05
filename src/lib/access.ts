import { supabase } from "@/integrations/supabase/client";

/** Client-side navigation guard for any valid app role; Supabase RLS separately enforces database access. */
export async function requireStaffAccount() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const { data: roles, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id);
  if (roleError || !roles?.some(({ role }) => role === "admin" || role === "docente" || role === "estudiante")) return null;
  return data.user;
}
