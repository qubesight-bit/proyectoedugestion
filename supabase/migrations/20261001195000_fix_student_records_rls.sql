BEGIN;

-- Keep student records private while making the permissions consistent with
-- the staff-only /app route. The previous folder regex rejected valid UUIDs
-- outside a narrow version range and course joins made legitimate uploads fail.
DROP POLICY IF EXISTS "Staff read permitted student documents" ON public.student_documents;
CREATE POLICY "Staff read permitted student documents" ON public.student_documents
FOR SELECT TO authenticated
USING (public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff create permitted student documents" ON public.student_documents;
CREATE POLICY "Staff create permitted student documents" ON public.student_documents
FOR INSERT TO authenticated
WITH CHECK (
  public.is_staff(auth.uid())
  AND uploaded_by = auth.uid()
  AND EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_documents.student_id)
);

DROP POLICY IF EXISTS "Staff update permitted student documents" ON public.student_documents;
CREATE POLICY "Staff update permitted student documents" ON public.student_documents
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid())
WITH CHECK (
  public.is_staff(auth.uid())
  AND (public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid())
);

DROP POLICY IF EXISTS "Staff delete permitted student documents" ON public.student_documents;
CREATE POLICY "Staff delete permitted student documents" ON public.student_documents
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR uploaded_by = auth.uid());

DROP POLICY IF EXISTS "Staff upload student records" ON storage.objects;
CREATE POLICY "Staff upload student records" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'student-records'
  AND public.is_staff(auth.uid())
  AND EXISTS (
    SELECT 1
    FROM public.students s
    WHERE s.id::text = (storage.foldername(name))[1]
  )
);

DROP POLICY IF EXISTS "Staff read student records" ON storage.objects;
CREATE POLICY "Staff read student records" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'student-records'
  AND public.is_staff(auth.uid())
  AND EXISTS (
    SELECT 1
    FROM public.student_documents d
    WHERE d.storage_path = name
  )
);

DROP POLICY IF EXISTS "Staff delete student records" ON storage.objects;
CREATE POLICY "Staff delete student records" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'student-records'
  AND EXISTS (
    SELECT 1
    FROM public.student_documents d
    WHERE d.storage_path = name
      AND (public.has_role(auth.uid(), 'admin') OR d.uploaded_by = auth.uid())
  )
);

COMMIT;
