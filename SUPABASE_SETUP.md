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

## 5. Configure Google Calendar

1. In Google Cloud Console, enable the Google Calendar API and configure an OAuth consent screen.
2. Create an OAuth 2.0 **Web application** client.
3. Add the exact production redirect URI: `https://YOUR_CLOUDFLARE_DOMAIN/api/google-calendar/callback`.
4. Generate a 32-byte encryption key with `openssl rand -base64 32` and store it separately from the database.
5. Add these encrypted Cloudflare Pages secrets/variables (never prefix them with `VITE_`):

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_OAUTH_REDIRECT_URI
GOOGLE_TOKEN_ENCRYPTION_KEY
```

6. Deploy through Cloudflare Pages, sign in as an administrator, open Settings, connect Google, and select a writable calendar.

The app requests only event read/write and calendar-list read access. OAuth state values are single-use and expire after ten minutes. Rotate the encryption key only with a planned re-encryption or reconnection of the stored credentials.

For local OAuth testing, copy `.dev.vars.example` to `.dev.vars`, use `http://localhost:8788/api/google-calendar/callback` as an authorised redirect URI, then run `npm run build` followed by `npx wrangler pages dev dist`.

## 6. Configure GitHub Pages

Add these repository settings:

- Variable `VITE_SUPABASE_URL`: Supabase project URL.
- Secret `VITE_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key.

Re-run the `Deploy to GitHub Pages` workflow. A configured production build automatically uses Supabase; a build without these variables stays in local demo mode.

Static GitHub Pages cannot execute the OAuth or event-sync Functions. Use the Cloudflare Pages deployment for Google Calendar sync.

## 7. Verification

- Anonymous visitors are redirected to login and cannot query any table.
- Ioannis can create/delete projects and edit financial records.
- Konstantinos can update status/tasks/journal/events but cannot edit payments or protected project fields.
- Changes appear on a second signed-in device through Realtime.
- Uploaded PDFs/images are private and accessed with expiring signed URLs.
- Invitation and password-reset links open the secure password setup page.
- Deactivating a profile immediately removes its database access through RLS.
- Only administrators can start OAuth or choose the calendar.
- Creating an event returns `calendarSync: synced` and stores both Google IDs when configured.
- Updating that event changes the same Google event ID.
- With Google unavailable, the event database write still succeeds and returns `calendarSync: failed`.

## Secrets and rotation

- Browser: only project URL and publishable key.
- Edge Function: service-role key supplied by Supabase runtime only.
- Cloudflare Function: Google OAuth secrets and the token-encryption key; OAuth tokens are encrypted in Supabase and never exposed to the browser.
- Rotate keys after suspected exposure and review Auth/activity logs.
