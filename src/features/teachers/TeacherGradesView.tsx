import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";

export function TeacherGradesView() {
  return (
    <section className="flex flex-col gap-4 px-4 py-4 animate-edu-rise pb-24 md:pb-4 relative min-h-screen bg-[#F8F9FE]">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
          PERÍODO ACADÉMICO 2024-II
        </span>
        <div className="flex items-center justify-between">
          <Button variant="secondary" className="h-10 rounded-xl bg-[#EAEFFF] text-[#165BDB] px-3 font-semibold hover:bg-[#EAEFFF]/80">
            <Icon name="menu_book" className="text-[18px] mr-1" />
            Matemáticas 4A
            <Icon name="expand_more" className="text-[20px] ml-1" />
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200 bg-white">
              <Icon name="search" className="text-[20px] text-slate-600" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200 bg-white">
              <Icon name="download" className="text-[20px] text-slate-600" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar mt-1">
        <Button className="h-9 flex-shrink-0 rounded-full px-5 text-sm font-semibold bg-white border border-slate-200 text-slate-800 shadow-sm">
          Examen Parcial 1
        </Button>
        <Button variant="secondary" className="h-9 flex-shrink-0 rounded-full px-5 text-sm font-semibold bg-white/60 border border-transparent text-slate-500">
          Proyecto 1
        </Button>
        <Button variant="secondary" className="h-9 flex-shrink-0 rounded-full px-5 text-sm font-semibold bg-white/60 border border-transparent text-slate-500">
          Examen Parcial 2
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="flex flex-col rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[11px] font-semibold">Promedio</span>
            <Icon name="trending_up" className="text-[16px] text-[#165BDB]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800">84.2</div>
          <div className="text-[10px] font-semibold text-emerald-600 mt-1">+2.4 vs P1</div>
        </div>
        
        <div className="flex flex-col rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start text-slate-500">
            <span className="text-[11px] font-semibold">Entregas</span>
            <Icon name="fact_check" className="text-[16px] text-teal-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-800">33<span className="text-sm font-normal text-slate-400">/35</span></div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
            <div className="h-full w-[94%] rounded-full bg-teal-600"></div>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl bg-[#FFEBD6] p-3 shadow-sm border border-orange-200 text-orange-900">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-semibold">Pendientes</span>
            <Icon name="warning" className="text-[16px]" />
          </div>
          <div className="mt-1 text-xl font-bold">2<br/>Alertas</div>
          <div className="text-[10px] font-semibold mt-1 opacity-80">Revisión lista</div>
        </div>
      </div>

      {/* Sync Banner */}
      <div className="rounded-2xl bg-white p-3 shadow-sm border border-slate-100 mt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Icon name="verified" className="text-[18px] text-[#165BDB]" />
            Planilla Oficial Sincronizada
          </div>
          <span className="rounded-full bg-[#A5F3E4] px-2 py-0.5 text-[10px] font-bold text-teal-900">Activa</span>
        </div>
        <div className="h-20 w-full rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200">
          <div className="absolute inset-0 bg-gradient-to-r from-[#165BDB]/10 to-transparent flex items-center p-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm border border-white">
              6 de 35 cargados
            </div>
            <div className="ml-auto bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-bold text-[#165BDB] shadow-sm border border-white flex items-center gap-1">
              <Icon name="cloud_sync" className="text-[14px]" />
              10:42 AM
            </div>
          </div>
        </div>
      </div>

      {/* List Header */}
      <div className="flex justify-between items-end mt-4 px-1">
        <h2 className="text-sm font-bold text-slate-500 tracking-wider">LISTADO DE<br/>CALIFICACIONES</h2>
        <span className="text-[11px] text-[#165BDB] font-medium text-right max-w-[120px] leading-tight">Toca una tarjeta para detallar</span>
      </div>

      {/* Students List */}
      <div className="flex flex-col gap-3 mt-2">
        
        {/* Student 1 */}
        <div className="rounded-[1.5rem] bg-white p-4 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAEFFF] text-sm font-bold text-[#165BDB]">GC</div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight">García, Carlos</h3>
                <span className="text-[11px] text-slate-400">ID: 2024-4A01</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-slate-800">70</span>
              <span className="rounded-full bg-[#A5F3E4] px-2 py-0.5 text-[9px] font-bold text-teal-900 uppercase">Aprobado</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 rounded-xl p-2 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Parcial 1</span>
              <span className="text-xs font-bold text-red-600">50</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Proyecto 1</span>
              <span className="text-xs font-bold text-slate-700">75</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Parcial 2</span>
              <span className="text-xs font-bold text-slate-700">75</span>
            </div>
          </div>
        </div>

        {/* Student 2 */}
        <div className="rounded-[1.5rem] bg-white p-4 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#62E3CC] text-sm font-bold text-teal-900">LM</div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight">López, María</h3>
                <span className="text-[11px] text-slate-400">ID: 2024-4A02</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-teal-600">95</span>
              <span className="rounded-full bg-[#A5F3E4] px-2 py-0.5 text-[9px] font-bold text-teal-900 uppercase">Destacado</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 rounded-xl p-2 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Parcial 1</span>
              <span className="text-xs font-bold text-teal-600">95</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Proyecto 1</span>
              <span className="text-xs font-bold text-teal-600">90</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Parcial 2</span>
              <span className="text-xs font-bold text-teal-600">95</span>
            </div>
          </div>
        </div>

        {/* Student 3 */}
        <div className="rounded-[1.5rem] bg-white p-4 shadow-sm border border-red-100">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-900">MS</div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight">Marín, Sapor</h3>
                <span className="text-[11px] text-slate-400">ID: 2024-4A03</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-red-600">58</span>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[9px] font-bold text-red-700 uppercase flex items-center gap-0.5">
                <Icon name="warning" className="text-[10px]" />
                En riesgo
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 bg-red-50/50 rounded-xl p-2 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Parcial 1</span>
              <span className="text-xs font-bold text-red-600">60</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Proyecto 1</span>
              <span className="text-xs font-bold text-red-600">50</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Parcial 2</span>
              <span className="text-xs font-bold text-red-600">50</span>
            </div>
          </div>
        </div>

        {/* Student 4 */}
        <div className="rounded-[1.5rem] bg-white p-4 shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAEFFF] text-sm font-bold text-[#165BDB]">GC</div>
              <div>
                <h3 className="font-bold text-slate-800 leading-tight">Garés, Carlos</h3>
                <span className="text-[11px] text-slate-400">ID: 2024-4A04</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-slate-800">90</span>
              <span className="rounded-full bg-[#A5F3E4] px-2 py-0.5 text-[9px] font-bold text-teal-900 uppercase">Aprobado</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 rounded-xl p-2 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Parcial 1</span>
              <span className="text-xs font-bold text-slate-700">85</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Proyecto 1</span>
              <span className="text-xs font-bold text-slate-700">90</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block mb-1">Parcial 2</span>
              <span className="text-xs font-bold text-slate-700">92</span>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Save Button Area */}
      <div className="fixed bottom-[80px] left-0 right-0 p-4 bg-gradient-to-t from-[#F8F9FE] via-[#F8F9FE] to-transparent z-10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500">Planilla activa</span>
          <span className="text-xs font-bold text-slate-800">Total alumnos: 35</span>
        </div>
        <Button className="h-12 rounded-xl bg-[#165BDB] text-sm font-bold px-6 shadow-md shadow-[#165BDB]/20 hover:bg-[#165BDB]/90">
          <Icon name="cloud_upload" className="text-[20px] mr-2" />
          Guardar Cambios
        </Button>
      </div>
      {/* Extra padding for the floating button */}
      <div className="h-16"></div>
    </section>
  );
}
