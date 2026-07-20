export async function authenticateChatUser(client, token) {
  if (!token) return { error: { code: 'UNAUTHORIZED', message: 'Please sign in again.', status: 401 } }
  const { data: { user }, error: authError } = await client.auth.getUser(token)
  if (authError || !user) return { error: { code: 'UNAUTHORIZED', message: 'Please sign in again.', status: 401 } }
  const { data: profile, error: profileError } = await client.from('profiles').select('id, display_name, role, active').eq('id', user.id).maybeSingle()
  if (profileError || !profile?.active) return { error: { code: 'FORBIDDEN', message: 'This account cannot use the assistant.', status: 403 } }
  return { user, profile }
}

