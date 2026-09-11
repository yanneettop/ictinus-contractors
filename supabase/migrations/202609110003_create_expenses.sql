-- Track project and general business expenses with optional private attachments.
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  expense_date date not null,
  category text not null,
  supplier text not null default '',
  description text not null,
  amount_pence bigint not null check (amount_pence > 0),
  payment_method text not null default 'Company card',
  reference text not null default '',
  notes text not null default '',
  attachment_name text,
  attachment_mime_type text,
  storage_path text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expense_attachment_complete check (
    (storage_path is null and attachment_name is null)
    or (storage_path is not null and attachment_name is not null)
  )
);

create index if not exists expenses_date_idx on public.expenses(expense_date desc);
create index if not exists expenses_project_date_idx on public.expenses(project_id, expense_date desc);

alter table public.expenses enable row level security;

drop policy if exists "admins manage expenses" on public.expenses;
create policy "admins manage expenses" on public.expenses
for all to authenticated
using (public.is_admin())
with check (public.is_admin() and created_by = auth.uid());

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'expenses'
  ) then
    alter publication supabase_realtime add table public.expenses;
  end if;
end $$;
