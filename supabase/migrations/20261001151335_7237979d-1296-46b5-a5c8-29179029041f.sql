
-- Align schema with repo migration 20260930120000 (already applied manually; make idempotent).
create table if not exists public.student_grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  period text not null default 'I período' check (char_length(trim(period)) between 2 and 40),
  grade numeric(4,1) not null check (grade between 0 and 10),
  notes text not null default '' check (char_length(notes) <= 500),
  recorded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (student_id, course_id, period)
);
create index if not exists student_grades_student_idx on public.student_grades (student_id);
create index if not exists student_grades_course_idx on public.student_grades (course_id);
grant select, insert, update, delete on public.student_grades to authenticated;
grant all on public.student_grades to service_role;

-- Replace the simpler staff-only policies created this turn with the repo migration's rules.
drop policy if exists "Staff can view grades" on public.student_grades;
drop policy if exists "Staff can insert grades" on public.student_grades;
drop policy if exists "Staff can update grades" on public.student_grades;
drop policy if exists "Staff can delete grades" on public.student_grades;

create policy "Staff read permitted grades" on public.student_grades for select to authenticated
using (
  public.has_role(auth.uid(), 'admin') or exists (
    select 1 from public.courses c
    join public.teacher_profiles t on t.id = c.teacher_id
    join public.course_students cs on cs.course_id = c.id
    where c.id = student_grades.course_id
      and cs.student_id = student_grades.student_id
      and t.user_id = auth.uid()
  )
);
create policy "Staff create permitted grades" on public.student_grades for insert to authenticated
with check (
  public.has_role(auth.uid(), 'admin') or exists (
    select 1 from public.courses c
    join public.teacher_profiles t on t.id = c.teacher_id
    join public.course_students cs on cs.course_id = c.id
    where c.id = student_grades.course_id
      and cs.student_id = student_grades.student_id
      and t.user_id = auth.uid()
  )
);
create policy "Staff update permitted grades" on public.student_grades for update to authenticated
using (
  public.has_role(auth.uid(), 'admin') or exists (
    select 1 from public.courses c join public.teacher_profiles t on t.id = c.teacher_id
    where c.id = student_grades.course_id and t.user_id = auth.uid()
  )
) with check (
  public.has_role(auth.uid(), 'admin') or exists (
    select 1 from public.courses c join public.teacher_profiles t on t.id = c.teacher_id
    where c.id = student_grades.course_id and t.user_id = auth.uid()
  )
);
create policy "Staff delete permitted grades" on public.student_grades for delete to authenticated
using (
  public.has_role(auth.uid(), 'admin') or exists (
    select 1 from public.courses c join public.teacher_profiles t on t.id = c.teacher_id
    where c.id = student_grades.course_id and t.user_id = auth.uid()
  )
);

drop trigger if exists trg_student_grades_updated_at on public.student_grades;
create trigger student_grades_updated_at before update on public.student_grades
  for each row execute function public.update_updated_at_column();

create or replace function public.refresh_student_average()
returns trigger language plpgsql security definer set search_path = public as $$
declare affected_student uuid;
begin
  affected_student := case when tg_op = 'DELETE' then old.student_id else new.student_id end;
  update public.students
  set score = (select round(avg(grade), 1) from public.student_grades where student_id = affected_student)
  where id = affected_student;
  return case when tg_op = 'DELETE' then old else new end;
end; $$;
revoke execute on function public.refresh_student_average() from public, anon, authenticated;
drop trigger if exists student_average_after_grade on public.student_grades;
create trigger student_average_after_grade
  after insert or update or delete on public.student_grades
  for each row execute function public.refresh_student_average();

create or replace function public.submit_admission_request(
  p_student_name text,
  p_student_document text,
  p_birth_date date,
  p_desired_level text,
  p_guardian_name text,
  p_guardian_document text,
  p_guardian_email text,
  p_guardian_phone text,
  p_entry_type text default 'nuevo'
) returns uuid
language plpgsql security definer set search_path = public as $$
declare new_id uuid;
begin
  if p_entry_type not in ('nuevo', 'regular', 'reingreso') then raise exception 'Tipo de ingreso inválido'; end if;
  if char_length(trim(p_student_name)) not between 3 and 120 then raise exception 'Nombre inválido'; end if;
  if char_length(trim(p_guardian_name)) not between 3 and 120 then raise exception 'Encargado inválido'; end if;
  if p_birth_date > current_date then raise exception 'Fecha de nacimiento inválida'; end if;
  insert into public.admission_requests (
    student_name, student_document, birth_date, desired_level, guardian_name,
    guardian_document, guardian_email, guardian_phone, entry_type, status, admin_note
  ) values (
    trim(p_student_name), trim(p_student_document), p_birth_date, trim(p_desired_level), trim(p_guardian_name),
    trim(p_guardian_document), lower(trim(p_guardian_email)), trim(p_guardian_phone), p_entry_type, 'pendiente', ''
  ) returning id into new_id;
  return new_id;
end; $$;
revoke all on function public.submit_admission_request(text,text,date,text,text,text,text,text,text) from public;
grant execute on function public.submit_admission_request(text,text,date,text,text,text,text,text,text) to anon, authenticated;
