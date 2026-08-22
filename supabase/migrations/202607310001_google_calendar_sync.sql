-- Google Calendar OAuth credentials are encrypted by the application before storage.
-- These tables deliberately have RLS enabled with no browser policies: only the
-- server-side Supabase secret key may read or write them.

alter table public.project_events
  add column if not exists google_calendar_id text;

create table if not exists public.google_calendar_connections (
  id uuid primary key default gen_random_uuid(),
  connected_by uuid not null references public.profiles(id) on delete cascade,
  google_account_email text not null default '',
  encrypted_access_token text not null,
  encrypted_refresh_token text not null,
  access_token_expires_at timestamptz not null,
  granted_scope text not null,
  selected_calendar_id text,
  selected_calendar_name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists google_calendar_one_active_connection_idx
  on public.google_calendar_connections (active) where active = true;
create unique index if not exists google_calendar_connection_owner_idx
  on public.google_calendar_connections (connected_by);

create table if not exists public.google_calendar_oauth_states (
  state_hash text primary key,
  administrator_id uuid not null references public.profiles(id) on delete cascade,
  return_path text not null default '/job-manager/settings',
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists google_calendar_oauth_states_expiry_idx
  on public.google_calendar_oauth_states (expires_at);

alter table public.google_calendar_connections enable row level security;
alter table public.google_calendar_oauth_states enable row level security;

comment on table public.google_calendar_connections is
  'Server-only Google OAuth credentials. Token columns contain AES-GCM ciphertext, never plaintext.';
comment on column public.project_events.google_calendar_id is
  'Calendar containing google_calendar_event_id, retained so updates target the original event.';
