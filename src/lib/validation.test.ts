import { describe, expect, it } from "vitest";
import {
  announcementSchema,
  canManage,
  courseSchema,
  fieldErrors,
  occupancyPercent,
  roleLabel,
  studentSchema,
} from "./validation";

describe("courseSchema", () => {
  const valid = { title: "Química", category: "ciencias", level: "1° de Secundaria", teacher: "Prof. X", capacity: "25" };
  it("acepta un curso válido y convierte números", () => {
    const r = courseSchema.parse(valid);
    expect(r.capacity).toBe(25);
    expect(r.enrolled).toBe(0);
  });
  it("rechaza título corto y categoría inválida", () => {
    const errs = fieldErrors(courseSchema, { ...valid, title: "Q", category: "deportes" });
    expect(errs?.["title"]).toMatch(/al menos 3/);
    expect(errs?.["category"]).toBeDefined();
  });
  it("rechaza cupo 0", () => {
    expect(fieldErrors(courseSchema, { ...valid, capacity: 0 })?.["capacity"]).toBeDefined();
  });
});

describe("studentSchema", () => {
  it("valida correo y teléfono", () => {
    const errs = fieldErrors(studentSchema, { name: "Ana Pérez", grade: "1°", status: "Activo", email: "malo", phone: "abc" });
    expect(errs?.["email"]).toBe("Correo inválido");
    expect(errs?.["phone"]).toBe("Teléfono inválido");
  });
  it("permite correo vacío y promedio nulo", () => {
    expect(fieldErrors(studentSchema, { name: "Ana Pérez", grade: "1°", status: "Activo", email: "", score: null })).toBeNull();
  });
  it("rechaza promedio mayor a 10", () => {
    expect(fieldErrors(studentSchema, { name: "Ana Pérez", grade: "1°", status: "Activo", score: 11 })?.["score"]).toBeDefined();
  });
});

describe("announcementSchema", () => {
  it("requiere contenido", () => {
    expect(fieldErrors(announcementSchema, { title: "Hola mundo", content: "" })?.["content"]).toBeDefined();
  });
});

describe("utilidades", () => {
  it("calcula ocupación con límites", () => {
    expect(occupancyPercent(28, 30)).toBe(93);
    expect(occupancyPercent(40, 30)).toBe(100);
    expect(occupancyPercent(5, 0)).toBe(0);
  });
  it("resuelve etiqueta y permisos por rol", () => {
    expect(roleLabel(["docente", "admin"])).toBe("Administrador");
    expect(roleLabel(["docente"])).toBe("Docente");
    expect(roleLabel([])).toBeNull();
    expect(canManage(["docente"])).toBe(false);
    expect(canManage(["admin"])).toBe(true);
  });
});
