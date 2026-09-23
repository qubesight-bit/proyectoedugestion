import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { LoginScreen as LoginFeature } from "@/features/auth";
import { DashboardView as DashboardFeature } from "@/features/dashboard";
import { CoursesView as CoursesFeature } from "@/features/courses";
import { StudentsView as StudentsFeature } from "@/features/students";
import { TeachersView as TeachersFeature } from "@/features/teachers";
import { AdminSupervisionView as AdminSupervisionFeature } from "@/features/admin";
import {
  TeacherDashboardView as TeacherDashboardFeature,
  TeacherCoursesView,
  TeacherGradesView,
  TeacherAttendanceView,
  TeacherResourcesView,
} from "@/features/teacher";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Plataforma Centro Educativo Adventista de Cartago" },
      {
        name: "description",
        content:
          "Acceso móvil para administrar estudiantes, cursos, matrículas y anuncios institucionales.",
      },
      { property: "og:title", content: "Plataforma Centro Educativo Adventista de Cartago" },
      {
        property: "og:description",
        content:
          "Acceso móvil para administrar estudiantes, cursos, matrículas y anuncios institucionales.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type View = "login" | "home" | "courses" | "students" | "teachers" | "assistant" | "profile" | "teacher_home" | "teacher_courses" | "teacher_grades" | "teacher_attendance" | "teacher_resources" | "admin_supervision";
type Role = "Administrador" | "Docente";
type CourseCategory = "all" | "ciencias" | "humanidades" | "artes" | "idiomas";

const logoUrl = "/logo_cartago.png";

const profileUrl =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAsU0n9vIMhCcBNeXrsZupFuWwIn1TXFabF1GsR-5mMut-1KPtA27oTbUvx3t4mRaeeSkSC6VrWAIs80d-LGPhZoChl6o4mgMXOH3wRs4z0cLKj-zDqYOOPi0u_2JU1uCRH44nyXK-vEsRP-EPPlpjBaIAWtWJErhAAxZV-s4HcPnWjmMzg9szKz8cVfxXRnjEPcDxFUg8I5njsLWdrG0u_dREB4jVZpzJ_o6tHmVB11n2UBTaRxHVIvQ";

const teacherFaces = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAZrVRSRKciy9svwx4BfCusB5TJcLAgrVtx306N9zoz_eo0TEekE-wls7jpIowFKu-pRSEaEP17JYBpYQHeC4xXXotFvywPAzP_A2PHJUhOTuZqQU6wm8rZ_4x6bZaWP5d8dmLbLaMSza7rvOZJlUc4IJ48nLdkBVbw6WKae22PAcODFidKUC1-SiE5-dYoS5OhexG60NpXfntPbxqQf76obc0Yq8YPQL1zctzP5u4SihJqkmPhwuM7Qw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD9cDdKgjVFhTkWyjyQ2ChcPqtAtsGBZRpUpz5Us1Zg9PmKr6QXGAKbxBJIOqEveCVVyzuT3Yah1NtqKCmZt3YzDmzu6RI8Tmt5xysBJNzx4YiJ6EnK1WIp3moaELMQDiYyUn1gONCM6WnYecVtTFuZvNHJNeyKqVfzeKjOSlCnMTeGB01gX2h8KMoiWkX99zmlwo1dpuqShwvigQD4J8If6pRV9uQJMEMHwYo7_Oqk4srAEWTpRnLPzw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD0CX2QR1KQzWVBULqzW8F9MpV0PD3bbrTQgfD5u4HRy8dx744ZD6PWryZCbB_1WKWpvLLcXJRUA0IZdd_dtAxFF1sP4-IurHrcBgOKiJ8UtQo7rNglJe7nCNT94SvP7snIGStTgJOjnBR1b6QvaFA3DWt4oGvf03911f56_3g5ncIvQ0SsRaE-4IgCUIoqbGRnMzCELc_MEiO_Y_NOYJs89FPEZqI7v6f4g51PF-i8SHZEZZq83Ds5SQ",
] as const;

const studentImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAsPemPGMLES2DZjlzwpWVMjpQzFDpi8eN9Nf-Tb4TYjPOqEQkhZa7jKHUxb9K-OTQSeYfpbyLylT_OnfCF_6zVfMsVI2oP-1iTahMCZ-vMg8HcciPCEkjm3efrmqAAnEMVZWTCp24oHJ4t32Jqwqv7iErCEYSx8egT_lxrlXaktYOpg2QgB79i_SXRBd8q77MU6ALKMEI18YRBR7UvKme7i55UQhLmx2580fKkKetshLeUeXdwWq9EsA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAc12AYzHjzUA3rgnlq0mhaSaCX6uhp81jBR8wGaQsdTqWeW34fbVv1oNlA2I-8x80qSzC5Fk-MTGXcDJxuc3b2cYGSToIuSspE8BYtORxneZnmR-EQoJTI95gMtNyd5ppxf-kc2ykXKihOM20GRfMEaVMjLeP2GClpK-_sp2Gfy7IhFWSqhRDle4eXexihy2963OtzczxsUqjp5U2htZkbJz1-Ynd1Pbx65dmKk5O6xy5uRv7ueU22mw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB-y9nlIkFaqE6S34ovdXLj-IjOcSEwClIIHeKi56vktCy0vyyIOFYRV8T8nUgg23sQHiUsb9JCvsjcWDsmvReluDaOpOYRf2SA6KIcq-PBTlJ3DuA6QT2yXYgm5wE_Qg_C23Q80DtijfcMI5lw70loE5cNnnMuBexTj0tT6j9CBR8AjzrtqUeg7DSE4NFPToiRXJHjso3Sb_5cPzMvuoQcR2NbEc7Mp_4Pk2fKc0yCrXz21axY2mt-hg",
] as const;

const announcementImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCpIF5S-QJGInEvozN2tJMBXKVWr_l6AWyPp8yVQlmADxhdDNZRdhw-ZWzefi_W2UjCp4uRscFbpzXbGqZKPME-ux7TMR-PQCDpbXnghk2tjIIGzT8sHveipD4QFtZlo_xU5cmSpjVZxGqV1dRDGvfahKeLqQTR-UDrscphI_q0WG0ba4axfCL5rBnFeqN9ew3dBcVb9XE9897TwPqvviXVhth7qK-XIg6jlq8FjCA0ufwf9Z-1B87Yaw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDBRqNTtxysBylX80C7orWPLY0v83r8TCCqy8ZlZ3TX5tj8F68Ad8P1dtSBvh1MUFh3u4J4r_LkrBiHltHkFU_5jeY_LqsFFwzX1R_34fJtCk6Cx15kQvFVkYwS1YES--8Gu3gc6wv6g-q8AbntFKgBOE0R9amnaqOMwFwMeoERRw-SnN61JdjgAWCk_xVzEQDtLjFtkfDFp0mblTn6o98Vvgzt1e_6BXbxok3wWIv4PDURfJm22XWlVQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAGkT9TgxkSdXUB0tjEVizcITJjIHgyGbZbFWBhBbFdLD3qiUsWtMinpzsu-o0JcoyY-tA_JBXl08fimAIJ6pW7QMb-meDftxQPB3BdNOUb9h856B_bETPjnQNeBGrsWEkHGGIy7N60h27ioKLSWkm1IEhd1Z1LV2jNFnwDJGx3cuN-fNB5oL926hjqCNDi5n4_HHzKL0sZblYig_1uhtGRoOb3lZmsMdlc2ejOgO22DGVyq9VCuEkDSA",
] as const;

const roleOptions: Array<[string, string, string]> = [
  ["admin_panel_settings", "Administrador", "Acceso total institucional"],
  ["school", "Docente", "Gestión de cursos y notas"],
];

const courses = [
  {
    category: "ciencias",
    level: "3° de Secundaria",
    tag: "Ciencias Exactas",
    title: "Matemáticas Avanzadas y Cálculo",
    teacher: "Prof. Carlos Menéndez",
    schedule: "Lun y Mié • 08:00 - 09:30 hrs",
    room: "Aula Magna 204 • Pabellón B",
    capacityLabel: "Capacidad de aula",
    occupancy: "28 / 30 ocupados (93%)",
    note: "¡Últimos 2 cupos disponibles antes de lista de espera!",
    count: 28,
    icon: "room",
    face: teacherFaces[0],
  },
  {
    category: "humanidades",
    level: "2° de Secundaria",
    tag: "Humanidades",
    title: "Lengua Española y Literatura",
    teacher: "Prof. Patricia Valenzuela",
    schedule: "Mar y Jue • 10:00 - 11:30 hrs",
    room: "Salón 108 • Edificio Central",
    capacityLabel: "Capacidad de aula",
    occupancy: "22 / 30 ocupados (73%)",
    note: "8 cupos regulares disponibles",
    count: 22,
    icon: "room",
    face: teacherFaces[1],
  },
  {
    category: "ciencias",
    level: "4° de Secundaria",
    tag: "Laboratorio Práctico",
    title: "Biología Celular y Laboratorio",
    teacher: "Dr. Roberto Salgado",
    schedule: "Viernes • 08:30 - 12:00 hrs",
    room: "Laboratorio de Bioquímica 3",
    capacityLabel: "Capacidad de laboratorio",
    occupancy: "15 / 20 ocupados (75%)",
    note: "Cupo máximo limitado por protocolos de bioseguridad",
    count: 15,
    icon: "science",
    face: teacherFaces[2],
  },
] as const;

const students = [
  {
    name: "Camilo Andrés Morales",
    id: "EST-2024-089",
    status: "Activo",
    grade: "4° Primaria 'A'",
    score: "9.2",
    trend: "star",
    tutor: "M. Morales",
    image: studentImages[0],
    alert: "",
  },
  {
    name: "Valentina Sofía Ríos",
    id: "EST-2024-112",
    status: "Activo",
    grade: "2° Secundaria 'B'",
    score: "8.4",
    trend: "trending_up",
    tutor: "E. Ríos G.",
    image: studentImages[1],
    alert: "",
  },
  {
    name: "Matías Herrera Vera",
    id: "EST-2024-045",
    status: "Doc. Pendiente",
    grade: "1° Secundaria 'C'",
    score: "7.9",
    trend: "remove",
    tutor: "",
    image: studentImages[2],
    alert: "Falta Certificado Médico",
  },
] as const;

const teachersMock = [
  {
    id: "DOC-2024-001",
    name: "Prof. Carlos Menéndez",
    subject: "Matemáticas y Cálculo",
    status: "Activo",
    classes: 4,
    rating: "4.8",
    image: teacherFaces[0],
    alert: "",
  }
] as const;

const chartBars = [
  { month: "May", value: "28", height: "h-14", kind: "real" },
  { month: "Jun", value: "34", height: "h-[4.5rem]", kind: "real" },
  { month: "Jul", value: "41", height: "h-[5.5rem]", kind: "real" },
  { month: "Ago", value: "52", height: "h-28", kind: "real" },
  { month: "Sep", value: "37", height: "h-20", kind: "real" },
  { month: "Oct", value: "45*", height: "h-24", kind: "estimate" },
] as const;

function Index() {
  const [role, setRole] = useState<Role>("Administrador");
  const [view, setView] = useState<View>("login");
  const [roleOpen, setRoleOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState<CourseCategory>("all");
  const [courseModal, setCourseModal] = useState(false);
  const [studentModal, setStudentModal] = useState(false);
  const [toast, setToast] = useState("");

  const filteredCourses = useMemo(
    () => courses.filter((course) => courseFilter === "all" || course.category === courseFilter),
    [courseFilter],
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  if (view === "login") {
    return <LoginFeature onLogin={(r) => {
      setRole(r);
      setView(r === "Administrador" ? "home" : "teacher_home");
    }} />;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface flex justify-center">
      <div className="mx-auto flex min-h-screen w-full flex-col md:flex-row bg-surface shadow-lg">
        {/* Desktop Sidebar */}
        <Sidebar active={view} onNavigate={setView} role={role} />
        <AppHeader
          title={view === "courses" ? "Cursos" : "Inicio"}
          roleOpen={roleOpen}
          onToggleRole={() => setRoleOpen((open) => !open)}
          onCloseRole={() => setRoleOpen(false)}
        />

        <main className="flex-1 bg-surface pt-16 pb-24 md:pt-20 md:pb-8 md:ml-64 w-full h-screen overflow-y-auto px-4 md:px-8 tv:px-24">
          {view === "home" && (
            <DashboardFeature
              onCourses={() => setView("courses")}
              onStudents={() => setView("students")}
            />
          )}
          {view === "courses" && <CoursesFeature />}
          {view === "students" && <StudentsFeature />}
          {view === "teachers" && <TeachersFeature />}
          {view === "teacher_home" && <TeacherDashboardFeature />}
          {view === "teacher_courses" && <TeacherCoursesView />}
          {view === "teacher_grades" && <TeacherGradesView />}
          {view === "teacher_attendance" && <TeacherAttendanceView />}
          {view === "teacher_resources" && <TeacherResourcesView />}
          {view === "admin_supervision" && <AdminSupervisionFeature />}
          {view === "assistant" && <SimplePanel icon="auto_awesome" title="Asistente IA" />}
          {view === "profile" && <SimplePanel icon="account_circle" title="Perfil institucional" />}
        </main>

        <BottomNav active={view} onNavigate={setView} role={role} />
      </div>

      {courseModal && (
        <CourseModal
          onClose={() => setCourseModal(false)}
          onSave={() => {
            setCourseModal(false);
            showToast("Acción completada exitosamente");
          }}
        />
      )}
      {studentModal && (
        <StudentModal
          onClose={() => setStudentModal(false)}
          onSave={() => {
            setStudentModal(false);
            showToast("Estudiante registrado exitosamente");
          }}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

function Icon({ name, className = "text-[24px]" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined font-light ${className}`}>{name}</span>;
}

function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
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
            <h1 className="text-display-lg font-bold">Centro Educativo Adventista de Cartago</h1>
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

function AppHeader({
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
          <span className="text-headline-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis w-48">Centro Educativo Adventista de Cartago</span>
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

function DashboardView({ onCourses, onStudents }: { onCourses: () => void; onStudents: () => void }) {
  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1 text-headline-md font-semibold">
              Hola, Lic. Mariana González <span aria-hidden="true">👋</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-body-sm text-on-surface-variant">
              <Icon name="calendar_today" className="text-[18px]" />
              Resumen institucional de hoy • 24 de Septiembre, 2024
            </div>
          </div>
          <Button variant="secondary" className="h-9 rounded-xl px-3" onClick={onCourses}>
            Gestionar
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm font-semibold">Acciones rápidas</h2>
        <span className="text-label-sm font-semibold text-primary">Ciclo 2024-II</span>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-3 tv:grid-cols-6 gap-3 tv:gap-8">
        <QuickAction icon="how_to_reg" label="+ Matrícula" onClick={onStudents} />
        <QuickAction icon="person_add" label="+ Estudiante" onClick={onStudents} />
        <QuickAction icon="campaign" label="+ Anuncio" onClick={() => undefined} />
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm font-semibold">Métricas del Período</h2>
        <span className="rounded-full bg-primary-fixed px-3 py-1 text-label-sm font-semibold text-on-primary-fixed">Ciclo 2024-II</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 tv:grid-cols-4 gap-3 tv:gap-8">
        <MetricCard icon="groups" label="Estudiantes Activos" value="482" helper="+12% vs ciclo anterior" />
        <MetricCard icon="assignment_turned_in" label="Matrículas este mes" value="37" helper="Meta: 45 proyectadas" />
        <div className="col-span-2 tv:col-span-4 rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-tertiary-fixed text-on-tertiary-fixed">
              <Icon name="auto_graph" className="text-[22px]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-body-sm text-on-surface-variant">Promedio General</p>
              <div className="flex items-end gap-1">
                <span className="text-metric-number font-bold">8.6</span>
                <span className="pb-1 text-body-sm text-on-surface-variant">/ 10</span>
              </div>
            </div>
            <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-label-sm font-semibold text-on-tertiary-fixed">Satisfactorio</span>
          </div>
          <p className="mt-2 text-body-sm text-on-surface-variant">Rendimiento global</p>
        </div>
      </div>

      <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-headline-sm font-semibold">Matrículas por mes</h2>
            <p className="text-body-sm text-on-surface-variant">Semestre actual con proyección</p>
          </div>
          <div className="flex gap-2 text-label-sm">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" />Real</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-tertiary" />Est.</span>
          </div>
        </div>
        <div className="mt-4 flex h-36 items-end justify-between gap-2">
          {chartBars.map((bar) => (
            <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-28 items-end">
                <div className={`w-8 rounded-t-lg ${bar.kind === "real" ? "bg-primary" : "bg-tertiary"} ${bar.height}`} />
              </div>
              <span className="text-label-sm font-semibold">{bar.value}</span>
              <span className="text-body-sm text-on-surface-variant">{bar.month}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-body-sm text-on-surface-variant">Toca una barra para inspeccionar el detalle</p>
      </section>

      <div className="flex items-center justify-between rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm">
        <div>
          <p className="text-body-sm opacity-90">Campus Central</p>
          <p className="font-semibold">Jornada de Inducción Académica</p>
        </div>
        <Icon name="chevron_right" />
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-headline-sm font-semibold">Anuncios recientes</h2>
            <p className="text-body-sm text-on-surface-variant">3 nuevos</p>
          </div>
          <Button variant="ghost" className="h-9 rounded-xl px-3 text-primary">Historial</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 tv:grid-cols-3 gap-3 tv:gap-8">
        <Announcement
          image={announcementImages[0]}
          icon="flag"
          label="Importante"
          date="25 sept"
          title="Reunión general de padres de familia"
          text="Confirmar asistencia y cronograma para la presentación de avances semestrales en el Auditorio A."
          owner="Coord. Familiar"
          action="Detalles"
        />
        <Announcement
          image={announcementImages[1]}
          icon="error"
          label="Urgente"
          date="30 sept"
          title="Cierre de período de matrícula regular"
          text="Últimos 8 cupos disponibles para bachillerato técnico. Posterior a la fecha aplicará recargo extraordinario."
          owner="Dpto. Admisiones"
          action="Ver cupos"
        />
        <Announcement
          image={announcementImages[2]}
          icon="psychology"
          label="Académico"
          date="03 oct"
          title="Capacitación docente en Plataforma IA"
          text="Taller virtual sincrónico sobre evaluación formativa con asistentes generativos certificados."
          owner="Innovación Educativa"
          action="Inscribirse"
        />
        </div>
        <Button variant="ghost" className="h-11 rounded-xl text-primary">
          Ver todos los anuncios
          <Icon name="arrow_right_alt" className="text-[20px]" />
        </Button>
      </section>

      <div className="flex items-center justify-between rounded-2xl bg-tertiary-fixed px-4 py-3 text-on-tertiary-fixed">
        <div className="flex items-center gap-2">
          <Icon name="verified" className="text-[20px]" />
          Servidores activos
        </div>
        <span className="font-semibold">100% operativo</span>
      </div>
    </section>
  );
}

function QuickAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <Button variant="secondary" className="h-20 flex-col rounded-2xl px-2 text-center" onClick={onClick}>
      <Icon name={icon} className="text-[24px] text-primary" />
      <span className="text-label-sm font-semibold">{label}</span>
    </Button>
  );
}

function MetricCard({ icon, label, value, helper }: { icon: string; label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-on-primary-fixed">
          <Icon name={icon} className="text-[22px]" />
        </div>
        <Icon name="trending_up" className="text-[18px] text-tertiary" />
      </div>
      <p className="mt-3 text-body-sm text-on-surface-variant">{label}</p>
      <p className="text-metric-number font-bold">{value}</p>
      <p className="text-body-sm text-on-surface-variant">{helper}</p>
    </div>
  );
}

function Announcement({
  image,
  icon,
  label,
  date,
  title,
  text,
  owner,
  action,
}: {
  image: string;
  icon: string;
  label: string;
  date: string;
  title: string;
  text: string;
  owner: string;
  action: string;
}) {
  return (
    <article className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <img alt="" className="h-5 w-5 rounded-full object-cover" src={image} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-label-sm font-semibold text-primary">
            <Icon name={icon} className="text-[17px]" />
            <span>{label}</span>
            <span className="ml-auto flex items-center gap-1 text-on-surface-variant">
              <Icon name="schedule" className="text-[16px]" />
              {date}
            </span>
          </div>
          <h3 className="mt-2 text-headline-sm font-semibold">{title}</h3>
          <p className="mt-1 text-body-sm text-on-surface-variant">{text}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-body-sm text-on-surface-variant">{owner}</span>
            <Button variant="ghost" className="h-8 rounded-lg px-2 text-primary">
              {action}
              <Icon name="arrow_forward" className="text-[18px]" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function CoursesView({
  filter,
  filteredCourses,
  onFilter,
  onOpenCourse,
  onToast,
}: {
  filter: CourseCategory;
  filteredCourses: typeof courses[number][];
  onFilter: (filter: CourseCategory) => void;
  onOpenCourse: () => void;
  onToast: (message: string) => void;
}) {
  const chips: Array<[CourseCategory, string]> = [
    ["all", "Todos los niveles"],
    ["ciencias", "Ciencias"],
    ["humanidades", "Humanidades"],
    ["artes", "Artes"],
    ["idiomas", "Idiomas"],
  ];

  return (
    <section className="flex flex-col gap-4 px-4 py-4 animate-edu-rise">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-label-sm font-semibold uppercase text-primary">Gestión Académica</span>
          <h1 className="text-headline-md font-semibold">Catálogo de Cursos</h1>
        </div>
        <Button className="h-10 rounded-xl px-4" onClick={onOpenCourse}>
          <Icon name="add" className="text-[20px]" />
          Crear Curso
        </Button>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 no-scrollbar">
        {chips.map(([value, label]) => (
          <Button
            key={value}
            variant={filter === value ? "default" : "secondary"}
            className="h-8 flex-shrink-0 rounded-full px-4 text-label-sm"
            onClick={() => onFilter(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-4 py-3">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <Icon name="tune" className="text-[18px]" />
          <span className="text-body-sm">3 cursos activos registrados</span>
        </div>
        <span className="text-label-sm font-semibold text-primary">Ciclo Lectivo 2025</span>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 tv:grid-cols-4 gap-4 tv:gap-8">
        {filteredCourses.map((course) => (
          <CourseCard key={course.title} course={course} onOpenCourse={onOpenCourse} onToast={onToast} />
        ))}
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-primary-fixed p-4 text-on-primary-fixed">
        <Icon name="calendar_today" className="text-[22px]" />
        <div>
          <h2 className="font-semibold">Validación de Aulas</h2>
          <p className="mt-1 text-body-sm">No se detectan solapamientos de horarios ni de docentes en el cronograma actual.</p>
        </div>
      </div>
    </section>
  );
}

function CourseCard({
  course,
  onOpenCourse,
  onToast,
}: {
  course: typeof courses[number];
  onOpenCourse: () => void;
  onToast: (message: string) => void;
}) {
  return (
    <article className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-secondary-container px-2 py-0.5 text-label-sm font-semibold text-on-secondary-container">{course.level}</span>
            <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-label-sm font-semibold text-on-primary-fixed">{course.tag}</span>
          </div>
          <h2 className="mt-2 text-headline-sm font-semibold">{course.title}</h2>
        </div>
        <Button aria-label="Opciones del curso" variant="ghost" size="icon" className="h-9 w-9 rounded-lg text-on-surface-variant">
          <Icon name="more_vert" className="text-[22px]" />
        </Button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <img alt="" className="h-11 w-11 flex-shrink-0 rounded-full object-cover shadow-sm" src={course.face} />
        <div className="min-w-0 flex-1">
          <p className="text-body-sm text-on-surface-variant">Docente a cargo</p>
          <p className="font-semibold">{course.teacher}</p>
        </div>
        <Button aria-label="Cambiar docente" variant="secondary" size="icon" className="h-8 w-8 rounded-lg" onClick={() => onToast("Asignación de docente actualizada")}> 
          <Icon name="swap_horiz" className="text-[19px]" />
        </Button>
      </div>

      <div className="mt-4 grid gap-2 text-body-sm text-on-surface-variant">
        <div className="flex items-center gap-2"><Icon name="schedule" className="text-[18px]" />{course.schedule}</div>
        <div className="flex items-center gap-2"><Icon name={course.icon} className="text-[18px]" />{course.room}</div>
      </div>

      <div className="mt-4 rounded-xl bg-surface-container-low p-3">
        <div className="flex items-center justify-between text-body-sm">
          <span className="text-on-surface-variant">{course.capacityLabel}</span>
          <span className="font-semibold">{course.occupancy}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-container-high">
          <div className="h-full w-3/4 rounded-full bg-primary" />
        </div>
        <p className="mt-2 text-body-sm text-primary">{course.note}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" className="h-10 flex-1 rounded-xl" onClick={onOpenCourse}>
          <Icon name="edit" className="text-[18px]" />
          Editar
        </Button>
        <Button className="h-10 flex-[1.5] rounded-xl">
          <Icon name="group" className="text-[18px]" />
          Alumnos ({course.count})
        </Button>
        <Button aria-label="Configuración rápida" variant="secondary" size="icon" className="h-10 w-10 rounded-xl">
          <Icon name="tune" className="text-[19px]" />
        </Button>
      </div>
    </article>
  );
}

function StudentsView({ onOpenStudent }: { onOpenStudent: () => void }) {
  return (
    <section className="flex flex-col gap-4 px-4 py-4 animate-edu-rise">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-headline-md font-semibold">Directorio de Estudiantes</h1>
          <div className="mt-1 flex gap-2 text-body-sm text-on-surface-variant">
            <span>482 activos</span>
            <span>•</span>
            <span>Ciclo Lectivo 2024</span>
          </div>
        </div>
        <Button className="h-10 rounded-xl px-3" onClick={onOpenStudent}>
          <Icon name="person_add" className="text-[20px]" />
          + Nuevo
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="flex h-11 flex-1 items-center gap-2 rounded-xl bg-surface-container-low px-3 text-on-surface-variant">
          <Icon name="search" className="text-[20px]" />
          <input aria-label="Buscar estudiantes" className="min-w-0 flex-1 bg-transparent text-on-surface outline-none" />
        </div>
        <Button aria-label="Filtros" variant="secondary" size="icon" className="h-11 w-11 rounded-xl">
          <Icon name="tune" className="text-[20px]" />
        </Button>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {["Todos (482)", "Primaria", "Secundaria", "Al día", "Pendiente pago"].map((chip, index) => (
          <Button key={chip} variant={index === 0 ? "default" : "secondary"} className="h-8 flex-shrink-0 rounded-full px-4 text-label-sm">
            {chip}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 tv:grid-cols-4 gap-3 tv:gap-8">
        <SmallStat icon="workspace_premium" label="Prom. Institucional" value="8.6" helper="+0.3" />
        <SmallStat icon="fact_check" label="Asistencia Global" value="94.8%" helper="" />
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 tv:grid-cols-4 gap-3 tv:gap-8">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-3 shadow-sm">
        <span className="text-body-sm text-on-surface-variant">Mostrando 3 de 482 registros</span>
        <div className="flex items-center gap-2">
          <Button aria-label="Página anterior" variant="secondary" size="icon" className="h-8 w-8 rounded-lg"><Icon name="chevron_left" className="text-[18px]" /></Button>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-label-sm font-semibold text-primary-foreground">1</span>
          <Button aria-label="Página siguiente" variant="secondary" size="icon" className="h-8 w-8 rounded-lg"><Icon name="chevron_right" className="text-[18px]" /></Button>
        </div>
      </div>
    </section>
  );
}

function SmallStat({ icon, label, value, helper }: { icon: string; label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        <Icon name={icon} className="text-[22px]" />
        <span className="text-body-sm text-on-surface-variant">{label}</span>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-metric-number font-bold">{value}</span>
        {helper && <span className="pb-1 text-label-sm font-semibold text-tertiary">{helper}</span>}
      </div>
    </div>
  );
}

function StudentCard({ student }: { student: typeof students[number] }) {
  const pending = student.status !== "Activo";
  return (
    <article className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex gap-3">
        <img alt="" className="h-16 w-16 rounded-2xl object-cover" src={student.image} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold">{student.name}</h2>
              <p className="text-body-sm text-on-surface-variant">ID: {student.id}</p>
            </div>
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-label-sm font-semibold ${pending ? "bg-secondary-container text-on-secondary-container" : "bg-tertiary-fixed text-on-tertiary-fixed"}`}>
              {pending && <Icon name="pending" className="text-[15px]" />}
              {student.status}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-body-sm text-on-surface-variant">Grado y Sección</p>
              <p className="font-semibold">{student.grade}</p>
            </div>
            <div>
              <p className="text-body-sm text-on-surface-variant">Rendimiento</p>
              <p className="flex items-center gap-1 font-semibold">
                <Icon name={student.trend} className="text-[18px] text-primary" />
                {student.score} <span className="text-body-sm text-on-surface-variant">/ 10</span>
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 text-body-sm text-on-surface-variant">
            {student.alert ? (
              <span className="flex items-center gap-1 text-destructive"><Icon name="warning" className="text-[17px]" />{student.alert}</span>
            ) : (
              <span className="flex items-center gap-1"><Icon name="person" className="text-[17px]" />Tutor: {student.tutor}</span>
            )}
            <div className="flex gap-1">
              <Button aria-label="Editar estudiante" variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Icon name="edit" className="text-[18px]" /></Button>
              <Button aria-label="Eliminar estudiante" variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-destructive"><Icon name="delete" className="text-[18px]" /></Button>
            </div>
          </div>
          <Button variant="secondary" className="mt-3 h-10 w-full rounded-xl">
            Ver ficha
            <Icon name="arrow_forward" className="text-[18px]" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function CourseModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <ModalShell onClose={onClose} title="Editar Curso" icon="edit_calendar">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <Field label="Nombre de la Asignatura"><input className="form-input" defaultValue="Matemáticas Avanzadas y Cálculo" /></Field>
        <Field label="Nivel Educativo"><select className="form-input" defaultValue="3° de Secundaria"><option>1° de Secundaria</option><option>2° de Secundaria</option><option>3° de Secundaria</option><option>4° de Secundaria</option><option>5° de Secundaria</option></select></Field>
        <Field label="Área"><select className="form-input" defaultValue="Ciencias"><option>Ciencias</option><option>Humanidades</option><option>Artes</option><option>Idiomas</option></select></Field>
        <Field label="Docente Titular"><select className="form-input"><option>Prof. Carlos Menéndez (Matemáticas)</option><option>Prof. Patricia Valenzuela (Literatura)</option><option>Dr. Roberto Salgado (Biología)</option><option>Lic. Andrea Morales (Historia)</option></select></Field>
        <Field label="Días y Horario"><input className="form-input" defaultValue="Lun y Mié • 08:00 - 09:30 hrs" /></Field>
        <Field label="Cupo Máximo"><input className="form-input" defaultValue="30" type="number" /></Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" className="h-11 rounded-xl px-4" onClick={onClose}>Cancelar</Button>
          <Button type="submit" className="h-11 rounded-xl px-5"><Icon name="check" className="text-[19px]" />Guardar Cambios</Button>
        </div>
      </form>
    </ModalShell>
  );
}

function StudentModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
  return (
    <ModalShell onClose={onClose} title="Nuevo Estudiante" icon="person_add" subtitle="Registro del ciclo escolar activo">
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-4 text-on-surface-variant">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high text-primary"><Icon name="add_a_photo" /></div>
          <div><p className="font-semibold text-on-surface">Fotografía Oficial</p><p className="text-body-sm">PNG o JPG hasta 5MB. Formato 1:1</p></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nombres *"><input className="form-input" /></Field>
          <Field label="Apellidos *"><input className="form-input" /></Field>
        </div>
        <Field label="Grado y Nivel *"><select className="form-input"><option>1° Primaria 'A'</option><option>2° Primaria 'A'</option><option>3° Primaria 'B'</option><option>4° Primaria 'A'</option><option>1° Secundaria 'A'</option><option>2° Secundaria 'B'</option></select></Field>
        <Field label="Estado Matrícula *"><select className="form-input"><option>Activo</option><option>Documento Pendiente</option><option>En Observación</option><option>Retirado Temporal</option></select></Field>
        <Field label="Tutor Responsable *"><div className="form-input flex items-center gap-2"><Icon name="family_restroom" className="text-[18px] text-on-surface-variant" /><input className="min-w-0 flex-1 bg-transparent outline-none" /></div></Field>
        <Field label="Teléfono de Contacto *"><div className="form-input flex items-center gap-2"><Icon name="call" className="text-[18px] text-on-surface-variant" /><input className="min-w-0 flex-1 bg-transparent outline-none" /></div></Field>
        <label className="flex items-start gap-2 text-body-sm text-on-surface-variant"><input className="mt-0.5 h-4 w-4 accent-primary" type="checkbox" />Enviar credenciales automáticas por SMS y correo electrónico al tutor</label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" className="h-11 rounded-xl px-4" onClick={onClose}>Cancelar</Button>
          <Button type="submit" className="h-11 rounded-xl px-5"><Icon name="save" className="text-[19px]" />Guardar Estudiante</Button>
        </div>
      </form>
    </ModalShell>
  );
}

function ModalShell({
  title,
  subtitle,
  icon,
  children,
  onClose,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-inverse-surface/60 px-3 pb-3 pt-12 backdrop-blur-sm">
      <div className="max-h-full w-full max-w-md md:max-w-2xl tv:max-w-4xl overflow-y-auto rounded-t-3xl md:rounded-3xl bg-surface-container-lowest p-5 shadow-lg animate-edu-rise">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-on-primary-fixed"><Icon name={icon} className="text-[22px]" /></div>
            <div><h2 className="text-headline-sm font-semibold">{title}</h2>{subtitle && <p className="text-body-sm text-on-surface-variant">{subtitle}</p>}</div>
          </div>
          <Button aria-label="Cerrar ventana" variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={onClose}><Icon name="close" className="text-[20px]" /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-label-md font-semibold">
      {label}
      {children}
    </label>
  );
}

function BottomNav({ active, onNavigate, role }: { active: View; onNavigate: (view: View) => void, role: Role }) {
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

function Sidebar({ active, onNavigate, role }: { active: View; onNavigate: (view: View) => void, role: Role }) {
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
          <Icon name="school" className="text-[28px] text-primary" />
          <span className="text-sm md:text-lg font-bold text-primary">Centro Educativo Adventista de Cartago</span>
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

function SimplePanel({ icon, title }: { icon: string; title: string }) {
  return (
    <section className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-3 px-8 text-center animate-edu-rise">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-on-primary-fixed"><Icon name={icon} className="text-[34px]" /></div>
      <h1 className="text-headline-md font-semibold">{title}</h1>
      <p className="text-body-md text-on-surface-variant">Módulo institucional conectado al panel principal.</p>
    </section>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed left-1/2 top-20 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full bg-inverse-surface px-4 py-3 text-inverse-on-surface shadow-lg animate-edu-rise">
      <Icon name="check_circle" className="text-[20px] text-tertiary-fixed" />
      <span className="text-label-md font-semibold">{message}</span>
    </div>
  );
}

function TeachersView({}: {}) {
  return (
    <section className="flex flex-col gap-4 px-4 py-4 animate-edu-rise">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-headline-md font-semibold">Directorio de Profesores</h1>
          <div className="mt-1 flex gap-2 text-body-sm text-on-surface-variant">
            <span>{teachersMock.length} registrados</span>
            <span>•</span>
            <span>Ciclo Lectivo 2024</span>
          </div>
        </div>
        <Button className="h-10 rounded-xl px-3" onClick={() => undefined}>
          <Icon name="person_add" className="text-[20px]" />
          + Nuevo
        </Button>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 tv:grid-cols-4 gap-3 tv:gap-8 mt-4">
        {teachersMock.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </section>
  );
}

function TeacherCard({ teacher }: { teacher: typeof teachersMock[number] }) {
  const pending = teacher.status !== "Activo";
  return (
    <article className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex gap-3">
        <img alt="" className="h-16 w-16 rounded-2xl object-cover" src={teacher.image} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold">{teacher.name}</h2>
              <p className="text-body-sm text-on-surface-variant">ID: {teacher.id}</p>
            </div>
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-label-sm font-semibold ${pending ? "bg-secondary-container text-on-secondary-container" : "bg-tertiary-fixed text-on-tertiary-fixed"}`}>
              {teacher.status}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <p className="text-body-sm text-on-surface-variant">Especialidad</p>
              <p className="font-semibold">{teacher.subject}</p>
            </div>
            <div>
              <p className="text-body-sm text-on-surface-variant">Calificación</p>
              <p className="flex items-center gap-1 font-semibold">
                <Icon name="star" className="text-[18px] text-primary" />
                {teacher.rating} <span className="text-body-sm text-on-surface-variant">/ 5</span>
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 text-body-sm text-on-surface-variant">
            <span className="flex items-center gap-1"><Icon name="menu_book" className="text-[17px]" />Cursos asignados: {teacher.classes}</span>
            <div className="flex gap-1">
              <Button aria-label="Editar docente" variant="ghost" size="icon" className="h-8 w-8 rounded-lg"><Icon name="edit" className="text-[18px]" /></Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function TeacherDashboardView() {
  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1 text-headline-md font-semibold">
            Hola, Prof. Ana García <span aria-hidden="true">👋</span>
          </div>
          <div className="mt-2 text-headline-sm font-semibold">
            Panel Principal
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 tv:grid-cols-3 gap-4 tv:gap-6 mt-2">
        {/* Mis Cursos Activos */}
        <div className="flex flex-col gap-5 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
          <h2 className="text-headline-sm font-semibold">Mis Cursos Activos</h2>
          <div className="flex flex-col gap-5">
            <div>
              <div className="flex justify-between text-body-md font-semibold mb-2">
                <span>Matemáticas 4A</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full bg-primary w-[40%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body-md font-semibold mb-2">
                <span>Física 5B</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full bg-primary w-[80%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body-md font-semibold mb-2">
                <span>Física JC</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full bg-primary w-[35%] rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body-md font-semibold mb-2">
                <span>Química 3A</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                <div className="h-full bg-primary w-[65%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Próximas Clases */}
          <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
            <h2 className="text-headline-sm font-semibold">Próximas Clases</h2>
            <p className="text-body-md font-medium text-on-surface-variant">Hoy (Matemáticas 4A, Aula 102)</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-high p-3">
                <span className="text-body-sm text-on-surface-variant">Hoy</span>
                <span className="font-semibold mt-1">10:00</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-high p-3">
                <span className="text-body-sm text-on-surface-variant">Mar</span>
                <span className="font-semibold mt-1">12:00</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl bg-surface-container-high p-3">
                <span className="text-body-sm text-on-surface-variant">Mar</span>
                <span className="font-semibold mt-1">13:00</span>
              </div>
            </div>
            <p className="text-body-sm font-medium mt-1">Mañana (Matemáticas 4A, 16:00)</p>
          </div>

          {/* Alertas de Calificaciones Pendientes */}
          <div className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
            <h2 className="text-headline-sm font-semibold">Alertas de Calificaciones Pendientes</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-body-md flex-1">Revisión final de Química 3A lista para ser grabada</p>
                <Icon name="warning" className="text-[24px] text-tertiary" />
              </div>
              <div className="flex items-start justify-between gap-3">
                <p className="text-body-md flex-1">Trabajo de Física 5C listo para ser grabado</p>
                <Icon name="warning" className="text-[24px] text-tertiary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Anuncios Institucionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 tv:grid-cols-3 mt-2">
        <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm col-span-1 md:col-span-2 tv:col-span-3">
          <h2 className="text-headline-sm font-semibold mb-4">Anuncios Institucionales</h2>
          <div className="flex items-center gap-3 rounded-xl bg-primary-container p-4 text-on-primary-container">
            <Icon name="verified_user" className="text-[24px] shrink-0" />
            <p className="text-body-md leading-relaxed">Acceso a métricas globales, nómina y configuración institucional. Acceso a métricas globales, nómina y configuración institucional.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const recentTeacherUploads = [
  {
    id: "up-1",
    teacherName: "Prof. Carlos Menéndez",
    subject: "Matemáticas 4A",
    fileType: "PDF",
    fileName: "Examen Parcial 1.pdf",
    time: "Hace 2 horas",
    icon: "picture_as_pdf"
  },
  {
    id: "up-2",
    teacherName: "Prof. Ana García",
    subject: "Química 3A",
    fileType: "DOCX",
    fileName: "Syllabus_2025.docx",
    time: "Hace 5 horas",
    icon: "description"
  },
  {
    id: "up-3",
    teacherName: "Dr. Roberto Salgado",
    subject: "Biología 2B",
    fileType: "XLSX",
    fileName: "Registro_Notas_Q1.xlsx",
    time: "Ayer",
    icon: "table"
  }
];

function AdminSupervisionView() {
  const groupedUploads = recentTeacherUploads.reduce((acc, upload) => {
    if (!acc[upload.subject]) acc[upload.subject] = [];
    acc[upload.subject].push(upload);
    return acc;
  }, {} as Record<string, typeof recentTeacherUploads>);

  return (
    <section className="flex flex-col gap-5 px-4 py-4 animate-edu-rise">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
        <div>
          <h1 className="text-headline-md font-semibold">Supervisión Docente</h1>
          <p className="mt-1 text-body-sm text-on-surface-variant">Registro de actividad reciente subdividida por materias.</p>
        </div>
        <Button variant="secondary" className="h-10 rounded-xl px-4">
          <Icon name="filter_list" className="text-[20px]" />
          Filtros
        </Button>
      </div>

      <div className="flex flex-col gap-8 mt-4 max-w-5xl">
        {Object.entries(groupedUploads).map(([subject, uploads]) => (
          <div key={subject} className="flex flex-col gap-4">
            <h2 className="text-title-lg font-bold flex items-center gap-2 text-primary">
              <Icon name="folder_open" className="text-[24px]" />
              {subject}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploads.map((upload) => (
                <div key={upload.id} className="flex flex-col justify-between gap-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm border border-outline-variant/30">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-fixed text-primary shadow-sm">
                      <Icon name={upload.icon} className="text-[24px]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-body-lg line-clamp-1">{upload.fileName}</h3>
                      <p className="text-body-sm text-on-surface-variant mt-1">
                        Subido por <span className="font-medium text-on-surface">{upload.teacherName}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="rounded-full bg-secondary-container px-2 py-0.5 text-label-sm font-semibold text-on-secondary-container">{upload.fileType}</span>
                        <span className="text-label-sm text-primary">{upload.time}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="h-10 rounded-xl px-4 text-sm w-full">
                    <Icon name="visibility" className="text-[20px]" />
                    Ver Documento
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
