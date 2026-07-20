import { CalendarCheck, CheckSquare2, ChevronLeft, ChevronRight, CircleDollarSign, ClipboardCheck, KeyRound, MapPin, PackageCheck, RefreshCw, Search } from 'lucide-react'
import { addMonths, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfDay, startOfMonth, startOfWeek, subMonths, subWeeks } from 'date-fns'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'
import { formatDate } from '../utils/format'
import { PageHeader } from '../components/UI'

const iconMap = { Work: CalendarCheck, 'Site visit': Search, 'Key collection': KeyRound, Payment: CircleDollarSign, Materials: PackageCheck, Inspection: ClipboardCheck, Handover: ClipboardCheck, Task: CheckSquare2 }
const toDate = (value) => parseISO(value)

export default function CalendarPage() {
  const { data, authMode, realtimeStatus, lastSyncedAt, refreshData } = useJobManager()
  const today = startOfDay(new Date())
  const todayKey = format(today, 'yyyy-MM-dd')
  const [view, setView] = useState('month')
  const [cursor, setCursor] = useState(today)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshError, setRefreshError] = useState('')

  const events = useMemo(() => {
    const paymentEvents = data.payments.flatMap((payment) => {
      if (payment.status === 'Paid' || !payment.dueDate) return []
      const project = data.projects.find((item) => item.id === payment.projectId)
      if (!project) {
        const lead = data.leads.find((item) => item.id === task.leadId)
        return lead ? [{ id: `task-${task.id}`, leadId: lead.id, type: 'Task', title: task.title, startDate: task.dueDate, endDate: task.dueDate, allDay: true, location: lead.fullAddress, notes: `${lead.clientName} · ${lead.projectType}`, colourCategory: task.priority === 'Urgent' ? 'red' : 'blue', source: 'task' }] : []
      }
      const client = data.clients.find((item) => item.id === project.clientId)
      return [{ id: `payment-${payment.id}`, projectId: project.id, type: 'Payment', title: `${client?.name?.split(' ')[0] || project.title} – ${project.postcode}`, startDate: payment.dueDate, endDate: payment.dueDate, allDay: true, location: project.address, notes: payment.title, colourCategory: 'red', source: 'payment' }]
    })
    const taskEvents = data.tasks.flatMap((task) => {
      if (task.completed || !task.dueDate) return []
      const project = data.projects.find((item) => item.id === task.projectId)
      if (!project) return []
      return [{ id: `task-${task.id}`, projectId: project.id, type: 'Task', title: task.title, startDate: task.dueDate, endDate: task.dueDate, allDay: true, location: project.address, notes: project.title, colourCategory: task.priority === 'High' ? 'red' : 'blue', source: 'task' }]
    })
    return [...data.events.map((event) => ({ ...event, source: 'event' })), ...taskEvents, ...paymentEvents].filter((event) => event.startDate)
  }, [data])

  const interval = view === 'month'
    ? { start: startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 }) }
    : { start: startOfWeek(cursor, { weekStartsOn: 1 }), end: endOfWeek(cursor, { weekStartsOn: 1 }) }
  const days = eachDayOfInterval(interval)
  const eventForDay = (event, day) => {
    const start = toDate(event.startDate)
    const end = toDate(event.endDate || event.startDate)
    const dateKey = format(day, 'yyyy-MM-dd')
    return dateKey >= format(start, 'yyyy-MM-dd') && dateKey <= format(end, 'yyyy-MM-dd')
  }
  const move = (direction) => setCursor((date) => view === 'month' ? (direction > 0 ? addMonths(date, 1) : subMonths(date, 1)) : (direction > 0 ? addWeeks(date, 1) : subWeeks(date, 1)))
  const refresh = async () => {
    setRefreshing(true)
    setRefreshError('')
    try { await refreshData() }
    catch { setRefreshError('Calendar data could not be refreshed. Live updates will retry automatically.') }
    finally { setRefreshing(false) }
  }
  const upcoming = events.filter((event) => event.startDate.slice(0, 10) >= todayKey).sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(0, 8)
  const live = authMode === 'supabase' && realtimeStatus === 'live'

  return <>
    <PageHeader eyebrow="Europe / London" title="Calendar" description="Live project events, tasks and payment deadlines in one schedule." />
    <div className="jm-calendar-sync" role="status">
      <div><span className={`jm-live-dot ${live ? 'is-live' : ''}`} aria-hidden="true" /><strong>{live ? 'Live from Supabase' : realtimeStatus === 'offline' ? 'Connection interrupted' : authMode === 'local' ? 'Local calendar data' : 'Connecting live updates…'}</strong>{lastSyncedAt && <small>Updated {format(lastSyncedAt, 'HH:mm:ss')}</small>}</div>
      <button className="jm-button jm-button--secondary jm-button--small" type="button" onClick={refresh} disabled={refreshing}><RefreshCw size={15} aria-hidden="true" />{refreshing ? 'Refreshing…' : 'Refresh now'}</button>
    </div>
    {refreshError && <p className="jm-calendar-sync-error" role="alert">{refreshError}</p>}

    <div className="jm-calendar-toolbar"><div><button onClick={() => move(-1)} aria-label="Previous period"><ChevronLeft size={20} /></button><button onClick={() => setCursor(startOfDay(new Date()))}>Today</button><button onClick={() => move(1)} aria-label="Next period"><ChevronRight size={20} /></button><h2>{view === 'month' ? format(cursor, 'MMMM yyyy') : `${format(interval.start, 'd MMM')} – ${format(interval.end, 'd MMM yyyy')}`}</h2></div><div className="jm-segment"><button className={view === 'month' ? 'active' : ''} onClick={() => setView('month')}>Month</button><button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Week</button></div></div>
    <div className="jm-calendar-legend"><span><i className="green" />Work</span><span><i className="blue" />Visits, keys & tasks</span><span><i className="yellow" />Provisional</span><span><i className="red" />Payments & urgent</span><span><i className="orange" />Materials</span><span><i className="grey" />Completed</span></div>

    {view === 'month' ? <div className="jm-calendar-month"><div className="jm-weekdays">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => <span key={day}>{day}</span>)}</div><div className="jm-month-grid">{days.map((day) => { const dayEvents = events.filter((event) => eventForDay(event, day)); return <div key={day.toISOString()} className={`${!isSameMonth(day, cursor) ? 'outside' : ''} ${isSameDay(day, today) ? 'today' : ''}`}><span className="jm-day-number">{format(day, 'd')}</span><div className="jm-day-events">{dayEvents.slice(0, 3).map((event) => <CalendarEvent key={event.id} event={event} compact />)}{dayEvents.length > 3 && <small>+{dayEvents.length - 3} more</small>}</div></div> })}</div></div> : <div className="jm-calendar-week">{days.map((day) => { const dayEvents = events.filter((event) => eventForDay(event, day)); return <section key={day.toISOString()} className={isSameDay(day, today) ? 'today' : ''}><header><span>{format(day, 'EEE')}</span><strong>{format(day, 'd')}</strong></header><div>{dayEvents.length ? dayEvents.map((event) => <CalendarEvent key={event.id} event={event} />) : <p>No events</p>}</div></section> })}</div>}

    <section className="jm-calendar-agenda"><h2>Next scheduled items</h2>{upcoming.length ? upcoming.map((event) => { const Icon = iconMap[event.type] || CalendarCheck; return <Link key={event.id} to={event.leadId ? `/job-manager/leads/${event.leadId}` : `/job-manager/projects/${event.projectId}`}><span className={`jm-agenda-icon jm-agenda-icon--${event.colourCategory}`}><Icon size={18} /></span><div><strong>{event.title}</strong><span>{event.type}{event.notes ? ` · ${event.notes}` : ''}</span></div><div><strong>{formatDate(event.startDate, !event.allDay)}</strong><span><MapPin size={13} />{event.location || 'No location'}</span></div></Link> }) : <div className="jm-calendar-empty"><p>No upcoming items yet.</p><Link className="jm-button jm-button--secondary jm-button--small" to="/job-manager/projects">Open projects</Link></div>}</section>
  </>
}

function CalendarEvent({ event, compact = false }) {
  const Icon = iconMap[event.type] || CalendarCheck
  return <Link title={`${event.type}: ${event.title}`} to={event.leadId ? `/job-manager/leads/${event.leadId}` : `/job-manager/projects/${event.projectId}`} className={`jm-calendar-event jm-calendar-event--${event.colourCategory}`}>{!compact && <Icon size={15} />}<span>{event.title}</span>{!compact && <small>{event.type}</small>}</Link>
}
