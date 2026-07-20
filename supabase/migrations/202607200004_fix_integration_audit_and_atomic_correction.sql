-- Fix service-role audit logging and provide one idempotent transaction for
-- coordinated project/payment corrections made by the private integration.

create or replace function public.guard_project_financial_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() is distinct from 'service_role' and not public.is_admin() and (
    new.client_id is distinct from old.client_id or new.title is distinct from old.title or
    new.project_type is distinct from old.project_type or new.description is distinct from old.description or
    new.address is distinct from old.address or new.postcode is distinct from old.postcode or
    new.start_date is distinct from old.start_date or new.end_date is distinct from old.end_date or
    new.assigned_to is distinct from old.assigned_to or
    new.contract_value_pence is distinct from old.contract_value_pence or
    new.amount_paid_pence is distinct from old.amount_paid_pence or
    new.outstanding_balance_pence is distinct from old.outstanding_balance_pence
  ) then
    raise exception 'Insufficient permission to change protected project fields';
  end if;
  return new;
end;
$$;

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

  -- Keep every NEW/OLD field reference inside its table-specific branch.
  -- A CASE expression over a polymorphic trigger record can still attempt to
  -- resolve a field which does not exist on that table.
  if tg_table_name = 'projects' then
    target_project_id := new.id;
    target_entity_type := 'project';
    if tg_op = 'UPDATE' and new.status = 'Completed' and old.status is distinct from 'Completed' then
      target_action := 'project.completed';
    else
      target_action := 'project.updated';
    end if;
  elsif tg_table_name = 'tasks' then
    target_project_id := new.project_id;
    target_entity_type := 'task';
    target_action := case when tg_op = 'INSERT' then 'task.created' else 'task.updated' end;
  elsif tg_table_name = 'payments' then
    target_project_id := new.project_id;
    target_entity_type := 'payment';
    if tg_op = 'INSERT' then
      target_action := 'payment.created';
    elsif new.status = 'Paid' and old.status is distinct from 'Paid' then
      target_action := 'payment.marked_paid';
    else
      target_action := 'payment.updated';
    end if;
  elsif tg_table_name = 'journal_entries' then
    target_project_id := new.project_id;
    target_entity_type := 'journal_entry';
    target_action := 'journal.created';
  elsif tg_table_name = 'project_events' then
    target_project_id := new.project_id;
    target_entity_type := 'event';
    target_action := case when tg_op = 'INSERT' then 'event.created' else 'event.updated' end;
  else
    raise exception 'Unsupported audit trigger table: %', tg_table_name;
  end if;

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

create or replace function public.apply_integration_project_correction(
  target_project_id uuid,
  project_patch jsonb,
  deposit_patch jsonb,
  final_payment_patch jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  unknown_key text;
  deposit_count integer;
  final_count integer;
  deposit_id uuid;
  final_id uuid;
  existing_paid_date date;
  result jsonb;
begin
  if auth.role() is distinct from 'service_role' then
    raise insufficient_privilege using message = 'Service role required';
  end if;

  if not exists (select 1 from public.projects where id = target_project_id) then
    raise no_data_found using message = 'Project not found';
  end if;

  select key into unknown_key
  from jsonb_object_keys(project_patch) as keys(key)
  where key not in ('address','postcode','title','description','scope','contractValuePence','endDate','status','nextAction')
  limit 1;
  if unknown_key is not null then raise exception 'Unsupported project field: %', unknown_key; end if;

  select key into unknown_key
  from jsonb_object_keys(deposit_patch) as keys(key)
  where key not in ('amountPence','percentage','paidDate')
  limit 1;
  if unknown_key is not null then raise exception 'Unsupported deposit field: %', unknown_key; end if;

  select key into unknown_key
  from jsonb_object_keys(final_payment_patch) as keys(key)
  where key not in ('amountPence','percentage','dueDate')
  limit 1;
  if unknown_key is not null then raise exception 'Unsupported final payment field: %', unknown_key; end if;

  if (project_patch->>'contractValuePence')::bigint < 0
    or (deposit_patch->>'amountPence')::bigint < 0
    or (final_payment_patch->>'amountPence')::bigint < 0 then
    raise exception 'Money values cannot be negative';
  end if;
  if (deposit_patch->>'percentage')::numeric not between 0 and 100
    or (final_payment_patch->>'percentage')::numeric not between 0 and 100 then
    raise exception 'Payment percentage must be between 0 and 100';
  end if;

  update public.projects
  set address = project_patch->>'address',
      postcode = project_patch->>'postcode',
      title = project_patch->>'title',
      description = project_patch->>'description',
      scope = array(select jsonb_array_elements_text(project_patch->'scope')),
      contract_value_pence = (project_patch->>'contractValuePence')::bigint,
      end_date = (project_patch->>'endDate')::date,
      status = project_patch->>'status',
      next_action = project_patch->>'nextAction',
      updated_at = now()
  where id = target_project_id;

  select count(*), (array_agg(id))[1], min(paid_date)
    into deposit_count, deposit_id, existing_paid_date
  from public.payments
  where project_id = target_project_id and lower(trim(title)) = 'deposit';
  if deposit_count > 1 then raise exception 'Duplicate Deposit payments already exist'; end if;

  if deposit_count = 1 then
    update public.payments
    set amount_pence = (deposit_patch->>'amountPence')::bigint,
        percentage = (deposit_patch->>'percentage')::numeric,
        status = 'Paid',
        paid_date = coalesce(existing_paid_date, nullif(deposit_patch->>'paidDate', '')::date, due_date),
        updated_at = now()
    where id = deposit_id;
  else
    if nullif(deposit_patch->>'paidDate', '') is null then
      raise exception 'paidDate is required when creating a Deposit';
    end if;
    insert into public.payments (project_id, title, percentage, amount_pence, due_date, paid_date, status)
    values (target_project_id, 'Deposit', (deposit_patch->>'percentage')::numeric,
      (deposit_patch->>'amountPence')::bigint, (deposit_patch->>'paidDate')::date,
      (deposit_patch->>'paidDate')::date, 'Paid')
    returning id into deposit_id;
  end if;

  select count(*), (array_agg(id))[1] into final_count, final_id
  from public.payments
  where project_id = target_project_id and lower(trim(title)) = 'final payment';
  if final_count > 1 then raise exception 'Duplicate Final payment rows already exist'; end if;

  if final_count = 1 then
    update public.payments
    set amount_pence = (final_payment_patch->>'amountPence')::bigint,
        percentage = (final_payment_patch->>'percentage')::numeric,
        due_date = (final_payment_patch->>'dueDate')::date,
        paid_date = null,
        status = 'Due',
        updated_at = now()
    where id = final_id;
  else
    insert into public.payments (project_id, title, percentage, amount_pence, due_date, paid_date, status)
    values (target_project_id, 'Final payment', (final_payment_patch->>'percentage')::numeric,
      (final_payment_patch->>'amountPence')::bigint, (final_payment_patch->>'dueDate')::date, null, 'Due')
    returning id into final_id;
  end if;

  select jsonb_build_object(
    'projectId', p.id,
    'contractValuePence', p.contract_value_pence,
    'amountPaidPence', p.amount_paid_pence,
    'outstandingBalancePence', p.outstanding_balance_pence,
    'depositId', deposit_id,
    'finalPaymentId', final_id
  ) into result
  from public.projects p where p.id = target_project_id;

  return result;
end;
$$;

revoke all on function public.apply_integration_project_correction(uuid, jsonb, jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.apply_integration_project_correction(uuid, jsonb, jsonb, jsonb) to service_role;
