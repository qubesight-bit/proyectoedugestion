import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoginForm } from "@/components/auth/LoginForm";
import { markSession } from "@/lib/session";

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
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/app", replace: true });
    });
  }, [navigate]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-surface px-5 py-8 text-on-surface">
      <section className="flex w-full max-w-md flex-col gap-6 animate-edu-rise" aria-labelledby="auth-title">
        <div className="flex flex-col items-center gap-3 text-center">
          <img src="/logo_cartago.png" alt="Logo del Centro Educativo Adventista de Cartago" className="h-20 w-auto" />
          <h1 id="auth-title" className="text-display-lg font-bold">
            Centro Educativo Adventista de Cartago
          </h1>
          <p className="text-body-md text-on-surface-variant">Plataforma de Gestión Académica e Institucional</p>
        </div>
        <LoginForm
          onSubmit={async ({ email, password, remember }) => {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) return "Correo o contraseña incorrectos.";
            markSession(remember);
            navigate({ to: "/app", replace: true });
            return null;
          }}
        />
        <Link to="/" className="text-center text-body-sm font-semibold text-primary underline-offset-4 hover:underline">
          ← Volver al sitio principal
        </Link>
      </section>
    </main>
  );
}
