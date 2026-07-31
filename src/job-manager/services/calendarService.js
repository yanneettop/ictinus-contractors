import { authService } from './authService'

async function request(path, options = {}) {
  const token = await authService.getAccessToken()
  if (!token) throw new Error('Please sign in again.')
  const response = await fetch(`/api/google-calendar${path}`, {
    ...options,
    headers: { authorization: `Bearer ${token}`, ...(options.body ? { 'content-type': 'application/json' } : {}), ...(options.headers || {}) },
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload?.success) throw new Error(payload?.error?.message || 'Google Calendar request failed.')
  return payload.data
}

export const calendarService = {
  status: () => request('/status'),
  calendars: () => request('/calendars'),
  async connect() {
    const { authorizationUrl } = await request('/connect', { method: 'POST' })
    window.location.assign(authorizationUrl)
  },
  selectCalendar: (calendarId) => request('/selection', { method: 'PUT', body: JSON.stringify({ calendarId }) }),
}
