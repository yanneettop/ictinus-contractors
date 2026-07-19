import { ArrowLeft, Eye, EyeOff, KeyRound, LockKeyhole, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'

export default function UpdatePasswordPage() {
  const { authMode, updatePassword } = useJobManager()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    if (values.password !== values.confirmPassword) { setError('The passwords do not match.'); return }
    setSaving(true)
    setError('')
    try { await updatePassword(values.password); navigate('/job-manager', { replace: true }) }
    catch (passwordError) { setError(passwordError.message || 'The password could not be updated. Open the latest email link and try again.') }
    finally { setSaving(false) }
  }

  if (authMode !== 'supabase') return <main className="jm-login jm-login--setup"><section className="jm-login-panel jm-login-panel--message"><div className="jm-login-brand"><div className="jm-brand-mark" aria-hidden="true">I</div><div><strong>Ictinus</strong><span>Job Manager</span></div></div><div className="jm-login-copy"><p><ShieldCheck size={15} /> Private workspace</p><h1>Account setup unavailable.</h1><span>Password setup becomes available when Supabase is connected.</span></div><Link className="jm-button jm-button--secondary jm-button--wide" to="/job-manager/login"><ArrowLeft size={17} />Back to sign in</Link></section><aside className="jm-login-visual" aria-hidden="true" /></main>

  return <main className="jm-login jm-login--setup">
    <section className="jm-login-panel" aria-labelledby="jm-password-title">
      <div className="jm-login-brand">
        <div className="jm-brand-mark jm-brand-mark--secure" aria-hidden="true"><ShieldCheck size={22} /></div>
        <div><strong>Ictinus</strong><span>Secure account setup</span></div>
      </div>

      <div className="jm-login-copy jm-login-copy--setup">
        <p><KeyRound size={15} aria-hidden="true" /> Private workspace</p>
        <h1 id="jm-password-title">Choose your password.</h1>
        <span>Use at least 10 characters to protect your account.</span>
      </div>

      <form onSubmit={submit} noValidate>
        <label>New password
          <div className="jm-password">
            <input name="password" type={showPassword ? 'text' : 'password'} minLength="10" autoComplete="new-password" aria-describedby="jm-password-hint" required autoFocus />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </label>
        <p id="jm-password-hint" className="jm-field-hint">At least 10 characters. A longer, unique passphrase is best.</p>
        <label>Confirm password
          <input name="confirmPassword" type={showPassword ? 'text' : 'password'} minLength="10" autoComplete="new-password" required />
        </label>
        <div className="jm-auth-message" aria-live="polite">{error && <p className="jm-form-error">{error}</p>}</div>
        <button className="jm-button jm-button--primary jm-button--wide" type="submit" disabled={saving}><LockKeyhole size={18} />{saving ? 'Saving…' : 'Save password'}</button>
      </form>

      <Link className="jm-auth-back" to="/job-manager/login"><ArrowLeft size={15} />Back to sign in</Link>
      <div className="jm-secure-login-note"><ShieldCheck size={15} /><span>Your password is handled securely by Supabase Auth</span></div>
    </section>

    <aside className="jm-login-visual jm-login-visual--setup" aria-label="Secure account setup information">
      <div><p>Private by default</p><h2>Your project data<br />stays with your team.</h2><span>Encrypted authentication and role-based access for the Ictinus workspace.</span></div>
    </aside>
  </main>
}
