import { ArrowRight, CalendarDays, MapPin, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, projectClient, projectUser } from '../utils/format'
import { ProgressBar, StatusBadge } from './UI'

export default function ProjectCard({ project, data, users }) {
  const client = projectClient(data, project)
  const assignee = projectUser(users, project)
  return <article className="jm-project-card">
    <div className="jm-project-card-top"><div><p className="jm-project-client">{client?.name}</p><h3>{project.title}</h3></div><StatusBadge status={project.status} /></div>
    <div className="jm-project-meta">
      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${project.address} ${project.postcode}`)}`} target="_blank" rel="noreferrer"><MapPin size={15} />{project.postcode}</a>
      <span><CalendarDays size={15} />{formatDate(project.startDate)} – {formatDate(project.endDate)}</span>
      <span><UserRound size={15} />{assignee?.name}</span>
    </div>
    <ProgressBar paid={project.amountPaid} total={project.contractValue} />
    <div className="jm-next-action"><span>Next action</span><strong>{project.nextAction}</strong></div>
    <Link className="jm-card-link" to={`/job-manager/projects/${project.id}`}>Open project <ArrowRight size={16} /></Link>
  </article>
}
