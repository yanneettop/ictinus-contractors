import { Grid2X2, List, Search, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'
import { formatDate, formatGBP, projectClient, projectUser } from '../utils/format'
import ProjectCard from '../components/ProjectCard'
import { AddProjectButton, EmptyState, PageHeader, StatusBadge, statuses } from '../components/UI'

function ProjectResults({ projects, view, data, users, showFinancials }) {
  if (view === 'cards') {
    return <div className="jm-project-grid jm-project-grid--all">{projects.map((project) => <ProjectCard key={project.id} project={project} data={data} users={users} showFinancials={showFinancials} />)}</div>
  }

  return <div className="jm-table-wrap"><table className="jm-table"><thead><tr><th>Client / project</th><th>Status</th><th>Location</th><th>Dates</th><th>Assigned</th>{showFinancials && <th>Value</th>}<th /></tr></thead><tbody>{projects.map((project) => <tr key={project.id}><td><strong>{projectClient(data, project)?.name}</strong><span>{project.title}</span></td><td><StatusBadge status={project.status} /></td><td>{project.postcode}</td><td>{formatDate(project.startDate)} – {formatDate(project.endDate)}</td><td>{projectUser(users, project)?.name}</td>{showFinancials && <td>{formatGBP(project.contractValue)}</td>}<td><Link to={`/job-manager/projects/${project.id}`}>Open</Link></td></tr>)}</tbody></table></div>
}

function ProjectSection({ title, description, projects, completed = false, ...resultsProps }) {
  if (projects.length === 0) return null

  return <section className={`jm-project-section${completed ? ' jm-project-section--completed' : ''}`}>
    <header className="jm-project-section-heading">
      <div><h2>{title}</h2><p>{description}</p></div>
      <span>{projects.length} {projects.length === 1 ? 'project' : 'projects'}</span>
    </header>
    <ProjectResults projects={projects} {...resultsProps} />
  </section>
}

export default function ProjectsPage() {
  const { data, users, can } = useJobManager()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [postcode, setPostcode] = useState('')
  const [from, setFrom] = useState('')
  const [view, setView] = useState('cards')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const showFinancials = can('view_financials')
  const filtered = useMemo(() => data.projects.filter((project) => {
    const client = projectClient(data, project)
    const needle = search.toLowerCase()
    return (!needle || `${client?.name} ${project.title} ${project.address} ${project.postcode}`.toLowerCase().includes(needle)) &&
      (status === 'All' || project.status === status) && (!postcode || project.postcode.toLowerCase().includes(postcode.toLowerCase())) && (!from || project.startDate >= from)
  }).sort((first, second) => (first.startDate || '9999-12-31').localeCompare(second.startDate || '9999-12-31') || first.title.localeCompare(second.title)), [data, search, status, postcode, from])
  const activeProjects = filtered.filter((project) => project.status !== 'Completed')
  const completedProjects = filtered.filter((project) => project.status === 'Completed')
  const resultsProps = { view, data, users, showFinancials }

  return <>
    <PageHeader eyebrow="Project pipeline" title="Projects" description={`${filtered.length} of ${data.projects.length} jobs shown`} action={can('create_projects') ? <AddProjectButton /> : null} />
    <section className="jm-filter-bar jm-filter-bar--simple" aria-label="Project filters">
      <div className="jm-filter-primary">
        <label className="jm-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by client, address or project" aria-label="Search projects" /></label>
        <label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}><option>All</option>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label>
        <button type="button" className={`jm-more-filters-button${filtersOpen ? ' active' : ''}`} aria-expanded={filtersOpen} onClick={() => setFiltersOpen((open) => !open)}><SlidersHorizontal size={17} />More filters{(postcode || from) && <span>{Number(Boolean(postcode)) + Number(Boolean(from))}</span>}</button>
        <div className="jm-view-toggle"><button type="button" className={view === 'cards' ? 'active' : ''} onClick={() => setView('cards')} aria-label="Card view"><Grid2X2 size={18} /></button><button type="button" className={view === 'table' ? 'active' : ''} onClick={() => setView('table')} aria-label="Compact table view"><List size={19} /></button></div>
      </div>
      {filtersOpen && <div className="jm-filter-advanced"><label><span>Postcode</span><input value={postcode} onChange={(event) => setPostcode(event.target.value)} placeholder="e.g. E15" /></label><label><span>Starting after</span><input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label>{(postcode || from) && <button type="button" className="jm-button jm-button--secondary" onClick={() => { setPostcode(''); setFrom('') }}>Clear extra filters</button>}</div>}
    </section>
    {filtered.length === 0 ? <EmptyState title="No projects match" text="Try clearing one or more filters." action={<button className="jm-button jm-button--secondary" onClick={() => { setSearch(''); setStatus('All'); setPostcode(''); setFrom('') }}>Clear filters</button>} /> : <>
      <ProjectSection title="Active projects" description="Current and upcoming work" projects={activeProjects} {...resultsProps} />
      <ProjectSection title="Completed projects" description="Finished jobs" projects={completedProjects} completed {...resultsProps} />
    </>}
  </>
}
