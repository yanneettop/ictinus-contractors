import assert from 'node:assert/strict'
import test from 'node:test'
import { GoogleCalendarClient, GOOGLE_TIME_ZONE, googleEventBody } from '../functions/_google/api.js'
import { decryptToken, encryptToken, hashOAuthState, randomOAuthState } from '../functions/_google/crypto.js'

const encryptionKey = Buffer.alloc(32, 7).toString('base64')

test('encrypts OAuth tokens with random AES-GCM ciphertext and decrypts them', async () => {
  const first = await encryptToken('refresh-secret', encryptionKey)
  const second = await encryptToken('refresh-secret', encryptionKey)
  assert.notEqual(first, second)
  assert.equal(first.includes('refresh-secret'), false)
  assert.equal(await decryptToken(first, encryptionKey), 'refresh-secret')
})

test('creates non-guessable single-use state material without storing the raw value', async () => {
  const state = randomOAuthState()
  const hash = await hashOAuthState(state)
  assert.ok(state.length >= 40)
  assert.notEqual(hash, state)
  assert.equal(hash.includes(state), false)
})

test('maps timed and all-day events to Europe/London Google event bodies', () => {
  const timed = googleEventBody({ id: 'event-1', title: 'Inspection', notes: '', location: 'London', all_day: false, start_date: '2026-10-25T09:00:00+00:00', end_date: '2026-10-25T10:00:00+00:00' })
  assert.equal(timed.start.timeZone, GOOGLE_TIME_ZONE)
  assert.equal(timed.end.timeZone, 'Europe/London')
  const allDay = googleEventBody({ id: 'event-2', title: 'Works', all_day: true, start_date: '2026-07-25T00:00:00Z', end_date: '2026-07-25T00:00:00Z' })
  assert.deepEqual(allDay.start, { date: '2026-07-25' })
  assert.deepEqual(allDay.end, { date: '2026-07-26' })
})

test('uses PUT with the stored calendar and event IDs when updating', async () => {
  const requests = []
  const connection = { id: 'connection-1', selected_calendar_id: 'new-calendar', encrypted_access_token: await encryptToken('access-secret', encryptionKey), encrypted_refresh_token: await encryptToken('refresh-secret', encryptionKey), access_token_expires_at: new Date(Date.now() + 3600_000).toISOString() }
  const query = { select() { return this }, eq() { return this }, async maybeSingle() { return { data: connection, error: null } } }
  const client = { from() { return query } }
  const fetcher = async (url, options) => { requests.push({ url, options }); return new Response(JSON.stringify({ id: 'google-event-1' }), { status: 200, headers: { 'content-type': 'application/json' } }) }
  const calendar = new GoogleCalendarClient({ client, env: { GOOGLE_TOKEN_ENCRYPTION_KEY: encryptionKey }, fetcher })
  const result = await calendar.syncEvent({ id: 'local-1', title: 'Updated', all_day: false, start_date: '2026-07-25T09:00:00+01:00', end_date: '2026-07-25T10:00:00+01:00', google_calendar_id: 'original-calendar', google_calendar_event_id: 'google-event-1' })
  assert.equal(result.status, 'synced')
  assert.equal(requests[0].options.method, 'PUT')
  assert.match(requests[0].url, /original-calendar\/events\/google-event-1$/)
  assert.equal(JSON.stringify(requests[0]).includes('refresh-secret'), false)
})
