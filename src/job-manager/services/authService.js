import { demoUsers } from '../data/seed'
import { requireSupabase, supabaseConfigured } from './supabaseClient'

const SESSION_KEY = 'ictinus-job-manager-session'

const profileToUser = (profile, authUser) => profile ? {
  id: profile.id,
  name: profile.display_name,
  role: profile.role,
  email: authUser?.email || '',
} : null

export const localAuthService = {
  mode: 'local',
  async getUser() { return demoUsers.find((item) => item.id === sessionStorage.getItem(SESSION_KEY)) || null },
  async signIn(identifier, password) {
    const match = demoUsers.find((item) => item.username.toLowerCase() === identifier.toLowerCase().trim() && item.password === password)
    if (!match) throw new Error('That username or password is not recognised.')
    sessionStorage.setItem(SESSION_KEY, match.id)
    return match
  },
  async signOut() { sessionStorage.removeItem(SESSION_KEY) },
  onAuthStateChange() { return () => {} },
  async resetPassword() { throw new Error('Password reset requires Supabase.') },
  async getAccessToken() { return null },
}

export const supabaseAuthService = {
  mode: 'supabase',
  async getUser() {
    const client = requireSupabase(); const { data: { user }, error } = await client.auth.getUser()
    if (error || !user) return null
    const { data: profile, error: profileError } = await client.from('profiles').select('*').eq('id', user.id).single()
    if (profileError) throw profileError
    if (!profile.active) { await client.auth.signOut(); throw new Error('This account has been disabled.') }
    return profileToUser(profile, user)
  },
  async getAccessToken() {
    const { data: { session }, error } = await requireSupabase().auth.getSession()
    if (error) throw error
    return session?.access_token || null
  },
  async signIn(email, password) {
    const client = requireSupabase(); const { data, error } = await client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    if (error) throw new Error('The email or password is not recognised.')
    const { data: profile, error: profileError } = await client.from('profiles').select('*').eq('id', data.user.id).single()
    if (profileError) throw profileError
    if (!profile.active) { await client.auth.signOut(); throw new Error('This account has been disabled.') }
    return profileToUser(profile, data.user)
  },
  async signOut() { const { error } = await requireSupabase().auth.signOut(); if (error) throw error },
  onAuthStateChange(callback) {
    const client = requireSupabase()
    const { data } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') { callback(null); return }
      if (session?.user && ['INITIAL_SESSION', 'SIGNED_IN', 'PASSWORD_RECOVERY', 'USER_UPDATED'].includes(event)) {
        setTimeout(async () => {
          const { data: profile } = await client.from('profiles').select('*').eq('id', session.user.id).single()
          if (profile?.active) callback(profileToUser(profile, session.user))
        }, 0)
      }
    })
    return () => data.subscription.unsubscribe()
  },
  async resetPassword(email) {
    const { error } = await requireSupabase().auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/job-manager/update-password` })
    if (error) throw error
  },
  async updatePassword(password) {
    const { error } = await requireSupabase().auth.updateUser({ password })
    if (error) throw error
  },
}

export const authService = supabaseConfigured ? supabaseAuthService : localAuthService
export { supabaseConfigured }
