const ACTIVE_STATUSES = new Set(['Confirmed', 'Scheduled', 'In Progress', 'On Hold'])
const CLOSED_LEAD_STAGES = new Set(['Won', 'Lost', 'Archived'])

const value = (record, camel, snake = camel) => record?.[camel] ?? record?.[snake]
const day = (date) => date ? String(date).slice(0, 10) : ''
const money = (record) => Number(value(record, 'amount', 'amount_pence') ?? 0) / (record?.amount_pence != null ? 100 : 1)
const projectId = (record) => value(record, 'projectId', 'project_id')
const leadId = (record) => value(record, 'leadId', 'lead_id')
const isPaid = (payment) => String(payment.status).toLowerCase() === 'paid'
const daysBetween = (from, to) => Math.max(0, Math.round((new Date(`${to}T12:00:00Z`) - new Date(`${from}T12:00:00Z`)) / 86400000))
const londonToday = () => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map((part) => [part.type, part.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}

export const dashboardQuickActions = (role, mobile = false) => {
  const operational = mobile ? ['Task', 'Photo', 'Note'] : ['Task', 'Site Note', 'Upload Photo']
  return role === 'administrator' ? [...operational.slice(0, 1), 'Expense', ...operational.slice(1), ...(mobile ? [] : ['Payment']), 'Lead'] : operational
}

export function calculateProjectHealth(project, data, today) {
  const id = project.id
  const reasons = []
  let score = 0
  const overdueTasks = data.tasks.filter((task) => projectId(task) === id && !task.completed && day(value(task, 'dueDate', 'due_date')) < today)
  const overduePayments = data.payments.filter((payment) => projectId(payment) === id && !isPaid(payment) && day(value(payment, 'dueDate', 'due_date')) < today)
  const text = [value(project, 'nextAction', 'next_action'), value(project, 'internalNotes', 'internal_notes'), value(project, 'accessNotes', 'access_notes')].filter(Boolean).join(' ').toLowerCase()
  const delayed = ACTIVE_STATUSES.has(project.status) && day(value(project, 'endDate', 'end_date')) && day(value(project, 'endDate', 'end_date')) < today
  const missingMaterials = /(?:missing|awaiting|need|order).{0,30}material|material.{0,30}(?:missing|awaiting|need|order)/i.test(text)
  const missingApproval = /(?:awaiting|pending|missing|need).{0,30}(?:approval|colour|selection)|(?:approval|colour|selection).{0,30}(?:awaiting|pending|missing|need)/i.test(text)
  if (overduePayments.length) { score += Math.min(8, overduePayments.length * 4); reasons.push(`${overduePayments.length} overdue payment${overduePayments.length === 1 ? '' : 's'}`) }
  if (delayed) { score += 4; reasons.push('Schedule has passed its finish date') }
  if (overdueTasks.length) { score += Math.min(6, overdueTasks.length * 3); reasons.push(`${overdueTasks.length} overdue task${overdueTasks.length === 1 ? '' : 's'}`) }
  if (missingMaterials) { score += 2; reasons.push('Materials need attention') }
  if (missingApproval) { score += 2; reasons.push('Client approval is outstanding') }
  return { projectId: id, status: score >= 6 ? 'At Risk' : score >= 2 ? 'Attention Needed' : 'Healthy', score, reasons }
}

export function buildTodayDashboard(rawData, options = {}) {
  const data = {
    projects: rawData.projects || [], clients: rawData.clients || [], tasks: rawData.tasks || [], payments: rawData.payments || [], events: rawData.events || rawData.project_events || [],
    leads: rawData.leads || [], activities: rawData.activities || rawData.activity_logs || [], journalEntries: rawData.journalEntries || rawData.journal_entries || [], documents: rawData.documents || [],
  }
  const today = options.today || londonToday()
  const tomorrow = new Date(`${today}T12:00:00Z`); tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  const nextWeek = new Date(`${today}T12:00:00Z`); nextWeek.setUTCDate(nextWeek.getUTCDate() + 7)
  const tomorrowKey = tomorrow.toISOString().slice(0, 10); const nextWeekKey = nextWeek.toISOString().slice(0, 10)
  const projectById = new Map(data.projects.map((project) => [project.id, project]))
  const clientById = new Map(data.clients.map((client) => [client.id, client]))
  const projectName = (id) => { const project = projectById.get(id); const client = project?.client || clientById.get(value(project, 'clientId', 'client_id')); return client?.name || project?.title || 'Project' }
  const hrefFor = (record) => leadId(record) ? `/job-manager/leads/${leadId(record)}` : `/job-manager/projects/${projectId(record) || record.id}`
  const activeProjects = data.projects.filter((project) => ACTIVE_STATUSES.has(project.status))
  const tasksDueToday = data.tasks.filter((task) => !task.completed && day(value(task, 'dueDate', 'due_date')) === today)
  const overdueTasks = data.tasks.filter((task) => !task.completed && day(value(task, 'dueDate', 'due_date')) < today)
  const outstandingPayments = data.payments.filter((payment) => !isPaid(payment))
  const overduePayments = outstandingPayments.filter((payment) => day(value(payment, 'dueDate', 'due_date')) < today)
  const todayEvents = data.events.filter((event) => day(value(event, 'startDate', 'start_date')) <= today && day(value(event, 'endDate', 'end_date')) >= today)
  const openLeads = data.leads.filter((lead) => !CLOSED_LEAD_STAGES.has(lead.stage))
  const leadFollowUps = openLeads.filter((lead) => day(value(lead, 'nextActionDueAt', 'next_action_due_at')) && day(value(lead, 'nextActionDueAt', 'next_action_due_at')) <= today)

  const actionItems = [
    ...overduePayments.map((payment) => ({ id: payment.id, kind: 'payment', severity: 'critical', priority: 100 + daysBetween(day(value(payment, 'dueDate', 'due_date')), today), title: `${payment.title || 'Payment'} overdue`, subtitle: `${projectName(projectId(payment))} · £${money(payment).toLocaleString('en-GB')}`, href: hrefFor(payment), adminOnly: true })),
    ...overdueTasks.map((task) => ({ id: task.id, kind: 'task', severity: 'critical', priority: 90 + daysBetween(day(value(task, 'dueDate', 'due_date')), today), title: task.title, subtitle: `${projectName(projectId(task))} · overdue`, href: hrefFor(task) })),
    ...leadFollowUps.map((lead) => ({ id: lead.id, kind: 'lead', severity: 'warning', priority: 80 + daysBetween(day(value(lead, 'nextActionDueAt', 'next_action_due_at')), today), title: lead.nextAction || 'Client follow-up', subtitle: `${lead.clientName || lead.client_name} · ${lead.postcode || 'No postcode'}`, href: `/job-manager/leads/${lead.id}`, adminOnly: true })),
    ...todayEvents.map((event) => ({ id: event.id, kind: 'event', severity: 'today', priority: 70, title: event.title, subtitle: `${projectName(projectId(event))} · ${event.type}`, href: hrefFor(event) })),
    ...tasksDueToday.map((task) => ({ id: task.id, kind: 'task', severity: 'today', priority: 60, title: task.title, subtitle: `${projectName(projectId(task))} · due today`, href: hrefFor(task) })),
  ].sort((a, b) => b.priority - a.priority || a.title.localeCompare(b.title))

  const health = activeProjects.map((project) => ({ ...calculateProjectHealth(project, data, today), project, clientName: projectName(project.id) })).sort((a, b) => b.score - a.score || a.clientName.localeCompare(b.clientName))
  const attention = health.filter((item) => item.status !== 'Healthy').map((item) => ({ id: item.projectId, title: item.clientName, reason: item.reasons[0], status: item.status, href: `/job-manager/projects/${item.projectId}` }))
  for (const lead of openLeads.filter((item) => ['Quote Sent', 'Follow-up Due', 'Negotiation'].includes(item.stage) && day(value(item, 'nextActionDueAt', 'next_action_due_at')) <= today)) attention.push({ id: `quote-${lead.id}`, title: lead.clientName || lead.client_name, reason: 'Quotation requires follow-up', status: 'Attention Needed', href: `/job-manager/leads/${lead.id}`, adminOnly: true })
  for (const payment of overduePayments) attention.push({ id: `invoice-${payment.id}`, title: projectName(projectId(payment)), reason: `${payment.title || 'Invoice'} is overdue`, status: 'At Risk', href: hrefFor(payment), adminOnly: true })
  for (const note of data.journalEntries.filter((entry) => String(entry.category).toLowerCase() === 'expense' && /(?:missing|no|awaiting|pending).{0,20}receipt|receipt.{0,20}(?:missing|awaiting|pending)/i.test(entry.message || ''))) attention.push({ id: `receipt-${note.id}`, title: projectName(projectId(note)), reason: 'Expense receipt is missing', status: 'Attention Needed', href: hrefFor(note), adminOnly: true })

  const upcoming = [
    ...data.events.filter((event) => day(value(event, 'startDate', 'start_date')) > today && day(value(event, 'startDate', 'start_date')) <= nextWeekKey).map((event) => ({ id: `event-${event.id}`, date: day(value(event, 'startDate', 'start_date')), type: event.type, title: event.title, subtitle: projectName(projectId(event)), href: hrefFor(event) })),
    ...activeProjects.filter((project) => day(value(project, 'startDate', 'start_date')) > today && day(value(project, 'startDate', 'start_date')) <= nextWeekKey).map((project) => ({ id: `start-${project.id}`, date: day(value(project, 'startDate', 'start_date')), type: 'Project starts', title: project.title, subtitle: projectName(project.id), href: `/job-manager/projects/${project.id}` })),
    ...outstandingPayments.filter((payment) => day(value(payment, 'dueDate', 'due_date')) > today && day(value(payment, 'dueDate', 'due_date')) <= nextWeekKey).map((payment) => ({ id: `payment-${payment.id}`, date: day(value(payment, 'dueDate', 'due_date')), type: 'Payment due', title: payment.title, subtitle: projectName(projectId(payment)), href: hrefFor(payment), adminOnly: true })),
    ...activeProjects.filter((project) => day(value(project, 'endDate', 'end_date')) > today && day(value(project, 'endDate', 'end_date')) <= nextWeekKey).map((project) => ({ id: `deadline-${project.id}`, date: day(value(project, 'endDate', 'end_date')), type: 'Project deadline', title: project.title, subtitle: projectName(project.id), href: `/job-manager/projects/${project.id}` })),
  ].sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title))

  const recentActivity = [...data.activities].sort((a, b) => String(value(b, 'createdAt', 'created_at')).localeCompare(String(value(a, 'createdAt', 'created_at')))).slice(0, 8).map((activity) => ({ id: activity.id, action: activity.action, createdAt: value(activity, 'createdAt', 'created_at'), projectName: projectName(projectId(activity)), href: leadId(activity) ? `/job-manager/leads/${leadId(activity)}` : projectId(activity) ? `/job-manager/projects/${projectId(activity)}` : '' }))
  const schedule = todayEvents.sort((a, b) => String(value(a, 'startDate', 'start_date')).localeCompare(String(value(b, 'startDate', 'start_date')))).map((event) => ({ id: event.id, time: event.allDay || event.all_day ? 'All day' : new Date(value(event, 'startDate', 'start_date')).toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' }), client: projectName(projectId(event)), postcode: projectById.get(projectId(event))?.postcode || '', type: event.type, title: event.title, href: hrefFor(event) }))
  return { today, tomorrow: tomorrowKey, summary: { activeProjects: activeProjects.length, tasksDueToday: tasksDueToday.length, overdueTasks: overdueTasks.length, outstandingPayments: outstandingPayments.reduce((sum, payment) => sum + money(payment), 0), siteVisitsToday: todayEvents.filter((event) => /visit|collection/i.test(event.type)).length, leadsRequiringFollowUp: leadFollowUps.length }, counts: { overduePayments: overduePayments.length, overdueTasks: overdueTasks.length, leadFollowUps: leadFollowUps.length }, actionItems, schedule, attention, recentActivity, upcoming, health }
}
