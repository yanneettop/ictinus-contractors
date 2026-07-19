import { KeyRound, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'

export default function UpdatePasswordPage() {
  const { authMode, updatePassword } = useJobManager()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    if (values.password !== values.confirmPassword) { setError('The passwords do not match.'); return }
    setSaving(true); setError('')
    try { await updatePassword(values.password); navigate('/job-manager', { replace: true }) }
    catch (passwordError) { setError(passwordError.message || 'The password could not be updated. Open the latest email link and try again.') }
    finally { setSaving(false) }
  }

  if (authMode !== 'supabase') return <div className="jm-login-page"><div className="jm-login-shell"><p>Password setup is available after Supabase is connected.</p><Link className="jm-button jm-button--secondary" to="/job-manager/login">Back to login</Link></div></div>

  return <div className="jm-login-page"><div className="jm-login-shell">
    <div className="jm-login-brand"><span><ShieldCheck size={30} /></span><div><p>ICTINUS CONTRACTORS</p><strong>Secure account setup</strong></div></div>
    <div className="jm-login-copy"><span><KeyRound size={18} />Private workspace</span><h1>Choose your password</h1><p>Use at least 10 characters. This page works from an invitation or password-reset email.</p></div>
    <form className="jm-login-form" onSubmit={submit}><label>New password<input name="password" type="password" minLength="10" autoComplete="new-password" required /></label><label>Confirm password<input name="confirmPassword" type="password" minLength="10" autoComplete="new-password" required /></label>{error && <p className="jm-form-error">{error}</p>}<button className="jm-button jm-button--primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save password'}</button></form>
  </div></div>
}
