BEGIN;

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
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_documents TO authenticated;
GRANT ALL ON public.student_documents TO service_role;

DROP POLICY IF EXISTS "Staff read permitted student documents" ON public.student_documents;
CREATE POLICY "Staff read permitted student documents" ON public.student_documents
FOR SELECT TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR EXISTS (
    SELECT 1
    FROM public.course_students cs
    JOIN public.courses c ON c.id = cs.course_id
    JOIN public.teacher_profiles t ON t.id = c.teacher_id
    WHERE cs.student_id = student_documents.student_id AND t.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Staff create permitted student documents" ON public.student_documents;
CREATE POLICY "Staff create permitted student documents" ON public.student_documents
FOR INSERT TO authenticated WITH CHECK (
  uploaded_by = auth.uid() AND (
    public.has_role(auth.uid(), 'admin') OR EXISTS (
      SELECT 1
      FROM public.course_students cs
      JOIN public.courses c ON c.id = cs.course_id
      JOIN public.teacher_profiles t ON t.id = c.teacher_id
      WHERE cs.student_id = student_documents.student_id AND t.user_id = auth.uid()
    )
  )
);

DROP POLICY IF EXISTS "Staff update permitted student documents" ON public.student_documents;
CREATE POLICY "Staff update permitted student documents" ON public.student_documents
FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid()
) WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid()
);

DROP POLICY IF EXISTS "Staff delete permitted student documents" ON public.student_documents;
CREATE POLICY "Staff delete permitted student documents" ON public.student_documents
FOR DELETE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid()
);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-records',
  'student-records',
  false,
  10485760,
  ARRAY['application/pdf','image/jpeg','image/png','image/webp','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Staff upload student records" ON storage.objects;
CREATE POLICY "Staff upload student records" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'student-records'
  AND (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  AND EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = ((storage.foldername(name))[1])::uuid
      AND (
        public.has_role(auth.uid(), 'admin') OR EXISTS (
          SELECT 1
          FROM public.course_students cs
          JOIN public.courses c ON c.id = cs.course_id
          JOIN public.teacher_profiles t ON t.id = c.teacher_id
          WHERE cs.student_id = s.id AND t.user_id = auth.uid()
        )
      )
  )
);

DROP POLICY IF EXISTS "Staff read student records" ON storage.objects;
CREATE POLICY "Staff read student records" ON storage.objects
FOR SELECT TO authenticated USING (
  bucket_id = 'student-records'
  AND EXISTS (
    SELECT 1 FROM public.student_documents d
    WHERE d.storage_path = name
      AND (
        public.has_role(auth.uid(), 'admin') OR EXISTS (
          SELECT 1
          FROM public.course_students cs
          JOIN public.courses c ON c.id = cs.course_id
          JOIN public.teacher_profiles t ON t.id = c.teacher_id
          WHERE cs.student_id = d.student_id AND t.user_id = auth.uid()
        )
      )
  )
);

DROP POLICY IF EXISTS "Staff delete student records" ON storage.objects;
CREATE POLICY "Staff delete student records" ON storage.objects
FOR DELETE TO authenticated USING (
  bucket_id = 'student-records'
  AND EXISTS (
    SELECT 1 FROM public.student_documents d
    WHERE d.storage_path = name
      AND (public.has_role(auth.uid(), 'admin') OR d.uploaded_by = auth.uid())
  )
);

COMMIT;
