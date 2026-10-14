-- Code of conduct reports: one row per submission from /conduct/report/.
-- Anyone (anon key) may insert; nobody but the dashboard / service role may read.
-- Idempotent: safe to re-run against the same project.

create extension if not exists pgcrypto;

create table if not exists public.conduct_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  what text not null check (char_length(what) between 1 and 4000),
  when_where text check (when_where is null or char_length(when_where) <= 300),
  who text check (who is null or char_length(who) <= 300),
  wants text not null default 'act' check (wants in ('act', 'log', 'talk')),
  contact text check (contact is null or char_length(contact) <= 200),
  on_behalf boolean not null default false,
  status text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  notes text
);

alter table public.conduct_reports enable row level security;

-- Only the service role (dashboard, SQL editor) reads, updates or deletes.
revoke all on public.conduct_reports from anon, authenticated;
grant insert on public.conduct_reports to anon, authenticated;

drop policy if exists "conduct_reports_insert_public" on public.conduct_reports;
create policy "conduct_reports_insert_public"
  on public.conduct_reports
  for insert
  to anon, authenticated
  with check (status = 'new' and notes is null);

-- No select policy on purpose: a submitter cannot read their own or anyone's report.
