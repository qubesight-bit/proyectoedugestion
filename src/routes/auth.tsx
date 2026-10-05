import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
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
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      if (roles?.some(({ role }) => role === "admin" || role === "docente" || role === "estudiante")) {
        navigate({ to: "/app", replace: true });
      }
    });
  }, [navigate]);

  return <AuthScreen onLogin={() => navigate({ to: "/app", replace: true })} />;
}
