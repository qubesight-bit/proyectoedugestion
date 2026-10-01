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
  const [googleLoading, setGoogleLoading] = useState(false);

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
      if (!roles?.some(({ role }) => role === "admin" || role === "docente")) {
        await supabase.auth.signOut();
        throw new Error("Tu cuenta todavía no tiene un rol de administrador o docente.");
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
            disabled={googleLoading}
            onClick={async () => {
              setGoogleLoading(true);
              const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: `${window.location.origin}/auth?oauth=1`,
                  queryParams: {
                    access_type: "offline",
                    prompt: "select_account",
                  },
                },
              });
              if (error) {
                const providerDisabled = error.message.toLowerCase().includes("provider") && error.message.toLowerCase().includes("enabled");
                toast.error(providerDisabled ? "El acceso con Google todavía no está habilitado en Supabase Authentication." : `Error conectando con Google: ${error.message}`);
                setGoogleLoading(false);
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            <span className="font-medium">{googleLoading ? "Conectando con Google…" : "Acceder con Google"}</span>
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
