BEGIN;

-- Calificaciones reales por estudiante, materia y período.
CREATE TABLE IF NOT EXISTS public.student_grades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  period text NOT NULL DEFAULT 'I período' CHECK (char_length(trim(period)) BETWEEN 2 AND 40),
  grade numeric(4,1) NOT NULL CHECK (grade BETWEEN 0 AND 10),
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 500),
  recorded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_id, period)
);
CREATE INDEX IF NOT EXISTS student_grades_student_idx ON public.student_grades (student_id);
CREATE INDEX IF NOT EXISTS student_grades_course_idx ON public.student_grades (course_id);
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_grades TO authenticated;
GRANT ALL ON public.student_grades TO service_role;

CREATE POLICY "Staff read permitted grades" ON public.student_grades FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.teacher_profiles t ON t.id = c.teacher_id
    JOIN public.course_students cs ON cs.course_id = c.id
    WHERE c.id = student_grades.course_id
      AND cs.student_id = student_grades.student_id
      AND t.user_id = auth.uid()
  )
);
CREATE POLICY "Staff create permitted grades" ON public.student_grades FOR INSERT TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.courses c
    JOIN public.teacher_profiles t ON t.id = c.teacher_id
    JOIN public.course_students cs ON cs.course_id = c.id
    WHERE c.id = student_grades.course_id
      AND cs.student_id = student_grades.student_id
      AND t.user_id = auth.uid()
  )
);
CREATE POLICY "Staff update permitted grades" ON public.student_grades FOR UPDATE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.courses c JOIN public.teacher_profiles t ON t.id = c.teacher_id
    WHERE c.id = student_grades.course_id AND t.user_id = auth.uid()
  )
) WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.courses c JOIN public.teacher_profiles t ON t.id = c.teacher_id
    WHERE c.id = student_grades.course_id AND t.user_id = auth.uid()
  )
);
CREATE POLICY "Staff delete permitted grades" ON public.student_grades FOR DELETE TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.courses c JOIN public.teacher_profiles t ON t.id = c.teacher_id
    WHERE c.id = student_grades.course_id AND t.user_id = auth.uid()
  )
);
CREATE TRIGGER student_grades_updated_at BEFORE UPDATE ON public.student_grades
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.refresh_student_average()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE affected_student uuid;
BEGIN
  affected_student := CASE WHEN TG_OP = 'DELETE' THEN OLD.student_id ELSE NEW.student_id END;
  UPDATE public.students
  SET score = (SELECT round(avg(grade), 1) FROM public.student_grades WHERE student_id = affected_student)
  WHERE id = affected_student;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END; $$;
REVOKE EXECUTE ON FUNCTION public.refresh_student_average() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER student_average_after_grade
  AFTER INSERT OR UPDATE OR DELETE ON public.student_grades
  FOR EACH ROW EXECUTE FUNCTION public.refresh_student_average();

-- Punto de entrada estable para el formulario público. Solo inserta solicitudes pendientes.
CREATE OR REPLACE FUNCTION public.submit_admission_request(
  p_student_name text,
  p_student_document text,
  p_birth_date date,
  p_desired_level text,
  p_guardian_name text,
  p_guardian_document text,
  p_guardian_email text,
  p_guardian_phone text,
  p_entry_type text DEFAULT 'nuevo'
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_id uuid;
BEGIN
  IF p_entry_type NOT IN ('nuevo', 'regular', 'reingreso') THEN RAISE EXCEPTION 'Tipo de ingreso inválido'; END IF;
  IF char_length(trim(p_student_name)) NOT BETWEEN 3 AND 120 THEN RAISE EXCEPTION 'Nombre inválido'; END IF;
  IF char_length(trim(p_guardian_name)) NOT BETWEEN 3 AND 120 THEN RAISE EXCEPTION 'Encargado inválido'; END IF;
  IF p_birth_date > current_date THEN RAISE EXCEPTION 'Fecha de nacimiento inválida'; END IF;
  INSERT INTO public.admission_requests (
    student_name, student_document, birth_date, desired_level, guardian_name,
    guardian_document, guardian_email, guardian_phone, entry_type, status, admin_note
  ) VALUES (
    trim(p_student_name), trim(p_student_document), p_birth_date, trim(p_desired_level), trim(p_guardian_name),
    trim(p_guardian_document), lower(trim(p_guardian_email)), trim(p_guardian_phone), p_entry_type, 'pendiente', ''
  ) RETURNING id INTO new_id;
  RETURN new_id;
END; $$;
REVOKE ALL ON FUNCTION public.submit_admission_request(text,text,date,text,text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_admission_request(text,text,date,text,text,text,text,text,text) TO anon, authenticated;

-- Datos académicos de demostración, idempotentes y apropiados para preescolar/primaria CEAC.
INSERT INTO public.teacher_profiles (full_name, email, phone, specialty, bio)
SELECT 'Ana Rodríguez', 'ana.rodriguez@ceaccr.ed.cr', '+506 2551-0300', 'Educación Primaria', 'Docente guía de primaria.'
WHERE NOT EXISTS (SELECT 1 FROM public.teacher_profiles WHERE lower(full_name) = lower('Ana Rodríguez'));
INSERT INTO public.teacher_profiles (full_name, email, phone, specialty, bio)
SELECT 'María Fernández', 'maria.fernandez@ceaccr.ed.cr', '+506 2551-0300', 'Inglés', 'Docente de inglés para I y II ciclos.'
WHERE NOT EXISTS (SELECT 1 FROM public.teacher_profiles WHERE lower(full_name) = lower('María Fernández'));

INSERT INTO public.courses (title, category, level, teacher, teacher_id, schedule, room, capacity)
SELECT 'Matemáticas 4°', 'ciencias', '4° Primaria', t.full_name, t.id, 'Lunes y miércoles · 8:00 a. m.', 'Aula 4', 30
FROM public.teacher_profiles t
WHERE lower(t.full_name) = lower('Ana Rodríguez')
  AND NOT EXISTS (SELECT 1 FROM public.courses WHERE title = 'Matemáticas 4°' AND level = '4° Primaria');
INSERT INTO public.courses (title, category, level, teacher, teacher_id, schedule, room, capacity)
SELECT 'Inglés 4°', 'idiomas', '4° Primaria', t.full_name, t.id, 'Martes y jueves · 9:30 a. m.', 'Aula 4', 30
FROM public.teacher_profiles t
WHERE lower(t.full_name) = lower('María Fernández')
  AND NOT EXISTS (SELECT 1 FROM public.courses WHERE title = 'Inglés 4°' AND level = '4° Primaria');

INSERT INTO public.students (code, name, grade, status, tutor, phone, email)
SELECT 'EST-DEMO-001', 'Sofía Vargas', '4° Primaria', 'Activo', 'Laura Vargas', '+506 8888-0101', 'familia.vargas@example.com'
WHERE NOT EXISTS (SELECT 1 FROM public.students WHERE code = 'EST-DEMO-001');
INSERT INTO public.students (code, name, grade, status, tutor, phone, email)
SELECT 'EST-DEMO-002', 'Daniel Mora', '4° Primaria', 'Activo', 'Carlos Mora', '+506 8888-0102', 'familia.mora@example.com'
WHERE NOT EXISTS (SELECT 1 FROM public.students WHERE code = 'EST-DEMO-002');

INSERT INTO public.course_students (course_id, student_id)
SELECT c.id, s.id FROM public.courses c CROSS JOIN public.students s
WHERE c.title IN ('Matemáticas 4°', 'Inglés 4°') AND s.code IN ('EST-DEMO-001', 'EST-DEMO-002')
ON CONFLICT DO NOTHING;

COMMIT;
