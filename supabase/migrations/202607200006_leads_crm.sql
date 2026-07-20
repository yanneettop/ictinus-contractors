-- Leads & Enquiries CRM. No production seed data is created by this migration.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  email text not null default '', phone text not null default '', postcode text not null default '', full_address text not null default '',
  project_type text not null default 'Other', custom_project_type text not null default '', enquiry_summary text not null default '',
  estimated_value_pence bigint, estimated_value_min_pence bigint, estimated_value_max_pence bigint, budget_pence bigint,
  stage text not null default 'New' check (stage in ('New','Contacted','Site Visit Booked','Site Visit Completed','Quote Preparing','Quote Sent','Follow-up Due','Negotiation','Won','Lost','Archived')),
  priority text not null default 'Normal' check (priority in ('Low','Normal','High','Urgent')),
  source text not null default 'Other', source_reference text not null default '',
  bark_credits_spent numeric(10,2), bark_purchased_at timestamptz, bark_client_replied boolean not null default false, bark_site_visit_booked boolean not null default false, bark_job_won boolean not null default false,
  assigned_to uuid references public.profiles(id) on delete set null,
  preferred_contact_method text not null default 'Phone', preferred_contact_time text not null default '',
  first_contacted_at timestamptz, last_contacted_at timestamptz,
  next_action text not null default '', next_action_due_at timestamptz, reminder_status text not null default 'None',
  site_visit_date timestamptz, site_visit_status text not null default 'Not booked',
  lost_reason text, lost_notes text, internal_notes text not null default '',
  converted_project_id uuid unique references public.projects(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null, updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.lead_quotes (
  id uuid primary key default gen_random_uuid(), lead_id uuid not null references public.leads(id) on delete cascade,
  reference text not null default '', amount_pence bigint, status text not null default 'Preparing', sent_at timestamptz, notes text not null default '',
  created_by uuid references public.profiles(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.leads add column if not exists quote_id uuid references public.lead_quotes(id) on delete set null;

create table if not exists public.lead_communications (
  id uuid primary key default gen_random_uuid(), lead_id uuid not null references public.leads(id) on delete cascade,
  type text not null check (type in ('Call','Email','SMS','WhatsApp','Meeting','Note')),
  direction text not null default 'Internal' check (direction in ('Inbound','Outbound','Internal')),
  occurred_at timestamptz not null default now(), summary text not null, note text not null default '',
  author_id uuid references public.profiles(id) on delete set null, attachment_url text, external_link text,
  created_at timestamptz not null default now()
);

alter table public.project_events alter column project_id drop not null;
alter table public.project_events add column if not exists lead_id uuid references public.leads(id) on delete cascade;
alter table public.tasks alter column project_id drop not null;
alter table public.tasks add column if not exists lead_id uuid references public.leads(id) on delete cascade;
alter table public.tasks drop constraint if exists tasks_priority_check;
alter table public.tasks add constraint tasks_priority_check check (priority in ('Low','Normal','Medium','High','Urgent'));
alter table public.activity_logs alter column project_id drop not null;
alter table public.activity_logs add column if not exists lead_id uuid references public.leads(id) on delete cascade;

create index if not exists leads_stage_idx on public.leads(stage);
create index if not exists leads_assigned_idx on public.leads(assigned_to);
create index if not exists leads_next_action_due_idx on public.leads(next_action_due_at) where next_action_due_at is not null;
create index if not exists leads_identity_idx on public.leads(lower(email), phone, upper(postcode));
create index if not exists lead_communications_lead_idx on public.lead_communications(lead_id, occurred_at desc);
create index if not exists lead_quotes_lead_idx on public.lead_quotes(lead_id);
create index if not exists project_events_lead_idx on public.project_events(lead_id) where lead_id is not null;
create index if not exists tasks_lead_idx on public.tasks(lead_id) where lead_id is not null;
create index if not exists activity_logs_lead_idx on public.activity_logs(lead_id, created_at desc) where lead_id is not null;

alter table public.leads enable row level security;
alter table public.lead_quotes enable row level security;
alter table public.lead_communications enable row level security;

create policy "leads visible to administrators or assignee" on public.leads for select to authenticated using (public.is_admin() or assigned_to = auth.uid());
create policy "administrators manage leads" on public.leads for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "assignees update leads" on public.leads for update to authenticated using (assigned_to = auth.uid()) with check (assigned_to = auth.uid());
create policy "lead records visible to lead viewers" on public.lead_quotes for select to authenticated using (exists (select 1 from public.leads l where l.id = lead_id));
create policy "administrators manage lead quotes" on public.lead_quotes for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "lead communications visible to lead viewers" on public.lead_communications for select to authenticated using (exists (select 1 from public.leads l where l.id = lead_id));
create policy "team log lead communications" on public.lead_communications for insert to authenticated with check (exists (select 1 from public.leads l where l.id = lead_id) and author_id = auth.uid());
create policy "administrators manage lead communications" on public.lead_communications for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant select, insert, update, delete on public.leads, public.lead_quotes, public.lead_communications to authenticated;
grant all on public.leads, public.lead_quotes, public.lead_communications to service_role;

create or replace function public.guard_site_manager_lead_update()
returns trigger language plpgsql set search_path = public as $$
declare actor_role text;
begin
  if auth.uid() is null then return new; end if;
  select role into actor_role from public.profiles where id = auth.uid();
  if actor_role = 'administrator' then return new; end if;
  if new.assigned_to is distinct from old.assigned_to
    or new.estimated_value_pence is distinct from old.estimated_value_pence
    or new.budget_pence is distinct from old.budget_pence
    or new.quote_id is distinct from old.quote_id
    or new.converted_project_id is distinct from old.converted_project_id
    or new.lost_reason is distinct from old.lost_reason
    or new.lost_notes is distinct from old.lost_notes
    or new.bark_credits_spent is distinct from old.bark_credits_spent
    or new.source is distinct from old.source
    or new.stage in ('Won','Lost','Archived','Quote Preparing','Quote Sent','Negotiation') and new.stage is distinct from old.stage
  then raise exception 'Administrator permission required for this lead change'; end if;
  return new;
end $$;
drop trigger if exists guard_site_manager_lead_update on public.leads;
create trigger guard_site_manager_lead_update before update on public.leads for each row execute function public.guard_site_manager_lead_update();

create or replace function public.convert_lead_to_project(target_lead_id uuid, conversion jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare l public.leads%rowtype; client_uuid uuid; project_uuid uuid; actor uuid := auth.uid(); actor_role text;
begin
  select * into l from public.leads where id = target_lead_id for update;
  if not found then raise exception 'Lead not found'; end if;
  if l.converted_project_id is not null then return l.converted_project_id; end if;
  if actor is not null then
    select role into actor_role from public.profiles where id = actor;
    if actor_role is distinct from 'administrator' then raise exception 'Administrator permission required'; end if;
  end if;
  select id into client_uuid from public.clients where (l.email <> '' and lower(email)=lower(l.email)) or (l.phone <> '' and phone=l.phone) order by created_at limit 1;
  if client_uuid is null then
    insert into public.clients(name,email,phone,preferred_contact,best_contact_time) values(l.client_name,l.email,l.phone,l.preferred_contact_method,l.preferred_contact_time) returning id into client_uuid;
  end if;
  insert into public.projects(client_id,title,project_type,description,status,address,postcode,start_date,end_date,assigned_to,contract_value_pence,internal_notes,next_action,created_at,updated_at)
  values(client_uuid, coalesce(nullif(conversion->>'title',''), l.project_type || ' - ' || l.client_name), l.project_type, l.enquiry_summary, 'Confirmed',
    coalesce(nullif(conversion->>'address',''),l.full_address), upper(coalesce(nullif(conversion->>'postcode',''),l.postcode)),
    coalesce((conversion->>'startDate')::date, current_date), coalesce((conversion->>'endDate')::date, current_date),
    coalesce((conversion->>'assignedTo')::uuid,l.assigned_to), coalesce((conversion->>'contractValuePence')::bigint,l.estimated_value_pence,0),
    concat_ws(E'\n',l.internal_notes,case when l.quote_id is not null then 'Lead quote: '||l.quote_id::text end), 'Plan confirmed works', now(), now()) returning id into project_uuid;
  update public.project_events set project_id=project_uuid, lead_id=null where lead_id=l.id;
  update public.tasks set project_id=project_uuid, lead_id=null where lead_id=l.id;
  update public.leads set stage='Won', converted_project_id=project_uuid, bark_job_won=case when source='Bark' then true else bark_job_won end, updated_by=actor, updated_at=now() where id=l.id;
  insert into public.activity_logs(project_id,lead_id,user_id,action,actor_type,source,entity_type,entity_id,new_values)
    values(project_uuid,l.id,actor,'Lead converted to project',case when actor is null then 'integration' else 'user' end,case when actor is null then 'integration_api' else 'job_manager' end,'lead',l.id,jsonb_build_object('projectId',project_uuid));
  return project_uuid;
end $$;
grant execute on function public.convert_lead_to_project(uuid,jsonb) to authenticated, service_role;

do $$ begin
  alter publication supabase_realtime add table public.leads;
exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.lead_communications; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.lead_quotes; exception when duplicate_object then null; end $$;
