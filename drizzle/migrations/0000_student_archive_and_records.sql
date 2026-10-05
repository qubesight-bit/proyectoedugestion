ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS archive_reason text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS archived_previous_status text,
  ADD COLUMN IF NOT EXISTS archived_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS students_archived_at_idx ON public.students (archived_at);

CREATE TABLE IF NOT EXISTS public.student_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  file_name text NOT NULL CHECK (char_length(trim(file_name)) BETWEEN 1 AND 180),
  storage_path text NOT NULL UNIQUE,
  mime_type text NOT NULL DEFAULT 'application/octet-stream',
  size_bytes bigint NOT NULL DEFAULT 0 CHECK (size_bytes >= 0 AND size_bytes <= 10485760),
  category text NOT NULL DEFAULT 'Otro' CHECK (category IN ('Identificación','Académico','Médico','Matrícula','Autorización','Otro')),
  notes text NOT NULL DEFAULT '' CHECK (char_length(notes) <= 500),
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS student_documents_student_idx ON public.student_documents (student_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_documents TO authenticated;
GRANT ALL ON public.student_documents TO service_role;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff read permitted student documents" ON public.student_documents
FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff create permitted student documents" ON public.student_documents
FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()) AND uploaded_by = auth.uid());
CREATE POLICY "Staff update permitted student documents" ON public.student_documents
FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid())
WITH CHECK (public.is_staff(auth.uid()) AND (public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid()));
CREATE POLICY "Staff delete permitted student documents" ON public.student_documents
FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid());

CREATE POLICY "Staff upload student records" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'student-records' AND public.is_staff(auth.uid()));
CREATE POLICY "Staff read student records" ON storage.objects
FOR SELECT TO authenticated USING (bucket_id = 'student-records' AND public.is_staff(auth.uid())
  AND EXISTS (SELECT 1 FROM public.student_documents d WHERE d.storage_path = name));
CREATE POLICY "Staff delete student records" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'student-records'
  AND EXISTS (SELECT 1 FROM public.student_documents d WHERE d.storage_path = name
    AND (public.has_role(auth.uid(), 'admin') OR d.uploaded_by = auth.uid())));