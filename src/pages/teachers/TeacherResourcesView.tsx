import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";

export function TeacherResourcesView() {
  return (
    <section className="flex flex-col gap-4 px-4 py-4 animate-edu-rise pb-24 md:pb-4 bg-[#F8F9FE] min-h-screen">
      {/* Course Pills */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar">
        <Button className="h-9 flex-shrink-0 rounded-full px-5 text-sm font-semibold bg-[#165BDB] hover:bg-[#165BDB]/90">
          <Icon name="grid_view" className="text-[16px] mr-1.5" />
          Todos los cursos
        </Button>
        <Button variant="secondary" className="h-9 flex-shrink-0 rounded-full px-5 text-sm font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm">
          Matemáticas 4A
        </Button>
        <Button variant="secondary" className="h-9 flex-shrink-0 rounded-full px-5 text-sm font-semibold bg-white border border-slate-200 text-slate-600 shadow-sm">
          Química 3A
        </Button>
      </div>

      {/* Search and Upload */}
      <div className="flex gap-2 mt-1">
        <div className="flex h-12 flex-1 items-center gap-2 rounded-2xl bg-white px-4 text-on-surface-variant shadow-sm border border-slate-100">
          <Icon name="search" className="text-[20px] text-slate-400" />
          <input
            aria-label="Buscar guías"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Buscar guías, lecturas, exámenes..."
          />
        </div>
        <Button size="icon" className="h-12 w-12 rounded-2xl bg-[#165BDB] hover:bg-[#165BDB]/90 shadow-sm">
          <Icon name="cloud_upload" className="text-[24px]" />
        </Button>
      </div>

      {/* Storage Card */}
      <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-slate-100 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <Icon name="cloud" className="text-[18px] text-[#165BDB]" />
            Espacio en nube institucional
          </div>
          <span className="text-xs font-bold text-[#165BDB]">28.4%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-100">
          <div className="h-full w-[28.4%] rounded-full bg-[#165BDB]"></div>
        </div>
        <div className="flex justify-between text-[10px] font-medium mt-1">
          <span className="text-slate-500">14.2 GB de 50 GB utilizados</span>
          <span className="text-emerald-600">35.8 GB libres</span>
        </div>
      </div>

      {/* Sync Banner */}
      <div className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative">
            {/* Mock image content */}
            <div className="absolute inset-0 bg-blue-50/50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon name="description" className="text-[24px] text-slate-300" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold tracking-wider text-[#165BDB] uppercase">
              REPOSITORIO DOCENTE
            </span>
            <span className="text-sm font-bold text-slate-800 leading-tight">Sincronizado con Drive</span>
            <span className="text-[10px] text-slate-500 mt-0.5">Último respaldo automático: Hoy 08...</span>
          </div>
        </div>
        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-[#EAEFFF] text-[#165BDB]">
          <Icon name="sync" className="text-[16px]" />
        </Button>
      </div>

      {/* Folders Section */}
      <div className="mt-2">
        <div className="flex items-end justify-between px-1 mb-3">
          <h2 className="text-lg font-bold text-slate-800">Carpetas de Estudio</h2>
          <span className="text-[11px] text-slate-500 font-medium">4 carpetas</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Folder 1 */}
          <div className="flex flex-col justify-between h-[120px] rounded-2xl bg-white p-4 shadow-sm border border-slate-100 relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAEFFF] text-[#165BDB]">
              <Icon name="menu_book" className="text-[20px]" />
            </div>
            <Icon name="chevron_right" className="absolute top-4 right-4 text-[18px] text-slate-400" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">Guías de<br/>Estudio</span>
              <span className="text-[10px] text-slate-500 mt-1">12 archivos</span>
            </div>
          </div>
          
          {/* Folder 2 */}
          <div className="flex flex-col justify-between h-[120px] rounded-2xl bg-white p-4 shadow-sm border border-slate-100 relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFEBD6] text-orange-800">
              <Icon name="quiz" className="text-[20px]" />
            </div>
            <Icon name="chevron_right" className="absolute top-4 right-4 text-[18px] text-slate-400" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">Exámenes y<br/>Pautas</span>
              <span className="text-[10px] text-slate-500 mt-1">8 archivos</span>
            </div>
          </div>

          {/* Folder 3 */}
          <div className="flex flex-col justify-between h-[120px] rounded-2xl bg-white p-4 shadow-sm border border-slate-100 relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A5F3E4] text-teal-800">
              <Icon name="slideshow" className="text-[20px]" />
            </div>
            <Icon name="chevron_right" className="absolute top-4 right-4 text-[18px] text-slate-400" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">Presentaciones</span>
              <span className="text-[10px] text-slate-500 mt-1">15 diapositivas</span>
            </div>
          </div>

          {/* Folder 4 */}
          <div className="flex flex-col justify-between h-[120px] rounded-2xl bg-white p-4 shadow-sm border border-slate-100 relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E6EEFF] text-[#165BDB]">
              <Icon name="science" className="text-[20px]" />
            </div>
            <Icon name="chevron_right" className="absolute top-4 right-4 text-[18px] text-slate-400" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800 leading-tight">Talleres<br/>Prácticos</span>
              <span className="text-[10px] text-slate-500 mt-1">6 archivos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Materials */}
      <div className="mt-2">
        <div className="flex items-center justify-between px-1 mb-3">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Material de Apoyo Reciente <span className="h-2 w-2 rounded-full bg-teal-500"></span>
          </h2>
          <span className="text-[11px] text-[#165BDB] font-bold">Ver todos</span>
        </div>

        <div className="flex flex-col gap-3">
          
          {/* File 1 */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFE2E2] text-red-600">
                <Icon name="picture_as_pdf" className="text-[24px]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-bold text-slate-800 truncate">Guía_Ecuaciones_Cua...</span>
                  <span className="rounded-full bg-[#EAEFFF] px-2 py-0.5 text-[9px] font-bold text-[#165BDB] shrink-0">Matemáticas 4A</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">2.4 MB • Subido ayer</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <Icon name="verified_user" className="text-[14px]" /> Visible para alumnos
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="download" className="text-[18px]" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="share" className="text-[18px]" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="more_vert" className="text-[18px]" /></Button>
              </div>
            </div>
          </div>

          {/* File 2 */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAEFFF] text-[#165BDB]">
                <Icon name="description" className="text-[24px]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-bold text-slate-800 truncate">Laboratorio_Química_Reac...</span>
                  <span className="rounded-full bg-[#A5F3E4] px-2 py-0.5 text-[9px] font-bold text-teal-900 shrink-0">Química 3A</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">1.1 MB • Subido hace 3 días</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                <Icon name="lock" className="text-[14px]" /> Borrador docente
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="download" className="text-[18px]" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="share" className="text-[18px]" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="more_vert" className="text-[18px]" /></Button>
              </div>
            </div>
          </div>

          {/* File 3 */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFEBD6] text-orange-600">
                <Icon name="slideshow" className="text-[24px]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-bold text-slate-800 truncate">Diapositivas_Leyes_Newton_...</span>
                  <span className="rounded-full bg-[#EAEFFF] px-2 py-0.5 text-[9px] font-bold text-slate-600 shrink-0">Física 5B</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">8.7 MB • Subido hace 1 sem</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <Icon name="verified_user" className="text-[14px]" /> Visible para alumnos
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="download" className="text-[18px]" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="share" className="text-[18px]" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="more_vert" className="text-[18px]" /></Button>
              </div>
            </div>
          </div>

          {/* File 4 */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFE2E2] text-red-600">
                <Icon name="picture_as_pdf" className="text-[24px]" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-sm font-bold text-slate-800 truncate">Formulario_Oficial_Trig...</span>
                  <span className="rounded-full bg-[#EAEFFF] px-2 py-0.5 text-[9px] font-bold text-[#165BDB] shrink-0">Matemáticas 4A</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1">850 KB • Subido 12 Oct</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                <Icon name="verified_user" className="text-[14px]" /> Visible para alumnos
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="download" className="text-[18px]" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="share" className="text-[18px]" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600"><Icon name="more_vert" className="text-[18px]" /></Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
