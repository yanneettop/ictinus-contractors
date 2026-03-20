import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

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
  preferredDate: '',
}

const MAX_FILES = 8
const MAX_MB    = 5

/* ── Photo Upload Zone ── */
function PhotoUpload({ files, setFiles }) {
  const inputRef  = useRef(null)
  const [dragging, setDragging] = useState(false)

  const addFiles = useCallback((incoming) => {
    const images = Array.from(incoming).filter((f) => f.type.startsWith('image/'))
    setFiles((prev) => {
      const combined = [...prev]
      for (const f of images) {
        if (combined.length >= MAX_FILES) break
        if (f.size > MAX_MB * 1024 * 1024) continue
        if (combined.some((p) => p.name === f.name && p.size === f.size)) continue
        combined.push(Object.assign(f, { preview: URL.createObjectURL(f) }))
      }
      return combined
    })
  }, [setFiles])

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
      <label>
        Photos{' '}
        <span style={{ fontWeight: 400, color: '#2d2d2db3' }}>(optional — up to {MAX_FILES} images, {MAX_MB}MB each)</span>
      </label>

      {/* Drop zone */}
      <motion.div
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
        className="relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl px-5 py-7 cursor-pointer select-none"
        style={{ minHeight: '100px' }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />

        <svg className="w-7 h-7 text-[#B08D2A]/60" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <p className="font-['Source_Serif_4'] text-[0.875rem] text-[#5A5048] text-center">
          <span className="font-semibold text-[#B08D2A]">Click to upload</span> or drag &amp; drop photos here
        </p>
        <p className="font-['Source_Serif_4'] text-[0.75rem] text-[#9A9590]">
          JPEG, PNG, WebP, HEIC — max {MAX_FILES} files
        </p>
      </motion.div>

      {/* Thumbnails */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
          >
            {files.map((f, i) => (
              <motion.div
                key={f.name + f.size}
                className="relative group aspect-square rounded-lg overflow-hidden border border-[rgba(212,175,55,0.2)] bg-[#F5F0E6]"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={f.preview}
                  alt={f.name}
                  className="w-full h-full object-cover"
                />
                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); remove(i) }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#1C1714]/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${f.name}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}

            {/* Add more slot */}
            {files.length < MAX_FILES && (
              <motion.button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-[rgba(212,175,55,0.25)] flex items-center justify-center text-[#B08D2A]/50 hover:border-[rgba(212,175,55,0.5)] hover:text-[#B08D2A] transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <p className="font-['Source_Serif_4'] text-[0.75rem] text-[#9A9590] mt-1.5">
          {files.length} / {MAX_FILES} photo{files.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </div>
  )
}

/* ── Quote Form ── */
export default function QuoteForm() {
  const [form, setForm]       = useState(EMPTY)
  const [files, setFiles]     = useState([])
  const [notice, setNotice]   = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const handle = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setNotice(null)

    const required = ['name', 'email', 'postcode', 'service', 'description']
    const missing = required.filter((f) => !form[f].trim())
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      missing.push('email (invalid format)')
    }
    if (missing.length > 0) {
      setNotice({ type: 'error', msg: `Missing: ${missing.join(', ')}.` })
      return
    }

    setSending(true)
    try {
      const fd = new FormData()
      fd.append('access_key',      'aa27f271-0058-42f0-b3e2-464fbbd41c8e')
      fd.append('subject',         `New Quote Request – ${form.service} (${form.postcode})`)
      fd.append('from_name',       form.name)
      fd.append('replyto',         form.email)
      fd.append('name',            form.name)
      fd.append('email',           form.email)
      fd.append('postcode',        form.postcode)
      fd.append('service',         form.service)
      fd.append('description',     form.description)
      fd.append('preferred_date',  form.preferredDate || 'Not specified')
      files.forEach((f) => fd.append('attachment[]', f, f.name))

      const res  = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
      const data = await res.json()

      if (data.success) {
        setSubmitted(true)
        files.forEach((f) => URL.revokeObjectURL(f.preview))
      } else {
        setNotice({ type: 'error', msg: 'Something went wrong. Please email us directly.' })
      }
    } catch {
      setNotice({ type: 'error', msg: 'Network error. Please email us directly.' })
    } finally {
      setSending(false)
    }
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

            <PhotoUpload files={files} setFiles={setFiles} />

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
                disabled={submitted || sending}
              >
                {submitted ? 'Received – Thank You' : sending ? 'Sending…' : 'Send Enquiry'}
              </button>
            </div>

            {notice?.type === 'error' && (
              <div className="ict-form-notice error full-width" role="alert">
                <strong>Please complete all required fields.</strong>{' '}
                {notice.msg}
              </div>
            )}
            {submitted && (
              <div className="ict-form-notice info full-width" role="status">
                <strong>Thank you, {form.name.split(' ')[0]}!</strong>{' '}
                We've received your enquiry and will be in touch within 1–2 business days.
              </div>
            )}
          </div>
        </form>

        <p className="ict-email-note">
          Prefer to email directly?{' '}
          <a href="mailto:info@ictinuscontractors.co.uk" style={{ color: '#B08D2A', fontWeight: 600 }}>
            info@ictinuscontractors.co.uk
          </a>
        </p>
      </div>
    </section>
  )
}
