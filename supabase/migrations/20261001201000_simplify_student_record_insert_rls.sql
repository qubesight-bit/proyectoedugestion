BEGIN;

-- The student foreign key validates the record at the metadata layer. Avoid
-- cross-schema/table lookups inside Storage RLS because they can be evaluated
-- under a restricted storage context and reject otherwise valid staff uploads.
DROP POLICY IF EXISTS "Staff create permitted student documents" ON public.student_documents;
CREATE POLICY "Staff create permitted student documents" ON public.student_documents
FOR INSERT TO authenticated
WITH CHECK (
  public.is_staff(auth.uid())
  AND uploaded_by = auth.uid()
);

DROP POLICY IF EXISTS "Staff upload student records" ON storage.objects;
CREATE POLICY "Staff upload student records" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'student-records'
  AND public.is_staff(auth.uid())
);

COMMIT;
