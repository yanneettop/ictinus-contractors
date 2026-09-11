-- Add mobile-friendly project video and Word document uploads.
-- 50 MB remains compatible with Supabase Free projects; non-video files are
-- additionally restricted to 25 MB by the application.
update storage.buckets
set
  file_size_limit = 52428800,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'video/x-m4v',
    'video/3gpp'
  ]
where id = 'ictinus-project-files';
