-- Gamificación estudiantil: monedas, avatar y canje de premios
create table if not exists public.student_gamification (
  student_id uuid primary key references public.students(id) on delete cascade,
  coins integer not null default 0 check (coins >= 0),
  avatar_key text not null default 'lumi',
  mood text not null default 'feliz',
  streak integer not null default 0 check (streak >= 0),
  last_interaction timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.student_gamification enable row level security;

drop policy if exists "staff can view gamification" on public.student_gamification;
create policy "staff can view gamification"
on public.student_gamification
for select
to authenticated
using (public.is_staff(auth.uid()));

drop policy if exists "students can view own gamification" on public.student_gamification;
create policy "students can view own gamification"
on public.student_gamification
for select
to authenticated
using (
  exists (
    select 1
    from public.students s
    where s.id = student_gamification.student_id
      and lower(s.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
);

create or replace function public.award_student_coins(
  p_student_id uuid,
  p_amount integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_coins integer;
begin
  if not public.is_staff(auth.uid()) then
    raise exception 'Solo personal autorizado puede otorgar monedas';
  end if;

  if p_amount = 0 or abs(p_amount) > 500 then
    raise exception 'La cantidad debe estar entre -500 y 500 y no puede ser 0';
  end if;

  insert into public.student_gamification (student_id, coins)
  values (p_student_id, greatest(p_amount, 0))
  on conflict (student_id) do update
    set coins = greatest(0, public.student_gamification.coins + p_amount),
        updated_at = now()
  returning coins into v_coins;

  return v_coins;
end;
$$;

create or replace function public.student_avatar_interact(
  p_student_id uuid,
  p_mood text default 'feliz'
)
returns table(coins integer, mood text, streak integer, last_interaction timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_last timestamptz;
  v_streak integer;
begin
  if not exists (
    select 1 from public.students s
    where s.id = p_student_id
      and lower(s.email) = v_email
  ) then
    raise exception 'No podés modificar este avatar';
  end if;

  select sg.last_interaction, sg.streak
  into v_last, v_streak
  from public.student_gamification sg
  where sg.student_id = p_student_id;

  v_streak := case
    when v_last is null then 1
    when v_last::date = current_date then coalesce(v_streak, 1)
    when v_last::date = current_date - 1 then coalesce(v_streak, 0) + 1
    else 1
  end;

  insert into public.student_gamification (student_id, mood, streak, last_interaction)
  values (p_student_id, left(coalesce(nullif(p_mood, ''), 'feliz'), 30), v_streak, now())
  on conflict (student_id) do update
    set mood = excluded.mood,
        streak = excluded.streak,
        last_interaction = excluded.last_interaction,
        updated_at = now();

  return query
  select sg.coins, sg.mood, sg.streak, sg.last_interaction
  from public.student_gamification sg
  where sg.student_id = p_student_id;
end;
$$;

create or replace function public.redeem_student_reward(
  p_student_id uuid,
  p_cost integer
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_coins integer;
begin
  if p_cost <= 0 or p_cost > 10000 then
    raise exception 'Costo inválido';
  end if;

  if not exists (
    select 1 from public.students s
    where s.id = p_student_id
      and lower(s.email) = v_email
  ) then
    raise exception 'No podés canjear premios para este estudiante';
  end if;

  insert into public.student_gamification (student_id)
  values (p_student_id)
  on conflict (student_id) do nothing;

  select coins into v_coins
  from public.student_gamification
  where student_id = p_student_id
  for update;

  if v_coins < p_cost then
    raise exception 'No tenés suficientes Monedas CEAC';
  end if;

  update public.student_gamification
  set coins = coins - p_cost,
      updated_at = now()
  where student_id = p_student_id
  returning coins into v_coins;

  return v_coins;
end;
$$;

grant execute on function public.award_student_coins(uuid, integer) to authenticated;
grant execute on function public.student_avatar_interact(uuid, text) to authenticated;
grant execute on function public.redeem_student_reward(uuid, integer) to authenticated;
