import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";
import { Role } from "../../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AuthScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleAndLogin = async (userId: string) => {
    // Intentar obtener el rol del usuario desde la tabla user_roles
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .single();
    
    const dbRole = data?.role;
    let appRole: Role = "Docente"; // default
    if (dbRole === "admin") appRole = "Administrador";
    
    onLogin(appRole);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (isRegistering) {
      if (password !== confirmPassword) {
        toast.error("Las contraseñas no coinciden.");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este correo ya está registrado.");
        } else {
          toast.error(error.message);
        }
      } else {
        if (data.session) {
          await handleRoleAndLogin(data.session.user.id);
        } else {
          toast.success("Registro exitoso. Por favor revisa tu correo para confirmar tu cuenta.");
          setIsRegistering(false);
        }
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login")) {
          toast.error("Correo o contraseña incorrectos.");
        } else {
          toast.error(error.message);
        }
      } else if (data.session) {
        await handleRoleAndLogin(data.session.user.id);
      }
    }

    setLoading(false);
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
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Icon name="school" className="text-[34px]" />
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
          <div className="flex gap-3 rounded-xl bg-primary-fixed p-3 text-on-primary-fixed">
            <Icon name={isRegistering ? "person_add" : "verified_user"} className="text-[22px]" />
            <p className="text-body-sm">
              {isRegistering 
                ? "Regístrate para obtener acceso a la plataforma institucional." 
                : "Acceso a métricas globales, nómina y configuración institucional."}
            </p>
          </div>

          {isRegistering && (
            <label className="flex flex-col gap-2 text-label-md font-semibold">
              Nombre completo
              <div className="flex h-12 items-center gap-2 rounded-xl bg-surface-container-low px-3 text-on-surface-variant">
                <Icon name="person" className="text-[20px]" />
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-label="Nombre completo"
                  className="min-w-0 flex-1 bg-transparent text-on-surface outline-none placeholder:text-muted-foreground"
                  placeholder="Tu nombre completo"
                  type="text"
                />
              </div>
            </label>
          )}

          <label className="flex flex-col gap-2 text-label-md font-semibold">
            Correo electrónico
            <div className="flex h-12 items-center gap-2 rounded-xl bg-surface-container-low px-3 text-on-surface-variant">
              <Icon name="mail" className="text-[20px]" />
              <input
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Correo institucional"
                className="min-w-0 flex-1 bg-transparent text-on-surface outline-none placeholder:text-muted-foreground"
                placeholder="usuario@ejemplo.com"
                type="email"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2 text-label-md font-semibold">
            Contraseña
            <div className="flex h-12 items-center gap-2 rounded-xl bg-surface-container-low px-3 text-on-surface-variant">
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

          {isRegistering && (
            <label className="flex flex-col gap-2 text-label-md font-semibold">
              Confirmar contraseña
              <div className="flex h-12 items-center gap-2 rounded-xl bg-surface-container-low px-3 text-on-surface-variant">
                <Icon name="lock" className="text-[20px]" />
                <input
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  aria-label="Confirmar contraseña"
                  className="min-w-0 flex-1 bg-transparent text-on-surface outline-none"
                  type="password"
                />
              </div>
            </label>
          )}

          {!isRegistering && (
            <div className="flex items-center justify-between text-body-sm">
              <label className="flex items-center gap-2 text-on-surface-variant">
                <input className="h-4 w-4 accent-primary" type="checkbox" />
                Recordar sesión
              </label>
              <a className="font-semibold text-primary" href="#recover">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          )}

          <Button type="submit" disabled={loading} className="h-12 rounded-xl text-label-md mt-2">
            {loading ? "Procesando..." : isRegistering ? "Crear cuenta" : "Ingresar a la Plataforma"}
            {!loading && <Icon name={isRegistering ? "check" : "arrow_forward"} className="text-[20px]" />}
          </Button>
          
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="font-semibold text-primary text-body-sm hover:underline"
            >
              {isRegistering 
                ? "¿Ya tienes una cuenta? Inicia sesión" 
                : "¿No tienes una cuenta? Regístrate"}
            </button>
          </div>
        </form>

        {!isRegistering && (
          <div className="flex flex-col items-center gap-2 text-center text-body-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Icon name="lock_clock" className="text-[18px]" />
              Acceso seguro certificado TLS 1.3
            </div>
            <p>Soporte técnico institucional • Dirección de Tecnología Educativa</p>
          </div>
        )}
      </section>
    </main>
  );
}
