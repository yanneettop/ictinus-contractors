-- Attach private files and structured quote details to leads, then carry them into projects.
alter table public.documents alter column project_id drop not null;
alter table public.documents add column if not exists lead_id uuid references public.leads(id) on delete cascade;
create index if not exists documents_lead_idx on public.documents(lead_id) where lead_id is not null;

alter table public.documents drop constraint if exists document_has_single_owner;
alter table public.documents add constraint document_has_single_owner
  check (num_nonnulls(project_id, lead_id) = 1);

alter table public.lead_quotes add column if not exists document_id uuid references public.documents(id) on delete set null;
alter table public.lead_quotes add column if not exists project_title text not null default '';
alter table public.lead_quotes add column if not exists project_type text not null default '';
alter table public.lead_quotes add column if not exists description text not null default '';
alter table public.lead_quotes add column if not exists scope jsonb not null default '[]'::jsonb;
alter table public.lead_quotes add column if not exists address text not null default '';
alter table public.lead_quotes add column if not exists postcode text not null default '';
alter table public.lead_quotes add column if not exists start_date date;
alter table public.lead_quotes add column if not exists end_date date;

create or replace function public.convert_lead_to_project(target_lead_id uuid, conversion jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  l public.leads%rowtype;
  q public.lead_quotes%rowtype;
  client_uuid uuid;
  project_uuid uuid;
  actor uuid := auth.uid();
  actor_role text;
  project_start date;
  project_end date;
begin
  select * into l from public.leads where id = target_lead_id for update;
  if not found then raise exception 'Lead not found'; end if;
  if l.converted_project_id is not null then return l.converted_project_id; end if;
  if actor is not null then
    select role into actor_role from public.profiles where id = actor;
    if actor_role is distinct from 'administrator' then raise exception 'Administrator permission required'; end if;
  end if;

  if l.quote_id is not null then
    select * into q from public.lead_quotes where id = l.quote_id and lead_id = l.id;
  end if;
  if q.id is null then
    select * into q from public.lead_quotes where lead_id = l.id order by updated_at desc limit 1;
  end if;

  project_start := coalesce(nullif(conversion->>'startDate','')::date, q.start_date, current_date);
  project_end := coalesce(nullif(conversion->>'endDate','')::date, q.end_date, project_start);
  if project_end < project_start then raise exception 'Project end date cannot be before start date'; end if;

  select id into client_uuid from public.clients
    where (l.email <> '' and lower(email)=lower(l.email)) or (l.phone <> '' and phone=l.phone)
    order by created_at limit 1;
  if client_uuid is null then
    insert into public.clients(name,email,phone,preferred_contact,best_contact_time)
      values(l.client_name,l.email,l.phone,l.preferred_contact_method,l.preferred_contact_time)
      returning id into client_uuid;
  end if;

  insert into public.projects(
    client_id,title,project_type,description,status,address,postcode,start_date,end_date,assigned_to,
    contract_value_pence,internal_notes,next_action,scope,created_at,updated_at
  ) values (
    client_uuid,
    coalesce(nullif(conversion->>'title',''), nullif(q.project_title,''), l.project_type || ' - ' || l.client_name),
    coalesce(nullif(q.project_type,''), l.project_type),
    coalesce(nullif(q.description,''), l.enquiry_summary),
    'Confirmed',
    coalesce(nullif(conversion->>'address',''), nullif(q.address,''), l.full_address),
    upper(coalesce(nullif(conversion->>'postcode',''), nullif(q.postcode,''), l.postcode)),
    project_start,
    project_end,
    coalesce(nullif(conversion->>'assignedTo','')::uuid,l.assigned_to),
    coalesce(nullif(conversion->>'contractValuePence','')::bigint,q.amount_pence,l.estimated_value_pence,0),
    concat_ws(E'\n',l.internal_notes,case when q.reference <> '' then 'Accepted quote: '||q.reference end),
    'Plan confirmed works',
    array(select jsonb_array_elements_text(coalesce(q.scope,'[]'::jsonb))),
    now(),now()
  ) returning id into project_uuid;

  update public.documents set project_id=project_uuid, lead_id=null where lead_id=l.id;
  update public.project_events set project_id=project_uuid, lead_id=null where lead_id=l.id;
  update public.tasks set project_id=project_uuid, lead_id=null where lead_id=l.id;
  update public.leads set stage='Won', converted_project_id=project_uuid,
    bark_job_won=case when source='Bark' then true else bark_job_won end,
    updated_by=actor, updated_at=now() where id=l.id;
  insert into public.activity_logs(project_id,lead_id,user_id,action,actor_type,source,entity_type,entity_id,new_values)
    values(project_uuid,l.id,actor,'Lead won and converted to project',case when actor is null then 'integration' else 'user' end,
      case when actor is null then 'integration_api' else 'job_manager' end,'lead',l.id,
      jsonb_build_object('projectId',project_uuid,'quoteId',q.id));
  return project_uuid;
end $$;

grant execute on function public.convert_lead_to_project(uuid,jsonb) to authenticated, service_role;
