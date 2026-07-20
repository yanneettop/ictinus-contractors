import { createClient } from '@supabase/supabase-js'
import { z, ZodError } from 'zod'
import { runChat } from '../../_chat/service.js'
import { authenticateChatUser } from '../../_chat/auth.js'
import { IntegrationError } from '../../_integration/errors.js'
import { SupabaseIntegrationRepository } from '../../_integration/repository.js'
import { IntegrationService } from '../../_integration/service.js'

const requestSchema = z.object({
  messages: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(8000) }).strict()).min(1).max(20),
}).strict()

const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers })

export async function onRequestPost({ request, env }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY || !env.OPENAI_API_KEY) return json({ success: false, error: { code: 'CHAT_NOT_CONFIGURED', message: 'The assistant is not configured.' } }, 503)
  const authorization = request.headers.get('authorization') || ''
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) return json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Please sign in again.' } }, 401)

  try {
    const client = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
    const identity = await authenticateChatUser(client, token)
    if (identity.error) return json({ success: false, error: { code: identity.error.code, message: identity.error.message } }, identity.error.status)
    const { profile } = identity

    const input = requestSchema.parse(await request.json())
    const service = new IntegrationService(new SupabaseIntegrationRepository(client))
    const result = await runChat({ apiKey: env.OPENAI_API_KEY, model: env.OPENAI_CHAT_MODEL || 'gpt-5.6-luna', role: profile.role, userName: profile.display_name, messages: input.messages, service })
    return json({ success: true, data: result, error: null })
  } catch (error) {
    if (error instanceof ZodError) return json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'The chat request is invalid.' } }, 422)
    if (error instanceof SyntaxError) return json({ success: false, error: { code: 'INVALID_JSON', message: 'The request body is not valid JSON.' } }, 400)
    if (error instanceof IntegrationError) return json({ success: false, error: { code: error.code, message: error.message } }, error.status)
    console.error('Unhandled job manager chat error', error?.name || 'Error')
    return json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'The assistant could not complete the request.' } }, 500)
  }
}

export function onRequest() {
  return json({ success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST.' } }, 405)
}
