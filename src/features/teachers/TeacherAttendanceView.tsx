import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";

export function TeacherAttendanceView() {
  return (
    <section className="flex flex-col gap-space-md px-margin py-4 animate-edu-rise pb-24 lg:ml-64 relative min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" className="h-10 rounded-xl bg-primary-fixed text-primary px-3 text-label-md hover:bg-primary-fixed-dim">
          <Icon name="grid_view" className="text-[18px] mr-1" />
          Matemáticas 4A
          <Icon name="expand_more" className="text-[20px] ml-1" />
        </Button>
        <span className="flex items-center gap-1.5 rounded-full bg-surface-container-lowest px-3 py-1.5 text-label-sm text-on-surface shadow-sm border border-border-soft">
          <span className="h-2 w-2 rounded-full bg-secondary animate-pulse"></span>
          Aula 204
        </span>
      </div>

      {/* Date Card */}
      <div className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-border-soft mt-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
            <Icon name="calendar_today" className="text-[24px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-label-sm tracking-wide text-muted uppercase">
              SESIÓN ACTUAL
            </span>
            <span className="text-headline-md text-on-surface leading-tight">
              Hoy, 24 Octubre<br/>2024
            </span>
          </div>
        </div>
        <Button variant="outline" className="h-9 rounded-xl border-border-soft text-primary px-3 text-label-md hover:bg-surface-container">
          Cambiar
          <Icon name="edit_calendar" className="text-[16px] ml-1" />
        </Button>
      </div>

      {/* Stats Card */}
      <div className="flex flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-border-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Circular Progress Mock */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-success bg-success-soft">
              <span className="text-label-md text-success">91%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-headline-md text-on-surface leading-tight">32 / 35 Alumnos</span>
              <span className="flex items-center gap-1 text-label-sm text-success mt-0.5">
                <Icon name="trending_up" className="text-[14px]" />
                Alta concurrencia hoy
              </span>
            </div>
          </div>
          <Button className="h-9 rounded-xl bg-success-soft text-success px-3 text-label-md hover:bg-success/20">
            <Icon name="done_all" className="text-[16px] mr-1" />
            Todos P
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center justify-center rounded-xl bg-success-soft py-2 border border-border-soft">
            <span className="text-headline-md text-success">32</span>
            <span className="text-label-sm text-success mt-0.5">Presentes</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-danger-soft py-2 border border-border-soft">
            <span className="text-headline-md text-danger">1</span>
            <span className="text-label-sm text-danger mt-0.5">Ausente</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-warning-soft py-2 border border-border-soft">
            <span className="text-headline-md text-warning">1</span>
            <span className="text-label-sm text-warning mt-0.5">Tardanza</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-primary-fixed py-2 border border-border-soft">
            <span className="text-headline-md text-primary">1</span>
            <span className="text-label-sm text-primary mt-0.5">Justif.</span>
          </div>
        </div>
      </div>

      {/* List Header */}
      <div className="flex justify-between items-end mt-2 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-headline-lg text-on-surface">Lista de Alumnos</h2>
          <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-label-sm text-primary">7 mostrados</span>
        </div>
        <span className="flex items-center gap-1 text-body-sm text-muted font-medium">
          <Icon name="touch_app" className="text-[14px]" />
          Toca para cambiar
        </span>
      </div>

      {/* Students List */}
      <div className="flex flex-col gap-3 mt-1">
        
        {/* Student 1 - Present */}
        <div className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-3 shadow-sm border border-border-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-fixed text-on-secondary-fixed text-headline-md">CG</div>
            <div className="flex flex-col">
              <span className="text-headline-md text-on-surface leading-tight">García, Carlos</span>
              <span className="text-body-sm text-muted mt-0.5">ID: #4012 • 98% asist.</span>
            </div>
          </div>
          <div className="flex gap-1 bg-surface-container-low rounded-xl p-1 border border-border-soft">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-success text-white shadow-sm"><Icon name="check" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="close" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="schedule" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="gpp_maybe" className="text-[18px]" /></button>
          </div>
        </div>

        {/* Student 3 - Absent */}
        <div className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-3 shadow-sm border border-border-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error-container text-on-error-container text-headline-md">MM</div>
            <div className="flex flex-col">
              <span className="text-headline-md text-on-surface leading-tight">Marián, Mesías</span>
              <span className="text-body-sm font-bold text-danger mt-0.5">Sin aviso previo</span>
            </div>
          </div>
          <div className="flex gap-1 bg-surface-container-low rounded-xl p-1 border border-border-soft">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="check" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger text-white shadow-sm"><Icon name="close" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="schedule" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="gpp_maybe" className="text-[18px]" /></button>
          </div>
        </div>

        {/* Student 4 - Late */}
        <div className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-3 shadow-sm border border-border-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning text-headline-md">GM</div>
            <div className="flex flex-col">
              <span className="text-headline-md text-on-surface leading-tight">García, Mario</span>
              <span className="text-body-sm font-bold text-warning mt-0.5">Llegada: +15 min</span>
            </div>
          </div>
          <div className="flex gap-1 bg-surface-container-low rounded-xl p-1 border border-border-soft">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="check" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="close" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning text-white shadow-sm"><Icon name="schedule" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="gpp_maybe" className="text-[18px]" /></button>
          </div>
        </div>

        {/* Student 5 - Excused */}
        <div className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-3 shadow-sm border border-border-soft">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-primary text-headline-md">JM</div>
            <div className="flex flex-col">
              <span className="text-headline-md text-on-surface leading-tight">Jemtio, María</span>
              <span className="flex items-center gap-0.5 text-body-sm font-bold text-primary mt-0.5"><Icon name="description" className="text-[12px]" />Certif. médico</span>
            </div>
          </div>
          <div className="flex gap-1 bg-surface-container-low rounded-xl p-1 border border-border-soft">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="check" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="close" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface-container"><Icon name="schedule" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-white shadow-sm"><Icon name="gpp_maybe" className="text-[18px]" /></button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-[80px] left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent z-10 flex flex-col items-center lg:ml-64">
        <Button className="h-12 w-full max-w-md rounded-xl bg-primary text-white text-label-md font-bold px-6 shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.99] transition-all">
          <Icon name="check_circle" className="text-[20px] mr-2" />
          Finalizar Registro
        </Button>
        <span className="text-body-sm text-muted mt-2">Los datos se sincronizan con la secretaría académica</span>
      </div>
      {/* Extra padding */}
      <div className="h-16"></div>
    </section>
  );
}
