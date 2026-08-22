import { GoogleCalendarClient, GOOGLE_CALENDAR_SCOPE } from './api.js'
import { encryptToken, hashOAuthState, randomOAuthState } from './crypto.js'

const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers })
const errorResponse = (code, message, status) => json({ success: false, data: null, error: { code, message } }, status)

function bearerToken(request) {
  return (request.headers.get('authorization') || '').match(/^Bearer\s+(.+)$/i)?.[1]
}

async function requireAdministrator(request, client) {
  const token = bearerToken(request)
  if (!token) return { error: errorResponse('UNAUTHORIZED', 'Please sign in again.', 401) }
  const { data: { user }, error } = await client.auth.getUser(token)
  if (error || !user) return { error: errorResponse('UNAUTHORIZED', 'Please sign in again.', 401) }
  const { data: profile, error: profileError } = await client.from('profiles').select('id, role, active').eq('id', user.id).maybeSingle()
  if (profileError || !profile?.active || profile.role !== 'administrator') return { error: errorResponse('FORBIDDEN', 'Administrator access is required.', 403) }
  return { user, profile }
}

function configured(env) {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_OAUTH_REDIRECT_URI && env.GOOGLE_TOKEN_ENCRYPTION_KEY)
}

function pathFor(request) {
  return new URL(request.url).pathname.slice('/api/google-calendar'.length).replace(/\/+$/, '') || '/'
}

async function tokenExchange(fetcher, env, code) {
  const response = await fetcher('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, redirect_uri: env.GOOGLE_OAUTH_REDIRECT_URI, grant_type: 'authorization_code' }),
  })
  if (!response.ok) throw new Error('OAuth exchange failed.')
  return response.json()
}

async function oauthCallback({ request, env, client, fetcher }) {
  const url = new URL(request.url)
  const state = url.searchParams.get('state')
  const code = url.searchParams.get('code')
  const base = new URL(env.GOOGLE_OAUTH_REDIRECT_URI).origin
  const fail = () => Response.redirect(`${base}/job-manager/settings?googleCalendar=failed`, 302)
  if (!state || !code || url.searchParams.get('error')) return fail()

  const stateHash = await hashOAuthState(state)
  const { data: stored, error } = await client.from('google_calendar_oauth_states').select('*').eq('state_hash', stateHash).maybeSingle()
  if (error || !stored || stored.used_at || new Date(stored.expires_at).getTime() <= Date.now()) return fail()
  const { data: consumed, error: consumeError } = await client.from('google_calendar_oauth_states').update({ used_at: new Date().toISOString() }).eq('state_hash', stateHash).is('used_at', null).select('state_hash').maybeSingle()
  if (consumeError || !consumed) return fail()

  try {
    const tokens = await tokenExchange(fetcher, env, code)
    const { data: existing } = await client.from('google_calendar_connections').select('encrypted_refresh_token').eq('connected_by', stored.administrator_id).maybeSingle()
    const encryptedRefreshToken = tokens.refresh_token
      ? await encryptToken(tokens.refresh_token, env.GOOGLE_TOKEN_ENCRYPTION_KEY)
      : existing?.encrypted_refresh_token
    if (!tokens.access_token || !encryptedRefreshToken) throw new Error('Offline credential was not returned.')

    await client.from('google_calendar_connections').update({ active: false, updated_at: new Date().toISOString() }).eq('active', true)
    const connection = {
      connected_by: stored.administrator_id,
      encrypted_access_token: await encryptToken(tokens.access_token, env.GOOGLE_TOKEN_ENCRYPTION_KEY),
      encrypted_refresh_token: encryptedRefreshToken,
      access_token_expires_at: new Date(Date.now() + Number(tokens.expires_in || 3600) * 1000).toISOString(),
      granted_scope: tokens.scope || GOOGLE_CALENDAR_SCOPE,
      active: true,
      updated_at: new Date().toISOString(),
    }
    const { error: saveError } = await client.from('google_calendar_connections').upsert(connection, { onConflict: 'connected_by' })
    if (saveError) throw new Error('OAuth credential storage failed.')
    return Response.redirect(`${base}${stored.return_path}?googleCalendar=connected`, 302)
  } catch {
    return fail()
  }
}

export async function handleGoogleCalendarRequest({ request, env, client, fetcher = fetch }) {
  if (!configured(env)) return errorResponse('NOT_CONFIGURED', 'Google Calendar environment variables are not configured.', 503)
  const path = pathFor(request)
  if (request.method === 'GET' && path === '/callback') return oauthCallback({ request, env, client, fetcher })

  const identity = await requireAdministrator(request, client)
  if (identity.error) return identity.error
  const google = new GoogleCalendarClient({ client, env, fetcher })

  try {
    if (request.method === 'GET' && path === '/status') {
      const connection = await google.activeConnection()
      return json({ success: true, data: { configured: true, connected: Boolean(connection), calendarId: connection?.selected_calendar_id || null, calendarName: connection?.selected_calendar_name || null } })
    }
    if (request.method === 'POST' && path === '/connect') {
      const state = randomOAuthState()
      const stateHash = await hashOAuthState(state)
      const { error } = await client.from('google_calendar_oauth_states').insert({ state_hash: stateHash, administrator_id: identity.profile.id, return_path: '/job-manager/settings', expires_at: new Date(Date.now() + 10 * 60_000).toISOString() })
      if (error) throw new Error('OAuth state could not be stored.')
      const params = new URLSearchParams({ client_id: env.GOOGLE_CLIENT_ID, redirect_uri: env.GOOGLE_OAUTH_REDIRECT_URI, response_type: 'code', scope: GOOGLE_CALENDAR_SCOPE, access_type: 'offline', include_granted_scopes: 'true', prompt: 'consent', state })
      return json({ success: true, data: { authorizationUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params}` } })
    }
    if (request.method === 'GET' && path === '/calendars') {
      const calendars = await google.listCalendars()
      if (!calendars) return errorResponse('NOT_CONNECTED', 'Google Calendar is not connected.', 409)
      return json({ success: true, data: { calendars } })
    }
    if (request.method === 'PUT' && path === '/selection') {
      const input = await request.json()
      if (!input?.calendarId || typeof input.calendarId !== 'string' || input.calendarId.length > 1024) return errorResponse('VALIDATION_ERROR', 'Choose a valid calendar.', 422)
      const calendars = await google.listCalendars()
      const selected = calendars?.find((calendar) => calendar.id === input.calendarId)
      if (!selected) return errorResponse('INVALID_CALENDAR', 'The selected writable calendar is unavailable.', 422)
      const connection = await google.activeConnection()
      const { error } = await client.from('google_calendar_connections').update({ selected_calendar_id: selected.id, selected_calendar_name: selected.name, updated_at: new Date().toISOString() }).eq('id', connection.id)
      if (error) throw new Error('Calendar selection could not be stored.')
      return json({ success: true, data: { calendarId: selected.id, calendarName: selected.name } })
    }
    if (request.method === 'DELETE' && path === '/connection') {
      const connection = await google.activeConnection()
      if (connection) {
        const { error } = await client.from('google_calendar_connections').update({ active: false, selected_calendar_id: null, selected_calendar_name: null, updated_at: new Date().toISOString() }).eq('id', connection.id)
        if (error) throw new Error('Google Calendar connection could not be disabled.')
      }
      return json({ success: true, data: { connected: false } })
    }
    return errorResponse('NOT_FOUND', 'Google Calendar endpoint not found.', 404)
  } catch {
    return errorResponse('GOOGLE_CALENDAR_ERROR', 'The Google Calendar request could not be completed.', 502)
  }
}
