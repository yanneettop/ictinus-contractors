import { AlertCircle, Banknote, BriefcaseBusiness, CalendarClock, Camera, CheckCircle2, ChevronRight, CloudSun, ListTodo, MapPin, MessageSquareText, Plus, Receipt, Siren, Sparkles, UserRoundPlus, UsersRound, WalletCards, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'
import { formatDate, formatGBP } from '../utils/format'
import { buildTodayDashboard, dashboardQuickActions } from '../utils/todayDashboard'

const summaryCards = [
  { key: 'activeProjects', label: 'Projects Active', icon: BriefcaseBusiness, tone: 'green', href: '/job-manager/projects' },
  { key: 'tasksDueToday', label: 'Tasks Due Today', icon: ListTodo, tone: 'blue', href: '#action-centre' },
  { key: 'overdueTasks', label: 'Overdue Tasks', icon: Siren, tone: 'red', href: '#action-centre' },
  { key: 'outstandingPayments', label: 'Payments Outstanding', icon: WalletCards, tone: 'orange', href: '/job-manager/payments', adminOnly: true, money: true },
  { key: 'siteVisitsToday', label: 'Site Visits Today', icon: CalendarClock, tone: 'purple', href: '/job-manager/calendar' },
  { key: 'leadsRequiringFollowUp', label: 'Lead Follow-ups', icon: UsersRound, tone: 'gold', href: '/job-manager/leads', adminOnly: true },
]

const actionIcons = { Task: ListTodo, Expense: Receipt, 'Site Note': MessageSquareText, Note: MessageSquareText, 'Upload Photo': Camera, Photo: Camera, Payment: Banknote, Lead: UserRoundPlus }

export default function DashboardPage() {
  const { data, users, user, addTask, addPayment, addJournalEntry, uploadPhoto, saveLead } = useJobManager()
  const [quickAction, setQuickAction] = useState(''); const [fabOpen, setFabOpen] = useState(false)
  const dashboard = useMemo(() => buildTodayDashboard(data), [data])
  const visible = (item) => !item.adminOnly || user.role === 'administrator'
  const urgentItems = dashboard.actionItems.filter(visible)
  const attention = dashboard.attention.filter(visible)
  const upcoming = dashboard.upcoming.filter(visible)
  const hour = new Date().getHours(); const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const dateLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())
  const desktopActions = dashboardQuickActions(user.role)
  const mobileActions = dashboardQuickActions(user.role, true)
  const actionContext = { data, users, user, addTask, addPayment, addJournalEntry, uploadPhoto, saveLead }

  return <div className="jm-today-dashboard">
    <header className="jm-today-hero"><div><p className="jm-eyebrow">Today · Operations</p><h1>{greeting}, {user.name}.</h1><p>{dateLabel}</p></div><div className="jm-weather-placeholder"><CloudSun size={25} /><div><strong>London weather</strong><span>Forecast integration coming soon</span></div></div></header>

    <section className="jm-today-summary" aria-label="Today's summary">{summaryCards.filter(visible).map(({ key, label, icon: Icon, tone, href, money }) => <Link key={key} to={href} className={`jm-today-metric jm-today-metric--${tone}`}><span><Icon size={20} /></span><div><small>{label}</small><strong>{money ? formatGBP(dashboard.summary[key]) : dashboard.summary[key]}</strong></div><ChevronRight size={16} /></Link>)}</section>

    <section id="action-centre" className="jm-today-action-centre jm-panel"><header><div><p className="jm-eyebrow">Ordered by urgency</p><h2>Action Centre</h2></div><span>{urgentItems.length} item{urgentItems.length === 1 ? '' : 's'} need a look</span></header>{urgentItems.length ? <div className="jm-today-priority-list">{urgentItems.slice(0, 8).map((item, index) => <Link key={`${item.kind}-${item.id}`} to={item.href} className={`jm-today-priority jm-today-priority--${item.severity}`}><b>{index + 1}</b><span className="jm-priority-signal">{item.severity === 'critical' ? <AlertCircle size={20} /> : item.kind === 'event' ? <CalendarClock size={20} /> : <ListTodo size={20} />}</span><div><strong>{item.title}</strong><small>{item.subtitle}</small></div><span className="jm-priority-kind">{item.kind}</span><ChevronRight size={17} /></Link>)}</div> : <UpToDate />}</section>

    <div className="jm-today-primary-grid">
      <DashboardSection eyebrow="Today" title="Today's schedule" link="/job-manager/calendar" linkLabel="Open calendar">{dashboard.schedule.length ? <div className="jm-today-schedule">{dashboard.schedule.map((item) => <Link key={item.id} to={item.href}><time>{item.time}</time><span className="jm-schedule-marker" /><div><strong>{item.client}</strong><small><MapPin size={12} />{item.postcode || 'No postcode'} · {item.type}</small></div><ChevronRight size={16} /></Link>)}</div> : <SmallEmpty text="No visits or calendar items today." />}</DashboardSection>
      <DashboardSection eyebrow="Automatic checks" title="Needs attention">{attention.length ? <div className="jm-attention-list">{attention.slice(0, 7).map((item) => <Link key={item.id} to={item.href}><span className={item.status === 'At Risk' ? 'is-risk' : 'is-attention'}><AlertCircle size={17} /></span><div><strong>{item.title}</strong><small>{item.reason}</small></div><ChevronRight size={16} /></Link>)}</div> : <UpToDate compact />}</DashboardSection>
    </div>

    <section className="jm-section jm-project-health-section"><div className="jm-section-heading"><div><p className="jm-eyebrow">Rule-based status</p><h2>Project health</h2></div><Link to="/job-manager/projects">All projects <ChevronRight size={15} /></Link></div>{dashboard.health.length ? <div className="jm-project-health-grid">{dashboard.health.slice(0, 6).map((item) => <Link key={item.projectId} to={`/job-manager/projects/${item.projectId}`} className={`jm-health-card jm-health-card--${item.status.toLowerCase().replaceAll(' ', '-')}`}><div><span>{item.status}</span><strong>{item.clientName}</strong><small>{item.project.title} · {item.project.postcode}</small></div><div className="jm-health-reasons">{item.reasons.length ? item.reasons.slice(0, 2).map((reason) => <span key={reason}><AlertCircle size={13} />{reason}</span>) : <span><CheckCircle2 size={13} />No current risks detected</span>}</div></Link>)}</div> : <SmallEmpty text="Active projects will appear here." />}</section>

    <div className="jm-today-secondary-grid">
      <DashboardSection eyebrow="Next seven days" title="Upcoming">{upcoming.length ? <div className="jm-upcoming-list">{upcoming.slice(0, 8).map((item) => <Link key={item.id} to={item.href}><time><strong>{new Date(`${item.date}T12:00:00`).toLocaleDateString('en-GB', { day: '2-digit' })}</strong><span>{new Date(`${item.date}T12:00:00`).toLocaleDateString('en-GB', { month: 'short' })}</span></time><div><span>{item.type}</span><strong>{item.title}</strong><small>{item.subtitle}</small></div></Link>)}</div> : <SmallEmpty text="Nothing scheduled in the next seven days." />}</DashboardSection>
      <DashboardSection eyebrow="Live workspace" title="Recent activity">{dashboard.recentActivity.length ? <div className="jm-dashboard-activity">{dashboard.recentActivity.map((item) => item.href ? <Link key={item.id} to={item.href}><span /><div><strong>{item.action}</strong><small>{item.projectName} · {formatDate(item.createdAt, true)}</small></div></Link> : <div key={item.id}><span /><div><strong>{item.action}</strong><small>{formatDate(item.createdAt, true)}</small></div></div>)}</div> : <SmallEmpty text="New project updates will appear here." />}</DashboardSection>
    </div>

    <div className="jm-today-quickbar"><span>Quick add</span>{desktopActions.map((label) => { const Icon = actionIcons[label]; return <button key={label} onClick={() => setQuickAction(label)}><Icon size={17} />{label}</button> })}</div>
    <div className={`jm-today-fab ${fabOpen ? 'is-open' : ''}`}>{fabOpen && <div className="jm-today-fab-menu">{mobileActions.map((label) => { const Icon = actionIcons[label]; return <button key={label} onClick={() => { setQuickAction(label); setFabOpen(false) }}><span>{label}</span><b><Icon size={19} /></b></button> })}</div>}<button className="jm-today-fab-main" aria-label="Quick actions" aria-expanded={fabOpen} onClick={() => setFabOpen((open) => !open)}>{fabOpen ? <X size={24} /> : <Plus size={25} />}</button></div>
    {quickAction && <QuickActionDialog type={quickAction} context={actionContext} close={() => setQuickAction('')} />}
  </div>
}

function DashboardSection({ eyebrow, title, link, linkLabel, children }) { return <section className="jm-panel jm-dashboard-section"><header><div><p className="jm-eyebrow">{eyebrow}</p><h2>{title}</h2></div>{link && <Link to={link}>{linkLabel}<ChevronRight size={15} /></Link>}</header>{children}</section> }
function UpToDate({ compact = false }) { return <div className={`jm-up-to-date ${compact ? 'is-compact' : ''}`}><span><Sparkles size={22} /></span><div><strong>Everything is up to date.</strong><small>Nice work.</small></div></div> }
function SmallEmpty({ text }) { return <div className="jm-dashboard-empty"><CheckCircle2 size={21} /><span>{text}</span></div> }

function QuickActionDialog({ type, context, close }) {
  const { data, users, user, addTask, addPayment, addJournalEntry, uploadPhoto, saveLead } = context
  const navigate = useNavigate(); const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  const projects = data.projects.filter((project) => ['Confirmed', 'Scheduled', 'In Progress', 'On Hold'].includes(project.status))
  const normalizedType = { Photo: 'Upload Photo', Note: 'Site Note' }[type] || type
  const needsProject = !['Lead'].includes(normalizedType)
  const submit = async (event) => {
    event.preventDefault(); const form = event.currentTarget; const values = Object.fromEntries(new FormData(form)); setBusy(true); setError('')
    try {
      if (normalizedType === 'Task') await addTask(values.projectId, { title: values.title, dueDate: values.dueDate, assignedTo: values.assignedTo || user.id, priority: values.priority })
      if (normalizedType === 'Payment') await addPayment(values.projectId, { title: values.title, amount: values.amount, percentage: 0, dueDate: values.dueDate, status: 'Due', invoiceReference: values.invoiceReference || '', notes: values.notes || '' })
      if (normalizedType === 'Site Note') await addJournalEntry(values.projectId, { category: 'Site update', message: values.message })
      if (normalizedType === 'Expense') await addJournalEntry(values.projectId, { category: 'Expense', message: `${values.vendor || 'Expense'} · £${values.amount || 0} · Receipt ${values.receiptStatus}` })
      if (normalizedType === 'Upload Photo') { const file = form.elements.photo.files[0]; if (!file) throw new Error('Choose a photo.'); await uploadPhoto(values.projectId, { stage: values.stage, title: values.title || file.name }, file) }
      if (normalizedType === 'Lead') { const id = await saveLead({ ...values, assignedTo: values.assignedTo || user.id, stage: 'New', priority: 'Normal', source: 'Direct', preferredContactMethod: 'Phone' }); navigate(`/job-manager/leads/${id}`) }
      close()
    } catch (submitError) { setError(submitError.message) } finally { setBusy(false) }
  }
  return <div className="jm-modal-backdrop" onMouseDown={close}><section className="jm-modal jm-today-dialog" onMouseDown={(event) => event.stopPropagation()}><header><div><p className="jm-eyebrow">Quick add</p><h2>{normalizedType}</h2></div><button onClick={close} aria-label="Close"><X size={20} /></button></header><form className="jm-form-grid" onSubmit={submit}>{needsProject && <SelectField name="projectId" label="Project" required options={projects.map((project) => ({ value: project.id, label: `${project.title} · ${project.postcode}` }))} />}
    {normalizedType === 'Task' && <><InputField name="title" label="Task" required wide /><InputField name="dueDate" label="Due date" type="date" required /><SelectField name="priority" label="Priority" options={['Low', 'Medium', 'High']} /><SelectField name="assignedTo" label="Assigned to" options={users.map((person) => ({ value: person.id, label: person.name }))} /></>}
    {normalizedType === 'Payment' && <><InputField name="title" label="Payment stage" required /><InputField name="amount" label="Amount (£)" type="number" min="0" step="0.01" required /><InputField name="dueDate" label="Due date" type="date" required /><InputField name="invoiceReference" label="Invoice reference" /><InputField name="notes" label="Notes" textarea wide /></>}
    {normalizedType === 'Site Note' && <InputField name="message" label="Site note" textarea required wide />}
    {normalizedType === 'Expense' && <><InputField name="vendor" label="Supplier / expense" required /><InputField name="amount" label="Amount (£)" type="number" min="0" step="0.01" required /><SelectField name="receiptStatus" label="Receipt" options={['received', 'missing']} /></>}
    {normalizedType === 'Upload Photo' && <><SelectField name="stage" label="Photo stage" options={['Before', 'Progress', 'Completed']} /><InputField name="title" label="Caption" /><label className="jm-field-wide jm-today-photo-input"><span>Photo</span><input name="photo" type="file" accept="image/*" required /></label></>}
    {normalizedType === 'Lead' && <><InputField name="clientName" label="Client name" required /><InputField name="projectType" label="Project type" required /><InputField name="phone" label="Phone" /><InputField name="email" label="Email" type="email" /><InputField name="postcode" label="Postcode" /><InputField name="enquirySummary" label="Enquiry" textarea wide /><InputField name="nextAction" label="Next action" /><InputField name="nextActionDueAt" label="Follow-up due" type="datetime-local" /></>}
    {error && <p className="jm-form-error jm-field-wide">{error}</p>}<footer><button type="button" className="jm-button" onClick={close}>Cancel</button><button className="jm-button jm-button--primary" disabled={busy || (needsProject && !projects.length)}>{busy ? 'Saving…' : `Add ${normalizedType.toLowerCase()}`}</button></footer></form></section></div>
}

function InputField({ label, textarea, wide, ...props }) { const Tag = textarea ? 'textarea' : 'input'; return <label className={wide ? 'jm-field-wide' : ''}><span>{label}</span><Tag {...props} /></label> }
function SelectField({ label, options, ...props }) { return <label><span>{label}</span><select {...props}>{options.map((item) => typeof item === 'string' ? <option key={item}>{item}</option> : <option key={item.value} value={item.value}>{item.label}</option>)}</select></label> }
