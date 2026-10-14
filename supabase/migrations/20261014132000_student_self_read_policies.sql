-- Permitir que cada estudiante consulte únicamente su propia información.
drop policy if exists "Students read own profile" on public.students;
create policy "Students read own profile"
on public.students
for select
to authenticated
using (
  lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
);

drop policy if exists "Students read own grades" on public.student_grades;
create policy "Students read own grades"
on public.student_grades
for select
to authenticated
using (
  exists (
    select 1
    from public.students s
    where s.id = student_grades.student_id
      and lower(s.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);

drop policy if exists "Students read own enrollments" on public.course_students;
create policy "Students read own enrollments"
on public.course_students
for select
to authenticated
using (
  exists (
    select 1
    from public.students s
    where s.id = course_students.student_id
      and lower(s.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);

drop policy if exists "Students read enrolled courses" on public.courses;
create policy "Students read enrolled courses"
on public.courses
for select
to authenticated
using (
  exists (
    select 1
    from public.course_students cs
    join public.students s on s.id = cs.student_id
    where cs.course_id = courses.id
      and lower(s.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);
