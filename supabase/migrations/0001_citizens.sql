-- Citizens directory: one row per citizen, keyed to an auth.users account.
-- Idempotent where cheap: safe to re-run against the same project.

create extension if not exists pgcrypto;

create table if not exists public.citizens (
  id uuid primary key default gen_random_uuid(),
  no serial unique not null,
  user_id uuid unique references auth.users(id) on delete cascade,
  code text not null check (code ~ '^1[mf][0-9a-z-]{8}$'),
  name text not null check (char_length(name) between 1 and 24),
  bio text not null default '' check (char_length(bio) <= 140),
  x text check (x is null or x ~ '^[A-Za-z0-9_]{1,15}$'),
  linkedin text check (linkedin is null or linkedin ~ '^https://www\.linkedin\.com/in/[A-Za-z0-9_%\-]+/?$'),
  visible boolean not null default true,
  is_seed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint citizens_user_id_required_unless_seed check (is_seed or user_id is not null)
);

-- bump updated_at on every update
create or replace function public.citizens_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists citizens_set_updated_at on public.citizens;
create trigger citizens_set_updated_at
  before update on public.citizens
  for each row
  execute function public.citizens_set_updated_at();

alter table public.citizens enable row level security;

drop policy if exists "citizens_select_visible" on public.citizens;
create policy "citizens_select_visible"
  on public.citizens
  for select
  to anon, authenticated
  using (visible = true);

drop policy if exists "citizens_insert_own" on public.citizens;
create policy "citizens_insert_own"
  on public.citizens
  for insert
  to authenticated
  with check (user_id = auth.uid() and is_seed = false);

drop policy if exists "citizens_update_own" on public.citizens;
create policy "citizens_update_own"
  on public.citizens
  for update
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "citizens_delete_own" on public.citizens;
create policy "citizens_delete_own"
  on public.citizens
  for delete
  to authenticated
  using (user_id = auth.uid());

-- public-safe projection: no user_id, security_invoker so RLS still applies to the querying role
create or replace view public.citizens_public
  with (security_invoker = true) as
  select no, code, name, bio, x, linkedin, created_at
  from public.citizens
  where visible = true;

grant select on public.citizens to anon, authenticated;
grant select on public.citizens_public to anon, authenticated;

-- seed the 16 mock citizens from new-site/citizens/data/citizens.json, is_seed = true, no user.
-- guarded so this only ever runs once; omitting "no" lets the serial assign 1..16 in order.
insert into public.citizens (code, name, bio, x, linkedin, is_seed, user_id, visible, created_at, updated_at)
select v.code, v.name, v.bio, v.x, v.linkedin, true, null, true, v.joined::timestamptz, v.joined::timestamptz
from (values
  ('1f1001-1--', 'Yuki Takahashi',   'Designs continuous glucose sensors for cats in Osaka.',          'yukitakahashi',   null,                                                   '2026-08-19'),
  ('1m02422--1', 'Lukas Brenner',    'Builds wearable EEG rigs for sleep researchers.',                 'lukasbrenner',    'https://www.linkedin.com/in/lukas-brenner',           '2026-08-22'),
  ('1f2110----', 'Priya Nair',       'Writes firmware for an insulin pump startup in Bengaluru.',       'priyanair',       'https://www.linkedin.com/in/priya-nair',              '2026-08-25'),
  ('1m3123100-', 'Rafael Souza',     'Runs a biotech incubator''s lab space in Sao Paulo.',             null,              null,                                                   '2026-08-29'),
  ('1f4135--1-', 'Amara Okafor',     'Studies gut bacteria samples from popup city residents.',         'amaraokafor',     'https://www.linkedin.com/in/amara-okafor',            '2026-09-02'),
  ('1m53040222', 'Kwame Asante',     'Builds robot hands for a lab automation startup.',                null,              'https://www.linkedin.com/in/kwame-asante',            '2026-09-05'),
  ('1f0251----', 'Elina Korhonen',   'Tracks supply chains for Nordic biotech startups.',               'elinakorhonen',   null,                                                   '2026-09-08'),
  ('1m1010-1--', 'Minho Seo',        'Codes trading models for a Seoul biotech fund.',                  'minhoseo',        'https://www.linkedin.com/in/minho-seo',               '2026-09-10'),
  ('1f31422---', 'Camila Reyes',     'Photographs biotech labs for a Mexico City magazine.',            null,              null,                                                   '2026-09-12'),
  ('1m2423--0-', 'Arjun Mehta',      'Builds low-cost diagnostic kits for rural clinics.',               'arjunmehta',      'https://www.linkedin.com/in/arjun-mehta',             '2026-09-14'),
  ('1f5305-0-0', 'Zuri Washington',  'Runs a mentoring program for first-time biotech founders.',       'zuriwashington',  null,                                                   '2026-09-17'),
  ('1m4531----', 'Diego Fernandez',  'Writes a newsletter about longevity startups in Latin America.',  null,              'https://www.linkedin.com/in/diego-fernandez',         '2026-09-19'),
  ('1f11501---', 'Charlotte Dubois', 'Designs lab furniture for compact biotech spaces.',                'charlottedubois', 'https://www.linkedin.com/in/charlotte-dubois',        '2026-09-22'),
  ('1m0112----', 'Tyler Brooks',     'Plans drone delivery routes for lab samples.',                     'tylerbrooks',     null,                                                   '2026-09-25'),
  ('1f2023--1-', 'Seoyeon Park',     'Runs a podcast about Asian biotech founders.',                     'seoyeonpark',     'https://www.linkedin.com/in/seoyeon-park',            '2026-09-28'),
  ('1m3044012-', 'Kenji Watanabe',   'Maintains open source tools for protein folding models.',          null,              'https://www.linkedin.com/in/kenji-watanabe',          '2026-10-01')
) as v(code, name, bio, x, linkedin, joined)
where not exists (select 1 from public.citizens where is_seed = true);
