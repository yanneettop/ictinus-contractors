import { Check, Download, Eye, FileCheck2, FilePlus2, FileText, Link2, LoaderCircle, Star, UploadCloud, X } from 'lucide-react'
import { useState } from 'react'
import { formatDate, formatGBP } from '../utils/format'
import { DocumentPreview } from './ProjectRecords'

const fileTypes = ['Site survey', 'Client brief', 'Plans', 'Photos', 'Contract', 'Other']

export default function LeadFilesPanel({ lead, quotes, documents, users, storageEnabled, canManageQuotes, canDelete, onUploadQuote, onAttachQuote, onUploadFiles, onSelectQuote, onDelete }) {
  const [mode, setMode] = useState(''); const [existingDocument, setExistingDocument] = useState(null); const [preview, setPreview] = useState(null); const [busy, setBusy] = useState(false); const [message, setMessage] = useState(''); const [error, setError] = useState('')
  const selectedQuote = quotes.find((quote) => quote.id === lead.quoteId) || quotes[quotes.length - 1]
  const linkedDocumentIds = new Set(quotes.map((quote) => quote.documentId).filter(Boolean))
  const unlinkedQuoteDocuments = documents.filter((document) => !linkedDocumentIds.has(document.id) && (document.type === 'Quotation' || /quot(?:e|ation)/i.test(document.name)))
  const quoteCandidateIds = new Set(unlinkedQuoteDocuments.map((document) => document.id))
  const otherDocuments = documents.filter((document) => !linkedDocumentIds.has(document.id) && !quoteCandidateIds.has(document.id))
  const openNewQuote = () => { setExistingDocument(null); setMode(mode === 'quote' ? '' : 'quote'); setError('') }
  const openExistingQuote = (document) => { setExistingDocument(document); setMode('quote'); setError('') }

  const submitQuote = async (event) => {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const values = Object.fromEntries(data); const file = data.get('file')
    setBusy(true); setError(''); setMessage('')
    try {
      if (existingDocument) await onAttachQuote(values, existingDocument.id)
      else { if (!file?.size) throw new Error('Choose the quote PDF.'); await onUploadQuote(values, file) }
      form.reset(); setMode(''); setExistingDocument(null); setMessage('Quote details saved and selected for this job.')
    } catch (uploadError) { setError(uploadError.message) } finally { setBusy(false) }
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
    <header className="jm-lead-section-heading"><div><p className="jm-eyebrow">Documents</p><h2>Quote & files</h2><span>The commercial record for this opportunity.</span></div><div>{canManageQuotes && <button type="button" className="jm-button jm-button--primary" onClick={openNewQuote}><FileText size={16} />Add quote</button>}<button type="button" className="jm-button" onClick={() => { setMode(mode === 'files' ? '' : 'files'); setExistingDocument(null) }}><FilePlus2 size={16} />Upload files</button></div></header>
    {message && <p className="jm-upload-notice"><Check size={15} />{message}</p>}{error && <p className="jm-form-error jm-lead-file-error">{error}</p>}
    {!storageEnabled && <p className="jm-form-error jm-lead-file-error">Private file uploads require the live Supabase workspace.</p>}

    {mode === 'quote' && storageEnabled && <form className="jm-lead-upload-card jm-form-grid" onSubmit={submitQuote}>
      <div className="jm-field-wide jm-quote-form-context">{existingDocument ? <><FileCheck2 size={22} /><div><strong>Use uploaded quotation</strong><span>{existingDocument.name}</span></div></> : <><UploadCloud size={22} /><div><strong>New quotation</strong><span>Upload the PDF and add the project-ready details.</span></div></>}</div>
      {!existingDocument && <label className="jm-field-wide jm-lead-file-picker"><UploadCloud size={24} /><span>Choose quotation PDF</span><small>PDF up to 25 MB</small><input name="file" type="file" accept="application/pdf,.pdf" required /></label>}
      <Field name="reference" label="Quote reference" placeholder="e.g. Q-2026-014" required /><Field name="amount" label="Accepted value (£)" type="number" min="0" step="0.01" defaultValue={lead.estimatedValue || ''} required />
      <Field name="projectTitle" label="Project title" defaultValue={`${lead.projectType} - ${lead.clientName}`} required wide /><Field name="projectType" label="Project type" defaultValue={lead.projectType} required />
      <label><span>Quote status</span><select name="status" defaultValue="Sent"><option>Sent</option><option>Preparing</option><option>Accepted</option></select></label>
      <Field name="address" label="Project address" defaultValue={lead.fullAddress} wide /><Field name="postcode" label="Postcode" defaultValue={lead.postcode} />
      <Field name="startDate" label="Planned start" type="date" /><Field name="endDate" label="Planned finish" type="date" />
      <Field name="description" label="Works summary" defaultValue={lead.enquirySummary} textarea wide /><Field name="scopeText" label="Scope of works" placeholder="One item per line" textarea wide /><Field name="notes" label="Internal quote notes" textarea wide />
      <footer><button type="button" className="jm-button" onClick={() => { setMode(''); setExistingDocument(null) }}>Cancel</button><button className="jm-button jm-button--primary" disabled={busy}>{busy ? <><LoaderCircle className="jm-spin" size={16} />Saving…</> : 'Save quote details'}</button></footer>
    </form>}

    {mode === 'files' && storageEnabled && <form className="jm-lead-upload-card jm-lead-general-upload" onSubmit={submitFiles}><label><span>File type</span><select name="type">{fileTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="jm-lead-file-picker"><UploadCloud size={24} /><span>Choose several files</span><small>PDF, JPG, PNG, WebP, HEIC or HEIF · 25 MB each</small><input name="files" type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,.pdf,.jpg,.jpeg,.png,.webp,.heic,.heif" required /></label><footer><button type="button" className="jm-button" onClick={() => setMode('')}>Cancel</button><button className="jm-button jm-button--primary" disabled={busy}>{busy ? <><LoaderCircle className="jm-spin" size={16} />Uploading…</> : 'Upload files'}</button></footer></form>}

    <div className="jm-lead-document-summary"><div><span>Selected quote</span><strong>{selectedQuote ? formatGBP(selectedQuote.amount || 0) : 'Not configured'}</strong></div><div><span>Quote versions</span><strong>{quotes.length}</strong></div><div><span>Total files</span><strong>{documents.length}</strong></div></div>

    <div className="jm-lead-quotes">
      {quotes.map((quote) => { const document = documents.find((item) => item.id === quote.documentId); const selected = selectedQuote?.id === quote.id; return <article key={quote.id} className={selected ? 'is-selected' : ''}><div className="jm-quote-icon"><FileText size={21} /></div><div><span>{selected && <><Star size={12} />Selected</>} {quote.status}</span><strong>{quote.reference || document?.name || 'Quotation'}</strong><small>{formatGBP(quote.amount || 0)} · {formatDate(quote.createdAt)}</small></div><div>{document?.url && <><button type="button" onClick={() => setPreview(document)} aria-label="Preview quote"><Eye size={16} /></button><a href={document.url} download aria-label="Download quote"><Download size={16} /></a></>}{canManageQuotes && !selected && <button type="button" className="jm-quote-select" onClick={() => onSelectQuote(quote.id)}>Use for job</button>}</div></article> })}
      {unlinkedQuoteDocuments.map((document) => <article key={document.id} className="is-unlinked"><div className="jm-quote-icon"><Link2 size={21} /></div><div><span>Details needed</span><strong>{document.name}</strong><small>Quotation PDF · uploaded {formatDate(document.createdAt)}</small></div><div><button type="button" onClick={() => setPreview(document)} aria-label="Preview quotation"><Eye size={16} /></button><a href={document.url} download aria-label="Download quotation"><Download size={16} /></a>{canManageQuotes && <button type="button" className="jm-quote-select" onClick={() => openExistingQuote(document)}>Add details</button>}</div></article>)}
      {!quotes.length && !unlinkedQuoteDocuments.length && <div className="jm-lead-files-empty"><FileText size={26} /><strong>No quotation yet</strong><span>Upload the PDF once, then its details will drive the project when the job is won.</span>{canManageQuotes && <button type="button" className="jm-button jm-button--primary" onClick={openNewQuote}>Add first quote</button>}</div>}
    </div>

    {otherDocuments.length > 0 && <div className="jm-lead-file-list"><h3>Supporting files <span>{otherDocuments.length}</span></h3>{otherDocuments.map((document) => <article key={document.id}><FilePlus2 size={18} /><div><strong>{document.name}</strong><small>{document.type} · {formatDate(document.createdAt)} · {users.find((item) => item.id === document.uploadedBy)?.name || 'Ictinus'}</small></div><button type="button" onClick={() => setPreview(document)} disabled={!document.url}><Eye size={16} /></button><a href={document.url} download><Download size={16} /></a>{canDelete(document) && <button type="button" className="is-danger" onClick={() => window.confirm('Delete this file?') && onDelete(document.id)}><X size={16} /></button>}</article>)}</div>}
    {preview && <DocumentPreview document={preview} onClose={() => setPreview(null)} />}
  </section>
}

function Field({ label, wide, textarea, ...props }) { const Tag = textarea ? 'textarea' : 'input'; return <label className={wide ? 'jm-field-wide' : ''}><span>{label}</span><Tag {...props} /></label> }
