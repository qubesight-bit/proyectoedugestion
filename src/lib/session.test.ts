import { beforeEach, describe, expect, it } from "vitest";
import { clearSessionMarks, markSession, shouldDropSession } from "./session";

describe("persistencia de sesión", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  it("mantiene la sesión cuando se elige recordar", () => {
    markSession(true);
    sessionStorage.clear();
    expect(shouldDropSession()).toBe(false);
  });
  it("descarta la sesión en una nueva ventana si no se recuerda", () => {
    markSession(false);
    expect(shouldDropSession()).toBe(false);
    sessionStorage.clear();
    expect(shouldDropSession()).toBe(true);
  });
  it("limpia las marcas al cerrar sesión", () => {
    markSession(false);
    clearSessionMarks();
    expect(shouldDropSession()).toBe(false);
  });
});
