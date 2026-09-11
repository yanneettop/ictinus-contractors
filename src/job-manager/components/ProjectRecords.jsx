import { Camera, Check, Download, ExternalLink, Eye, File, FileCheck2, FileImage, FilePlus2, FileText, FolderOpen, ImagePlus, LoaderCircle, Maximize2, Trash2, UploadCloud, Video, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { formatDate } from '../utils/format'
import { applySelectedFileDefaults, documentPreviewKind, friendlyUploadError, PROJECT_FILE_ACCEPT, PROJECT_FILE_HELP, PROJECT_GALLERY_ACCEPT, PROJECT_GALLERY_HELP, uploadFileKind, validateUploadFile } from '../utils/fileUploads'

const documentGroups = ['Quotation', 'Invoice', 'Payment schedule', 'Photos', 'Video', 'Word document', 'Text file', 'Contract', 'Certificate', 'Google Drive folder', 'Other']
const documentIcon = (document) => {
  const kind = uploadFileKind(document.name, document.type)
  if (kind === 'video') return Video
  if (kind === 'word' || kind === 'text') return FileText
  if (kind === 'image') return FileImage
  if (document.type.includes('Drive')) return FolderOpen
  if (document.type === 'Certificate' || document.type === 'Contract') return FileCheck2
  return File
}

export function DocumentsSection({ documents, users, canDelete = () => false, onDelete, onAdd, onUpload, storageEnabled }) {
  const [preview, setPreview] = useState(null); const [adding, setAdding] = useState(false); const [uploading, setUploading] = useState(false); const [error, setError] = useState(''); const [notice, setNotice] = useState('')
  const groups = useMemo(() => {
    const types = [...documentGroups]
    documents.forEach((document) => { if (!types.some((type) => type.toLowerCase() === document.type.toLowerCase())) types.push(document.type) })
    return types.map((type) => ({ type, items: documents.filter((document) => document.type.toLowerCase() === type.toLowerCase()) })).filter((group) => group.items.length)
  }, [documents])
  useEffect(() => {
    if (!preview) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => { if (event.key === 'Escape') setPreview(null) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', closeOnEscape) }
  }, [preview])
  const submitDocument = async (event) => {
    event.preventDefault(); setError(''); setNotice(''); setUploading(true)
    const form = event.currentTarget; const formData = new FormData(form); const file = formData.get('file'); const values = { name: String(formData.get('name')).trim(), type: formData.get('type'), url: String(formData.get('url') || '').trim() }
    try {
      if (storageEnabled) { if (!file?.size) throw new Error('Choose a file to store in the account.'); await onUpload(values, file) }
      else { if (!values.url) throw new Error('Add an external file URL.'); await onAdd(values) }
      form.reset(); setAdding(false); setNotice('Document added to this project.')
    } catch (uploadError) { setError(friendlyUploadError(uploadError)) }
    finally { setUploading(false) }
  }
  const closeUploader = () => { if (uploading) return; setAdding(false); setError('') }
  return <section className="jm-detail-card jm-documents-section"><div className="jm-card-heading"><div><h2>Documents</h2><p>{documents.length} linked file{documents.length === 1 ? '' : 's'}</p></div><div className="jm-document-heading-actions"><span>Grouped by type</span><button type="button" className="jm-button jm-button--small jm-button--secondary" onClick={() => { setAdding((value) => !value); setError(''); setNotice('') }}><FilePlus2 size={15} />{adding ? 'Close' : 'Add documents'}</button></div></div>{notice && <p className="jm-upload-notice" role="status" aria-live="polite"><Check size={15} />{notice}</p>}{adding && <form className="jm-document-upload-form" onSubmit={submitDocument}><div><label><span>Document name</span><input name="name" placeholder="Filled automatically from the file" required /></label><label><span>Document type</span><select name="type"><option>Quotation</option><option>Invoice</option><option>Payment schedule</option><option>Photos</option><option>Video</option><option>Word document</option><option>Text file</option><option>Contract</option><option>Certificate</option><option>Other</option></select></label>{storageEnabled ? <label className="jm-document-upload-picker"><span>Choose a file</span><input name="file" type="file" accept={PROJECT_FILE_ACCEPT} onChange={(event) => applySelectedFileDefaults(event.currentTarget)} required /><small>{PROJECT_FILE_HELP}</small></label> : <label className="jm-document-upload-picker"><span>External file link</span><input name="url" type="url" placeholder="https://" required /></label>}</div>{error && <p className="jm-form-error" role="alert" aria-live="assertive">{error}</p>}<footer><button type="button" className="jm-button jm-button--secondary" onClick={closeUploader}>Cancel</button><button type="submit" className="jm-button jm-button--primary" disabled={uploading}>{uploading ? <><LoaderCircle className="jm-spin" size={16} />Uploading…</> : 'Upload document'}</button></footer></form>}{groups.length ? <div className="jm-document-groups">{groups.map((group) => <div key={group.type}><h3>{group.type}</h3>{group.items.map((document) => { const Icon = documentIcon(document); const uploader = users.find((user) => user.id === document.uploadedBy); return <article key={document.id}><span className="jm-document-icon"><Icon size={18} /></span><div><strong>{document.name}</strong><small>{formatDate(document.createdAt)} · {uploader?.name || 'Ictinus'}</small></div><button type="button" onClick={() => setPreview(document)} aria-label={`Preview ${document.name}`} disabled={!document.url}><Eye size={15} /><span>View</span></button><a href={document.url} download aria-label={`Download ${document.name}`}><Download size={15} /><span>Download</span></a>{canDelete(document) && <button onClick={() => onDelete(document.id)} aria-label={`Delete ${document.name}`}><Trash2 size={15} /><span>Delete</span></button>}</article> })}</div>)}</div> : <p className="jm-empty-copy">No documents have been added yet.</p>}{preview && <DocumentPreview document={preview} onClose={() => setPreview(null)} />}</section>
}

export function DocumentPreview({ document: selectedDocument, onClose }) {
  const kind = documentPreviewKind(selectedDocument)
  const [content, setContent] = useState({ loading: false, text: '', error: '' })
  useEffect(() => {
    if (!['docx', 'text'].includes(kind)) return undefined
    const controller = new AbortController()
    const loadContent = async () => {
      setContent({ loading: true, text: '', error: '' })
      try {
        const response = await fetch(selectedDocument.url, { signal: controller.signal })
        if (!response.ok) throw new Error(`File request failed (${response.status})`)
        if (kind === 'text') {
          setContent({ loading: false, text: await response.text(), error: '' })
          return
        }
        const arrayBuffer = await response.arrayBuffer()
        const mammothModule = await import('mammoth')
        const mammoth = mammothModule.default || mammothModule
        const result = await mammoth.extractRawText({ arrayBuffer })
        setContent({ loading: false, text: result.value, error: '' })
      } catch (previewError) {
        if (previewError.name !== 'AbortError') setContent({ loading: false, text: '', error: 'This file could not be previewed. Download it to open the original.' })
      }
    }
    loadContent()
    return () => controller.abort()
  }, [kind, selectedDocument.url])
  return <div className="jm-document-preview" role="dialog" aria-modal="true" aria-labelledby="jm-document-preview-title" onMouseDown={onClose}>
    <div className="jm-document-preview-shell" onMouseDown={(event) => event.stopPropagation()}>
      <header><div><span>{selectedDocument.type}</span><strong id="jm-document-preview-title">{selectedDocument.name}</strong></div><div><a href={selectedDocument.url} download aria-label={`Download ${selectedDocument.name}`}><Download size={18} /><span>Download</span></a><button type="button" onClick={onClose} aria-label="Close document preview" autoFocus><X size={21} /></button></div></header>
      <div className="jm-document-preview-content">{kind === 'image' ? <img src={selectedDocument.url} alt={selectedDocument.name} /> : kind === 'video' ? <video src={selectedDocument.url} controls playsInline preload="metadata">Your browser cannot play this video.</video> : kind === 'pdf' ? <iframe src={selectedDocument.url} title={selectedDocument.name} /> : ['docx', 'text'].includes(kind) ? <div className="jm-document-text-preview">{content.loading ? <p>Opening preview…</p> : content.error ? <div className="jm-document-preview-unavailable"><FileText size={46} /><strong>Preview could not be loaded</strong><p>{content.error}</p><a href={selectedDocument.url} download><Download size={17} />Download file</a></div> : <pre>{content.text || 'This file is empty.'}</pre>}</div> : <div className="jm-document-preview-unavailable"><FileText size={46} /><strong>Preview is not available for this file</strong><p>Older .doc files need Microsoft Word or your phone’s document viewer.</p><a href={selectedDocument.url} target="_blank" rel="noreferrer"><ExternalLink size={17} />Open file</a></div>}</div>
    </div>
  </div>
}

export function PhotoGallery({ photos, users, canDelete = () => false, onDelete, onAdd, onUpload, storageEnabled }) {
  const [stage, setStage] = useState('Before'); const [preview, setPreview] = useState(null); const [adding, setAdding] = useState(false); const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [queue, setQueue] = useState([]); const [uploading, setUploading] = useState(false); const queueRef = useRef([])
  const filtered = photos.filter((photo) => photo.stage === stage)
  useEffect(() => { queueRef.current = queue }, [queue])
  useEffect(() => () => queueRef.current.forEach((item) => URL.revokeObjectURL(item.preview)), [])
  const addFiles = (fileList) => {
    const files = [...fileList]; const accepted = []; const rejected = []
    files.forEach((file) => { try { validateUploadFile(file, 'photos'); accepted.push(file) } catch (fileError) { rejected.push(friendlyUploadError(fileError)) } })
    setQueue((current) => { const known = new Set(current.map((item) => `${item.file.name}-${item.file.size}-${item.file.lastModified}`)); return [...current, ...accepted.filter((file) => !known.has(`${file.name}-${file.size}-${file.lastModified}`)).map((file) => ({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file), status: 'ready', error: '' }))] })
    setError(rejected.length ? `${rejected.length} file${rejected.length === 1 ? '' : 's'} skipped. ${rejected[0]}` : ''); setNotice('')
  }
  const removeQueued = (id) => setQueue((current) => current.filter((item) => { if (item.id === id) URL.revokeObjectURL(item.preview); return item.id !== id }))
  const submit = async (event) => {
    event.preventDefault(); setError(''); setNotice(''); const formData = new FormData(event.currentTarget); const selectedStage = formData.get('stage'); const title = `${formData.get('title') || ''}`.trim(); const url = formData.get('url') || ''
    if (!storageEnabled) { try { if (!url) throw new Error('Add a photo or video URL.'); await onAdd({ stage: selectedStage, title: title || 'Project media', url }); event.currentTarget.reset(); setAdding(false); setStage(selectedStage) } catch (uploadError) { setError(uploadError.message) }; return }
    const pending = queue.filter((item) => item.status !== 'uploaded'); if (!pending.length) { setError('Choose one or more photos or videos.'); return }
    setUploading(true); let uploaded = 0; let failed = 0
    for (let index = 0; index < pending.length; index += 1) {
      const item = pending[index]; setQueue((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'uploading', error: '' } : entry))
      try { await onUpload({ stage: selectedStage, title: mediaTitle(item.file, title, index, pending.length) }, item.file); uploaded += 1; setQueue((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'uploaded' } : entry)) }
      catch (uploadError) { failed += 1; setQueue((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'error', error: friendlyUploadError(uploadError, 'Upload failed. Try this file again.') } : entry)) }
    }
    setUploading(false); setStage(selectedStage); setNotice(uploaded ? `${uploaded} gallery item${uploaded === 1 ? '' : 's'} uploaded successfully.` : ''); if (failed) setError(`${failed} file${failed === 1 ? '' : 's'} could not be uploaded. You can retry.`)
    setQueue((current) => current.filter((item) => { if (item.status === 'uploaded') URL.revokeObjectURL(item.preview); return item.status !== 'uploaded' }))
    if (!failed) setAdding(false)
  }
  const closeUploader = () => { if (uploading) return; queue.forEach((item) => URL.revokeObjectURL(item.preview)); setQueue([]); setAdding(false); setError('') }
  return <section className="jm-detail-card jm-photo-section"><div className="jm-card-heading"><div><h2>Photo & video gallery</h2><p>{photos.length} gallery item{photos.length === 1 ? '' : 's'}</p></div><button className="jm-button jm-button--small jm-button--secondary" onClick={() => adding ? closeUploader() : setAdding(true)}><ImagePlus size={15} />{adding ? 'Close' : 'Add photos or videos'}</button></div><div className="jm-photo-tabs">{['Before', 'Progress', 'Completed'].map((item) => <button key={item} className={stage === item ? 'active' : ''} onClick={() => setStage(item)}>{item}<span>{photos.filter((photo) => photo.stage === item).length}</span></button>)}</div>{notice && <p className="jm-upload-notice" role="status" aria-live="polite"><Check size={15} />{notice}</p>}{adding && <form className="jm-photo-form jm-photo-form--multiple" onSubmit={submit}><div className="jm-photo-upload-fields"><label><span>Gallery stage</span><select name="stage" defaultValue={stage}><option>Before</option><option>Progress</option><option>Completed</option></select></label><label><span>Optional title</span><input name="title" placeholder="e.g. Living room walls" /></label></div>{storageEnabled ? <><label className="jm-photo-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files) }}><UploadCloud size={27} /><strong>Choose photos or videos</strong><span>or drag and drop from your computer</span><small>{PROJECT_GALLERY_HELP}</small><input type="file" multiple accept={PROJECT_GALLERY_ACCEPT} onChange={(event) => { addFiles(event.target.files); event.target.value = '' }} /></label><label className="jm-camera-button"><Camera size={18} /><span>Use camera</span><input type="file" accept="image/*,video/*" capture="environment" onChange={(event) => { addFiles(event.target.files); event.target.value = '' }} /></label>{queue.length > 0 && <div className="jm-upload-queue">{queue.map((item) => <article key={item.id} className={`is-${item.status}`}>{uploadFileKind(item.file) === 'video' ? <video src={item.preview} muted playsInline preload="metadata" aria-label={`Video selected: ${item.file.name}`} /> : <img src={item.preview} alt="" />}<div><strong>{item.file.name}</strong><span>{formatFileSize(item.file.size)}{item.status === 'uploading' ? ' · Uploading…' : item.status === 'error' ? ` · ${item.error}` : ''}</span></div>{item.status === 'uploading' ? <LoaderCircle className="jm-spin" size={18} /> : item.status === 'uploaded' ? <Check size={18} /> : <button type="button" onClick={() => removeQueued(item.id)} aria-label={`Remove ${item.file.name}`}><X size={17} /></button>}</article>)}</div>}</> : <label><span>Photo or video URL</span><input name="url" type="url" placeholder="https://" required /></label>}<div className="jm-photo-upload-actions"><span>{queue.length ? `${queue.length} item${queue.length === 1 ? '' : 's'} selected` : 'Select photos or videos to begin'}</span><button className="jm-button jm-button--primary" type="submit" disabled={uploading}>{uploading ? <><LoaderCircle className="jm-spin" size={16} />Uploading…</> : `Upload ${queue.length || ''} item${queue.length === 1 ? '' : 's'}`}</button></div>{error && <p className="jm-form-error" role="alert" aria-live="assertive">{error}</p>}</form>}<div className="jm-photo-grid">{filtered.map((photo) => { const video = isVideoItem(photo); return <article key={photo.id}><button className="jm-photo-open" onClick={() => setPreview(photo)}>{video ? <video src={photo.url} muted playsInline preload="metadata" aria-label={photo.title} /> : <img src={photo.url} alt={photo.title} />}<span>{video ? <Video size={16} /> : <Maximize2 size={16} />}</span></button><div><strong>{photo.title}</strong><small>{formatDate(photo.createdAt)} · {users.find((user) => user.id === photo.uploadedBy)?.name}</small></div>{canDelete(photo) && <button className="jm-photo-delete" onClick={() => onDelete(photo.id)} aria-label={`Delete ${video ? 'video' : 'photo'}`}><Trash2 size={15} /></button>}</article> })}{filtered.length === 0 && <p className="jm-empty-copy">No {stage.toLowerCase()} photos or videos yet.</p>}</div>{preview && <div className="jm-photo-preview" role="dialog" aria-modal="true" aria-label={preview.title} onClick={() => setPreview(null)}><button aria-label="Close preview"><X size={24} /></button><div className="jm-photo-preview-media" onClick={(event) => event.stopPropagation()}>{isVideoItem(preview) ? <video src={preview.url} controls playsInline preload="metadata">Your browser cannot play this video.</video> : <img src={preview.url} alt={preview.title} />}</div><div><strong>{preview.title}</strong><span>{preview.stage} · {formatDate(preview.createdAt)}</span></div></div>}</section>
}

function isVideoItem(item) { return uploadFileKind(item.storagePath || `${item.url || ''}`.split('?')[0] || item.title) === 'video' }
function mediaTitle(file, batchTitle, index, total) { if (batchTitle) return total > 1 ? `${batchTitle} ${index + 1}` : batchTitle; return file.name.replace(/\.[^.]+$/, '').replaceAll(/[-_]+/g, ' ').trim() || 'Project media' }
function formatFileSize(bytes) { return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB` }
