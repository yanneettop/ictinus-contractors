import { Download, ExternalLink, File, FileCheck2, FileImage, Files, FolderOpen, Plus, Search, Upload } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/UI'
import { useJobManager } from '../context/JobManagerContext'
import { formatDate, projectClient } from '../utils/format'

const documentTypes = ['Quotation', 'Invoice', 'Payment schedule', 'Photos', 'Contract', 'Certificate', 'Google Drive folder', 'Other']

function documentIcon(type) {
  if (type === 'Photos') return FileImage
  if (type.includes('Drive')) return FolderOpen
  if (type === 'Certificate' || type === 'Contract') return FileCheck2
  return File
}

export default function FilesPage() {
  const { data, users, authMode, uploadDocument, addDocument } = useJobManager()
  const [search, setSearch] = useState('')
  const [type, setType] = useState('All')
  const [projectId, setProjectId] = useState('All')
  const [adding, setAdding] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const rows = useMemo(() => data.documents.map((document) => {
    const project = data.projects.find((item) => item.id === document.projectId)
    const client = project ? projectClient(data, project) : null
    return { document, project, client }
  }).filter(({ document, project, client }) => {
    const needle = search.trim().toLowerCase()
    const haystack = `${document.name} ${document.type} ${project?.title || ''} ${project?.postcode || ''} ${client?.name || ''}`.toLowerCase()
    return (!needle || haystack.includes(needle)) && (type === 'All' || document.type === type) && (projectId === 'All' || document.projectId === projectId)
  }).sort((a, b) => (b.document.createdAt || '').localeCompare(a.document.createdAt || '')), [data, search, type, projectId])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setUploading(true)
    const form = event.currentTarget
    const formData = new FormData(form)
    const selectedProject = formData.get('projectId')
    const file = formData.get('file')
    const values = { name: String(formData.get('name')).trim(), type: formData.get('type'), url: String(formData.get('url') || '').trim() }
    try {
      if (file?.size) await uploadDocument(selectedProject, values, file)
      else if (values.url) await addDocument(selectedProject, values)
      else throw new Error(authMode === 'supabase' ? 'Choose a PDF/image or add an external URL.' : 'Add an external file URL.')
      form.reset()
      setAdding(false)
      setNotice('File added to the account and linked to its project.')
    } catch (uploadError) { setError(uploadError.message) }
    finally { setUploading(false) }
  }

  const clearFilters = () => { setSearch(''); setType('All'); setProjectId('All') }

  return <>
    <PageHeader eyebrow="Private workspace" title="Files" description={`${rows.length} of ${data.documents.length} documents shown`} action={<button className="jm-button jm-button--primary" type="button" onClick={() => { setAdding((value) => !value); setError(''); setNotice('') }}><Plus size={18} />Add file</button>} />

    {adding && <form className="jm-file-upload" onSubmit={submit}>
      <div className="jm-file-upload-heading"><div><Upload size={20} /><div><h2>Add a document</h2><p>Store it privately and link it to the correct project.</p></div></div><span>PDF, JPG, PNG or WebP · 25 MB max</span></div>
      <div className="jm-file-upload-grid">
        <label>Project<select name="projectId" required defaultValue=""><option value="" disabled>Select project</option>{data.projects.map((project) => <option key={project.id} value={project.id}>{projectClient(data, project)?.name} · {project.postcode}</option>)}</select></label>
        <label>Document type<select name="type" defaultValue="Quotation">{documentTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Display name<input name="name" placeholder="e.g. Final quotation" required /></label>
        {authMode === 'supabase' && <label>Upload file<input name="file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" /></label>}
        <label className="jm-file-url">External URL <span>optional</span><input name="url" type="url" placeholder="https://drive.google.com/…" /></label>
      </div>
      {error && <p className="jm-file-message jm-file-message--error" role="alert">{error}</p>}
      <div className="jm-file-upload-actions"><button className="jm-button jm-button--secondary" type="button" onClick={() => setAdding(false)}>Cancel</button><button className="jm-button jm-button--primary" type="submit" disabled={uploading}>{uploading ? 'Uploading…' : 'Save file'}</button></div>
    </form>}
    {notice && <p className="jm-file-message jm-file-message--success" role="status">{notice}</p>}

    <section className="jm-file-filters" aria-label="File filters">
      <label className="jm-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search file, client, project or postcode" aria-label="Search files" /></label>
      <label><span>Type</span><select value={type} onChange={(event) => setType(event.target.value)}><option>All</option>{documentTypes.map((item) => <option key={item}>{item}</option>)}</select></label>
      <label><span>Project</span><select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="All">All projects</option>{data.projects.map((project) => <option key={project.id} value={project.id}>{projectClient(data, project)?.name} · {project.postcode}</option>)}</select></label>
    </section>

    {rows.length ? <div className="jm-files-list">{rows.map(({ document, project, client }) => {
      const Icon = documentIcon(document.type)
      const uploader = users.find((item) => item.id === document.uploadedBy)
      return <article key={document.id}>
        <span className="jm-file-icon"><Icon size={20} /></span>
        <div className="jm-file-name"><strong>{document.name}</strong><span>{document.type} · {formatDate(document.createdAt)} · {uploader?.name || 'Ictinus'}</span></div>
        <div className="jm-file-project">{project ? <Link to={`/job-manager/projects/${project.id}`}><strong>{client?.name || project.title}</strong><span>{project.postcode} · {project.title}</span></Link> : <span>Project unavailable</span>}</div>
        <div className="jm-file-actions"><a href={document.url} target="_blank" rel="noreferrer" aria-label={`Open ${document.name}`}><ExternalLink size={16} /></a><a href={document.url} download aria-label={`Download ${document.name}`}><Download size={16} /></a></div>
      </article>
    })}</div> : <EmptyState title="No files match" text={data.documents.length ? 'Try clearing one or more filters.' : 'Upload the first quotation, invoice or project document.'} action={data.documents.length ? <button className="jm-button jm-button--secondary" type="button" onClick={clearFilters}>Clear filters</button> : <button className="jm-button jm-button--primary" type="button" onClick={() => setAdding(true)}><Files size={17} />Add first file</button>} />}
  </>
}
