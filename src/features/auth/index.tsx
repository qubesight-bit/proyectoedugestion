import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";
import { Role } from "../../types";

export function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [selectedRole, setSelectedRole] = useState<Role>("Administrador");
  
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
            <h1 className="text-display-lg font-bold text-center">Centro Educativo Adventista de Cartago</h1>
            <p className="mt-1 text-body-md text-on-surface-variant">
              Plataforma de Gestión Académica e Institucional
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-container p-1">
          {(["Administrador", "Docente"] as Role[]).map((roleOption) => (
            <Button
              key={roleOption}
              type="button"
              variant={selectedRole === roleOption ? "default" : "ghost"}
              className="h-10 rounded-lg px-2 text-label-sm"
              onClick={() => setSelectedRole(roleOption)}
            >
              {roleOption}
            </Button>
          ))}
        </div>

        <form
          className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm"
          onSubmit={(event) => {
            event.preventDefault();
            onLogin(selectedRole);
          }}
        >
          <div className="flex gap-3 rounded-xl bg-primary-fixed p-3 text-on-primary-fixed">
            <Icon name="verified_user" className="text-[22px]" />
            <p className="text-body-sm">Acceso a métricas globales, nómina y configuración institucional.</p>
          </div>

          <label className="flex flex-col gap-2 text-label-md font-semibold">
            Correo institucional
            <div className="flex h-12 items-center gap-2 rounded-xl bg-surface-container-low px-3 text-on-surface-variant">
              <Icon name="mail" className="text-[20px]" />
              <input
                aria-label="Correo institucional"
                className="min-w-0 flex-1 bg-transparent text-on-surface outline-none placeholder:text-muted-foreground"
                placeholder="Dominio oficial"
                type="email"
              />
            </div>
          </label>

          <label className="flex flex-col gap-2 text-label-md font-semibold">
            Contraseña
            <div className="flex h-12 items-center gap-2 rounded-xl bg-surface-container-low px-3 text-on-surface-variant">
              <Icon name="lock" className="text-[20px]" />
              <input
                aria-label="Contraseña"
                className="min-w-0 flex-1 bg-transparent text-on-surface outline-none"
                type="password"
              />
              <Icon name="visibility" className="text-[20px]" />
            </div>
          </label>

          <div className="flex items-center justify-between text-body-sm">
            <label className="flex items-center gap-2 text-on-surface-variant">
              <input className="h-4 w-4 accent-primary" type="checkbox" />
              Recordar sesión
            </label>
            <a className="font-semibold text-primary" href="#recover">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <Button type="submit" className="h-12 rounded-xl text-label-md">
            Ingresar a la Plataforma
            <Icon name="arrow_forward" className="text-[20px]" />
          </Button>
        </form>

        <div className="rounded-2xl bg-surface-container-low p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-high text-primary">
                <Icon name="contact_support" className="text-[22px]" />
              </div>
              <div>
                <p className="font-semibold">¿Problemas de ingreso? Recuperar acceso</p>
                <p className="text-body-sm text-on-surface-variant">Mesa de Ayuda para Campus</p>
              </div>
            </div>
            <Icon name="chevron_right" className="text-[22px] text-on-surface-variant" />
          </div>
          <p className="mt-3 text-body-sm text-on-surface-variant">
            Atención activa de Lunes a Viernes (7:00 a 19:00)
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 text-center text-body-sm text-on-surface-variant">
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
