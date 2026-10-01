import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthScreen } from "@/pages/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión | CEAC Cartago" },
      { name: "description", content: "Acceso seguro a la plataforma académica del Centro Educativo Adventista de Cartago." },
      { property: "og:title", content: "Iniciar sesión | CEAC Cartago" },
      { property: "og:description", content: "Acceso seguro a la plataforma académica del CEAC." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("recovery") === "1") return;
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error_description") ?? new URLSearchParams(window.location.hash.slice(1)).get("error_description");
    if (oauthError) {
      toast.error(decodeURIComponent(oauthError.replace(/\+/g, " ")));
      window.history.replaceState({}, "", "/auth");
      return;
    }
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      if (roles?.some(({ role }) => role === "admin" || role === "docente")) {
        navigate({ to: "/app", replace: true });
      } else if (params.get("oauth") === "1") {
        await supabase.auth.signOut();
        toast.error("La cuenta de Google inició sesión, pero no tiene un rol de administrador o docente asignado.");
        window.history.replaceState({}, "", "/auth");
      }
    });
  }, [navigate]);

  return <AuthScreen onLogin={() => navigate({ to: "/app", replace: true })} />;
}
