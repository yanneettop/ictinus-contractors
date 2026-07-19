import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const allowedOrigin = Deno.env.get('ALLOWED_APP_ORIGIN') || 'https://www.ictinuscontractors.co.uk'
const cors = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin === allowedOrigin ? origin : allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
  Vary: 'Origin',
})

Deno.serve(async (request) => {
  const headers = cors(request.headers.get('origin'))
  if (request.method === 'OPTIONS') return new Response('ok', { headers })
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })

  try {
    const authorization = request.headers.get('Authorization')
    if (!authorization) return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers })

    const url = Deno.env.get('SUPABASE_URL')!
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const callerClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } })
    const { data: { user }, error: userError } = await callerClient.auth.getUser()
    if (userError || !user) return new Response(JSON.stringify({ error: 'Invalid session' }), { status: 401, headers })

    const adminClient = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } })
    const { data: profile } = await adminClient.from('profiles').select('role, active').eq('id', user.id).single()
    if (!profile?.active || profile.role !== 'administrator') return new Response(JSON.stringify({ error: 'Administrator access required' }), { status: 403, headers })

    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const displayName = String(body.displayName || '').trim()
    const role = body.role === 'administrator' ? 'administrator' : 'site_manager'
    if (!/^\S+@\S+\.\S+$/.test(email) || displayName.length < 2) return new Response(JSON.stringify({ error: 'Valid name and email are required' }), { status: 400, headers })

    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { display_name: displayName },
      redirectTo: `${allowedOrigin}/job-manager/update-password`,
    })
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers })
    const { error: profileError } = await adminClient.from('profiles').update({ display_name: displayName, email, role, active: true }).eq('id', data.user.id)
    if (profileError) return new Response(JSON.stringify({ error: 'The user was invited but their role could not be saved. Review the profile before granting access.' }), { status: 500, headers })
    return new Response(JSON.stringify({ user: { id: data.user.id, email, displayName, role } }), { status: 200, headers })
  } catch {
    return new Response(JSON.stringify({ error: 'Could not invite user' }), { status: 500, headers })
  }
})
