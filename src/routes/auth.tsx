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
    // Limpiar sesión demo si entra a esta página
    if (typeof window !== 'undefined') {
      localStorage.removeItem('demo_role');
    }

    // Si ya tiene sesión real, mandarlo a /app
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app", replace: true });
    });
  }, [navigate]);

  return <AuthScreen onLogin={() => navigate({ to: "/app", replace: true })} />;
}
