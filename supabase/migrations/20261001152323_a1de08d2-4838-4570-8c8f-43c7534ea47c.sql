BEGIN;

-- Matricular a los estudiantes existentes en los cursos de su mismo nivel,
-- para que el formulario de calificaciones tenga materias disponibles.
INSERT INTO public.course_students (course_id, student_id)
SELECT c.id, s.id
FROM public.students s
JOIN public.courses c
  ON replace(c.level, ' de Secundaria', ' Secundaria') = regexp_replace(s.grade, '\s*''[A-Z]+''$', '')
ON CONFLICT DO NOTHING;

-- Asegurar que ningún estudiante quede sin cursos matriculados.
INSERT INTO public.course_students (course_id, student_id)
SELECT (SELECT id FROM public.courses ORDER BY created_at LIMIT 1), s.id
FROM public.students s
WHERE NOT EXISTS (SELECT 1 FROM public.course_students cs WHERE cs.student_id = s.id)
ON CONFLICT DO NOTHING;

COMMIT;