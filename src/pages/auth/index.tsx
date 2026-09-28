import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";
import { Role } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AuthScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    // Mock Login Demo
    if (email === "admin@ceac.ed.cr" && password === "admin123") {
      localStorage.setItem("demo_role", "Administrador");
      toast.success("¡Bienvenido al panel de Administración!");
      setTimeout(() => onLogin("Administrador"), 1000);
    } else if (email === "profesor@ceac.ed.cr" && password === "profe123") {
      localStorage.setItem("demo_role", "Docente");
      toast.success("¡Bienvenido al panel Docente!");
      setTimeout(() => onLogin("Docente"), 1000);
    } else {
      toast.error("Correo o contraseña incorrectos. Utiliza las cuentas de prueba.");
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-surface px-5 py-8 text-on-surface pt-safe pb-safe">
      <section className="flex w-full max-w-md md:max-w-lg tv:max-w-3xl flex-col gap-6 animate-edu-rise">
        <div className="flex justify-end">
          <span className="rounded-full bg-primary-fixed px-3 py-1 text-label-sm font-semibold text-on-primary-fixed">
            Ciclo Académico 2025 Activo
          </span>
        </div>

        <div className="flex flex-col gap-3 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-md p-2">
            <img src="/logo.png" alt="Logo Educación Adventista" className="w-full h-full object-contain" />
          </div>

          <div>
            <h1 className="text-display-lg font-bold">Centro Educativo Adventista de Cartago</h1>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Plataforma de Gestión Académica e Institucional
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-3 rounded-xl bg-primary-fixed p-3 text-on-primary-fixed mb-4">
            <Icon name="verified_user" className="text-[22px]" />
            <p className="text-body-sm">
              Acceso seguro a métricas globales, nómina y configuración institucional.
            </p>
          </div>

          <label className="flex flex-col gap-2 text-label-md font-semibold">
            Correo electrónico
            <div className="flex h-12 items-center gap-2 rounded-xl bg-surface-container-low px-3 text-on-surface-variant focus-within:ring-2 focus-within:ring-primary">
              <Icon name="mail" className="text-[20px]" />
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Correo institucional"
                className="min-w-0 flex-1 bg-transparent text-on-surface outline-none placeholder:text-muted-foreground"
                placeholder="admin@ceac.ed.cr o profesor@ceac.ed.cr"
                type="email"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2 text-label-md font-semibold">
            Contraseña
            <div className="flex h-12 items-center gap-2 rounded-xl bg-surface-container-low px-3 text-on-surface-variant focus-within:ring-2 focus-within:ring-primary">
              <Icon name="lock" className="text-[20px]" />
              <input
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Contraseña"
                className="min-w-0 flex-1 bg-transparent text-on-surface outline-none"
                type="password"
              />
              <Icon name="visibility" className="text-[20px]" />
            </div>
          </label>

          <div className="flex items-center justify-between text-body-sm mt-2">
            <label className="flex items-center gap-2 text-on-surface-variant">
              <input className="h-4 w-4 accent-primary" type="checkbox" />
              Recordar sesión
            </label>
            <a className="font-semibold text-primary" href="#recover">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button type="submit" disabled={loading} className="h-12 rounded-xl text-label-md mt-4">
            {loading ? "Verificando credenciales..." : "Ingresar a la Plataforma"}
            {!loading && <Icon name="arrow_forward" className="text-[20px]" />}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-300 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-container-lowest px-2 text-on-surface-variant">O continuar con</span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="h-12 rounded-xl w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700"
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({ 
                provider: 'google',
                options: {
                  redirectTo: window.location.origin + '/app'
                }
              });
              if (error) toast.error("Error conectando con Google: " + error.message);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            <span className="font-medium">Acceder con Google</span>
          </Button>
          <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="text-sm font-bold text-amber-800 mb-2">Cuentas de Demostración:</h4>
            <div className="text-xs text-amber-900 space-y-1">
              <p><strong>Administrador:</strong> admin@ceac.ed.cr / admin123</p>
              <p><strong>Profesor:</strong> profesor@ceac.ed.cr / profe123</p>
            </div>
          </div>
        </form>

        <div className="flex flex-col items-center gap-2 text-center text-body-sm text-on-surface-variant mt-4">
          <div className="flex items-center gap-2">
            <Icon name="lock_clock" className="text-[18px]" />
            Acceso seguro certificado TLS 1.3
          </div>
          <p>Soporte técnico institucional • Dirección de Tecnología Educativa</p>
        </div>
      </section>
    </main>
  );
}
