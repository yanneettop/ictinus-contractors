import { requireSupabase } from './supabaseClient'

export const teamService = {
  async invite({ email, displayName, role }) {
    const { data, error } = await requireSupabase().functions.invoke('invite-user', { body: { email, displayName, role } })
    if (error) throw new Error(error.message || 'The invitation could not be sent.')
    if (data?.error) throw new Error(data.error)
    return data.user
  },
  async setActive(userId, active) {
    const { error } = await requireSupabase().from('profiles').update({ active, updated_at: new Date().toISOString() }).eq('id', userId)
    if (error) throw error
  },
}
