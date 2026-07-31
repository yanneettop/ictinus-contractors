import { decryptToken, encryptToken } from './crypto.js'

export const GOOGLE_CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.calendarlist.readonly'
export const GOOGLE_TIME_ZONE = 'Europe/London'
const GOOGLE_API = 'https://www.googleapis.com/calendar/v3'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'

async function jsonResponse(response, label) {
  if (response.ok) return response.json()
  const error = new Error(`${label} failed.`)
  error.status = response.status
  throw error
}

export function googleEventBody(event) {
  const body = {
    summary: event.title,
    description: event.notes || '',
    location: event.location || '',
    extendedProperties: { private: { ictinusProjectEventId: event.id } },
  }
  if (event.all_day) {
    body.start = { date: event.start_date.slice(0, 10) }
    const inclusiveEnd = new Date(`${event.end_date.slice(0, 10)}T00:00:00Z`)
    inclusiveEnd.setUTCDate(inclusiveEnd.getUTCDate() + 1)
    body.end = { date: inclusiveEnd.toISOString().slice(0, 10) }
  } else {
    body.start = { dateTime: event.start_date, timeZone: GOOGLE_TIME_ZONE }
    body.end = { dateTime: event.end_date, timeZone: GOOGLE_TIME_ZONE }
  }
  return body
}

export class GoogleCalendarClient {
  constructor({ client, env, fetcher = fetch }) {
    this.client = client
    this.env = env
    this.fetcher = fetcher
  }

  async activeConnection() {
    const { data, error } = await this.client.from('google_calendar_connections').select('*').eq('active', true).maybeSingle()
    if (error) throw new Error('Google Calendar connection could not be loaded.')
    return data
  }

  async accessToken(connection) {
    const expiresAt = new Date(connection.access_token_expires_at).getTime()
    if (expiresAt > Date.now() + 60_000) return decryptToken(connection.encrypted_access_token, this.env.GOOGLE_TOKEN_ENCRYPTION_KEY)

    const refreshToken = await decryptToken(connection.encrypted_refresh_token, this.env.GOOGLE_TOKEN_ENCRYPTION_KEY)
    const response = await this.fetcher(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: this.env.GOOGLE_CLIENT_ID, client_secret: this.env.GOOGLE_CLIENT_SECRET, refresh_token: refreshToken, grant_type: 'refresh_token' }),
    })
    const tokens = await jsonResponse(response, 'Google token refresh')
    const encryptedAccessToken = await encryptToken(tokens.access_token, this.env.GOOGLE_TOKEN_ENCRYPTION_KEY)
    const expires = new Date(Date.now() + Number(tokens.expires_in || 3600) * 1000).toISOString()
    const { error } = await this.client.from('google_calendar_connections').update({ encrypted_access_token: encryptedAccessToken, access_token_expires_at: expires, updated_at: new Date().toISOString() }).eq('id', connection.id)
    if (error) throw new Error('Refreshed Google credential could not be stored.')
    return tokens.access_token
  }

  async request(connection, path, options = {}) {
    const token = await this.accessToken(connection)
    return this.fetcher(`${GOOGLE_API}${path}`, { ...options, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', ...(options.headers || {}) } })
  }

  async listCalendars() {
    const connection = await this.activeConnection()
    if (!connection) return null
    const response = await this.request(connection, '/users/me/calendarList?minAccessRole=writer&maxResults=250')
    const result = await jsonResponse(response, 'Google calendar list')
    return (result.items || []).map(({ id, summary, primary, accessRole }) => ({ id, name: summary, primary: Boolean(primary), accessRole }))
  }

  async syncEvent(event) {
    const connection = await this.activeConnection()
    if (!connection?.selected_calendar_id) return { status: 'not_configured' }
    const calendarId = event.google_calendar_id || connection.selected_calendar_id
    const eventId = event.google_calendar_event_id
    const path = eventId
      ? `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`
      : `/calendars/${encodeURIComponent(calendarId)}/events`
    const response = await this.request(connection, path, { method: eventId ? 'PUT' : 'POST', body: JSON.stringify(googleEventBody(event)) })
    const googleEvent = await jsonResponse(response, eventId ? 'Google event update' : 'Google event creation')
    return { status: 'synced', calendarId, eventId: googleEvent.id || eventId }
  }
}
