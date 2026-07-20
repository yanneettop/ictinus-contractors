import { authService } from './authService'

export async function sendChatMessages(messages) {
  const token = await authService.getAccessToken()
  if (!token) throw new Error('Please sign in again to use the assistant.')
  const response = await fetch('/api/job-manager/chat', {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ messages: messages.slice(-20).map(({ role, content }) => ({ role, content })) }),
  })
  const payload = await response.json().catch(() => null)
  if (!response.ok || !payload?.success) throw new Error(payload?.error?.message || 'The assistant is unavailable right now.')
  return payload.data
}

