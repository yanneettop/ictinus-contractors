import { confirmationRequired, IntegrationError, notFound } from './errors.js'
import { validateDateRange } from './schemas.js'
import { buildTodayDashboard, londonToday } from '../../src/job-manager/utils/todayDashboard.js'

const ACTOR = Object.freeze({ actor_type: 'integration', actor_name: 'ChatGPT', source: 'chatgpt_integration' })
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const priority = (value) => `${value[0].toUpperCase()}${value.slice(1).toLowerCase()}`
const paymentStatus = (value) => value === 'paid' ? 'Paid' : 'Due'
const pounds = (pence) => Number(pence || 0) / 100
const pence = (value) => Math.round(Number(value) * 100)
const normalisePostcode = (value = '') => value.toUpperCase().replace(/\s+/g, '')
const normaliseName = (value = '') => value.trim().toLowerCase().replace(/\s+/g, ' ')
const now = () => new Date().toISOString()

export function mapProjectPatch(input, timestamp = now()) {
  const values = {
    title: input.title,
    project_type: input.projectType,
    description: input.description,
    status: input.status,
    address: input.address,
    postcode: input.postcode,
    start_date: input.startDate,
    end_date: input.endDate,
    estimated_duration: input.estimatedDuration,
    contract_value_pence: input.contractValue === undefined ? undefined : pence(input.contractValue),
    access_notes: input.accessNotes,
    parking_notes: input.parkingNotes,
    key_status: input.keyStatus,
    internal_notes: input.internalNotes,
    next_action: input.nextAction,
    scope: input.scope,
    provisional: input.provisional,
    updated_at: timestamp,
  }
  return Object.fromEntries(Object.entries(values).filter(([, value]) => value !== undefined))
}

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
const eventView = (row) => ({ id: row.id, projectId: row.project_id, leadId: row.lead_id, type: row.type, title: row.title, startDate: row.start_date, endDate: row.end_date, allDay: row.all_day, location: row.location, notes: row.notes, colourCategory: row.colour_category, googleCalendarId: row.google_calendar_id, googleCalendarEventId: row.google_calendar_event_id, syncStatus: row.sync_status, lastSyncedAt: row.last_synced_at, createdAt: row.created_at, updatedAt: row.updated_at })
const leadView = (row) => row && ({ id: row.id, clientName: row.client_name, email: row.email, phone: row.phone, postcode: row.postcode, fullAddress: row.full_address, projectType: row.project_type, enquirySummary: row.enquiry_summary, estimatedValue: pounds(row.estimated_value_pence), budget: pounds(row.budget_pence), stage: row.stage, priority: row.priority, source: row.source, sourceReference: row.source_reference, barkCreditsSpent: Number(row.bark_credits_spent || 0), assignedTo: row.assigned_to, preferredContactMethod: row.preferred_contact_method, preferredContactTime: row.preferred_contact_time, firstContactedAt: row.first_contacted_at, lastContactedAt: row.last_contacted_at, nextAction: row.next_action, nextActionDueAt: row.next_action_due_at, reminderStatus: row.reminder_status, siteVisitDate: row.site_visit_date, siteVisitStatus: row.site_visit_status, quoteId: row.quote_id, convertedProjectId: row.converted_project_id, lostReason: row.lost_reason, lostNotes: row.lost_notes, internalNotes: row.internal_notes, createdAt: row.created_at, updatedAt: row.updated_at })
const leadValues = (input) => Object.fromEntries(Object.entries({ client_name: input.clientName, email: input.email, phone: input.phone, postcode: input.postcode?.toUpperCase(), full_address: input.fullAddress, project_type: input.projectType, enquiry_summary: input.enquirySummary, estimated_value_pence: input.estimatedValue === undefined ? undefined : pence(input.estimatedValue), budget_pence: input.budget === undefined ? undefined : pence(input.budget), stage: input.stage, priority: input.priority, source: input.source, source_reference: input.sourceReference, assigned_to: input.assignedTo, preferred_contact_method: input.preferredContactMethod, preferred_contact_time: input.preferredContactTime, next_action: input.nextAction, next_action_due_at: input.nextActionDueAt, internal_notes: input.internalNotes, bark_credits_spent: input.barkCreditsSpent, updated_at: now() }).filter(([,value]) => value !== undefined))

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
  constructor(repository, calendar = null) {
    this.repository = repository
    this.calendar = calendar
  }

  setRequestContext(context) { this.repository.setContext?.(context) }

  async resolveProject(identifier, lookup) {
    const id = lookup?.id || (UUID_PATTERN.test(identifier || '') ? identifier : null)
    if (id) {
      const row = await this.repository.project(id)
      if (!row) throw notFound('project', id)
      this.repository.setContext?.({ projectId: row.id })
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
    this.repository.setContext?.({ projectId: matches[0].id })
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
    const [projects, tasks, payments, events, leads, activities, journalEntries] = await Promise.all([
      this.repository.projects(), this.repository.rows('tasks'), this.repository.rows('payments'), this.repository.rows('project_events'),
      this.repository.rows('leads'), this.repository.rows('activity_logs'), this.repository.rows('journal_entries'),
    ])
    const dashboard = buildTodayDashboard({ projects, tasks, payments, events, leads, activities, journalEntries })
    return { ...dashboard, performance: { queryCount: 7, strategy: 'parallel aggregate' } }
  }

  async outstandingPayments(overdueOnly = false) {
    const today = londonToday()
    const [paymentRows, projects] = await Promise.all([this.repository.rows('payments'), this.repository.projects()])
    let rows = paymentRows.filter((row) => row.status !== 'Paid')
    if (overdueOnly) rows = rows.filter((row) => row.due_date < today)
    const projectById = new Map(projects.map((row) => [row.id, row]))
    return rows.map((row) => ({ ...paymentView(row), projectDisplayName: projectView(projectById.get(row.project_id))?.displayName || row.project_id }))
  }

  async overdueTasks() {
    const today = londonToday()
    const [taskRows, projects] = await Promise.all([this.repository.rows('tasks'), this.repository.projects()])
    const projectById = new Map(projects.map((row) => [row.id, row]))
    return taskRows.filter((row) => !row.completed && row.due_date < today).map((row) => ({ ...taskView(row), projectDisplayName: projectView(projectById.get(row.project_id))?.displayName || row.project_id }))
  }

  async audit(action, entityType, entityId, projectId, previous, next) {
    if (this.repository.databaseAuditsMutations && !entityType.startsWith('lead')) return
    await this.repository.audit({
      project_id: projectId,
      lead_id: entityType === 'lead' ? entityId : (next?.lead_id || previous?.lead_id || null),
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
    if (input.status === 'Completed' && (input.startDate || previous.start_date) > londonToday()) throw new IntegrationError('INVALID_COMPLETION_DATE', 'A project cannot be completed before its start date.', 422)

    const values = mapProjectPatch(input)
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
    const createdDate = londonToday()
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
    const paidDate = nextStatus === 'Paid' ? (input.paidDate || previous.paid_date || londonToday()) : null
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
    const row = await this.repository.insert('project_events', { project_id: project.id, type: input.type, title: input.title, start_date: input.startDate, end_date: input.endDate, all_day: input.allDay, location: input.location || '', notes: input.notes || '', colour_category: input.colourCategory, google_calendar_id: null, google_calendar_event_id: null, sync_status: 'not_configured', last_synced_at: null, created_by: null, updated_at: now() })
    await this.audit('event.created', 'event', row.id, project.id, null, row)
    return this.syncEvent(row)
  }

  async patchEvent(id, input) {
    const previous = await this.repository.row('project_events', id)
    if (!previous) throw notFound('event', id)
    if (!validateDateRange(input.startDate || previous.start_date, input.endDate || previous.end_date)) throw new IntegrationError('INVALID_DATE_RANGE', 'endDate must be on or after startDate.', 422)
    const values = { type: input.type, title: input.title, start_date: input.startDate, end_date: input.endDate, all_day: input.allDay, location: input.location, notes: input.notes, colour_category: input.colourCategory, updated_at: now() }
    Object.keys(values).forEach((key) => values[key] === undefined && delete values[key])
    const updated = await this.repository.update('project_events', id, values)
    await this.audit('event.updated', 'event', id, previous.project_id, previous, updated)
    return this.syncEvent(updated)
  }

  async syncEvent(row) {
    if (!this.calendar) return { event: eventView(row), calendarSync: 'not_configured' }
    try {
      const result = await this.calendar.syncEvent(row)
      const status = result?.status === 'synced' ? 'synced' : 'not_configured'
      const values = {
        sync_status: status,
        google_calendar_id: result?.calendarId || row.google_calendar_id || null,
        google_calendar_event_id: result?.eventId || row.google_calendar_event_id || null,
        last_synced_at: status === 'synced' ? now() : row.last_synced_at || null,
        updated_at: now(),
      }
      try {
        const updated = await this.repository.update('project_events', row.id, values)
        return { event: eventView(updated || { ...row, ...values }), calendarSync: status }
      } catch {
        return { event: eventView({ ...row, ...values }), calendarSync: status }
      }
    } catch {
      const values = { sync_status: 'failed', updated_at: now() }
      try { await this.repository.update('project_events', row.id, values) } catch { /* The primary event write remains authoritative. */ }
      return { event: eventView({ ...row, ...values }), calendarSync: 'failed' }
    }
  }

  async resolveLead(identifier, lookup = {}) {
    const rows = await this.repository.rows('leads'); const raw = decodeURIComponent(identifier || '').trim()
    if (UUID_PATTERN.test(lookup.id || raw)) { const row = await this.repository.row('leads', lookup.id || raw); if (!row) throw notFound('lead', lookup.id || raw); return row }
    const wanted = { name: normaliseName(lookup.name || raw), postcode: normalisePostcode(lookup.postcode), email: (lookup.email || '').toLowerCase(), phone: (lookup.phone || '').replace(/\D/g,'') }
    const matches = rows.filter((row) => (!wanted.name || normaliseName(row.client_name) === wanted.name) && (!wanted.postcode || normalisePostcode(row.postcode) === wanted.postcode) && (!wanted.email || row.email.toLowerCase() === wanted.email) && (!wanted.phone || row.phone.replace(/\D/g,'') === wanted.phone))
    if (!matches.length) throw notFound('lead', lookup || identifier)
    if (matches.length > 1) throw new IntegrationError('AMBIGUOUS_LEAD', 'More than one lead matches. Provide a lead UUID or more identity fields.', 409, { matches: matches.map((row)=>({id:row.id,clientName:row.client_name,postcode:row.postcode,stage:row.stage})) })
    return matches[0]
  }
  async listLeads(filters = {}) { let rows = await this.repository.rows('leads'); if(filters.stage) rows=rows.filter((r)=>normaliseName(r.stage)===normaliseName(filters.stage)); if(filters.source) rows=rows.filter((r)=>normaliseName(r.source)===normaliseName(filters.source)); if(filters.assignedTo) rows=rows.filter((r)=>r.assigned_to===filters.assignedTo); return rows.map(leadView) }
  async getLead(id) { const lead = await this.resolveLead(id); const [communications,tasks,events,quotes]=await Promise.all([this.repository.rows('lead_communications','lead_id',lead.id),this.repository.rows('tasks','lead_id',lead.id),this.repository.rows('project_events','lead_id',lead.id),this.repository.rows('lead_quotes','lead_id',lead.id)]); return {...leadView(lead),communications,tasks:tasks.map(taskView),events:events.map(eventView),quotes:quotes.map((q)=>({...q,amount:pounds(q.amount_pence)}))} }
  async createLead(input) { const existing=await this.repository.rows('leads'); const email=(input.email||'').trim().toLowerCase(); const phone=(input.phone||'').replace(/\D/g,''); const postcode=normalisePostcode(input.postcode); const name=normaliseName(input.clientName); const duplicates=existing.filter((item)=>(email&&item.email?.trim().toLowerCase()===email)||(phone&&item.phone?.replace(/\D/g,'')===phone)||(name&&postcode&&normaliseName(item.client_name)===name&&normalisePostcode(item.postcode)===postcode)); const values={...leadValues(input),created_by:null,updated_by:null}; const row=await this.repository.insert('leads',values); await this.audit('lead.created','lead',row.id,null,null,row); return {...leadView(row),duplicateWarning:duplicates.length?{message:'Possible existing lead matches were found. The new lead was still created.',matches:duplicates.map((item)=>({id:item.id,clientName:item.client_name,postcode:item.postcode,stage:item.stage}))}:null} }
  async patchLead(id,input) { const previous=await this.resolveLead(id); if(['Won','Lost'].includes(input.stage)&&!input.confirmed) throw confirmationRequired(['stage']); const row=await this.repository.update('leads',previous.id,{...leadValues(input),updated_by:null}); await this.audit('lead.updated','lead',row.id,null,previous,row); return leadView(row) }
  async logLeadCommunication(id,input) { const lead=await this.resolveLead(id); const row=await this.repository.insert('lead_communications',{lead_id:lead.id,type:input.type,direction:input.direction,occurred_at:input.occurredAt||now(),summary:input.summary,note:input.note||'',attachment_url:input.attachmentUrl||null,external_link:input.externalLink||null,author_id:null}); await this.repository.update('leads',lead.id,{last_contacted_at:now(),first_contacted_at:lead.first_contacted_at||now(),stage:lead.stage==='New'?'Contacted':lead.stage,updated_at:now()}); await this.audit('lead.communication_logged','lead_communication',row.id,null,null,row); return row }
  async createLeadSiteVisit(id,input) { const lead=await this.resolveLead(id); if(!validateDateRange(input.startDate,input.endDate||input.startDate)) throw new IntegrationError('INVALID_DATE_RANGE','endDate must be on or after startDate.',422); const event=await this.repository.insert('project_events',{project_id:null,lead_id:lead.id,type:'Site visit',title:`${lead.client_name} – ${lead.postcode}`,start_date:input.startDate,end_date:input.endDate||input.startDate,all_day:false,location:`${lead.full_address} ${lead.postcode}`.trim(),notes:input.notes||'',colour_category:'blue',sync_status:'not_configured',created_by:null,updated_at:now()}); await this.repository.update('leads',lead.id,{stage:'Site Visit Booked',site_visit_date:input.startDate,site_visit_status:'Booked',bark_site_visit_booked:lead.source==='Bark'?true:lead.bark_site_visit_booked,updated_at:now()}); await this.audit('lead.site_visit_booked','event',event.id,null,null,event); return {event:eventView(event),calendarSync:'not_configured'} }
  async createLeadTask(id,input) { const lead=await this.resolveLead(id); const row=await this.repository.insert('tasks',{project_id:null,lead_id:lead.id,title:input.title,due_date:input.dueDate,assigned_to:input.assignedTo||lead.assigned_to,priority:input.priority,completed:false,created_by:null,updated_at:now()}); await this.audit('lead.task_created','task',row.id,null,null,row); return taskView(row) }
  async convertLead(id,input) { const lead=await this.resolveLead(id); const result=await this.repository.rpc('convert_lead_to_project',{target_lead_id:lead.id,conversion:{title:input.title,startDate:input.startDate,endDate:input.endDate,assignedTo:input.assignedTo,contractValuePence:input.contractValue===undefined?undefined:pence(input.contractValue)}}); return {leadId:lead.id,projectId:result} }
  async markLeadLost(id,input) { const lead=await this.resolveLead(id); const row=await this.repository.update('leads',lead.id,{stage:'Lost',lost_reason:input.reason,lost_notes:input.notes||'',updated_at:now()}); await this.audit('lead.marked_lost','lead',lead.id,null,lead,row); return leadView(row) }
  async leadFollowUps(overdueOnly=false) { const today=now(); return (await this.repository.rows('leads')).filter((row)=>!['Won','Lost','Archived'].includes(row.stage)&&row.next_action_due_at&&(!overdueOnly||row.next_action_due_at<today)).sort((a,b)=>a.next_action_due_at.localeCompare(b.next_action_due_at)).map(leadView) }

  async applyProjectFinancialCorrection(input) {
    const result = await this.repository.rpc('apply_integration_project_correction', {
      target_project_id: input.projectId,
      project_patch: {
        address: input.address,
        postcode: input.postcode,
        title: input.title,
        description: input.description,
        scope: input.scope,
        contractValuePence: pence(input.contractValue),
        endDate: input.endDate,
        status: input.status,
        nextAction: input.nextAction,
      },
      deposit_patch: { amountPence: pence(input.deposit.amount), percentage: input.deposit.percentage, paidDate: input.deposit.paidDate },
      final_payment_patch: { amountPence: pence(input.finalPayment.amount), percentage: input.finalPayment.percentage, dueDate: input.finalPayment.dueDate },
    })
    return result
  }
}
