import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setRecoveryMode(new URLSearchParams(window.location.search).get("recovery") === "1");
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        if (error.code === "invalid_credentials") {
          throw new Error(
            "Supabase no reconoció ese correo y contraseña. Usá la contraseña del usuario creado en Authentication, no la contraseña de tu cuenta de Supabase.",
          );
        }
        throw error;
      }
      const { data: roles, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      if (roleError) throw roleError;
      if (!roles?.some(({ role }) => role === "admin" || role === "docente" || role === "estudiante")) {
        await supabase.auth.signOut();
        throw new Error("Tu cuenta todavía no tiene un rol de administrador, docente o estudiante.");
      }
      onLogin();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo iniciar sesión.");
      setLoading(false);
    }
  };

  const sendRecovery = async () => {
    if (!email.trim()) {
      toast.error("Escribí primero el correo de tu usuario del panel.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth?recovery=1`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Revisá tu correo. Te enviamos el enlace para crear una contraseña nueva.");
  };

  const updatePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      toast.error("El enlace de recuperación venció o no es válido. Solicitá uno nuevo.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    toast.success("Contraseña actualizada. Ya podés ingresar al panel.");
    window.history.replaceState({}, "", "/auth");
    setRecoveryMode(false);
    setPassword("");
    setNewPassword("");
    setConfirmPassword("");
    await supabase.auth.signOut();
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

        {recoveryMode ? <form
          className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm"
          onSubmit={updatePassword}
        >
          <h2 className="text-headline-sm font-semibold">Crear contraseña nueva</h2>
          <p className="text-body-sm text-on-surface-variant">Elegí una contraseña para tu usuario del Centro Educativo Adventista.</p>
          <label className="flex flex-col gap-2 text-label-md font-semibold">
            Contraseña nueva
            <input required minLength={8} type="password" className="form-input" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </label>
          <label className="flex flex-col gap-2 text-label-md font-semibold">
            Confirmar contraseña
            <input required minLength={8} type="password" className="form-input" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          </label>
          <Button type="submit" disabled={loading}>{loading ? "Actualizando…" : "Guardar contraseña"}</Button>
        </form> : <form
          className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex gap-3 rounded-xl bg-primary-fixed p-3 text-on-primary-fixed mb-4">
            <Icon name="verified_user" className="text-[22px]" />
            <p className="text-body-sm">
              Acceso seguro para administradores, docentes y estudiantes.
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
                placeholder="correo@ceac.ed.cr"
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
            <button type="button" disabled={loading} className="font-semibold text-primary disabled:opacity-50" onClick={() => void sendRecovery()}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button type="submit" disabled={loading} className="h-12 rounded-xl text-label-md mt-4">
            {loading ? "Verificando credenciales..." : "Ingresar a la Plataforma"}
            {!loading && <Icon name="arrow_forward" className="text-[20px]" />}
          </Button>

        </form>}

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
