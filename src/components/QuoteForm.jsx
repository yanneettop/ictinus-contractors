import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { trackQuoteFormSubmit } from '../utils/tracking'

const WORK_OPTIONS = [
  'Property Refurbishment & Extensions',
  'Bathroom Fitting',
  'Hard Flooring',
  'Plastering',
  'Painting & Decorating',
  'Finishing Carpentry',
  'Electrical Works',
  'Plumbing',
  'Other / Not sure',
]

const PROPERTY_TYPES = [
  'House',
  'Flat / Apartment',
  'Rental property',
  'Commercial property',
  'Other',
]

const START_TIMES = [
  'As soon as possible',
  'Within 2-4 weeks',
  'Within 1-3 months',
  'Flexible / planning ahead',
]

const CONTACT_METHODS = ['Phone', 'Email', 'WhatsApp']

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  area: '',
  workType: '',
  description: '',
  propertyType: '',
  preferredStart: '',
  bestTime: '',
  contactMethod: '',
}

const MAX_FILES = 8
const MAX_MB = 5
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
const HEIC_EXTENSIONS = ['.heic', '.heif']

const isHeicFile = (file) => HEIC_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))

const isAllowedPhoto = (file) => {
  if (!file) return false
  if (ALLOWED_FILE_TYPES.includes(file.type)) return true
  return !file.type && isHeicFile(file)
}

const canPreviewPhoto = (file) => file.type && !['image/heic', 'image/heif'].includes(file.type) && !isHeicFile(file)

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="ict-field-error" role="alert">
      {message}
    </p>
  )
}

function TurnstileWidget({ siteKey, resetKey, onTokenChange }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)

  useEffect(() => {
    if (!siteKey || !containerRef.current) return undefined

    let cancelled = false

    const renderWidget = () => {
      if (cancelled || !window.turnstile || !containerRef.current || widgetIdRef.current !== null) return

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => onTokenChange(token),
        'expired-callback': () => onTokenChange(''),
        'error-callback': () => onTokenChange(''),
      })
    }

    const existingScript = document.getElementById('cf-turnstile-script')
    if (existingScript) {
      if (window.turnstile) {
        renderWidget()
      } else {
        existingScript.addEventListener('load', renderWidget, { once: true })
      }
    } else {
      const script = document.createElement('script')
      script.id = 'cf-turnstile-script'
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.addEventListener('load', renderWidget, { once: true })
      document.head.appendChild(script)
    }

    return () => {
      cancelled = true
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey, onTokenChange])

  useEffect(() => {
    if (window.turnstile && widgetIdRef.current !== null) {
      window.turnstile.reset(widgetIdRef.current)
      onTokenChange('')
    }
  }, [resetKey, onTokenChange])

  if (!siteKey) {
    return (
      <div className="ict-form-notice error full-width" role="alert">
        <strong>Spam check unavailable.</strong>
        Please call 07586 480417 or email info@ictinuscontractors.co.uk.
      </div>
    )
  }

  return (
    <div className="ict-form-group full-width">
      <div ref={containerRef} />
    </div>
  )
}

function PhotoUpload({ files, setFiles, setNotice }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const inputId = 'quote-photos'

  const addFiles = useCallback((incoming) => {
    const selected = Array.from(incoming || [])
    const invalid = selected.filter((f) => !isAllowedPhoto(f) || f.size > MAX_MB * 1024 * 1024)
    if (invalid.length > 0) {
      setNotice({
        type: 'error',
        msg: `Please upload JPG, PNG, WebP, HEIC or HEIF photos only, up to ${MAX_MB}MB each.`,
      })
    }

    const images = selected.filter((f) => isAllowedPhoto(f) && f.size <= MAX_MB * 1024 * 1024)
    setFiles((prev) => {
      const combined = [...prev]
      for (const f of images) {
        if (combined.length >= MAX_FILES) break
        if (combined.some((p) => p.name === f.name && p.size === f.size)) continue
        combined.push(Object.assign(f, { preview: URL.createObjectURL(f) }))
      }
      if (images.length > 0 && combined.length === MAX_FILES && prev.length + images.length > MAX_FILES) {
        setNotice({ type: 'error', msg: `You can upload up to ${MAX_FILES} photos.` })
      }
      return combined
    })
  }, [setFiles, setNotice])

  const remove = (idx) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className="ict-form-group full-width">
      <label htmlFor={inputId}>Upload photos</label>
      <p id={`${inputId}-help`} className="ict-field-help">
        Photos of the current condition help us understand the work faster.
      </p>

      <motion.button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => { e.preventDefault(); setDragging(true) }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={(e) => { e.preventDefault(); setDragging(false) }}
        onDrop={onDrop}
        animate={{
          borderColor: dragging ? 'rgba(212,175,55,0.7)' : 'rgba(212,175,55,0.25)',
          backgroundColor: dragging ? 'rgba(212,175,55,0.06)' : 'rgba(212,175,55,0.02)',
        }}
        transition={{ duration: 0.2 }}
        className="ict-photo-upload"
        aria-describedby={`${inputId}-help`}
      >
        <input
          id={inputId}
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <svg className="h-7 w-7 text-[#B08D2A]/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
        </svg>
        <span className="font-['Source_Serif_4'] text-[0.9rem] text-[#5A5048]">
          <span className="font-semibold text-[#B08D2A]">Click to upload</span> or drag photos here
        </span>
        <span className="font-['Source_Serif_4'] text-[0.75rem] text-[#9A9590]">
          JPEG, PNG, WebP or HEIC. Up to {MAX_FILES} images, {MAX_MB}MB each.
        </span>
      </motion.button>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
          >
            {files.map((f, i) => (
              <motion.div
                key={f.name + f.size}
                className="group relative aspect-square overflow-hidden rounded-lg border border-[rgba(212,175,55,0.2)] bg-[#F5F0E6]"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
              >
                {canPreviewPhoto(f) ? (
                  <img src={f.preview} alt={f.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#EFE7D8] px-2 text-center font-['Source_Serif_4'] text-[0.7rem] font-semibold uppercase tracking-wide text-[#8B6C2C]">
                    HEIC photo
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#1C1714]/75 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100"
                  aria-label={`Remove ${f.name}`}
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <p className="ict-field-help">
          {files.length} / {MAX_FILES} photo{files.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}

export default function QuoteForm() {
  const navigate = useNavigate()
  const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  const [form, setForm] = useState(EMPTY)
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)

  const handle = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!form.phone.trim()) next.phone = 'Please enter your phone number.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = 'Please enter a valid email address.'
    }
    if (!form.area.trim()) next.area = 'Please enter your property postcode or area.'
    if (!form.workType) next.workType = 'Please select the type of work.'
    if (!form.description.trim()) next.description = 'Please describe the work you need.'
    if (files.length > MAX_FILES) next.files = `Please upload no more than ${MAX_FILES} photos.`
    const invalidPhoto = files.find((file) => !isAllowedPhoto(file) || file.size > MAX_MB * 1024 * 1024)
    if (invalidPhoto) next.files = `Please upload JPG, PNG, WebP, HEIC or HEIF photos only, up to ${MAX_MB}MB each.`
    return next
  }

  const submit = async (e) => {
    e.preventDefault()
    setNotice(null)

    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setNotice({ type: 'error', msg: 'Please check the highlighted fields and try again.' })
      return
    }

    if (!turnstileToken) {
      setNotice({ type: 'error', msg: 'Please complete the quick spam check and try again.' })
      return
    }

    setSending(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('phone', form.phone)
      fd.append('email', form.email)
      fd.append('area', form.area)
      fd.append('workType', form.workType)
      fd.append('propertyType', form.propertyType)
      fd.append('preferredStart', form.preferredStart)
      fd.append('contactMethod', form.contactMethod)
      fd.append('bestTime', form.bestTime)
      fd.append('description', form.description)
      fd.append('cf-turnstile-response', turnstileToken)
      files.forEach((f) => fd.append('photos', f, f.name))

      const res = await fetch('/api/quote', { method: 'POST', body: fd })
      const data = await res.json().catch(() => null)

      if (res.ok && data?.ok) {
        const trackingContext = {
          service_type: form.workType || 'Not specified',
          property_type: form.propertyType || 'Not specified',
          preferred_contact_method: form.contactMethod || 'Not specified',
          page_path: window.location.pathname,
        }

        try {
          sessionStorage.setItem('ictinus_quote_context', JSON.stringify(trackingContext))
        } catch {
          // Session storage is optional; tracking should not affect the quote flow.
        }

        trackQuoteFormSubmit(trackingContext)
        setSubmitted(true)
        files.forEach((f) => URL.revokeObjectURL(f.preview))
        navigate('/thank-you')
      } else {
        setTurnstileResetKey((value) => value + 1)
        setNotice({ type: 'error', msg: data?.message || 'Something went wrong. Please email us directly or call 07586 480417.' })
      }
    } catch {
      setTurnstileResetKey((value) => value + 1)
      setNotice({ type: 'error', msg: 'Network error. Please email us directly or call 07586 480417.' })
    } finally {
      setSending(false)
    }
  }

  const errorId = (name) => `quote-${name}-error`

  return (
    <section id="quote" className="ict-quote-section">
      <div className="ict-quote-inner">
        <div className="ict-quote-intro">
          <p className="ict-quote-label">Project Enquiry</p>
          <h2 className="ict-quote-heading">Request a Quote</h2>
          <p className="ict-quote-subtitle">
            Tell us a few details about the work you need. Photos are helpful because they allow us to understand the space, condition and next step more clearly.
          </p>
        </div>

        <div className="ict-quote-layout">
          <form className="ict-form-card" onSubmit={submit} noValidate data-reveal style={{ transitionDelay: '80ms' }}>
            <div className="ict-form-grid">
              <div className="ict-form-group">
                <label htmlFor="quote-name">Full name <span className="req">*</span></label>
                <input
                  id="quote-name"
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handle}
                  required
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? errorId('name') : undefined}
                />
                <FieldError id={errorId('name')} message={errors.name} />
              </div>

              <div className="ict-form-group">
                <label htmlFor="quote-phone">Phone number <span className="req">*</span></label>
                <input
                  id="quote-phone"
                  type="tel"
                  name="phone"
                  placeholder="07586 480417"
                  value={form.phone}
                  onChange={handle}
                  required
                  autoComplete="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? errorId('phone') : undefined}
                />
                <FieldError id={errorId('phone')} message={errors.phone} />
              </div>

              <div className="ict-form-group">
                <label htmlFor="quote-email">Email address <span className="req">*</span></label>
                <input
                  id="quote-email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handle}
                  required
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? errorId('email') : undefined}
                />
                <FieldError id={errorId('email')} message={errors.email} />
              </div>

              <div className="ict-form-group">
                <label htmlFor="quote-area">Property postcode or area <span className="req">*</span></label>
                <input
                  id="quote-area"
                  type="text"
                  name="area"
                  placeholder="e.g. E14, Hackney, Islington"
                  value={form.area}
                  onChange={handle}
                  required
                  autoComplete="postal-code"
                  aria-invalid={Boolean(errors.area)}
                  aria-describedby={errors.area ? errorId('area') : undefined}
                />
                <FieldError id={errorId('area')} message={errors.area} />
              </div>

              <div className="ict-form-group">
                <label htmlFor="quote-work-type">Type of work <span className="req">*</span></label>
                <select
                  id="quote-work-type"
                  name="workType"
                  value={form.workType}
                  onChange={handle}
                  required
                  aria-invalid={Boolean(errors.workType)}
                  aria-describedby={errors.workType ? errorId('workType') : undefined}
                >
                  <option value="" disabled>Select the type of work</option>
                  {WORK_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <FieldError id={errorId('workType')} message={errors.workType} />
              </div>

              <div className="ict-form-group">
                <label htmlFor="quote-property-type">Property type</label>
                <select id="quote-property-type" name="propertyType" value={form.propertyType} onChange={handle}>
                  <option value="">Select property type</option>
                  {PROPERTY_TYPES.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="ict-form-group">
                <label htmlFor="quote-start">Preferred start time</label>
                <select id="quote-start" name="preferredStart" value={form.preferredStart} onChange={handle}>
                  <option value="">Select timing</option>
                  {START_TIMES.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="ict-form-group">
                <label htmlFor="quote-contact-method">Preferred contact method</label>
                <select id="quote-contact-method" name="contactMethod" value={form.contactMethod} onChange={handle}>
                  <option value="">Select contact method</option>
                  {CONTACT_METHODS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="ict-form-group full-width">
                <label htmlFor="quote-best-time">Best time to contact</label>
                <input
                  id="quote-best-time"
                  type="text"
                  name="bestTime"
                  placeholder="e.g. Weekday mornings, after 5pm"
                  value={form.bestTime}
                  onChange={handle}
                  autoComplete="off"
                />
              </div>

              <div className="ict-form-group full-width">
                <label htmlFor="quote-description">Short project description <span className="req">*</span></label>
                <textarea
                  id="quote-description"
                  name="description"
                  rows={5}
                  placeholder="Briefly describe the work, current condition, rooms involved, and anything useful to know."
                  value={form.description}
                  onChange={handle}
                  required
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={errors.description ? errorId('description') : undefined}
                />
                <FieldError id={errorId('description')} message={errors.description} />
              </div>

              <PhotoUpload files={files} setFiles={setFiles} setNotice={setNotice} />
              {errors.files && (
                <div className="ict-form-group full-width">
                  <FieldError id={errorId('files')} message={errors.files} />
                </div>
              )}

              <TurnstileWidget
                siteKey={turnstileSiteKey}
                resetKey={turnstileResetKey}
                onTokenChange={setTurnstileToken}
              />

              <div className="ict-form-group full-width">
                <motion.button
                  type="submit"
                  className="ict-submit-btn"
                  disabled={submitted || sending}
                  whileHover={submitted || sending ? {} : { scale: 1.015, y: -1, boxShadow: '0 10px 28px rgba(212,175,55,0.42), 0 2px 6px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.28)' }}
                  whileTap={submitted || sending ? {} : { scale: 0.98, y: 0 }}
                  transition={{ type: 'spring', stiffness: 340, damping: 22 }}
                >
                  {submitted ? 'Request Received' : sending ? 'Sending...' : 'Send Quote Request'}
                </motion.button>
              </div>

              {notice?.type === 'error' && (
                <div className="ict-form-notice error full-width" role="alert">
                  <strong>Please complete all required fields.</strong>
                  {notice.msg}
                </div>
              )}

              {submitted && (
                <div className="ict-form-notice info full-width" role="status">
                  Thank you. We've received your enquiry and will get back to you as soon as possible. If you have photos, you can also send them by WhatsApp to help us understand the work faster.
                </div>
              )}
            </div>
          </form>

          <aside className="ict-quote-trust-panel" data-reveal style={{ transitionDelay: '140ms' }}>
            <h3>Why send photos?</h3>
            <p>
              Photos help us understand the condition of the space, the type of work required and whether a visit may be needed before quoting.
            </p>
            <ul>
              {[
                '9.97/10 Checkatrade rating',
                '33 verified reviews',
                'Fully insured',
                'Free estimates',
                'Clear communication',
              ].map((point) => (
                <li key={point}>
                  <svg className="h-4 w-4 flex-shrink-0 text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {point}
                </li>
              ))}
            </ul>
            <div className="ict-quote-callout">
              <span>Prefer to speak directly?</span>
              <a href="tel:07586480417" data-link-location="quote form trust panel">Call 07586 480417</a>
            </div>
          </aside>
        </div>

        <p className="ict-email-note">
          Prefer to email directly?{' '}
          <a href="mailto:info@ictinuscontractors.co.uk" data-link-location="quote form email note">
            info@ictinuscontractors.co.uk
          </a>
        </p>
      </div>
    </section>
  )
}
