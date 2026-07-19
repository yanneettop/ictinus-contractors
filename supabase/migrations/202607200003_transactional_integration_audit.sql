-- Guarantee that server integration mutations and audit records commit atomically.

create or replace function public.audit_service_role_mutation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_project_id uuid;
  target_entity_type text;
  target_action text;
begin
  if auth.role() is distinct from 'service_role' then
    return new;
  end if;

  target_project_id := case when tg_table_name = 'projects' then new.id else new.project_id end;
  target_entity_type := case tg_table_name
    when 'projects' then 'project'
    when 'tasks' then 'task'
    when 'payments' then 'payment'
    when 'journal_entries' then 'journal_entry'
    when 'project_events' then 'event'
  end;
  target_action := case
    when tg_table_name = 'projects' and tg_op = 'UPDATE' and new.status = 'Completed' and old.status is distinct from 'Completed' then 'project.completed'
    when tg_table_name = 'projects' then 'project.updated'
    when tg_table_name = 'tasks' and tg_op = 'INSERT' then 'task.created'
    when tg_table_name = 'tasks' then 'task.updated'
    when tg_table_name = 'payments' and tg_op = 'INSERT' then 'payment.created'
    when tg_table_name = 'payments' and new.status = 'Paid' and old.status is distinct from 'Paid' then 'payment.marked_paid'
    when tg_table_name = 'payments' then 'payment.updated'
    when tg_table_name = 'journal_entries' then 'journal.created'
    when tg_table_name = 'project_events' and tg_op = 'INSERT' then 'event.created'
    else 'event.updated'
  end;

  insert into public.activity_logs (
    project_id, user_id, action, actor_type, actor_name, source,
    entity_type, entity_id, previous_values, new_values, created_at
  ) values (
    target_project_id, null, target_action, 'integration', 'ChatGPT', 'chatgpt_integration',
    target_entity_type, new.id,
    case when tg_op = 'UPDATE' then to_jsonb(old) else null end,
    to_jsonb(new), now()
  );

  return new;
end;
$$;

drop trigger if exists audit_integration_projects on public.projects;
create trigger audit_integration_projects after update on public.projects
for each row execute function public.audit_service_role_mutation();

drop trigger if exists audit_integration_tasks on public.tasks;
create trigger audit_integration_tasks after insert or update on public.tasks
for each row execute function public.audit_service_role_mutation();

drop trigger if exists audit_integration_payments on public.payments;
create trigger audit_integration_payments after insert or update on public.payments
for each row execute function public.audit_service_role_mutation();

drop trigger if exists audit_integration_journal on public.journal_entries;
create trigger audit_integration_journal after insert on public.journal_entries
for each row execute function public.audit_service_role_mutation();

drop trigger if exists audit_integration_events on public.project_events;
create trigger audit_integration_events after insert or update on public.project_events
for each row execute function public.audit_service_role_mutation();

