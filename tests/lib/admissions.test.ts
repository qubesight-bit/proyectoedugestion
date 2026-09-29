import { describe, expect, it } from "vitest";
import { admissionFromForm } from "@/lib/admissions";

const valid = () => {
  const form = new FormData();
  for (const [name, value] of Object.entries({
    est_nombre: "Ana Pérez",
    est_id: "1234567",
    est_fecha: "2018-04-03",
    est_nivel: "Primer Grado",
    enc_nombre: "María Pérez",
    enc_id: "9876543",
    enc_email: "maria@example.com",
    enc_tel: "8888-8888",
  }))
    form.set(name, value);
  return form;
};

describe("solicitud pública de ingreso", () => {
  it("transforma los campos del formulario al registro de Supabase", () => {
    expect(admissionFromForm(valid(), "nuevo")).toEqual({
      student_name: "Ana Pérez",
      student_document: "1234567",
      birth_date: "2018-04-03",
      desired_level: "Primer Grado",
      guardian_name: "María Pérez",
      guardian_document: "9876543",
      guardian_email: "maria@example.com",
      guardian_phone: "8888-8888",
      entry_type: "nuevo",
    });
  });
  it("rechaza correo inválido o campos incompletos", () => {
    const form = valid();
    form.set("enc_email", "invalido");
    expect(() => admissionFromForm(form, "nuevo")).toThrow();
    form.delete("est_nombre");
    expect(() => admissionFromForm(form, "nuevo")).toThrow();
  });
});
