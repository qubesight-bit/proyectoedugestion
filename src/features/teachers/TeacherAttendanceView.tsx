import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";

export function TeacherAttendanceView() {
  return (
    <section className="flex flex-col gap-4 px-4 py-4 animate-edu-rise pb-28 md:pb-4 relative min-h-screen bg-[#F8F9FE]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" className="h-10 rounded-xl bg-[#EAEFFF] text-[#165BDB] px-3 font-semibold hover:bg-[#EAEFFF]/80">
          <Icon name="grid_view" className="text-[18px] mr-1" />
          Matemáticas 4A
          <Icon name="expand_more" className="text-[20px] ml-1" />
        </Button>
        <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm border border-slate-100">
          <span className="h-2 w-2 rounded-full bg-teal-600"></span>
          Aula 204
        </span>
      </div>

      {/* Date Card */}
      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 mt-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAEFFF] text-[#165BDB]">
            <Icon name="calendar_today" className="text-[24px]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              SESIÓN ACTUAL
            </span>
            <span className="text-lg font-bold text-slate-800 leading-tight">
              Hoy, 24 Octubre<br/>2024
            </span>
          </div>
        </div>
        <Button variant="outline" className="h-9 rounded-xl border-slate-200 text-[#165BDB] px-3 text-xs font-bold hover:bg-slate-50">
          Cambiar
          <Icon name="edit_calendar" className="text-[16px] ml-1" />
        </Button>
      </div>

      {/* Stats Card */}
      <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Circular Progress Mock */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-[4px] border-teal-500 bg-teal-50">
              <span className="text-sm font-bold text-teal-800">91%</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-800 leading-tight">32 / 35 Alumnos</span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 mt-0.5">
                <Icon name="trending_up" className="text-[14px]" />
                Alta concurrencia hoy
              </span>
            </div>
          </div>
          <Button className="h-9 rounded-xl bg-[#62E3CC] text-teal-950 px-3 text-xs font-bold hover:bg-[#62E3CC]/90">
            <Icon name="done_all" className="text-[16px] mr-1" />
            Todos P
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#F0FDF4] py-2 border border-emerald-100">
            <span className="text-sm font-bold text-emerald-600">32</span>
            <span className="text-[9px] text-emerald-800 mt-0.5">Presentes</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#FEF2F2] py-2 border border-red-100">
            <span className="text-sm font-bold text-red-600">1</span>
            <span className="text-[9px] text-red-800 mt-0.5">Ausente</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#FFF7ED] py-2 border border-orange-100">
            <span className="text-sm font-bold text-orange-600">1</span>
            <span className="text-[9px] text-orange-800 mt-0.5">Tardanza</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#EFF6FF] py-2 border border-blue-100">
            <span className="text-sm font-bold text-[#165BDB]">1</span>
            <span className="text-[9px] text-blue-800 mt-0.5">Justif.</span>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Icon name="analytics" className="text-[18px] text-[#165BDB]" />
            Resumen Institucional
          </div>
          <span className="text-[10px] font-bold text-[#165BDB]">Oficial</span>
        </div>
        <div className="h-16 w-full rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200">
           {/* Mock image content */}
           <div className="absolute inset-0 bg-slate-200 opacity-50"></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="flex gap-2 w-full px-4 opacity-30">
               <div className="h-10 flex-1 bg-white rounded-lg"></div>
               <div className="h-10 flex-1 bg-white rounded-lg"></div>
               <div className="h-10 flex-1 bg-white rounded-lg"></div>
             </div>
           </div>
        </div>
      </div>

      {/* List Header */}
      <div className="flex justify-between items-end mt-2 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-800">Lista de Alumnos</h2>
          <span className="rounded-full bg-[#EAEFFF] px-2 py-0.5 text-[10px] font-bold text-[#165BDB]">7 mostrados</span>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <Icon name="touch_app" className="text-[14px]" />
          Toca para cambiar
        </span>
      </div>

      {/* Students List */}
      <div className="flex flex-col gap-3 mt-1">
        
        {/* Student 1 - Present */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A5F3E4] text-sm font-bold text-teal-900">CG</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">García, Carlos</span>
              <span className="text-[10px] text-slate-500 mt-0.5">ID: #4012 • 98% asist.</span>
            </div>
          </div>
          <div className="flex gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#62E3CC] text-teal-950 shadow-sm"><Icon name="check" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="close" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="schedule" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="gpp_maybe" className="text-[18px]" /></button>
          </div>
        </div>

        {/* Student 2 - Present */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#A5F3E4] text-sm font-bold text-teal-900">ML</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">López, María</span>
              <span className="text-[10px] text-slate-500 mt-0.5">ID: #4018 • 100% asist.</span>
            </div>
          </div>
          <div className="flex gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#62E3CC] text-teal-950 shadow-sm"><Icon name="check" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="close" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="schedule" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="gpp_maybe" className="text-[18px]" /></button>
          </div>
        </div>

        {/* Student 3 - Absent */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-red-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-900">MM</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">Marián, Mesías</span>
              <span className="text-[10px] font-bold text-red-600 mt-0.5">Sin aviso previo</span>
            </div>
          </div>
          <div className="flex gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="check" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-700 shadow-sm border border-red-200"><Icon name="close" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="schedule" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="gpp_maybe" className="text-[18px]" /></button>
          </div>
        </div>

        {/* Student 4 - Late */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-orange-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFEBD6] text-sm font-bold text-orange-900">GM</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">García, Mario</span>
              <span className="text-[10px] font-bold text-orange-600 mt-0.5">Llegada: +15 min</span>
            </div>
          </div>
          <div className="flex gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="check" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="close" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFEBD6] text-orange-800 shadow-sm border border-orange-200"><Icon name="schedule" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="gpp_maybe" className="text-[18px]" /></button>
          </div>
        </div>

        {/* Student 5 - Excused */}
        <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-blue-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAEFFF] text-sm font-bold text-[#165BDB]">JM</div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">Jemtio, María</span>
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#165BDB] mt-0.5"><Icon name="description" className="text-[12px]" />Certif. médico</span>
            </div>
          </div>
          <div className="flex gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="check" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="close" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><Icon name="schedule" className="text-[18px]" /></button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#165BDB] text-white shadow-sm"><Icon name="gpp_maybe" className="text-[18px]" /></button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-[80px] left-0 right-0 p-4 bg-gradient-to-t from-[#F8F9FE] via-[#F8F9FE] to-transparent z-10 flex flex-col items-center">
        <Button className="h-12 w-full rounded-xl bg-[#165BDB] text-sm font-bold px-6 shadow-lg shadow-[#165BDB]/20 hover:bg-[#165BDB]/90">
          <Icon name="check_circle" className="text-[20px] mr-2" />
          Finalizar Registro
        </Button>
        <span className="text-[10px] text-slate-500 mt-2">Los datos se sincronizan con la secretaría académica</span>
      </div>
      {/* Extra padding */}
      <div className="h-16"></div>
    </section>
  );
}
