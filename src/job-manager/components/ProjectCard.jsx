import { ArrowRight, CalendarDays, MapPin, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDate, projectClient, projectUser } from '../utils/format'
import { ProgressBar, StatusBadge } from './UI'

export default function ProjectCard({ project, data, users, showFinancials = true }) {
  const navigate = useNavigate()
  const client = projectClient(data, project)
  const assignee = projectUser(users, project)
  const projectUrl = `/job-manager/projects/${project.id}`
  const openProject = () => navigate(projectUrl)
  return <article className="jm-project-card jm-project-card--clickable" role="link" tabIndex="0" aria-label={`Open ${client?.name || project.title} project`} onClick={openProject} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openProject() } }}>
    <div className="jm-project-card-top"><div><p className="jm-project-client">{client?.name}</p><h3>{project.title}</h3></div><StatusBadge status={project.status} /></div>
    <div className="jm-project-meta">
      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${project.address} ${project.postcode}`)}`} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}><MapPin size={15} />{project.postcode}</a>
      <span><CalendarDays size={15} />{formatDate(project.startDate)} – {formatDate(project.endDate)}</span>
      <span><UserRound size={15} />{assignee?.name}</span>
    </div>
    {showFinancials && <ProgressBar paid={project.amountPaid} total={project.contractValue} />}
    <div className="jm-next-action"><span>Next action</span><strong>{project.nextAction}</strong></div>
    <Link className="jm-card-link" to={projectUrl} onClick={(event) => event.stopPropagation()}>Open project <ArrowRight size={16} /></Link>
  </article>
}
