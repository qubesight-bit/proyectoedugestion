import { describe, expect, it } from "vitest";
import { assignedCourses } from "@/lib/academic";

describe("cursos visibles del docente", () => {
  it("devuelve solo cursos vinculados a la cuenta y omite los heredados sin vincular", () => {
    const courses = [
      { title: "Arte", teacher_id: "t1" },
      { title: "Ciencias", teacher_id: "t2" },
      { title: "Sin asignación", teacher_id: null },
    ];
    const teachers = [
      { id: "t1", user_id: "usuario-1" },
      { id: "t2", user_id: "usuario-2" },
    ];
    expect(assignedCourses(courses, teachers, "usuario-1")).toEqual([courses[0]]);
    expect(assignedCourses(courses, teachers, "sin-perfil")).toEqual([]);
  });
});
