import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyAccount } from "@/lib/data.functions";
import { canManage, roleLabel } from "@/lib/validation";

export function useAccount() {
  const fn = useServerFn(getMyAccount);
  const q = useQuery({ queryKey: ["account"], queryFn: () => fn() });
  const roles = q.data?.roles ?? [];
  return { ...q, roles, label: roleLabel(roles), isAdmin: canManage(roles) };
}
