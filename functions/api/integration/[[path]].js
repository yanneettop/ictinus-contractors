import { createClient } from '@supabase/supabase-js'
import { SupabaseIntegrationRepository } from '../../_integration/repository.js'
import { handleIntegrationRequest } from '../../_integration/router.js'
import { IntegrationService } from '../../_integration/service.js'

export async function onRequest(context) {
  const { env } = context
  if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
    return new Response(JSON.stringify({ success: false, data: null, error: { code: 'INTEGRATION_NOT_CONFIGURED', message: 'The integration API is not configured.' } }), {
      status: 503,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    })
  }
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
  const service = new IntegrationService(new SupabaseIntegrationRepository(client))
  return handleIntegrationRequest({ ...context, service })
}
