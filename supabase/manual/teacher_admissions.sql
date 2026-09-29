-- Execute after the existing profiles, roles and courses/students migrations.
-- Existing rows remain intact. Run this migration only once.
BEGIN;

CREATE TABLE public.teacher_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL CHECK (char_length(trim(full_name)) BETWEEN 2 AND 120),
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  specialty text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX teacher_profiles_name_key ON public.teacher_profiles (lower(trim(full_name)));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_profiles TO authenticated;
GRANT ALL ON public.teacher_profiles TO service_role;
ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff read teachers" ON public.teacher_profiles FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "Admins add teachers" ON public.teacher_profiles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND (user_id IS NULL OR public.has_role(user_id, 'docente')));
CREATE POLICY "Admins edit teachers" ON public.teacher_profiles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND (user_id IS NULL OR public.has_role(user_id, 'docente')));
CREATE POLICY "Admins remove teachers" ON public.teacher_profiles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER teacher_profiles_updated_at BEFORE UPDATE ON public.teacher_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.courses ADD COLUMN teacher_id uuid REFERENCES public.teacher_profiles(id) ON DELETE SET NULL;
CREATE INDEX courses_teacher_id_idx ON public.courses (teacher_id);
INSERT INTO public.teacher_profiles (full_name)
SELECT DISTINCT ON (lower(trim(teacher))) trim(teacher)
FROM public.courses WHERE trim(teacher) <> '' ORDER BY lower(trim(teacher)), trim(teacher);
UPDATE public.courses c SET teacher_id = t.id
FROM public.teacher_profiles t WHERE lower(trim(c.teacher)) = lower(trim(t.full_name));

CREATE TABLE public.course_students (
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (course_id, student_id)
);
CREATE INDEX course_students_student_idx ON public.course_students (student_id);
CREATE OR REPLACE FUNCTION public.refresh_course_enrollment()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE affected_course uuid;
BEGIN
  IF TG_OP = 'INSERT' THEN affected_course := NEW.course_id;
  ELSE affected_course := OLD.course_id; END IF;
  UPDATE public.courses SET enrolled = (
    SELECT count(*) FROM public.course_students WHERE course_id = affected_course
  ) WHERE id = affected_course;
  IF TG_OP = 'INSERT' THEN RETURN NEW; ELSE RETURN OLD; END IF;
END; $$;
REVOKE EXECUTE ON FUNCTION public.refresh_course_enrollment() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER course_student_count_insert AFTER INSERT ON public.course_students
  FOR EACH ROW EXECUTE FUNCTION public.refresh_course_enrollment();
CREATE TRIGGER course_student_count_delete AFTER DELETE ON public.course_students
  FOR EACH ROW EXECUTE FUNCTION public.refresh_course_enrollment();
GRANT SELECT, INSERT, DELETE ON public.course_students TO authenticated;
GRANT ALL ON public.course_students TO service_role;
ALTER TABLE public.course_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff see assigned course students" ON public.course_students FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.courses c JOIN public.teacher_profiles t ON t.id = c.teacher_id
    WHERE c.id = course_id AND t.user_id = auth.uid()
  ));
CREATE POLICY "Admins enroll students" ON public.course_students FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins unenroll students" ON public.course_students FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- A teacher can only see students in their courses; admins retain full access.
DROP POLICY IF EXISTS "Staff can view students" ON public.students;
CREATE POLICY "Admins and assigned teachers see students" ON public.students FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1 FROM public.course_students cs
    JOIN public.courses c ON c.id = cs.course_id
    JOIN public.teacher_profiles t ON t.id = c.teacher_id
    WHERE cs.student_id = students.id AND t.user_id = auth.uid()
  ));

-- Admin can discover existing teacher accounts to link a profile by user ID.
CREATE POLICY "Admins see teacher roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins see profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.admission_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL CHECK (char_length(trim(student_name)) BETWEEN 3 AND 120),
  student_document text NOT NULL CHECK (char_length(trim(student_document)) BETWEEN 3 AND 40),
  birth_date date NOT NULL,
  desired_level text NOT NULL CHECK (char_length(trim(desired_level)) BETWEEN 2 AND 80),
  guardian_name text NOT NULL CHECK (char_length(trim(guardian_name)) BETWEEN 3 AND 120),
  guardian_document text NOT NULL CHECK (char_length(trim(guardian_document)) BETWEEN 3 AND 40),
  guardian_email text NOT NULL CHECK (char_length(guardian_email) <= 255),
  guardian_phone text NOT NULL CHECK (char_length(guardian_phone) BETWEEN 7 AND 30),
  entry_type text NOT NULL DEFAULT 'nuevo' CHECK (entry_type IN ('nuevo','regular','reingreso')),
  status text NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente','en_revision','contactado','cerrado')),
  admin_note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admission_requests_created_idx ON public.admission_requests (created_at DESC);
GRANT INSERT ON public.admission_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admission_requests TO authenticated;
GRANT ALL ON public.admission_requests TO service_role;
ALTER TABLE public.admission_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public submit admission only" ON public.admission_requests FOR INSERT TO anon
  WITH CHECK (status = 'pendiente' AND admin_note = '');
CREATE POLICY "Signed in users may submit admission" ON public.admission_requests FOR INSERT TO authenticated
  WITH CHECK (status = 'pendiente' AND admin_note = '');
CREATE POLICY "Admin read admissions" ON public.admission_requests FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update admissions" ON public.admission_requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete admissions" ON public.admission_requests FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER admission_requests_updated_at BEFORE UPDATE ON public.admission_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;
