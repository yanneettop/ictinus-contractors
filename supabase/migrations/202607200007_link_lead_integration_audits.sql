-- Preserve the lead relationship when ChatGPT creates lead tasks or visits.
create or replace function public.audit_service_role_mutation()
returns trigger language plpgsql security definer set search_path = public as $$
declare target_project_id uuid; target_lead_id uuid; target_entity_type text; target_action text;
begin
  if auth.role() is distinct from 'service_role' then return new; end if;
  if tg_table_name = 'projects' then
    target_project_id := new.id; target_entity_type := 'project';
    target_action := case when tg_op='UPDATE' and new.status='Completed' and old.status is distinct from 'Completed' then 'project.completed' else 'project.updated' end;
  elsif tg_table_name = 'tasks' then
    target_project_id := new.project_id; target_lead_id := new.lead_id; target_entity_type := 'task'; target_action := case when tg_op='INSERT' then 'task.created' else 'task.updated' end;
  elsif tg_table_name = 'payments' then
    target_project_id := new.project_id; target_entity_type := 'payment';
    target_action := case when tg_op='INSERT' then 'payment.created' when new.status='Paid' and old.status is distinct from 'Paid' then 'payment.marked_paid' else 'payment.updated' end;
  elsif tg_table_name = 'journal_entries' then
    target_project_id := new.project_id; target_entity_type := 'journal_entry'; target_action := 'journal.created';
  elsif tg_table_name = 'project_events' then
    target_project_id := new.project_id; target_lead_id := new.lead_id; target_entity_type := 'event'; target_action := case when tg_op='INSERT' then 'event.created' else 'event.updated' end;
  else raise exception 'Unsupported audit trigger table: %', tg_table_name;
  end if;
  insert into public.activity_logs(project_id,lead_id,user_id,action,actor_type,actor_name,source,entity_type,entity_id,previous_values,new_values,created_at)
  values(target_project_id,target_lead_id,null,target_action,'integration','ChatGPT','chatgpt_integration',target_entity_type,new.id,case when tg_op='UPDATE' then to_jsonb(old) else null end,to_jsonb(new),now());
  return new;
end $$;
