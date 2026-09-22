import { Button } from "@/components/ui/button";
import { Icon } from "../shared";
import { View, Role } from "../../types";
import { profileUrl, logoUrl } from "../../services/mockData";

export function AppHeader({
  title,
  roleOpen,
  onToggleRole,
  onCloseRole,
}: {
  title: string;
  roleOpen: boolean;
  onToggleRole: () => void;
  onCloseRole: () => void;
}) {
  // We'll import roleOptions dynamically or redefine for simplicity in the header
  const roleOptions: Array<[string, string, string]> = [
    ["admin_panel_settings", "Administrador", "Acceso total institucional"],
    ["school", "Docente", "Gestión de cursos y notas"],
  ];

  return (
    <header className="fixed top-0 z-50 w-full bg-inverse-surface/95 text-inverse-on-surface shadow-sm backdrop-blur-xl pt-safe md:w-[calc(100%-16rem)] md:ml-64">
      <div className="flex h-16 items-center justify-between px-4">
        <Button aria-label="Abrir menú principal" variant="ghost" size="icon" className="h-11 w-11 rounded-xl text-inverse-on-surface hover:bg-on-surface-variant">
          <Icon name="menu" />
        </Button>
        <div className="flex min-w-0 items-center gap-2">
          <img
            alt=""
            className="h-8 w-auto object-contain"
            src={logoUrl}
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
          <span className="text-headline-sm font-semibold truncate max-w-[200px]">Centro Educativo Adventista de Cartago</span>
          <span className="sr-only">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button aria-label="Notificaciones no leídas" variant="ghost" size="icon" className="relative h-11 w-11 rounded-xl text-inverse-on-surface hover:bg-on-surface-variant">
            <Icon name="notifications" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-inverse-surface" />
          </Button>
          <Button aria-label="Perfil de usuario" variant="ghost" size="icon" className="h-11 w-11 rounded-full" onClick={onToggleRole}>
            <img alt="Profile" className="h-8 w-8 rounded-full object-cover ring-1 ring-outline-variant" src={profileUrl} />
          </Button>
        </div>
      </div>
      {roleOpen && (
        <div className="absolute right-3 top-16 w-72 rounded-2xl bg-surface-container-lowest p-2 text-on-surface shadow-lg animate-edu-rise">
          {roleOptions.map(([icon, label, desc]) => (
            <Button key={label} variant="ghost" className="h-auto w-full justify-start rounded-xl px-3 py-3 text-left" onClick={onCloseRole}>
              <Icon name={icon} className="text-[22px] text-primary" />
              <span className="flex flex-col">
                <span className="font-semibold">{label}</span>
                <span className="text-body-sm text-on-surface-variant">{desc}</span>
              </span>
            </Button>
          ))}
          <a href="/" className="mt-1 flex h-auto w-full items-center justify-start gap-3 rounded-xl px-3 py-3 text-left text-destructive hover:bg-surface-container-high">
            <Icon name="logout" className="text-[22px]" />
            <span className="font-semibold">Salir al Inicio</span>
          </a>
        </div>
      )}
    </header>
  );
}

export function Sidebar({ active, onNavigate, role }: { active: View | string; onNavigate: (view: View) => void, role: Role }) {
  const adminNav: Array<[View, string, string]> = [
    ["home", "dashboard", "Inicio"],
    ["courses", "school", "Cursos"],
    ["teachers", "group", "Profesores"],
    ["admin_supervision", "visibility", "Supervisión"],
    ["profile", "account_circle", "Perfil"],
  ];
  const teacherNav: Array<[View, string, string]> = [
    ["teacher_home", "home", "Inicio (Resumen)"],
    ["teacher_courses", "school", "Mis Cursos"],
    ["teacher_grades", "grading", "Calificaciones"],
    ["teacher_attendance", "fact_check", "Asistencia"],
    ["teacher_resources", "folder", "Recursos"],
  ];
  const nav = role === "Administrador" ? adminNav : teacherNav;
  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col bg-surface-container-lowest shadow-xl border-r">
      <div className="flex h-16 items-center gap-3 px-6 pt-4 mb-8">
        <div className="flex min-w-0 items-center gap-2">
          <Icon name="school" className="text-[28px] text-primary shrink-0" />
          <span className="text-sm font-bold text-primary leading-tight">Centro Educativo Adventista de Cartago</span>
        </div>
      </div>
      <nav className="flex flex-col gap-2 px-4 flex-1">
        {nav.map(([target, icon, label]) => (
          <Button
            key={target}
            variant="ghost"
            className={`h-14 justify-start gap-4 rounded-xl px-4 ${active === target ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container-high"}`}
            onClick={() => onNavigate(target)}
          >
            <Icon name={icon} className="text-[24px]" />
            <span className="text-sm font-semibold">{label}</span>
          </Button>
        ))}
      </nav>
      <div className="flex flex-col gap-2 p-4">
        <Button variant="outline" className="w-full justify-start gap-3 h-14 rounded-xl" onClick={() => onNavigate("profile")}>
          <img src={profileUrl} alt="Profile" className="h-8 w-8 rounded-full" />
          <span className="text-sm font-semibold">Mi Cuenta</span>
        </Button>
        <a href="/" className="flex w-full items-center justify-start gap-3 h-14 rounded-xl px-4 hover:bg-surface-container-high text-destructive">
          <Icon name="logout" className="text-[24px]" />
          <span className="text-sm font-semibold">Salir al Inicio</span>
        </a>
      </div>
    </aside>
  );
}

export function BottomNav({ active, onNavigate, role }: { active: View | string; onNavigate: (view: View) => void, role: Role }) {
  const adminNav: Array<[View, string, string]> = [
    ["home", "dashboard", "Inicio"],
    ["courses", "school", "Cursos"],
    ["teachers", "group", "Profesores"],
    ["admin_supervision", "visibility", "Supervisión"],
    ["profile", "account_circle", "Perfil"],
  ];
  const teacherNav: Array<[View, string, string]> = [
    ["teacher_home", "home", "Inicio (Resumen)"],
    ["teacher_courses", "school", "Mis Cursos"],
    ["teacher_grades", "grading", "Calificaciones"],
    ["teacher_attendance", "fact_check", "Asistencia"],
    ["teacher_resources", "folder", "Recursos"],
  ];
  const nav = role === "Administrador" ? adminNav : teacherNav;
  return (
    <nav className="fixed bottom-0 z-50 w-full bg-surface-container-lowest/95 shadow-lg backdrop-blur-xl pb-safe md:hidden">
      <div className="grid h-20 grid-cols-5 px-2 pt-2">
        {nav.map(([target, icon, label]) => (
          <Button key={target} variant="ghost" className={`h-16 flex-col rounded-xl gap-1 ${active === target ? "text-primary" : "text-on-surface-variant"}`} onClick={() => onNavigate(target)}>
            <Icon name={icon} className="text-[24px]" />
            <span className="text-label-sm font-semibold">{label}</span>
            {target === "assistant" && <span className="sr-only">Asistente IA</span>}
          </Button>
        ))}
      </div>
    </nav>
  );
}
