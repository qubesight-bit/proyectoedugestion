import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon, Field, ModalShell } from "../../components/shared";
import { courses } from "../../services/mockData";
import { Course } from "../../types";

export function CoursesView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "ciencias" | "humanidades">("all");

  const filteredCourses = courses.filter(
    (course) => filter === "all" || course.category === filter,
  );

  return (
    <section className="flex flex-col gap-4 px-4 py-4 animate-edu-rise">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-headline-md font-semibold">Oferta Académica</h1>
          <div className="mt-1 flex gap-2 text-body-sm text-on-surface-variant">
            <span>24 asignaturas</span>
            <span>•</span>
            <span>Ciclo Lectivo 2024</span>
          </div>
        </div>
        <Button className="h-10 rounded-xl px-3" onClick={() => setModalOpen(true)}>
          <Icon name="add" className="text-[20px]" />
          <span className="hidden tv:inline">Nuevo Curso</span>
        </Button>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 no-scrollbar">
        {[
          ["Todos", "all"],
          ["Ciencias", "ciencias"],
          ["Humanidades", "humanidades"],
        ].map(([label, value]) => (
          <Button
            key={label}
            variant={filter === value ? "default" : "secondary"}
            className="h-8 flex-shrink-0 rounded-full px-4 text-label-sm"
            onClick={() => setFilter(value as "all" | "ciencias" | "humanidades")}
          >
            {label}
          </Button>
        ))}
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 tv:grid-cols-3 gap-3 tv:gap-8 mt-2">
        {filteredCourses.map((course, index) => (
          <CourseCard key={index} course={course} onEdit={() => setModalOpen(true)} />
        ))}
      </div>

      {modalOpen && (
        <CourseModal
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            setToastOpen(true);
            setTimeout(() => setToastOpen(false), 3000);
          }}
        />
      )}
      
      {/* Toast would ideally be managed globally, but included here for completeness */}
      {toastOpen && (
        <div className="fixed left-1/2 top-20 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full bg-inverse-surface px-4 py-3 text-inverse-on-surface shadow-lg animate-edu-rise">
          <Icon name="check_circle" className="text-[20px] text-tertiary-fixed" />
          <span className="text-label-md font-semibold">Curso actualizado correctamente</span>
        </div>
      )}
    </section>
  );
}

export function CourseCard({ course, onEdit }: { course: Course; onEdit: () => void }) {
  const isHighOccupancy = course.count > 25;
  return (
    <article className="flex flex-col justify-between rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isHighOccupancy ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-primary-fixed text-on-primary-fixed"}`}>
            <Icon name={course.icon} className="text-[24px]" />
          </div>
          <div>
            <span className="text-label-sm font-semibold text-primary">{course.tag}</span>
            <h2 className="text-title-md font-bold leading-tight">{course.title}</h2>
          </div>
        </div>
        <Button aria-label="Opciones del curso" variant="ghost" size="icon" className="h-8 w-8 rounded-lg -mr-2" onClick={onEdit}>
          <Icon name="more_vert" className="text-[20px]" />
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-2 text-body-sm text-on-surface-variant">
        <div className="flex items-center gap-2">
          <img alt="" className="h-5 w-5 rounded-full object-cover" src={course.face} />
          {course.teacher}
        </div>
        <div className="flex items-center gap-2">
          <Icon name="schedule" className="text-[17px]" />
          {course.schedule}
        </div>
        <div className="flex items-center gap-2">
          <Icon name="location_on" className="text-[17px]" />
          {course.room}
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-surface-container p-3">
        <div className="flex items-center justify-between text-label-sm">
          <span className="font-semibold">{course.capacityLabel}</span>
          <span className="text-on-surface-variant">{course.occupancy}</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high">
          <div className={`h-full rounded-full ${isHighOccupancy ? "bg-tertiary" : "bg-primary"} w-[85%]`} />
        </div>
        <p className={`mt-2 text-body-sm ${isHighOccupancy ? "font-semibold text-tertiary" : "text-on-surface-variant"}`}>
          {course.note}
        </p>
      </div>
    </article>
  );
}

export function CourseModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
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
        <Field label="Nivel Educativo">
          <select className="form-input" defaultValue="3° de Secundaria">
            <option>1° de Secundaria</option>
            <option>2° de Secundaria</option>
            <option>3° de Secundaria</option>
            <option>4° de Secundaria</option>
          </select>
        </Field>
        <Field label="Área">
          <select className="form-input" defaultValue="Ciencias">
            <option>Ciencias</option>
            <option>Humanidades</option>
            <option>Artes</option>
            <option>Idiomas</option>
          </select>
        </Field>
        <Field label="Docente Titular">
          <select className="form-input">
            <option>Prof. Carlos Menéndez (Matemáticas)</option>
            <option>Prof. Patricia Valenzuela (Literatura)</option>
            <option>Dr. Roberto Salgado (Biología)</option>
          </select>
        </Field>
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
