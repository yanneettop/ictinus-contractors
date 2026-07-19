import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'

export default function LoginPage() {
  const { user, login, resetPassword, authMode, authReady } = useJobManager()
  const [username, setUsername] = useState(authMode === 'supabase' ? '' : 'ioannis')
  const [password, setPassword] = useState('demo123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const location = useLocation()
  if (authReady && user) return <Navigate to={location.state?.from || '/job-manager'} replace />
  const submit = async (event) => { event.preventDefault(); setError(''); try { await login(username, password) } catch (loginError) { setError(loginError.message) } }
  const recover = async () => { if (!username.includes('@')) { setError('Enter your email address first.'); return } setError(''); try { await resetPassword(username); setNotice('Password reset instructions have been sent.') } catch (resetError) { setError(resetError.message) } }
  return <div className="jm-login">
    <div className="jm-login-panel">
      <div className="jm-login-brand"><div className="jm-brand-mark">I</div><div><strong>Ictinus</strong><span>Job Manager</span></div></div>
      <div className="jm-login-copy"><p>Private workspace</p><h1>Good morning.</h1><span>Sign in to see today’s jobs, visits and payments.</span></div>
      <form onSubmit={submit} noValidate>
        <label>{authMode === 'supabase' ? 'Email address' : 'Username'}<input type={authMode === 'supabase' ? 'email' : 'text'} value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
        <label>Password<div className="jm-password"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
        {error && <p className="jm-form-error">{error}</p>}
        {notice && <p className="jm-form-notice">{notice}</p>}
        <button className="jm-button jm-button--primary jm-button--wide" type="submit"><LockKeyhole size={18} />Sign in</button>
        {authMode === 'supabase' && <button className="jm-login-recover" type="button" onClick={recover}>Forgot password?</button>}
      </form>
      {authMode === 'local' ? <div className="jm-demo-users"><p>Local demo access</p><button onClick={() => { setUsername('admin'); setPassword('demo123') }}><strong>Demo Administrator</strong><span>Administrator</span></button><button onClick={() => { setUsername('manager'); setPassword('demo123') }}><strong>Demo Site Manager</strong><span>Site manager</span></button><small>Password: demo123</small></div> : <div className="jm-secure-login-note"><LockKeyhole size={15} /><span>Private account access · Supabase Auth</span></div>}
    </div>
    <div className="jm-login-visual"><div><p>Saturday, 18 July</p><h2>Everything needed<br />for the day ahead.</h2><span>Jobs, people, dates and payments in one practical place.</span></div></div>
  </div>
}
