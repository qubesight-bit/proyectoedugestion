import { Button } from "@/components/ui/button";
import { Icon } from "../../components/shared";
import { teachersMock } from "../../services/mockData";
import { Teacher } from "../../types";

export function TeachersView() {
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
          <span className="hidden tv:inline">Nuevo</span>
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

export function TeacherCard({ teacher }: { teacher: Teacher }) {
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
