-- Ictinus Job Manager production schema
-- Apply with Supabase CLI or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('administrator', 'site_manager');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  email text not null default '',
  role public.app_role not null default 'site_manager',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.current_app_role()
returns public.app_role
language sql stable security definer
set search_path = public
as $$ select role from public.profiles where id = auth.uid() and active = true $$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$ select coalesce(public.current_app_role() = 'administrator', false) $$;

create or replace function public.is_active_member()
returns boolean
language sql stable security definer
set search_path = public
as $$ select public.current_app_role() is not null $$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)), coalesce(new.email, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_auth_user();

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  email text not null default '',
  preferred_contact text not null default 'Phone',
  best_contact_time text not null default '',
  emergency_contact text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete restrict,
  title text not null,
  project_type text not null,
  description text not null default '',
  status text not null check (status in ('Enquiry','Quoted','Confirmed','Scheduled','In Progress','On Hold','Completed','Cancelled')),
  address text not null,
  postcode text not null,
  start_date date not null,
  end_date date not null check (end_date >= start_date),
  estimated_duration text not null default '',
  assigned_to uuid references public.profiles(id) on delete set null,
  contract_value_pence bigint not null default 0 check (contract_value_pence >= 0),
  amount_paid_pence bigint not null default 0 check (amount_paid_pence >= 0),
  outstanding_balance_pence bigint not null default 0 check (outstanding_balance_pence >= 0),
  access_notes text not null default '',
  parking_notes text not null default '',
  key_status text not null default 'Not collected',
  internal_notes text not null default '',
  next_action text not null default 'Review project',
  scope text[] not null default '{}',
  provisional boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null,
  title text not null,
  start_date timestamptz not null,
  end_date timestamptz not null,
  all_day boolean not null default true,
  location text not null default '',
  notes text not null default '',
  colour_category text not null default 'green',
  google_calendar_event_id text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  due_date date not null,
  assigned_to uuid references public.profiles(id) on delete set null,
  priority text not null check (priority in ('Low','Medium','High')),
  completed boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  percentage numeric(5,2) not null default 0 check (percentage between 0 and 100),
  amount_pence bigint not null check (amount_pence >= 0),
  due_date date not null,
  paid_date date,
  status text not null check (status in ('Due','Paid')),
  invoice_reference text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null,
  name text not null,
  external_url text,
  storage_path text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint document_has_source check (external_url is not null or storage_path is not null)
);

create table if not exists public.project_photos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stage text not null check (stage in ('Before','Progress','Completed')),
  title text not null,
  storage_path text not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  category text not null check (category in ('General','Client','Materials','Payments','Site','Issue','Variation','Completion')),
  message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  created_at timestamptz not null default now()
);

create index if not exists projects_status_idx on public.projects(status);
create index if not exists projects_dates_idx on public.projects(start_date, end_date);
create index if not exists tasks_project_due_idx on public.tasks(project_id, due_date);
create index if not exists payments_project_due_idx on public.payments(project_id, due_date);
create index if not exists events_project_start_idx on public.project_events(project_id, start_date);
create index if not exists journal_project_created_idx on public.journal_entries(project_id, created_at desc);
create index if not exists activity_project_created_idx on public.activity_logs(project_id, created_at desc);

create or replace function public.guard_project_financial_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() and (
    new.client_id is distinct from old.client_id or new.title is distinct from old.title or
    new.project_type is distinct from old.project_type or new.description is distinct from old.description or
    new.address is distinct from old.address or new.postcode is distinct from old.postcode or
    new.start_date is distinct from old.start_date or new.end_date is distinct from old.end_date or
    new.assigned_to is distinct from old.assigned_to or
    new.contract_value_pence is distinct from old.contract_value_pence or
    new.amount_paid_pence is distinct from old.amount_paid_pence or
    new.outstanding_balance_pence is distinct from old.outstanding_balance_pence
  ) then raise exception 'Insufficient permission to change protected project fields';
  end if;
  return new;
end;
$$;

drop trigger if exists guard_project_financial_fields on public.projects;
create trigger guard_project_financial_fields before update on public.projects
for each row execute procedure public.guard_project_financial_fields();

create or replace function public.recalculate_project_financials()
returns trigger language plpgsql security definer set search_path = public as $$
declare target_project uuid;
begin
  target_project := case when tg_op = 'DELETE' then old.project_id else new.project_id end;
  update public.projects p set
    amount_paid_pence = coalesce((select sum(amount_pence) from public.payments where project_id = target_project and status = 'Paid'), 0),
    outstanding_balance_pence = greatest(0, p.contract_value_pence - coalesce((select sum(amount_pence) from public.payments where project_id = target_project and status = 'Paid'), 0)),
    updated_at = now()
  where p.id = target_project;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists recalculate_project_financials on public.payments;
create trigger recalculate_project_financials after insert or update or delete on public.payments
for each row execute procedure public.recalculate_project_financials();

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_events enable row level security;
alter table public.tasks enable row level security;
alter table public.payments enable row level security;
alter table public.documents enable row level security;
alter table public.project_photos enable row level security;
alter table public.journal_entries enable row level security;
alter table public.activity_logs enable row level security;

do $$
declare table_name text;
begin
  foreach table_name in array array['profiles','clients','projects','project_events','tasks','payments','documents','project_photos','journal_entries','activity_logs'] loop
    execute format('drop policy if exists "team read" on public.%I', table_name);
    execute format('create policy "team read" on public.%I for select to authenticated using (public.is_active_member())', table_name);
  end loop;
end $$;

create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage clients" on public.clients for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins create projects" on public.projects for insert to authenticated with check (public.is_admin());
create policy "team update projects" on public.projects for update to authenticated using (public.is_active_member()) with check (public.is_active_member());
create policy "admins delete projects" on public.projects for delete to authenticated using (public.is_admin());
create policy "team manage events" on public.project_events for all to authenticated using (public.is_active_member()) with check (public.is_active_member());
create policy "team create tasks" on public.tasks for insert to authenticated with check (public.is_active_member());
create policy "team update tasks" on public.tasks for update to authenticated using (public.is_active_member()) with check (public.is_active_member());
create policy "admins delete tasks" on public.tasks for delete to authenticated using (public.is_admin());
create policy "admins manage payments" on public.payments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "team add documents" on public.documents for insert to authenticated with check (public.is_active_member() and uploaded_by = auth.uid());
create policy "owners or admins delete documents" on public.documents for delete to authenticated using (uploaded_by = auth.uid() or public.is_admin());
create policy "team add photos" on public.project_photos for insert to authenticated with check (public.is_active_member() and uploaded_by = auth.uid());
create policy "owners or admins delete photos" on public.project_photos for delete to authenticated using (uploaded_by = auth.uid() or public.is_admin());
create policy "team add journal" on public.journal_entries for insert to authenticated with check (public.is_active_member() and user_id = auth.uid());
create policy "owners or admins update journal" on public.journal_entries for update to authenticated using (user_id = auth.uid() or public.is_admin()) with check (user_id = auth.uid() or public.is_admin());
create policy "owners or admins delete journal" on public.journal_entries for delete to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "team add activity" on public.activity_logs for insert to authenticated with check (public.is_active_member() and user_id = auth.uid());
create policy "admins delete activity" on public.activity_logs for delete to authenticated using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ictinus-project-files', 'ictinus-project-files', false, 26214400, array['image/jpeg','image/png','image/webp','application/pdf'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "team read project files" on storage.objects for select to authenticated
using (bucket_id = 'ictinus-project-files' and public.is_active_member());
create policy "team upload project files" on storage.objects for insert to authenticated
with check (bucket_id = 'ictinus-project-files' and public.is_active_member() and (storage.foldername(name))[1] is not null);
create policy "owners or admins delete project files" on storage.objects for delete to authenticated
using (bucket_id = 'ictinus-project-files' and (owner_id = auth.uid()::text or public.is_admin()));

do $$
declare table_name text;
begin
  foreach table_name in array array['projects','project_events','tasks','payments','documents','project_photos','journal_entries','activity_logs'] loop
    if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = table_name) then
      execute format('alter publication supabase_realtime add table public.%I', table_name);
    end if;
  end loop;
end $$;
