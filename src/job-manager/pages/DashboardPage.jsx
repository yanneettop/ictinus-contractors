import { AlertTriangle, BriefcaseBusiness, CalendarClock, MapPin, WalletCards } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'
import { formatDate, formatGBP, paymentStatus, projectClient } from '../utils/format'
import ProjectCard from '../components/ProjectCard'
import { AddProjectButton, EmptyState, MetricCard, PageHeader, SectionHeading, StatusBadge } from '../components/UI'

const TODAY = '2026-07-18'
const activeStatuses = ['Confirmed', 'Scheduled', 'In Progress', 'On Hold']

export default function DashboardPage() {
  const { data, users, user } = useJobManager()
  const active = data.projects.filter((project) => activeStatuses.includes(project.status))
  const upcoming = active.filter((project) => project.startDate > TODAY)
  const outstanding = data.payments.filter((payment) => payment.status !== 'Paid')
  const attention = data.tasks.filter((task) => !task.completed && task.dueDate <= '2026-07-20')
  const todayEvents = data.events.filter((event) => event.startDate.slice(0, 10) <= TODAY && event.endDate.slice(0, 10) >= TODAY)
  const visits = data.events.filter((event) => ['Site visit', 'Key collection'].includes(event.type) && event.startDate.slice(0, 10) >= TODAY).sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(0, 4)
  const dueTotal = outstanding.reduce((sum, payment) => sum + payment.amount, 0)

  return <>
    <PageHeader eyebrow="Saturday · 18 July 2026" title={`Good morning, ${user.name}.`} description="Here’s what needs attention across Ictinus jobs today." action={canAdd(user) ? <AddProjectButton /> : null} />
    <section className="jm-metrics" aria-label="Operational summary">
      <MetricCard icon={BriefcaseBusiness} label="Active jobs" value={active.length} detail="Across London" tone="green" />
      <MetricCard icon={CalendarClock} label="Upcoming jobs" value={upcoming.length} detail="Next 60 days" tone="blue" />
      <MetricCard icon={WalletCards} label="Payments due" value={formatGBP(dueTotal)} detail={`${outstanding.length} payment stages`} tone="red" />
      <MetricCard icon={AlertTriangle} label="Needs attention" value={attention.length} detail="Due by Monday" tone="orange" />
    </section>

    <section className="jm-today-panel">
      <SectionHeading title="Today" />
      <div className="jm-today-grid">
        <div><span className="jm-today-label">On site</span>{todayEvents.length ? todayEvents.map((event) => { const project = data.projects.find((item) => item.id === event.projectId); return <Link key={event.id} to={`/job-manager/projects/${event.projectId}`} className="jm-today-item"><div className={`jm-event-dot jm-event-dot--${event.colourCategory}`} /><div><strong>{event.title}</strong><span>{event.type} · {project?.nextAction}</span></div></Link> }) : <p className="jm-muted">No site work scheduled today.</p>}</div>
        <div><span className="jm-today-label">Priority tasks</span>{attention.slice(0, 3).map((task) => { const project = data.projects.find((item) => item.id === task.projectId); return <Link key={task.id} to={`/job-manager/projects/${task.projectId}`} className="jm-today-item"><div className="jm-priority-mark">!</div><div><strong>{task.title}</strong><span>{projectClient(data, project)?.name} · due {formatDate(task.dueDate)}</span></div></Link> })}</div>
      </div>
    </section>

    <section className="jm-section"><SectionHeading title="Active projects" link="/job-manager/projects" />
      <div className="jm-project-grid">{active.slice(0, 3).map((project) => <ProjectCard key={project.id} project={project} data={data} users={users} />)}</div>
    </section>

    <div className="jm-dashboard-columns">
      <section className="jm-section jm-panel"><SectionHeading title="Upcoming site visits" link="/job-manager/calendar" linkLabel="Calendar" />
        <div className="jm-list">{visits.map((event) => <Link to={`/job-manager/projects/${event.projectId}`} key={event.id} className="jm-list-row"><div className="jm-date-tile"><strong>{formatDate(event.startDate, true).split(' ')[0]}</strong><span>{formatDate(event.startDate, true).split(' ')[1]}</span></div><div className="jm-list-main"><strong>{event.title}</strong><span>{event.type} · {formatDate(event.startDate, !event.allDay)}</span></div><MapPin size={17} /></Link>)}</div>
      </section>
      <section className="jm-section jm-panel"><SectionHeading title="Outstanding payments" link="/job-manager/payments" />
        <div className="jm-list">{outstanding.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4).map((payment) => { const project = data.projects.find((item) => item.id === payment.projectId); return <Link to={`/job-manager/projects/${project.id}`} key={payment.id} className="jm-payment-mini"><div><strong>{projectClient(data, project)?.name}</strong><span>{payment.title} · {formatDate(payment.dueDate)}</span></div><div><strong>{formatGBP(payment.amount)}</strong><span className={paymentStatus(payment, TODAY) === 'Overdue' ? 'jm-text-danger' : ''}>{paymentStatus(payment, TODAY)}</span></div></Link> })}</div>
      </section>
    </div>

    <div className="jm-dashboard-columns">
      <section className="jm-section jm-panel"><SectionHeading title="Upcoming jobs" link="/job-manager/projects" />{upcoming.length ? <div className="jm-compact-projects">{upcoming.slice(0, 4).map((project) => <Link key={project.id} to={`/job-manager/projects/${project.id}`}><div><strong>{projectClient(data, project)?.name}</strong><span>{project.title} · {project.postcode}</span></div><div><StatusBadge status={project.status} /><small>{formatDate(project.startDate)}</small></div></Link>)}</div> : <EmptyState title="No upcoming work" text="New confirmed jobs will appear here." />}</section>
      <section className="jm-section jm-panel"><SectionHeading title="Recent activity" />
        <div className="jm-activity-list">{data.activities.slice(0, 5).map((activity) => { const project = data.projects.find((item) => item.id === activity.projectId); const actor = users.find((item) => item.id === activity.userId); return <div key={activity.id}><span>{actor?.name?.[0]}</span><div><strong>{activity.action}</strong><p>{projectClient(data, project)?.name} · {formatDate(activity.createdAt, true)}</p></div></div> })}</div>
      </section>
    </div>
  </>
}

const canAdd = (user) => user.role === 'administrator'
