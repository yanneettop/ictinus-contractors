import { confirmationRequired, IntegrationError, notFound } from './errors.js'
import { validateDateRange } from './schemas.js'

const ACTOR = Object.freeze({ actor_type: 'integration', actor_name: 'ChatGPT', source: 'chatgpt_integration' })
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const priority = (value) => `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`
const paymentStatus = (value) => value === 'paid' ? 'Paid' : 'Due'
const pounds = (pence) => Number(pence || 0) / 100
const pence = (value) => Math.round(Number(value) * 100)
const normalisePostcode = (value = '') => value.toUpperCase().replace(/\s+/g, '')
const normaliseName = (value = '') => value.trim().toLowerCase().replace(/\s+/g, ' ')
const now = () => new Date().toISOString()

function projectView(row) {
  if (!row) return null
  return {
    id: row.id,
    displayName: `${row.client?.name || row.title} – ${row.postcode}`,
    client: row.client ? { id: row.client.id, name: row.client.name, phone: row.client.phone, email: row.client.email } : null,
    title: row.title,
    projectType: row.project_type,
    description: row.description,
    status: row.status,
    address: row.address,
    postcode: row.postcode,
    startDate: row.start_date,
    endDate: row.end_date,
    estimatedDuration: row.estimated_duration,
    assignedTo: row.assignee ? { id: row.assignee.id, name: row.assignee.display_name, email: row.assignee.email } : row.assigned_to,
    contractValue: pounds(row.contract_value_pence),
    amountPaid: pounds(row.amount_paid_pence),
    outstandingBalance: pounds(row.outstanding_balance_pence),
    accessNotes: row.access_notes,
    parkingNotes: row.parking_notes,
    keyStatus: row.key_status,
    internalNotes: row.internal_notes,
    nextAction: row.next_action,
    scope: row.scope || [],
    provisional: row.provisional,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

const taskView = (row) => ({ id: row.id, projectId: row.project_id, title: row.title, dueDate: row.due_date, assignedTo: row.assigned_to, priority: row.priority, completed: row.completed, status: row.completed ? 'Completed' : 'Pending', createdAt: row.created_at, updatedAt: row.updated_at })
const paymentView = (row) => ({ id: row.id, projectId: row.project_id, title: row.title, percentage: Number(row.percentage), amount: pounds(row.amount_pence), dueDate: row.due_date, paidDate: row.paid_date, status: row.status, invoiceReference: row.invoice_reference, notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at })
const journalView = (row) => ({ id: row.id, projectId: row.project_id, category: row.category, message: row.message, createdAt: row.created_at, updatedAt: row.updated_at })
const eventView = (row) => ({ id: row.id, projectId: row.project_id, type: row.type, title: row.title, startDate: row.start_date, endDate: row.end_date, allDay: row.all_day, location: row.location, notes: row.notes, colourCategory: row.colour_category, googleCalendarEventId: row.google_calendar_event_id, syncStatus: row.sync_status, lastSyncedAt: row.last_synced_at, createdAt: row.created_at, updatedAt: row.updated_at })

function ambiguity(matches) {
  throw new IntegrationError('AMBIGUOUS_PROJECT', 'More than one project matches. Provide a project UUID or a unique name and postcode.', 409, {
    matches: matches.map((row) => ({ id: row.id, clientName: row.client?.name, title: row.title, postcode: row.postcode, status: row.status })),
  })
}

function safeAuditValue(row) {
  if (!row) return null
  const safe = { ...row }
  delete safe.client
  delete safe.assignee
  return safe
}

export class IntegrationService {
  constructor(repository) {
    this.repository = repository
  }

  async resolveProject(identifier, lookup) {
    const id = lookup?.id || (UUID_PATTERN.test(identifier || '') ? identifier : null)
    if (id) {
      const row = await this.repository.project(id)
      if (!row) throw notFound('project', id)
      return row
    }

    const rows = await this.repository.projects()
    const rawIdentifier = decodeURIComponent(identifier || '').trim()
    const wantedName = normaliseName(lookup?.clientName || lookup?.name || rawIdentifier)
    const wantedPostcode = normalisePostcode(lookup?.postcode || (rawIdentifier.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i)?.[0] || ''))
    const nameWithoutPostcode = normaliseName(wantedPostcode ? rawIdentifier.replace(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i, '').replace(/[\s,–—-]+$/, '') : wantedName)

    const matches = rows.filter((row) => {
      const rowPostcode = normalisePostcode(row.postcode)
      const clientName = normaliseName(row.client?.name)
      const projectName = normaliseName(row.title)
      const name = lookup?.clientName ? normaliseName(lookup.clientName) : (lookup?.name ? normaliseName(lookup.name) : nameWithoutPostcode)
      const postcodeMatches = !wantedPostcode || rowPostcode === wantedPostcode
      const nameMatches = !name || clientName === name || projectName === name || clientName.startsWith(`${name} `)
      return postcodeMatches && nameMatches
    })

    if (matches.length === 0) throw notFound('project', lookup || identifier)
    if (matches.length > 1) ambiguity(matches)
    return matches[0]
  }

  async listProjects(filters = {}) {
    let rows = await this.repository.projects()
    if (filters.status) rows = rows.filter((row) => normaliseName(row.status) === normaliseName(filters.status))
    if (filters.postcode) rows = rows.filter((row) => normalisePostcode(row.postcode) === normalisePostcode(filters.postcode))
    if (filters.name) {
      const name = normaliseName(filters.name)
      rows = rows.filter((row) => normaliseName(row.client?.name).includes(name) || normaliseName(row.title).includes(name))
    }
    return rows.map(projectView)
  }

  async getProject(identifier) {
    const project = await this.resolveProject(identifier)
    const bundle = await this.repository.projectBundle(project.id)
    return {
      ...projectView(bundle.project),
      tasks: bundle.tasks.map(taskView),
      payments: bundle.payments.map(paymentView),
      journal: bundle.journal.map(journalView),
      events: bundle.events.map(eventView),
    }
  }

  async dashboard() {
    const [projects, tasks, payments, events] = await Promise.all([
      this.repository.projects(), this.repository.rows('tasks'), this.repository.rows('payments'), this.repository.rows('project_events'),
    ])
    const today = new Date().toISOString().slice(0, 10)
    const active = projects.filter((row) => !['Completed', 'Cancelled'].includes(row.status))
    const outstanding = payments.filter((row) => row.status !== 'Paid')
    return {
      projects: { total: projects.length, active: active.length, completed: projects.length - active.length },
      financials: { contractValue: projects.reduce((sum, row) => sum + pounds(row.contract_value_pence), 0), outstanding: outstanding.reduce((sum, row) => sum + pounds(row.amount_pence), 0) },
      overdueTasks: tasks.filter((row) => !row.completed && row.due_date < today).length,
      overduePayments: outstanding.filter((row) => row.due_date < today).length,
      upcomingEvents: events.filter((row) => row.end_date >= now()).slice(0, 10).map(eventView),
    }
  }

  async outstandingPayments(overdueOnly = false) {
    const today = new Date().toISOString().slice(0, 10)
    const [paymentRows, projects] = await Promise.all([this.repository.rows('payments'), this.repository.projects()])
    let rows = paymentRows.filter((row) => row.status !== 'Paid')
    if (overdueOnly) rows = rows.filter((row) => row.due_date < today)
    const projectById = new Map(projects.map((row) => [row.id, row]))
    return rows.map((row) => ({ ...paymentView(row), projectDisplayName: projectView(projectById.get(row.project_id))?.displayName || row.project_id }))
  }

  async overdueTasks() {
    const today = new Date().toISOString().slice(0, 10)
    const [taskRows, projects] = await Promise.all([this.repository.rows('tasks'), this.repository.projects()])
    const projectById = new Map(projects.map((row) => [row.id, row]))
    return taskRows.filter((row) => !row.completed && row.due_date < today).map((row) => ({ ...taskView(row), projectDisplayName: projectView(projectById.get(row.project_id))?.displayName || row.project_id }))
  }

  async audit(action, entityType, entityId, projectId, previous, next) {
    await this.repository.audit({
      project_id: projectId,
      user_id: null,
      action,
      ...ACTOR,
      entity_type: entityType,
      entity_id: entityId,
      previous_values: safeAuditValue(previous),
      new_values: safeAuditValue(next),
      created_at: now(),
    })
  }

  async resolveAssignee(value) {
    if (value === undefined || value === null || UUID_PATTERN.test(value)) return value
    const wanted = normaliseName(value)
    const matches = (await this.repository.profiles()).filter((row) => {
      const name = normaliseName(row.display_name)
      return name === wanted || name.startsWith(`${wanted} `)
    })
    if (matches.length === 0) throw notFound('assignee', value)
    if (matches.length > 1) throw new IntegrationError('AMBIGUOUS_ASSIGNEE', 'More than one active team member matches.', 409, { matches: matches.map((row) => ({ id: row.id, name: row.display_name })) })
    return matches[0].id
  }

  async patchProject(identifier, input) {
    const previous = await this.resolveProject(identifier, input.project)
    const sensitive = []
    if (input.contractValue !== undefined && pence(input.contractValue) !== Number(previous.contract_value_pence)) sensitive.push('contractValue')
    if (input.status && input.status !== previous.status && (input.status === 'Completed' || previous.status === 'Completed')) sensitive.push('status')
    if (sensitive.length && !input.confirmed) throw confirmationRequired(sensitive)
    if (!validateDateRange(input.startDate || previous.start_date, input.endDate || previous.end_date)) throw new IntegrationError('INVALID_DATE_RANGE', 'endDate must be on or after startDate.', 422)
    if (input.status === 'Completed' && (input.startDate || previous.start_date) > new Date().toISOString().slice(0, 10)) throw new IntegrationError('INVALID_COMPLETION_DATE', 'A project cannot be completed before its start date.', 422)

    const values = {
      title: input.title, project_type: input.projectType, description: input.description, status: input.status,
      address: input.address, postcode: input.postcode, start_date: input.startDate, end_date: input.endDate,
      estimated_duration: input.estimatedDuration, contract_value_pence: input.contractValue === undefined ? undefined : pence(input.contractValue),
      access_notes: input.accessNotes, parking_notes: input.parkingNotes, key_status: input.keyStatus,
      internal_notes: input.internalNotes, next_action: input.nextAction, scope: input.scope, provisional: input.provisional, updated_at: now(),
    }
    Object.keys(values).forEach((key) => values[key] === undefined && delete values[key])
    const updated = await this.repository.update('projects', previous.id, values)
    if (!updated) throw notFound('project', previous.id)
    const action = updated.status === 'Completed' && previous.status !== 'Completed' ? 'project.completed' : 'project.updated'
    await this.audit(action, 'project', updated.id, updated.id, previous, updated)
    return projectView({ ...updated, client: previous.client, assignee: previous.assignee })
  }

  async createTask(identifier, input) {
    const project = await this.resolveProject(identifier, input.project)
    const assignedTo = await this.resolveAssignee(input.assignedTo)
    const row = await this.repository.insert('tasks', { project_id: project.id, title: input.title, due_date: input.dueDate, assigned_to: assignedTo || null, priority: priority(input.priority), completed: input.completed, created_by: null, updated_at: now() })
    await this.audit('task.created', 'task', row.id, project.id, null, row)
    return taskView(row)
  }

  async patchTask(id, input) {
    const previous = await this.repository.row('tasks', id)
    if (!previous) throw notFound('task', id)
    const assignedTo = await this.resolveAssignee(input.assignedTo)
    const values = { title: input.title, due_date: input.dueDate, assigned_to: assignedTo, priority: input.priority && priority(input.priority), completed: input.completed, updated_at: now() }
    Object.keys(values).forEach((key) => values[key] === undefined && delete values[key])
    const updated = await this.repository.update('tasks', id, values)
    await this.audit('task.updated', 'task', id, previous.project_id, previous, updated)
    return taskView(updated)
  }

  async createPayment(identifier, input) {
    const project = await this.resolveProject(identifier, input.project)
    if (input.status === 'paid' && !input.confirmed) throw confirmationRequired(['status'])
    const createdDate = new Date().toISOString().slice(0, 10)
    if (input.paidDate && input.paidDate < createdDate) throw new IntegrationError('INVALID_PAID_DATE', 'paidDate cannot be before the payment was created.', 422)
    const row = await this.repository.insert('payments', { project_id: project.id, title: input.title, percentage: input.percentage, amount_pence: pence(input.amount), due_date: input.dueDate, paid_date: input.status === 'paid' ? (input.paidDate || createdDate) : null, status: paymentStatus(input.status), invoice_reference: input.invoiceReference || '', notes: input.notes || '', updated_at: now() })
    await this.audit('payment.created', 'payment', row.id, project.id, null, row)
    return paymentView(row)
  }

  async patchPayment(id, input) {
    const previous = await this.repository.row('payments', id)
    if (!previous) throw notFound('payment', id)
    const sensitive = []
    if (input.status === 'paid' && previous.status !== 'Paid') sensitive.push('status')
    if (input.amount !== undefined && (previous.status === 'Paid' || /final/i.test(previous.title)) && pence(input.amount) !== Number(previous.amount_pence)) sensitive.push('amount')
    if (sensitive.length && !input.confirmed) throw confirmationRequired(sensitive)
    const nextStatus = input.status ? paymentStatus(input.status) : previous.status
    const paidDate = nextStatus === 'Paid' ? (input.paidDate || previous.paid_date || new Date().toISOString().slice(0, 10)) : null
    if (paidDate && paidDate < previous.created_at.slice(0, 10)) throw new IntegrationError('INVALID_PAID_DATE', 'paidDate cannot be before the payment was created.', 422)
    const values = { title: input.title, percentage: input.percentage, amount_pence: input.amount === undefined ? undefined : pence(input.amount), due_date: input.dueDate, paid_date: paidDate, status: nextStatus, invoice_reference: input.invoiceReference, notes: input.notes, updated_at: now() }
    Object.keys(values).forEach((key) => values[key] === undefined && delete values[key])
    const updated = await this.repository.update('payments', id, values)
    const action = updated.status === 'Paid' && previous.status !== 'Paid' ? 'payment.marked_paid' : 'payment.updated'
    await this.audit(action, 'payment', id, previous.project_id, previous, updated)
    return paymentView(updated)
  }

  async createJournal(identifier, input) {
    const project = await this.resolveProject(identifier, input.project)
    const row = await this.repository.insert('journal_entries', { project_id: project.id, user_id: null, category: input.category, message: input.message, updated_at: now() })
    await this.audit('journal.created', 'journal_entry', row.id, project.id, null, row)
    return journalView(row)
  }

  async createEvent(identifier, input) {
    const project = await this.resolveProject(identifier, input.project)
    if (!validateDateRange(input.startDate, input.endDate)) throw new IntegrationError('INVALID_DATE_RANGE', 'endDate must be on or after startDate.', 422)
    const row = await this.repository.insert('project_events', { project_id: project.id, type: input.type, title: input.title, start_date: input.startDate, end_date: input.endDate, all_day: input.allDay, location: input.location || '', notes: input.notes || '', colour_category: input.colourCategory, google_calendar_event_id: null, sync_status: 'not_configured', last_synced_at: null, created_by: null, updated_at: now() })
    await this.audit('event.created', 'event', row.id, project.id, null, row)
    return { event: eventView(row), calendarSync: 'not_configured' }
  }

  async patchEvent(id, input) {
    const previous = await this.repository.row('project_events', id)
    if (!previous) throw notFound('event', id)
    if (!validateDateRange(input.startDate || previous.start_date, input.endDate || previous.end_date)) throw new IntegrationError('INVALID_DATE_RANGE', 'endDate must be on or after startDate.', 422)
    const values = { type: input.type, title: input.title, start_date: input.startDate, end_date: input.endDate, all_day: input.allDay, location: input.location, notes: input.notes, colour_category: input.colourCategory, sync_status: previous.google_calendar_event_id ? 'pending' : 'not_configured', updated_at: now() }
    Object.keys(values).forEach((key) => values[key] === undefined && delete values[key])
    const updated = await this.repository.update('project_events', id, values)
    await this.audit('event.updated', 'event', id, previous.project_id, previous, updated)
    return { event: eventView(updated), calendarSync: updated.google_calendar_event_id ? 'pending' : 'not_configured' }
  }
}
