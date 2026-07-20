import { Download, Eye, File, FileCheck2, FileImage, FolderOpen, ImagePlus, Maximize2, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
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
  const [stage, setStage] = useState('Before'); const [preview, setPreview] = useState(null); const [adding, setAdding] = useState(false); const [error, setError] = useState('')
  const filtered = photos.filter((photo) => photo.stage === stage)
  const submit = async (event) => { event.preventDefault(); setError(''); const form = event.currentTarget; const formData = new FormData(form); const file = formData.get('file'); const values = { stage: formData.get('stage'), title: formData.get('title'), url: formData.get('url') || '' }; try { if (storageEnabled) { if (!file?.size) throw new Error('Choose a project photo.'); await onUpload(values, file) } else { if (!values.url) throw new Error('Add an image URL.'); await onAdd(values) } form.reset(); setAdding(false); setStage(values.stage) } catch (uploadError) { setError(uploadError.message) } }
  return <section className="jm-detail-card jm-photo-section"><div className="jm-card-heading"><div><h2>Photo gallery</h2><p>{photos.length} project photo{photos.length === 1 ? '' : 's'}</p></div><button className="jm-button jm-button--small jm-button--secondary" onClick={() => setAdding((value) => !value)}><ImagePlus size={15} />Add photo</button></div><div className="jm-photo-tabs">{['Before', 'Progress', 'Completed'].map((item) => <button key={item} className={stage === item ? 'active' : ''} onClick={() => setStage(item)}>{item}<span>{photos.filter((photo) => photo.stage === item).length}</span></button>)}</div>{adding && <form className="jm-photo-form" onSubmit={submit}><select name="stage" defaultValue={stage}><option>Before</option><option>Progress</option><option>Completed</option></select><input name="title" placeholder="Photo title" required />{storageEnabled ? <input name="file" type="file" accept="image/jpeg,image/png,image/webp" required /> : <input name="url" type="url" placeholder="Image URL for local mode" required />}<button className="jm-button jm-button--primary" type="submit">Upload</button>{error && <p className="jm-form-error">{error}</p>}</form>}<div className="jm-photo-grid">{filtered.map((photo) => <article key={photo.id}><button className="jm-photo-open" onClick={() => setPreview(photo)}><img src={photo.url} alt={photo.title} /><span><Maximize2 size={16} /></span></button><div><strong>{photo.title}</strong><small>{formatDate(photo.createdAt)} · {users.find((user) => user.id === photo.uploadedBy)?.name}</small></div>{canDelete(photo) && <button className="jm-photo-delete" onClick={() => onDelete(photo.id)} aria-label="Delete photo"><Trash2 size={15} /></button>}</article>)}{filtered.length === 0 && <p className="jm-empty-copy">No {stage.toLowerCase()} photos yet.</p>}</div>{preview && <div className="jm-photo-preview" role="dialog" aria-modal="true" aria-label={preview.title} onClick={() => setPreview(null)}><button aria-label="Close preview"><X size={24} /></button><img src={preview.url} alt={preview.title} /><div><strong>{preview.title}</strong><span>{preview.stage} · {formatDate(preview.createdAt)}</span></div></div>}</section>
}
