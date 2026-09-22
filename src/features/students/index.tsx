import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon, Field, ModalShell, SmallStat } from "../../components/shared";
import { students } from "../../services/mockData";
import { Student } from "../../types";

export function StudentsView() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

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
        <Button className="h-10 rounded-xl px-3" onClick={() => setModalOpen(true)}>
          <Icon name="person_add" className="text-[20px]" />
          <span className="hidden tv:inline">Nuevo</span>
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

      {modalOpen && (
        <StudentModal
          onClose={() => setModalOpen(false)}
          onSave={() => {
            setModalOpen(false);
            setToastOpen(true);
            setTimeout(() => setToastOpen(false), 3000);
          }}
        />
      )}

      {toastOpen && (
        <div className="fixed left-1/2 top-20 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full bg-inverse-surface px-4 py-3 text-inverse-on-surface shadow-lg animate-edu-rise">
          <Icon name="check_circle" className="text-[20px] text-tertiary-fixed" />
          <span className="text-label-md font-semibold">Estudiante registrado</span>
        </div>
      )}
    </section>
  );
}

export function StudentCard({ student }: { student: Student }) {
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

export function StudentModal({ onClose, onSave }: { onClose: () => void; onSave: () => void }) {
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
        <Field label="Grado y Nivel *">
          <select className="form-input">
            <option>1° Primaria 'A'</option>
            <option>2° Primaria 'A'</option>
            <option>3° Primaria 'B'</option>
            <option>1° Secundaria 'A'</option>
          </select>
        </Field>
        <Field label="Estado Matrícula *">
          <select className="form-input">
            <option>Activo</option>
            <option>Documento Pendiente</option>
          </select>
        </Field>
        <Field label="Tutor Responsable *"><div className="form-input flex items-center gap-2"><Icon name="family_restroom" className="text-[18px] text-on-surface-variant" /><input className="min-w-0 flex-1 bg-transparent outline-none" /></div></Field>
        <Field label="Teléfono de Contacto *"><div className="form-input flex items-center gap-2"><Icon name="call" className="text-[18px] text-on-surface-variant" /><input className="min-w-0 flex-1 bg-transparent outline-none" /></div></Field>
        <label className="flex items-start gap-2 text-body-sm text-on-surface-variant"><input className="mt-0.5 h-4 w-4 accent-primary" type="checkbox" />Enviar credenciales automáticas por SMS</label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" className="h-11 rounded-xl px-4" onClick={onClose}>Cancelar</Button>
          <Button type="submit" className="h-11 rounded-xl px-5"><Icon name="save" className="text-[19px]" />Guardar</Button>
        </div>
      </form>
    </ModalShell>
  );
}
