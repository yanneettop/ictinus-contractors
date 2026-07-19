-- The existing project guard protects browser users. Supabase server secrets
-- execute as service_role and are additionally protected by the integration API.

create or replace function public.guard_project_financial_fields()
returns trigger language plpgsql security definer set search_path = public as $$
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
  ) then raise exception 'Insufficient permission to change protected project fields';
  end if;
  return new;
end;
$$;

