import { createClient } from '@supabase/supabase-js'
import { SupabaseIntegrationRepository } from '../../_integration/repository.js'
import { handleIntegrationRequest } from '../../_integration/router.js'
import { IntegrationService } from '../../_integration/service.js'
import { GoogleCalendarClient } from '../../_google/api.js'

export async function onRequest(context) {
  const { env } = context
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
    return new Response(JSON.stringify({ success: false, data: null, error: { code: 'INTEGRATION_NOT_CONFIGURED', message: 'The integration API is not configured.' } }), {
      status: 503,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    })
  }
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  const repository = new SupabaseIntegrationRepository(client)
  const googleConfigured = env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_TOKEN_ENCRYPTION_KEY
  const calendar = googleConfigured ? new GoogleCalendarClient({ client, env }) : null
  const service = new IntegrationService(repository, calendar)
  return handleIntegrationRequest({ ...context, service })
}
