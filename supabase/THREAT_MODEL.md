# Job Manager security model

## Users and assets

- Two invited staff users: administrator and site manager.
- Protected assets: client contact details, addresses, project notes, financial data, documents and photos.
- No public registration. Accounts are created/invited by an administrator.

## Primary threats

- Unauthenticated access to client or financial records.
- A site manager modifying financial values or deleting projects.
- Leaked service-role credentials in browser code or Git history.
- Public document/photo URLs being shared outside the team.
- Stale sessions on lost site devices.
- Cross-device update conflicts and missing audit history.

## Enforcement

- Supabase Auth issues short-lived JWT sessions; the browser receives only the publishable key.
- Every exposed table has RLS enabled. Anonymous users have no policies.
- Database policies and a protected-field trigger enforce permissions independently of UI checks.
- The service-role key is never used by the browser application.
- Storage bucket is private; the app creates short-lived signed URLs.
- Mutations append immutable activity records.
- Production should enable MFA for the administrator and use Supabase account recovery.

## Operational controls

- Remove access by setting `profiles.active = false` and revoking the Auth user sessions.
- Review Auth logs and activity records after suspected account compromise.
- Rotate publishable keys when required; service-role rotation is mandatory after any suspected exposure.
