import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { canManage, roleLabel } from "@/lib/validation";

export function useAccount() {
  const q = useQuery({ queryKey: ["account"], queryFn: async () => {
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) throw authError ?? new Error("Sesión vencida");
    const [{ data: roles, error: rolesError }, { data: profile, error: profileError }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", auth.user.id),
      supabase.from("profiles").select("email, full_name").eq("id", auth.user.id).maybeSingle(),
    ]);
    if (rolesError || profileError) throw rolesError ?? profileError;
    return { userId: auth.user.id, email: profile?.email ?? auth.user.email ?? "", fullName: profile?.full_name ?? "", roles: (roles ?? []).map((row) => row.role) };
  } });
  const roles = q.data?.roles ?? [];
  return { ...q, roles, label: roleLabel(roles), isAdmin: canManage(roles) };
}
