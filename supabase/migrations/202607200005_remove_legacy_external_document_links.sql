-- Remove legacy external Drive links only where the corresponding private
-- Supabase Storage document has already been imported for the same project/type.
-- This removes link records only; no stored files are deleted.

delete from public.documents as legacy
where legacy.id in (
  '0030c9fe-1695-400e-bbe0-098b4c2029cf',
  '058d6da6-cf1a-4c53-a3f7-b033cda0b8d8',
  'e078295a-d64c-4754-849b-e42e5be0e33b'
)
and legacy.external_url is not null
and legacy.storage_path is null
and exists (
  select 1
  from public.documents as stored
  where stored.project_id = legacy.project_id
    and lower(stored.type) = lower(legacy.type)
    and stored.storage_path is not null
);
