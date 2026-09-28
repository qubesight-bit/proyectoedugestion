import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    // Permitir acceso si es una cuenta de demostración
    const isDemo = typeof window !== 'undefined' && localStorage.getItem('demo_role');
    if (isDemo) return { user: { id: 'demo-user', email: 'demo@ceac.ed.cr' } };

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });
    return { user: data.user };
  },
  component: () => <Outlet />,
});
