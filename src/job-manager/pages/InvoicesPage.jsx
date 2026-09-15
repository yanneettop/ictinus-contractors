import { Download, ExternalLink, FileText, ReceiptText, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/UI'
import { useJobManager } from '../context/JobManagerContext'
import { formatDate } from '../utils/format'
import { invoiceRows } from '../utils/invoices'

export default function InvoicesPage() {
  const { data, users } = useJobManager()
  const [search, setSearch] = useState('')
  const [projectId, setProjectId] = useState('All')

  const invoices = useMemo(() => invoiceRows(data), [data])
  const rows = useMemo(() => invoices.filter(({ document, project, client }) => {
    const needle = search.trim().toLowerCase()
    const haystack = `${document.name} ${project.title} ${project.projectType || ''} ${project.address || ''} ${project.postcode} ${client?.name || ''}`.toLowerCase()
    return (projectId === 'All' || project.id === projectId) && (!needle || haystack.includes(needle))
  }), [invoices, search, projectId])

  return <>
    <PageHeader eyebrow="Private workspace" title="Invoices" description={`${rows.length} of ${invoices.length} invoices shown · newest first`} />

    <section className="jm-file-filters jm-invoice-filters" aria-label="Invoice filters">
      <label className="jm-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search invoice, client, project or postcode" aria-label="Search invoices" /></label>
      <label><span>Project</span><select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="All">All projects</option>{data.projects.map((project) => { const client = data.clients.find((item) => item.id === project.clientId); return <option key={project.id} value={project.id}>{client?.name || project.title} · {project.postcode}</option> })}</select></label>
    </section>

    {rows.length ? <div className="jm-invoice-table-wrap">
      <table className="jm-invoice-table">
        <thead><tr><th>Invoice</th><th>Project</th><th>Client</th><th>Postcode</th><th>Uploaded</th><th><span className="jm-sr-only">Actions</span></th></tr></thead>
        <tbody>{rows.map(({ document, project, client }) => {
          const uploader = users.find((item) => item.id === document.uploadedBy)
          return <tr key={document.id}>
            <td><div className="jm-invoice-name"><span><FileText size={18} /></span><div><strong>{document.name}</strong><small>Invoice</small></div></div></td>
            <td><Link to={`/job-manager/projects/${project.id}`}><strong>{project.title}</strong><small>{project.projectType || 'Project'}</small></Link></td>
            <td>{client?.name || '—'}</td>
            <td>{project.postcode || '—'}</td>
            <td><strong>{formatDate(document.createdAt)}</strong><small>{uploader?.name || 'Ictinus'}</small></td>
            <td><div className="jm-file-actions"><a href={document.url} target="_blank" rel="noreferrer" aria-label={`Open ${document.name}`}><ExternalLink size={16} /></a><a href={document.url} download aria-label={`Download ${document.name}`}><Download size={16} /></a></div></td>
          </tr>
        })}</tbody>
      </table>
    </div> : <EmptyState title="No invoices found" text={invoices.length ? 'Try clearing the search or project filter.' : 'Invoices uploaded inside a project will appear here automatically.'} action={invoices.length ? <button className="jm-button jm-button--secondary" type="button" onClick={() => { setSearch(''); setProjectId('All') }}>Clear filters</button> : <Link className="jm-button jm-button--primary" to="/job-manager/projects"><ReceiptText size={17} />Open projects</Link>} />}
  </>
}
