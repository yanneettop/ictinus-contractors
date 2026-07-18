import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'

export default function LoginPage() {
  const { user, login } = useJobManager()
  const [username, setUsername] = useState('ioannis')
  const [password, setPassword] = useState('demo123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const location = useLocation()
  if (user) return <Navigate to={location.state?.from || '/job-manager'} replace />
  const submit = (event) => { event.preventDefault(); setError(login(username, password) ? '' : 'That username or password is not recognised.') }
  return <div className="jm-login">
    <div className="jm-login-panel">
      <div className="jm-login-brand"><div className="jm-brand-mark">I</div><div><strong>Ictinus</strong><span>Job Manager</span></div></div>
      <div className="jm-login-copy"><p>Private workspace</p><h1>Good morning.</h1><span>Sign in to see today’s jobs, visits and payments.</span></div>
      <form onSubmit={submit} noValidate>
        <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label>
        <label>Password<div className="jm-password"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
        {error && <p className="jm-form-error">{error}</p>}
        <button className="jm-button jm-button--primary jm-button--wide" type="submit"><LockKeyhole size={18} />Sign in</button>
      </form>
      <div className="jm-demo-users"><p>Demo access</p><button onClick={() => { setUsername('ioannis'); setPassword('demo123') }}><strong>Ioannis</strong><span>Administrator</span></button><button onClick={() => { setUsername('konstantinos'); setPassword('demo123') }}><strong>Konstantinos</strong><span>Site manager</span></button><small>Password: demo123</small></div>
    </div>
    <div className="jm-login-visual"><div><p>Saturday, 18 July</p><h2>Everything needed<br />for the day ahead.</h2><span>Jobs, people, dates and payments in one practical place.</span></div></div>
  </div>
}
