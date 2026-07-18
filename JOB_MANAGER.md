# Ictinus Job Manager

Private, mobile-first operations workspace available at `/job-manager`.

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173/job-manager`. Demo accounts:

- `ioannis` / `demo123` — administrator
- `konstantinos` / `demo123` — site manager

For a production check, run `npm run lint`, `npm run typecheck`, and `npm run build`.

## Folder structure

```text
src/job-manager/
  components/              Shared navigation, cards and UI primitives
  context/                 Auth, permissions and application actions
  data/
    models.js              Domain model reference
    repository.js          localStorage repository adapter
    seed.js                Users, clients, projects and related demo data
  pages/                   Dashboard, calendar, projects, payments, settings
  services/
    calendarService.js     Google Calendar boundary and integration TODOs
  utils/                   GBP, UK date and address helpers
  JobManagerApp.jsx        Nested application routes
  manager.css              Fully scoped responsive visual system
```

## Mock data layer

`JobManagerProvider` reads and writes through `localRepository`, not directly from presentation components. The repository seeds `ictinus-job-manager-data-v1` in localStorage on first use. All project, task, payment, document, event and activity mutations update the shared domain state and then persist it. Settings includes a confirmed reset action.

localStorage is deliberately a demo implementation: it is browser-specific, has no server-side security and does not support concurrent users.

## Connecting Supabase

1. Create tables matching the types in `data/models.js`, using foreign keys from projects to clients/users and from child records to projects.
2. Add Supabase Auth users and a `profiles` table with `administrator` and `site_manager` roles.
3. Enable row-level security. Administrators can manage all records; site managers should receive only the operational mutations represented by `can()`.
4. Implement a Supabase repository with the same interface as `localRepository`, ideally with specific CRUD methods rather than the demo aggregate `save` call.
5. Inject it into `JobManagerProvider`, replace sessionStorage demo auth with Supabase sessions, and move permission enforcement to both RLS and the UI.
6. Store money as integer pence in production and convert only for display.

## Google Calendar integration

Project events already include `googleCalendarEventId`. `services/calendarService.js` defines the external service boundary and intentionally throws while disconnected.

Add OAuth through a server-side Cloudflare Pages Function. Keep the client secret and refresh tokens server-side, request the narrow Calendar scope, exchange tokens in the Function, and call the Google Calendar API there. After an event is created, store its returned id on the matching project event. Add retry/idempotency handling and an explicit per-event sync state before enabling the Settings connection control.

## Deployment

The existing Cloudflare Pages deployment remains unchanged: root `/`, build command `npm run build`, output `dist`. `public/_redirects` now serves `index.html` for direct `/job-manager/*` requests so React Router can resolve them.

## Remaining production TODOs

- Replace demo credentials and localStorage with Supabase Auth, Postgres and RLS.
- Put the manager on a protected subdomain or Cloudflare Access policy; the demo login alone is not production security.
- Connect Google OAuth and Calendar through server-side Functions.
- Replace external document links with Drive/Supabase Storage only if direct uploads are later required.
- Add automated browser tests and real notification/reminder delivery.

## Project Details operations model

The Project Details page is composed from reusable operational components rather than one presentation file:

- `ProjectSummary.jsx` calculates schedule progress, payment progress, project health and metrics.
- `ProjectContacts.jsx` contains client/location actions through integration service adapters.
- `ProjectJournal.jsx` provides searchable, categorised chronological notes with edit/delete support.
- `ProjectTasks.jsx` provides due-date sorting and pending/overdue/completed filtering.
- `ProjectRecords.jsx` groups external documents and manages staged project photos.
- `ProjectHistory.jsx` builds the ordered milestone timeline and automatic activity feed.

The version 2 local model adds `journalEntries` and `photos`, extends clients with contact preferences, and adds document audit metadata. `repository.js` migrates existing version 1 browser data without discarding current projects.

Browser-native actions are isolated in `services/integrationServices.js`. These adapters are the replacement points for Twilio/WhatsApp, transactional email, Google Maps, Google Calendar, Google Drive and server-side invoice generation.
