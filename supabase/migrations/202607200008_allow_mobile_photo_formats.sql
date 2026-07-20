-- Accept native Apple mobile photo formats in the private project bucket.
update storage.buckets
set allowed_mime_types = array[
  'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'
]
where id = 'ictinus-project-files';
