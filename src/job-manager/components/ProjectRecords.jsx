import { Camera, Check, Download, Eye, File, FileCheck2, FileImage, FolderOpen, ImagePlus, LoaderCircle, Maximize2, Trash2, UploadCloud, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { formatDate } from '../utils/format'

const documentGroups = ['Quotation', 'Invoice', 'Payment schedule', 'Photos', 'Contract', 'Certificate', 'Google Drive folder', 'Other']
const documentIcon = (type) => type === 'Photos' ? FileImage : type.includes('Drive') ? FolderOpen : type === 'Certificate' ? FileCheck2 : File

export function DocumentsSection({ documents, users, canDelete = () => false, onDelete }) {
  const [preview, setPreview] = useState(null)
  const groups = useMemo(() => documentGroups.map((type) => ({ type, items: documents.filter((document) => document.type.toLowerCase() === type.toLowerCase()) })).filter((group) => group.items.length), [documents])
  useEffect(() => {
    if (!preview) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => { if (event.key === 'Escape') setPreview(null) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', closeOnEscape) }
  }, [preview])
  return <section className="jm-detail-card"><div className="jm-card-heading"><div><h2>Documents</h2><p>{documents.length} linked file{documents.length === 1 ? '' : 's'}</p></div><span>Grouped by type</span></div>{groups.length ? <div className="jm-document-groups">{groups.map((group) => <div key={group.type}><h3>{group.type}</h3>{group.items.map((document) => { const Icon = documentIcon(document.type); const uploader = users.find((user) => user.id === document.uploadedBy); return <article key={document.id}><span className="jm-document-icon"><Icon size={18} /></span><div><strong>{document.name}</strong><small>{formatDate(document.createdAt)} · {uploader?.name || 'Ictinus'}</small></div><button type="button" onClick={() => setPreview(document)} aria-label={`Preview ${document.name}`} disabled={!document.url}><Eye size={15} /></button><a href={document.url} download aria-label={`Download ${document.name}`}><Download size={15} /></a>{canDelete(document) && <button onClick={() => onDelete(document.id)} aria-label={`Delete ${document.name}`}><Trash2 size={15} /></button>}</article> })}</div>)}</div> : <p className="jm-empty-copy">No documents linked yet.</p>}{preview && <DocumentPreview document={preview} onClose={() => setPreview(null)} />}</section>
}

function DocumentPreview({ document: selectedDocument, onClose }) {
  const source = selectedDocument.storagePath || selectedDocument.url
  const imageFile = /\.(jpe?g|png|webp)(?:\?|$)/i.test(source)
  return <div className="jm-document-preview" role="dialog" aria-modal="true" aria-labelledby="jm-document-preview-title" onMouseDown={onClose}>
    <div className="jm-document-preview-shell" onMouseDown={(event) => event.stopPropagation()}>
      <header><div><span>{selectedDocument.type}</span><strong id="jm-document-preview-title">{selectedDocument.name}</strong></div><div><a href={selectedDocument.url} download aria-label={`Download ${selectedDocument.name}`}><Download size={18} /><span>Download</span></a><button type="button" onClick={onClose} aria-label="Close document preview" autoFocus><X size={21} /></button></div></header>
      <div className="jm-document-preview-content">{imageFile ? <img src={selectedDocument.url} alt={selectedDocument.name} /> : <iframe src={selectedDocument.url} title={selectedDocument.name} />}</div>
    </div>
  </div>
}

export function PhotoGallery({ photos, users, canDelete = () => false, onDelete, onAdd, onUpload, storageEnabled }) {
  const [stage, setStage] = useState('Before'); const [preview, setPreview] = useState(null); const [adding, setAdding] = useState(false); const [error, setError] = useState(''); const [notice, setNotice] = useState(''); const [queue, setQueue] = useState([]); const [uploading, setUploading] = useState(false); const queueRef = useRef([])
  const filtered = photos.filter((photo) => photo.stage === stage)
  useEffect(() => { queueRef.current = queue }, [queue])
  useEffect(() => () => queueRef.current.forEach((item) => URL.revokeObjectURL(item.preview)), [])
  const addFiles = (fileList) => {
    const files = [...fileList]; const accepted = files.filter(isSupportedPhoto); const rejected = files.length - accepted.length
    setQueue((current) => { const known = new Set(current.map((item) => `${item.file.name}-${item.file.size}-${item.file.lastModified}`)); return [...current, ...accepted.filter((file) => !known.has(`${file.name}-${file.size}-${file.lastModified}`)).map((file) => ({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file), status: 'ready', error: '' }))] })
    setError(rejected ? `${rejected} file${rejected === 1 ? '' : 's'} skipped. Use JPG, PNG, WebP, HEIC or HEIF.` : ''); setNotice('')
  }
  const removeQueued = (id) => setQueue((current) => current.filter((item) => { if (item.id === id) URL.revokeObjectURL(item.preview); return item.id !== id }))
  const submit = async (event) => {
    event.preventDefault(); setError(''); setNotice(''); const formData = new FormData(event.currentTarget); const selectedStage = formData.get('stage'); const title = `${formData.get('title') || ''}`.trim(); const url = formData.get('url') || ''
    if (!storageEnabled) { try { if (!url) throw new Error('Add an image URL.'); await onAdd({ stage: selectedStage, title: title || 'Project photo', url }); event.currentTarget.reset(); setAdding(false); setStage(selectedStage) } catch (uploadError) { setError(uploadError.message) }; return }
    const pending = queue.filter((item) => item.status !== 'uploaded'); if (!pending.length) { setError('Choose one or more project photos.'); return }
    setUploading(true); let uploaded = 0; let failed = 0
    for (let index = 0; index < pending.length; index += 1) {
      const item = pending[index]; setQueue((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'uploading', error: '' } : entry))
      try { await onUpload({ stage: selectedStage, title: photoTitle(item.file, title, index, pending.length) }, item.file); uploaded += 1; setQueue((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'uploaded' } : entry)) }
      catch (uploadError) { failed += 1; setQueue((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'error', error: uploadError.message } : entry)) }
    }
    setUploading(false); setStage(selectedStage); setNotice(uploaded ? `${uploaded} photo${uploaded === 1 ? '' : 's'} uploaded successfully.` : ''); if (failed) setError(`${failed} photo${failed === 1 ? '' : 's'} could not be uploaded. You can retry.`)
    setQueue((current) => current.filter((item) => { if (item.status === 'uploaded') URL.revokeObjectURL(item.preview); return item.status !== 'uploaded' }))
    if (!failed) setAdding(false)
  }
  const closeUploader = () => { if (uploading) return; queue.forEach((item) => URL.revokeObjectURL(item.preview)); setQueue([]); setAdding(false); setError('') }
  return <section className="jm-detail-card jm-photo-section"><div className="jm-card-heading"><div><h2>Photo gallery</h2><p>{photos.length} project photo{photos.length === 1 ? '' : 's'}</p></div><button className="jm-button jm-button--small jm-button--secondary" onClick={() => adding ? closeUploader() : setAdding(true)}><ImagePlus size={15} />{adding ? 'Close' : 'Add photos'}</button></div><div className="jm-photo-tabs">{['Before', 'Progress', 'Completed'].map((item) => <button key={item} className={stage === item ? 'active' : ''} onClick={() => setStage(item)}>{item}<span>{photos.filter((photo) => photo.stage === item).length}</span></button>)}</div>{notice && <p className="jm-upload-notice"><Check size={15} />{notice}</p>}{adding && <form className="jm-photo-form jm-photo-form--multiple" onSubmit={submit}><div className="jm-photo-upload-fields"><label><span>Photo stage</span><select name="stage" defaultValue={stage}><option>Before</option><option>Progress</option><option>Completed</option></select></label><label><span>Optional title</span><input name="title" placeholder="e.g. Living room walls" /></label></div>{storageEnabled ? <><label className="jm-photo-dropzone" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files) }}><UploadCloud size={27} /><strong>Choose several photos at once</strong><span>or drag and drop from your computer</span><small>JPG, PNG, WebP, HEIC or HEIF · up to 25 MB each</small><input type="file" multiple accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif" onChange={(event) => { addFiles(event.target.files); event.target.value = '' }} /></label><label className="jm-camera-button"><Camera size={18} /><span>Take a photo</span><input type="file" accept="image/*" capture="environment" onChange={(event) => { addFiles(event.target.files); event.target.value = '' }} /></label>{queue.length > 0 && <div className="jm-upload-queue">{queue.map((item) => <article key={item.id} className={`is-${item.status}`}><img src={item.preview} alt="" /><div><strong>{item.file.name}</strong><span>{formatFileSize(item.file.size)}{item.status === 'uploading' ? ' · Uploading…' : item.status === 'error' ? ` · ${item.error}` : ''}</span></div>{item.status === 'uploading' ? <LoaderCircle className="jm-spin" size={18} /> : item.status === 'uploaded' ? <Check size={18} /> : <button type="button" onClick={() => removeQueued(item.id)} aria-label={`Remove ${item.file.name}`}><X size={17} /></button>}</article>)}</div>}</> : <label><span>Image URL</span><input name="url" type="url" placeholder="https://" required /></label>}<div className="jm-photo-upload-actions"><span>{queue.length ? `${queue.length} photo${queue.length === 1 ? '' : 's'} selected` : 'Select photos to begin'}</span><button className="jm-button jm-button--primary" type="submit" disabled={uploading}>{uploading ? <><LoaderCircle className="jm-spin" size={16} />Uploading…</> : `Upload ${queue.length || ''} photo${queue.length === 1 ? '' : 's'}`}</button></div>{error && <p className="jm-form-error">{error}</p>}</form>}<div className="jm-photo-grid">{filtered.map((photo) => <article key={photo.id}><button className="jm-photo-open" onClick={() => setPreview(photo)}><img src={photo.url} alt={photo.title} /><span><Maximize2 size={16} /></span></button><div><strong>{photo.title}</strong><small>{formatDate(photo.createdAt)} · {users.find((user) => user.id === photo.uploadedBy)?.name}</small></div>{canDelete(photo) && <button className="jm-photo-delete" onClick={() => onDelete(photo.id)} aria-label="Delete photo"><Trash2 size={15} /></button>}</article>)}{filtered.length === 0 && <p className="jm-empty-copy">No {stage.toLowerCase()} photos yet.</p>}</div>{preview && <div className="jm-photo-preview" role="dialog" aria-modal="true" aria-label={preview.title} onClick={() => setPreview(null)}><button aria-label="Close preview"><X size={24} /></button><img src={preview.url} alt={preview.title} /><div><strong>{preview.title}</strong><span>{preview.stage} · {formatDate(preview.createdAt)}</span></div></div>}</section>
}

const supportedPhotoExtensions = /\.(jpe?g|png|webp|heic|heif)$/i
function isSupportedPhoto(file) { return ['image/jpeg','image/png','image/webp','image/heic','image/heif'].includes(file.type) || (!file.type && supportedPhotoExtensions.test(file.name)) }
function photoTitle(file, batchTitle, index, total) { if (batchTitle) return total > 1 ? `${batchTitle} ${index + 1}` : batchTitle; return file.name.replace(/\.[^.]+$/, '').replaceAll(/[-_]+/g, ' ').trim() || 'Project photo' }
function formatFileSize(bytes) { return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB` }
