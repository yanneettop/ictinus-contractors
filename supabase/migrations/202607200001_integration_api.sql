-- Server-side integration audit metadata and future calendar sync state.

alter table public.activity_logs
  add column if not exists actor_type text,
  add column if not exists actor_name text,
  add column if not exists source text,
  add column if not exists entity_type text,
  add column if not exists entity_id uuid,
  add column if not exists previous_values jsonb,
  add column if not exists new_values jsonb;

alter table public.activity_logs
  drop constraint if exists activity_logs_actor_type_check;

alter table public.activity_logs
  add constraint activity_logs_actor_type_check
  check (actor_type is null or actor_type in ('user', 'integration', 'system'));

create index if not exists activity_source_created_idx
  on public.activity_logs(source, created_at desc);

create index if not exists activity_entity_idx
  on public.activity_logs(entity_type, entity_id, created_at desc);

alter table public.project_events
  add column if not exists sync_status text not null default 'not_configured',
  add column if not exists last_synced_at timestamptz;

alter table public.project_events
  drop constraint if exists project_events_sync_status_check;

alter table public.project_events
  add constraint project_events_sync_status_check
  check (sync_status in ('not_configured', 'pending', 'synced', 'failed'));

