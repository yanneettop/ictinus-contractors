import { useState } from 'react'

const SERVICE_OPTIONS = [
  'Painting & Decorating',
  'Wallpapering',
  'Plastering',
  'Hard Flooring Installation',
  'Bathroom Fitting',
  'Property Refurbishment',
  'Finishing Carpentry & Detail Work',
  'Multiple Services / Full Project',
  'Other',
]

const EMPTY = {
  name: '',
  email: '',
  postcode: '',
  service: '',
  description: '',
  photoLinks: '',
  preferredDate: '',
}

export default function QuoteForm() {
  const [form, setForm] = useState(EMPTY)
  const [notice, setNotice] = useState(null) // { type: 'info' | 'error', msg: string }
  const [submitted, setSubmitted] = useState(false)

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    setNotice(null)

    const required = ['name', 'email', 'postcode', 'service', 'description']
    const missing = required.filter((f) => !form[f].trim())
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      missing.push('email (invalid format)')
    }

    if (missing.length > 0) {
      setNotice({
        type: 'error',
        msg: `Please complete all required fields. Missing: ${missing.join(', ')}.`,
      })
      return
    }

    // TODO: Replace with Formspree/Basin POST when ready:
    // fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   body: new FormData(e.target),
    //   headers: { Accept: 'application/json' },
    // }).then(...)

    setSubmitted(true)
    setNotice({ type: 'info', msg: null })
  }

  return (
    <section id="quote" className="ict-quote-section">
      <div className="ict-quote-inner">
        <p className="ict-quote-label">Get in Touch</p>
        <h2 className="ict-quote-heading">Request a Free Quote</h2>
        <p className="ict-quote-subtitle">
          Tell us about your project and we&rsquo;ll get back to you with a detailed quote
          and estimated timeline — no obligation.
        </p>

        <form className="ict-form-card" onSubmit={submit} noValidate data-reveal style={{ transitionDelay: '80ms' }}>
          <div className="ict-form-grid">

            <div className="ict-form-group">
              <label>Name <span className="req">*</span></label>
              <input
                type="text" name="name" placeholder="Your full name"
                value={form.name} onChange={handle} required
              />
            </div>

            <div className="ict-form-group">
              <label>Email <span className="req">*</span></label>
              <input
                type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handle} required
              />
            </div>

            <div className="ict-form-group">
              <label>Postcode <span className="req">*</span></label>
              <input
                type="text" name="postcode" placeholder="e.g. SW1A 1AA"
                value={form.postcode} onChange={handle} required
              />
            </div>

            <div className="ict-form-group">
              <label>Service Type <span className="req">*</span></label>
              <select name="service" value={form.service} onChange={handle} required>
                <option value="" disabled>Select a service…</option>
                {SERVICE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="ict-form-group full-width">
              <label>Describe the Work <span className="req">*</span></label>
              <textarea
                name="description" rows={4}
                placeholder="Brief description of what you need done…"
                value={form.description} onChange={handle} required
              />
            </div>

            <div className="ict-form-group full-width">
              <label>
                Photo Links{' '}
                <span style={{ fontWeight: 400, color: '#2d2d2db3' }}>(optional)</span>
              </label>
              <input
                type="text" name="photoLinks"
                placeholder="Paste Google Drive, Dropbox, or image links…"
                value={form.photoLinks} onChange={handle}
              />
              <span className="ict-photo-note">
                Share a link to photos of the area or any reference images.
              </span>
            </div>

            <div className="ict-form-group full-width">
              <label>
                Preferred Date{' '}
                <span style={{ fontWeight: 400, color: '#2d2d2db3' }}>(optional)</span>
              </label>
              <input
                type="text" name="preferredDate"
                placeholder="e.g. Weekdays, March 2026, ASAP…"
                value={form.preferredDate} onChange={handle}
              />
            </div>

            <div className="ict-form-group full-width">
              <button
                type="submit"
                className="ict-submit-btn"
                disabled={submitted}
              >
                {submitted ? 'Received – Thank You' : 'Send Enquiry'}
              </button>
            </div>

            {/* Notice banner */}
            {notice?.type === 'error' && (
              <div className="ict-form-notice error full-width" role="alert">
                <strong>Please complete all required fields.</strong>
                {notice.msg.replace('Please complete all required fields.', '')}
              </div>
            )}
            {submitted && (
              <div className="ict-form-notice info full-width" role="status">
                <strong>Thank you for your interest!</strong>
                Quote requests by email will be available soon. For now, please email us directly at{' '}
                <a
                  href="mailto:info@ictinuscontractors.co.uk"
                  style={{ color: '#B08D2A', fontWeight: 600, textDecoration: 'underline' }}
                >
                  info@ictinuscontractors.co.uk
                </a>.
              </div>
            )}
          </div>
        </form>

        <p className="ict-email-note">
          Quote requests by email will be available soon. For now, please use the contact section
          or email{' '}
          <a
            href="mailto:info@ictinuscontractors.co.uk"
            style={{ color: '#B08D2A', fontWeight: 600 }}
          >
            info@ictinuscontractors.co.uk
          </a>{' '}
          directly.
        </p>
      </div>
    </section>
  )
}
