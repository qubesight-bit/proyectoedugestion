import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export type LoginFormProps = {
  onSubmit: (values: { email: string; password: string; remember: boolean }) => Promise<string | null>;
};

/** Accessible sign-in form. `onSubmit` resolves to an error message or null on success. */
export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handle(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Ingresa un correo válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const msg = await onSubmit({ email: email.trim(), password, remember });
    setLoading(false);
    if (msg) setError(msg);
  }

  return (
    <form
      noValidate
      aria-describedby={error ? "login-error" : undefined}
      className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm"
      onSubmit={handle}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="login-email" className="text-label-md font-semibold">
          Correo institucional
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          className="form-input h-12"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="login-password" className="text-label-md font-semibold">
          Contraseña
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPwd ? "text" : "password"}
            autoComplete="current-password"
            required
            className="form-input h-12 w-full pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!error}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-on-surface-variant focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPwd}
            onClick={() => setShowPwd((v) => !v)}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[20px]">
              {showPwd ? "visibility_off" : "visibility"}
            </span>
          </button>
        </div>
      </div>
      <label className="flex items-center gap-2 text-body-sm text-on-surface-variant">
        <input
          type="checkbox"
          className="h-4 w-4 accent-primary"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
        />
        Recordar sesión
      </label>
      {error && (
        <p id="login-error" role="alert" className="rounded-lg bg-destructive/10 p-3 text-body-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading} className="h-12 rounded-xl text-label-md">
        {loading ? "Ingresando…" : "Ingresar a la Plataforma"}
      </Button>
    </form>
  );
}
