import { Button } from "@/components/ui/button";
import { Icon, QuickAction, MetricCard, Announcement } from "../../components/shared";
import { chartBars, announcementImages } from "../../services/mockData";

export function DashboardView({ onCourses, onStudents }: { onCourses: () => void; onStudents: () => void }) {
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

export function TeacherDashboardView() {
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
          </div>
        </div>
      </div>
    </section>
  );
}
