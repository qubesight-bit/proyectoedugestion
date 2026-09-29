/** Filter the dashboard to courses linked to the signed-in teacher account. */
export function assignedCourses<
  TCourse extends { teacher_id: string | null },
  TTeacher extends { id: string; user_id: string | null },
>(courses: TCourse[], teachers: TTeacher[], userId: string): TCourse[] {
  const teacherIds = new Set(
    teachers.filter((teacher) => teacher.user_id === userId).map((teacher) => teacher.id),
  );
  return courses.filter((course) => !!course.teacher_id && teacherIds.has(course.teacher_id));
}
