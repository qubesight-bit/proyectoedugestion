import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";

export function TeacherCoursesView() {
  return (
    <section className="flex flex-col gap-4 px-4 py-4 animate-edu-rise pb-24 md:pb-4">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2rem] bg-[#165BDB] p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col gap-1">
          <span className="text-[10px] font-bold tracking-wider opacity-90 uppercase">
            Período Académico 2024-1
          </span>
          <h1 className="text-3xl font-bold mt-1">¡Hola, Prof. Ana García!</h1>
          <p className="mt-1 max-w-[200px] text-sm opacity-90 leading-tight">
            Planifica tus sesiones y supervisa el progreso del ciclo escolar.
          </p>
          
          <div className="mt-5 flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
              <Icon name="menu_book" className="text-[14px]" />
              4 Cursos Activos
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
              <Icon name="group" className="text-[14px]" />
              138 Alumnos
            </span>
          </div>
        </div>
        
        {/* Decorative graphic (mocked with a circle gradient/image) */}
        <div className="absolute -right-4 top-4 h-24 w-24 rounded-full bg-white/10 p-2 shadow-inner backdrop-blur-md">
          <div className="h-full w-full rounded-full bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden">
             {/* Using a generic placeholder image to simulate the UI graphic */}
             <div className="grid grid-cols-2 gap-1 opacity-50 w-full p-2">
               <div className="h-2 bg-white rounded-full w-full"></div>
               <div className="h-2 bg-white rounded-full w-full"></div>
               <div className="h-2 bg-white rounded-full w-3/4"></div>
             </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mt-2">
        <div className="flex h-12 w-full items-center gap-2 rounded-2xl bg-white px-4 text-on-surface-variant shadow-sm border border-slate-100">
          <Icon name="search" className="text-[20px] text-slate-400" />
          <input
            aria-label="Buscar materia o grupo"
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Buscar materia o grupo..."
          />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          <Button className="h-9 flex-shrink-0 rounded-full px-5 text-sm font-semibold bg-[#0A47B8] hover:bg-[#0A47B8]/90">
            Todos
          </Button>
          <Button variant="secondary" className="h-9 flex-shrink-0 rounded-full px-5 text-sm font-semibold bg-[#EAEFFF] text-slate-600 hover:bg-[#EAEFFF]/80">
            Secundaria
          </Button>
          <Button variant="secondary" className="h-9 flex-shrink-0 rounded-full px-5 text-sm font-semibold bg-[#EAEFFF] text-slate-600 hover:bg-[#EAEFFF]/80">
            Bachillerato
          </Button>
        </div>
      </div>

      {/* Course Cards List */}
      <div className="mt-2 flex flex-col gap-4">
        {/* Card 1 */}
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6EEFF] text-[#165BDB]">
                <Icon name="grid_view" className="text-[24px]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold leading-tight">Matemáticas<br/>4A</h2>
                  <div className="flex flex-col gap-1 items-end ml-2">
                    <span className="rounded-full bg-[#62E3CC] px-2 py-0.5 text-[10px] font-bold text-teal-900 uppercase">Secundaria</span>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <Icon name="meeting_room" className="text-[14px]" />
                  Aula 102 • Lun/Mié/Vie 13:00
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#F0F2F5] px-2 py-1 min-w-[70px]">
              <Icon name="person" className="text-[16px] text-slate-500" />
              <span className="text-xs font-bold mt-0.5 text-slate-700">35</span>
              <span className="text-[9px] text-slate-500 -mt-0.5">Estudiantes</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Syllabus completado</span>
              <span className="text-[#165BDB]">65%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#EAEFFF]">
              <div className="h-full w-[65%] rounded-full bg-[#165BDB]"></div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Temas Recientes:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-lg bg-white px-2 py-1 text-xs text-slate-600 shadow-sm border border-slate-100">Ecuaciones cuadráticas</span>
              <span className="rounded-lg bg-white px-2 py-1 text-xs text-slate-600 shadow-sm border border-slate-100">Trigonometría básica</span>
              <span className="rounded-lg bg-white px-2 py-1 text-xs text-slate-600 shadow-sm border border-slate-100">Funciones reales</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="h-11 flex-1 rounded-xl bg-[#165BDB] text-sm font-semibold hover:bg-[#165BDB]/90">
              <Icon name="menu_book" className="text-[18px] mr-1" />
              Ver Programa
            </Button>
            <Button variant="secondary" className="h-11 flex-1 rounded-xl bg-[#E6EEFF] text-[#165BDB] text-sm font-semibold hover:bg-[#E6EEFF]/80">
              <Icon name="link" className="text-[18px] mr-1" />
              Material de Apoyo
            </Button>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#A5F3E4] text-teal-800">
                <Icon name="science" className="text-[24px]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold leading-tight">Química<br/>3A</h2>
                  <div className="flex flex-col gap-1 items-end ml-2">
                    <span className="rounded-full bg-[#62E3CC] px-2 py-0.5 text-[10px] font-bold text-teal-900 uppercase">Secundaria</span>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <Icon name="biotech" className="text-[14px]" />
                  Laboratorio B • Mar/Jue 09:00
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#F0F2F5] px-2 py-1 min-w-[70px]">
              <Icon name="person" className="text-[16px] text-slate-500" />
              <span className="text-xs font-bold mt-0.5 text-slate-700">32</span>
              <span className="text-[9px] text-slate-500 -mt-0.5">Estudiantes</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Syllabus completado</span>
              <span className="text-[#165BDB]">48%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#EAEFFF]">
              <div className="h-full w-[48%] rounded-full bg-[#165BDB]"></div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Temas Recientes:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-lg bg-white px-2 py-1 text-xs text-slate-600 shadow-sm border border-slate-100">Tabla periódica y enlaces</span>
              <span className="rounded-lg bg-white px-2 py-1 text-xs text-slate-600 shadow-sm border border-slate-100">Reacciones redox</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="h-11 flex-1 rounded-xl bg-[#165BDB] text-sm font-semibold hover:bg-[#165BDB]/90">
              <Icon name="menu_book" className="text-[18px] mr-1" />
              Ver Programa
            </Button>
            <Button variant="secondary" className="h-11 flex-1 rounded-xl bg-[#E6EEFF] text-[#165BDB] text-sm font-semibold hover:bg-[#E6EEFF]/80">
              <Icon name="link" className="text-[18px] mr-1" />
              Material de Apoyo
            </Button>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFDCA8] text-orange-800">
                <Icon name="bolt" className="text-[24px]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold leading-tight">Física<br/>5B</h2>
                  <div className="flex flex-col gap-1 items-end ml-2">
                    <span className="rounded-full bg-[#FFE5BF] px-2 py-0.5 text-[10px] font-bold text-orange-900 uppercase">Bachillerato</span>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <Icon name="meeting_room" className="text-[14px]" />
                  Aula 204 • Lun/Mié 15:30
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#F0F2F5] px-2 py-1 min-w-[70px]">
              <Icon name="person" className="text-[16px] text-slate-500" />
              <span className="text-xs font-bold mt-0.5 text-slate-700">36</span>
              <span className="text-[9px] text-slate-500 -mt-0.5">Estudiantes</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Syllabus completado</span>
              <span className="text-[#165BDB]">80%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#EAEFFF]">
              <div className="h-full w-[80%] rounded-full bg-[#165BDB]"></div>
            </div>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] p-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Temas Recientes:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-lg bg-white px-2 py-1 text-xs text-slate-600 shadow-sm border border-slate-100">Cinemática y dinámica</span>
              <span className="rounded-lg bg-white px-2 py-1 text-xs text-slate-600 shadow-sm border border-slate-100">Leyes de Newton</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="h-11 flex-1 rounded-xl bg-[#165BDB] text-sm font-semibold hover:bg-[#165BDB]/90">
              <Icon name="menu_book" className="text-[18px] mr-1" />
              Ver Programa
            </Button>
            <Button variant="secondary" className="h-11 flex-1 rounded-xl bg-[#E6EEFF] text-[#165BDB] text-sm font-semibold hover:bg-[#E6EEFF]/80">
              <Icon name="link" className="text-[18px] mr-1" />
              Material de Apoyo
            </Button>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex flex-col gap-4 rounded-[2rem] bg-white p-5 shadow-sm border border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFDCA8] text-orange-800">
                <Icon name="bolt" className="text-[24px]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold leading-tight">Física<br/>5C</h2>
                  <div className="flex flex-col gap-1 items-end ml-2">
                    <span className="rounded-full bg-[#FFE5BF] px-2 py-0.5 text-[10px] font-bold text-orange-900 uppercase">Bachillerato</span>
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <Icon name="meeting_room" className="text-[14px]" />
                  Aula 205 • Mar/Vie 11:00
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#F0F2F5] px-2 py-1 min-w-[70px]">
              <Icon name="person" className="text-[16px] text-slate-500" />
              <span className="text-xs font-bold mt-0.5 text-slate-700">35</span>
              <span className="text-[9px] text-slate-500 -mt-0.5">Estudiantes</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span>Syllabus completado</span>
              <span className="text-[#165BDB]">30%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#EAEFFF]">
              <div className="h-full w-[30%] rounded-full bg-[#165BDB]"></div>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button className="h-11 flex-1 rounded-xl bg-[#165BDB] text-sm font-semibold hover:bg-[#165BDB]/90">
              <Icon name="menu_book" className="text-[18px] mr-1" />
              Ver Programa
            </Button>
            <Button variant="secondary" className="h-11 flex-1 rounded-xl bg-[#E6EEFF] text-[#165BDB] text-sm font-semibold hover:bg-[#E6EEFF]/80">
              <Icon name="link" className="text-[18px] mr-1" />
              Material de Apoyo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
