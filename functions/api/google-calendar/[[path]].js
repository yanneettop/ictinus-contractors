import { createClient } from '@supabase/supabase-js'
import { handleGoogleCalendarRequest } from '../../_google/router.js'

export async function onRequest(context) {
  const { env } = context
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
    return new Response(JSON.stringify({ success: false, data: null, error: { code: 'NOT_CONFIGURED', message: 'The server database connection is not configured.' } }), { status: 503, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } })
  }
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  return handleGoogleCalendarRequest({ ...context, client })
}
