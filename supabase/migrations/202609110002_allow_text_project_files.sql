-- Allow plain text notes and exports in the private project file bucket.
update storage.buckets
set allowed_mime_types = array_append(allowed_mime_types, 'text/plain')
where id = 'ictinus-project-files'
  and not ('text/plain' = any(allowed_mime_types));
