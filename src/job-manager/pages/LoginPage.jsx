import { Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'

export default function LoginPage() {
  const { user, login, resetPassword, authMode, authReady } = useJobManager()
  const [username, setUsername] = useState(authMode === 'supabase' ? '' : 'ioannis')
  const [password, setPassword] = useState(authMode === 'supabase' ? '' : 'demo123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [recovering, setRecovering] = useState(false)
  const location = useLocation()
  const today = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  if (authReady && user) return <Navigate to={location.state?.from || '/job-manager'} replace />

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setSubmitting(true)
    try { await login(username, password) }
    catch (loginError) { setError(loginError.message) }
    finally { setSubmitting(false) }
  }

  const recover = async () => {
    if (!username.includes('@')) { setError('Enter your email address first.'); return }
    setError('')
    setNotice('')
    setRecovering(true)
    try { await resetPassword(username); setNotice('Password reset instructions have been sent. Check your inbox.') }
    catch (resetError) { setError(resetError.message) }
    finally { setRecovering(false) }
  }

  return <main className="jm-login">
    <section className="jm-login-panel" aria-labelledby="jm-login-title">
      <div className="jm-login-brand">
        <div className="jm-brand-mark" aria-hidden="true">I</div>
        <div><strong>Ictinus</strong><span>Job Manager</span></div>
      </div>

      <div className="jm-login-copy">
        <p><ShieldCheck size={15} aria-hidden="true" /> Private workspace</p>
        <h1 id="jm-login-title">Welcome back.</h1>
        <span>Sign in to manage jobs, visits and payments.</span>
      </div>

      <form onSubmit={submit} noValidate>
        <label>{authMode === 'supabase' ? 'Email address' : 'Username'}
          <input type={authMode === 'supabase' ? 'email' : 'text'} value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" inputMode={authMode === 'supabase' ? 'email' : undefined} required autoFocus />
        </label>
        <label>Password
          <div className="jm-password">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </label>
        <div className="jm-auth-message" aria-live="polite">
          {error && <p className="jm-form-error">{error}</p>}
          {notice && <p className="jm-form-notice">{notice}</p>}
        </div>
        <button className="jm-button jm-button--primary jm-button--wide" type="submit" disabled={submitting || !authReady}><LockKeyhole size={18} />{submitting ? 'Signing in…' : 'Sign in'}</button>
        {authMode === 'supabase' && <button className="jm-login-recover" type="button" onClick={recover} disabled={recovering}>{recovering ? 'Sending…' : 'Forgot password?'}</button>}
      </form>

      {authMode === 'local' ? <div className="jm-demo-users"><p>Local demo access</p><button onClick={() => { setUsername('admin'); setPassword('demo123') }}><strong>Demo Administrator</strong><span>Administrator</span></button><button onClick={() => { setUsername('manager'); setPassword('demo123') }}><strong>Demo Site Manager</strong><span>Site manager</span></button><small>Password: demo123</small></div> : <div className="jm-secure-login-note"><LockKeyhole size={15} /><span>Secure access powered by Supabase Auth</span></div>}
    </section>

    <aside className="jm-login-visual" aria-label="Ictinus workspace introduction">
      <div><p>{today}</p><h2>Everything needed<br />for the day ahead.</h2><span>Jobs, people, dates and payments in one practical place.</span></div>
    </aside>
  </main>
}
