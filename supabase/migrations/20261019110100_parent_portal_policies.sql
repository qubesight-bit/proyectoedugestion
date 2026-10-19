-- Vínculos familiares y permisos del portal de padres.
CREATE TABLE IF NOT EXISTS public.guardian_students (
  guardian_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  relationship text NOT NULL DEFAULT 'Encargado',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (guardian_user_id, student_id)
);

ALTER TABLE public.guardian_students ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guardian_students TO authenticated;
GRANT ALL ON public.guardian_students TO service_role;

DROP POLICY IF EXISTS "Guardians read own links" ON public.guardian_students;
CREATE POLICY "Guardians read own links"
ON public.guardian_students FOR SELECT TO authenticated
USING (guardian_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage guardian links" ON public.guardian_students;
CREATE POLICY "Admins manage guardian links"
ON public.guardian_students FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Guardians read linked students" ON public.students;
CREATE POLICY "Guardians read linked students"
ON public.students FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.guardian_students gs
    WHERE gs.student_id = students.id
      AND gs.guardian_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Guardians read linked grades" ON public.student_grades;
CREATE POLICY "Guardians read linked grades"
ON public.student_grades FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.guardian_students gs
    WHERE gs.student_id = student_grades.student_id
      AND gs.guardian_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Guardians read linked enrollments" ON public.course_students;
CREATE POLICY "Guardians read linked enrollments"
ON public.course_students FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.guardian_students gs
    WHERE gs.student_id = course_students.student_id
      AND gs.guardian_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Guardians read linked courses" ON public.courses;
CREATE POLICY "Guardians read linked courses"
ON public.courses FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.course_students cs
    JOIN public.guardian_students gs ON gs.student_id = cs.student_id
    WHERE cs.course_id = courses.id
      AND gs.guardian_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Guardians read linked gamification" ON public.student_gamification;
CREATE POLICY "Guardians read linked gamification"
ON public.student_gamification FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.guardian_students gs
    WHERE gs.student_id = student_gamification.student_id
      AND gs.guardian_user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Families read announcements" ON public.announcements;
CREATE POLICY "Families read announcements"
ON public.announcements FOR SELECT TO authenticated
USING (
  public.is_staff(auth.uid())
  OR public.has_role(auth.uid(), 'estudiante')
  OR public.has_role(auth.uid(), 'padre')
);
