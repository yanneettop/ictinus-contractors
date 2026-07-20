import { Check, Download, Eye, FilePlus2, FileText, LoaderCircle, Star, UploadCloud, X } from 'lucide-react'
import { useState } from 'react'
import { formatDate, formatGBP } from '../utils/format'
import { DocumentPreview } from './ProjectRecords'

const fileTypes = ['Quotation', 'Site survey', 'Client brief', 'Plans', 'Photos', 'Contract', 'Other']

export default function LeadFilesPanel({ lead, quotes, documents, users, storageEnabled, canManageQuotes, canDelete, onUploadQuote, onUploadFiles, onSelectQuote, onDelete }) {
  const [mode, setMode] = useState(''); const [preview, setPreview] = useState(null); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [error, setError] = useState('')
  const selectedQuote = quotes.find((quote) => quote.id === lead.quoteId) || quotes[quotes.length - 1]
  const submitQuote = async (event) => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const file = data.get('file')
    setBusy(true); setError(''); setMessage('')
    try { if (!file?.size) throw new Error('Choose the quote PDF.'); await onUploadQuote(Object.fromEntries(data), file); form.reset(); setMode(''); setMessage('Quote uploaded and selected for the project.') }
    catch (uploadError) { setError(uploadError.message) } finally { setBusy(false) }
  }
  const submitFiles = async (event) => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const files = [...form.elements.files.files]
    setBusy(true); setError(''); setMessage('')
    try {
      if (!files.length) throw new Error('Choose one or more files.')
      for (const file of files) await onUploadFiles({ type: data.get('type'), name: file.name }, file)
      form.reset(); setMode(''); setMessage(`${files.length} file${files.length === 1 ? '' : 's'} uploaded.`)
    } catch (uploadError) { setError(uploadError.message) } finally { setBusy(false) }
  }
  return <section className="jm-panel jm-lead-files">
    <header className="jm-lead-section-heading"><div><p className="jm-eyebrow">Documents</p><h2>Quote & files</h2><span>Keep the accepted quote and every enquiry file together.</span></div><div>{canManageQuotes && <button className="jm-button jm-button--primary" onClick={() => setMode(mode === 'quote' ? '' : 'quote')}><FileText size={16} />Add quote PDF</button>}<button className="jm-button" onClick={() => setMode(mode === 'files' ? '' : 'files')}><FilePlus2 size={16} />Upload files</button></div></header>
    {message && <p className="jm-upload-notice"><Check size={15} />{message}</p>}{error && <p className="jm-form-error jm-lead-file-error">{error}</p>}
    {!storageEnabled && <p className="jm-form-error jm-lead-file-error">Private file uploads require the live Supabase workspace.</p>}
    {mode === 'quote' && storageEnabled && <form className="jm-lead-upload-card jm-form-grid" onSubmit={submitQuote}>
      <label className="jm-field-wide jm-lead-file-picker"><UploadCloud size={24} /><span>Choose quotation PDF</span><small>PDF up to 25 MB</small><input name="file" type="file" accept="application/pdf,.pdf" required /></label>
      <Field name="reference" label="Quote reference" placeholder="e.g. Q-2026-014" required /><Field name="amount" label="Accepted value (£)" type="number" min="0" step="0.01" defaultValue={lead.estimatedValue || ''} required />
      <Field name="projectTitle" label="Project title" defaultValue={`${lead.projectType} - ${lead.clientName}`} required wide /><Field name="projectType" label="Project type" defaultValue={lead.projectType} required />
      <label><span>Quote status</span><select name="status" defaultValue="Sent"><option>Sent</option><option>Preparing</option><option>Accepted</option></select></label>
      <Field name="address" label="Project address" defaultValue={lead.fullAddress} wide /><Field name="postcode" label="Postcode" defaultValue={lead.postcode} />
      <Field name="startDate" label="Planned start" type="date" /><Field name="endDate" label="Planned finish" type="date" />
      <Field name="description" label="Works summary" defaultValue={lead.enquirySummary} textarea wide /><Field name="scopeText" label="Scope of works" placeholder="One item per line" textarea wide /><Field name="notes" label="Internal quote notes" textarea wide />
      <footer><button type="button" className="jm-button" onClick={() => setMode('')}>Cancel</button><button className="jm-button jm-button--primary" disabled={busy}>{busy ? <><LoaderCircle className="jm-spin" size={16} />Uploading…</> : 'Save quote'}</button></footer>
    </form>}
    {mode === 'files' && storageEnabled && <form className="jm-lead-upload-card jm-lead-general-upload" onSubmit={submitFiles}><label><span>File type</span><select name="type">{fileTypes.filter((item) => item !== 'Quotation').map((type) => <option key={type}>{type}</option>)}</select></label><label className="jm-lead-file-picker"><UploadCloud size={24} /><span>Choose several files</span><small>PDF, JPG, PNG, WebP, HEIC or HEIF · 25 MB each</small><input name="files" type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,.pdf,.jpg,.jpeg,.png,.webp,.heic,.heif" required /></label><footer><button type="button" className="jm-button" onClick={() => setMode('')}>Cancel</button><button className="jm-button jm-button--primary" disabled={busy}>{busy ? <><LoaderCircle className="jm-spin" size={16} />Uploading…</> : 'Upload files'}</button></footer></form>}
    <div className="jm-lead-quotes">
      {quotes.map((quote) => { const document = documents.find((item) => item.id === quote.documentId); const selected = selectedQuote?.id === quote.id; return <article key={quote.id} className={selected ? 'is-selected' : ''}><div className="jm-quote-icon"><FileText size={21} /></div><div><span>{selected && <><Star size={12} />Selected quote</>} {quote.status}</span><strong>{quote.reference || document?.name || 'Quotation'}</strong><small>{formatGBP(quote.amount || 0)} · {formatDate(quote.createdAt)}</small></div><div>{document?.url && <><button onClick={() => setPreview(document)} aria-label="Preview quote"><Eye size={16} /></button><a href={document.url} download aria-label="Download quote"><Download size={16} /></a></>}{canManageQuotes && !selected && <button className="jm-quote-select" onClick={() => onSelectQuote(quote.id)}>Use for job</button>}</div></article> })}
      {!quotes.length && <div className="jm-lead-files-empty"><FileText size={26} /><strong>No quote uploaded yet</strong><span>Add the PDF and quote details before marking this lead as won.</span></div>}
    </div>
    {documents.filter((document) => document.type !== 'Quotation').length > 0 && <div className="jm-lead-file-list"><h3>Other files</h3>{documents.filter((document) => document.type !== 'Quotation').map((document) => <article key={document.id}><FilePlus2 size={18} /><div><strong>{document.name}</strong><small>{document.type} · {formatDate(document.createdAt)} · {users.find((item) => item.id === document.uploadedBy)?.name || 'Ictinus'}</small></div><button onClick={() => setPreview(document)} disabled={!document.url}><Eye size={16} /></button><a href={document.url} download><Download size={16} /></a>{canDelete(document) && <button className="is-danger" onClick={() => window.confirm('Delete this file?') && onDelete(document.id)}><X size={16} /></button>}</article>)}</div>}
    {preview && <DocumentPreview document={preview} onClose={() => setPreview(null)} />}
  </section>
}

function Field({ label, wide, textarea, ...props }) { const Tag = textarea ? 'textarea' : 'input'; return <label className={wide ? 'jm-field-wide' : ''}><span>{label}</span><Tag {...props} /></label> }
