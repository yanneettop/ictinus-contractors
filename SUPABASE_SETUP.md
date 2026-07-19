# Ictinus Job Manager production setup

## 1. Create the project

Create a Supabase project in the London or nearest available European region. In Authentication settings:

- Disable public user sign-ups.
- Add `https://www.ictinuscontractors.co.uk/job-manager/update-password` as an allowed redirect URL.
- Set the production site URL to `https://www.ictinuscontractors.co.uk`.
- Enable MFA for the administrator account.

## 2. Apply database security

Install/login to the Supabase CLI, link this repository, then apply migrations:

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

The migration creates normalized tables, indexes, financial recalculation triggers, RLS policies, Realtime publication entries and the private `ictinus-project-files` Storage bucket.

## 3. Create the first administrator

Create the Ioannis account in Authentication > Users with user metadata:

```json
{ "display_name": "Ioannis" }
```

Then run this once in the SQL editor, replacing the email:

```sql
update public.profiles
set role = 'administrator', active = true
where email = 'IOANNIS_EMAIL_HERE';
```

Sign in as Ioannis. Additional users can then be invited from Job Manager > Settings.

## 4. Deploy the invitation function

```bash
npx supabase functions deploy invite-user
npx supabase secrets set ALLOWED_APP_ORIGIN=https://www.ictinuscontractors.co.uk
```

Supabase automatically supplies the URL, anonymous key and service-role key to its Edge Functions. Never add the service-role key to GitHub Pages or browser environment variables.

## 5. Configure GitHub Pages

Add these repository settings:

- Variable `VITE_SUPABASE_URL`: Supabase project URL.
- Secret `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key.

Re-run the `Deploy to GitHub Pages` workflow. A configured production build automatically uses Supabase; a build without these variables stays in local demo mode.

## 6. Verification

- Anonymous visitors are redirected to login and cannot query any table.
- Ioannis can create/delete projects and edit financial records.
- Konstantinos can update status/tasks/journal/events but cannot edit payments or protected project fields.
- Changes appear on a second signed-in device through Realtime.
- Uploaded PDFs/images are private and accessed with expiring signed URLs.
- Invitation and password-reset links open the secure password setup page.
- Deactivating a profile immediately removes its database access through RLS.

## Secrets and rotation

- Browser: only project URL and publishable key.
- Edge Function: service-role key supplied by Supabase runtime only.
- Rotate keys after suspected exposure and review Auth/activity logs.
