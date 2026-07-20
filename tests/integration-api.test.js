import assert from 'node:assert/strict'
import test from 'node:test'
import SwaggerParser from '@apidevtools/swagger-parser'
import { integrationOpenApi } from '../functions/_integration/openapi.js'
import { handleIntegrationRequest } from '../functions/_integration/router.js'
import { IntegrationError } from '../functions/_integration/errors.js'
import { SupabaseIntegrationRepository } from '../functions/_integration/repository.js'
import { projectCorrectionSchema, projectPatchSchema } from '../functions/_integration/schemas.js'
import { IntegrationService, mapProjectPatch } from '../functions/_integration/service.js'

const GEORGE_ID = '11111111-1111-4111-8111-111111111111'
const STRATFORD_ID = '22222222-2222-4222-8222-222222222222'
const OTHER_GEORGE_ID = '33333333-3333-4333-8333-333333333333'
const PAYMENT_ID = '44444444-4444-4444-8444-444444444444'
const TASK_ID = '55555555-5555-4555-8555-555555555555'
const EVENT_ID = '66666666-6666-4666-8666-666666666666'
const PROFILE_ID = '77777777-7777-4777-8777-777777777777'

const baseProject = (id, name, postcode, title = 'Property Refurbishment') => ({
  id, client_id: crypto.randomUUID(), client: { id: crypto.randomUUID(), name, phone: '', email: '' }, assignee: null,
  title, project_type: 'Refurbishment', description: '', status: 'In Progress', address: '1 Test Road', postcode,
  start_date: '2026-07-01', end_date: '2026-08-01', estimated_duration: '4 weeks', assigned_to: null,
  contract_value_pence: 1000000, amount_paid_pence: 0, outstanding_balance_pence: 1000000,
  access_notes: '', parking_notes: '', key_status: 'Not collected', internal_notes: '', next_action: 'Continue', scope: [], provisional: false,
  created_at: '2026-07-01T09:00:00.000Z', updated_at: '2026-07-01T09:00:00.000Z',
})

class MemoryRepository {
  constructor({ duplicateGeorge = false } = {}) {
    this.tables = {
      projects: [baseProject(GEORGE_ID, 'George Brown', 'SE18 7RU'), baseProject(STRATFORD_ID, 'Emma Stone', 'E15 1QF', 'Stratford Renovation')],
      tasks: [{ id: TASK_ID, project_id: GEORGE_ID, title: 'Old task', due_date: '2026-07-01', assigned_to: null, priority: 'Low', completed: false, created_at: '2026-07-01T09:00:00.000Z', updated_at: '2026-07-01T09:00:00.000Z' }],
      payments: [{ id: PAYMENT_ID, project_id: GEORGE_ID, title: 'Final payment', percentage: 50, amount_pence: 500000, due_date: '2026-07-10', paid_date: null, status: 'Due', invoice_reference: '', notes: '', created_at: '2026-07-01T09:00:00.000Z', updated_at: '2026-07-01T09:00:00.000Z' }],
      project_events: [], journal_entries: [], activity_logs: [],
    }
    if (duplicateGeorge) this.tables.projects.push(baseProject(OTHER_GEORGE_ID, 'George Smith', 'SE18 7RU', 'Kitchen Works'))
  }
  async projects() { return structuredClone(this.tables.projects) }
  async project(id) { return structuredClone(this.tables.projects.find((row) => row.id === id) || null) }
  async projectBundle(id) { return { project: await this.project(id), tasks: await this.rows('tasks', 'project_id', id), payments: await this.rows('payments', 'project_id', id), journal: await this.rows('journal_entries', 'project_id', id), events: await this.rows('project_events', 'project_id', id) } }
  async rows(table, column, value) { return structuredClone((this.tables[table] || []).filter((row) => !column || row[column] === value)) }
  async row(table, id) { return structuredClone((this.tables[table] || []).find((row) => row.id === id) || null) }
  async profiles() { return [{ id: PROFILE_ID, display_name: 'Konstantinos Test', email: 'test@example.com' }] }
  async insert(table, values) {
    const row = { id: table === 'project_events' ? EVENT_ID : crypto.randomUUID(), created_at: new Date().toISOString(), ...structuredClone(values) }
    this.tables[table].push(row)
    return structuredClone(row)
  }
  async update(table, id, values) {
    const row = this.tables[table].find((item) => item.id === id)
    if (!row) return null
    Object.assign(row, structuredClone(values))
    return structuredClone(row)
  }
  async audit(values) { return this.insert('activity_logs', values) }
  setContext(context) { this.context = { ...this.context, ...context } }
  async rpc(name, values) {
    assert.equal(name, 'apply_integration_project_correction')
    this.lastRpc = structuredClone(values)
    const project = this.tables.projects.find((row) => row.id === values.target_project_id)
    Object.assign(project, {
      address: values.project_patch.address,
      postcode: values.project_patch.postcode,
      title: values.project_patch.title,
      description: values.project_patch.description,
      scope: values.project_patch.scope,
      contract_value_pence: values.project_patch.contractValuePence,
      end_date: values.project_patch.endDate,
      status: values.project_patch.status,
      next_action: values.project_patch.nextAction,
    })
    const upsertPayment = (title, patch, status) => {
      let payment = this.tables.payments.find((row) => row.project_id === project.id && row.title.toLowerCase() === title.toLowerCase())
      if (!payment) {
        payment = { id: crypto.randomUUID(), project_id: project.id, title, created_at: new Date().toISOString() }
        this.tables.payments.push(payment)
      }
      Object.assign(payment, { amount_pence: patch.amountPence, percentage: patch.percentage, status })
      if (title === 'Final payment') Object.assign(payment, { due_date: patch.dueDate, paid_date: null })
      return payment
    }
    const deposit = upsertPayment('Deposit', values.deposit_patch, 'Paid')
    const finalPayment = upsertPayment('Final payment', values.final_payment_patch, 'Due')
    project.amount_paid_pence = deposit.amount_pence
    project.outstanding_balance_pence = Math.max(0, project.contract_value_pence - deposit.amount_pence)
    return { projectId: project.id, depositId: deposit.id, finalPaymentId: finalPayment.id }
  }
}

const request = (path, { method = 'GET', key = 'test-key', body } = {}) => new Request(`https://www.ictinuscontractors.co.uk/api/integration${path}`, {
  method,
  headers: { ...(key === null ? {} : { authorization: `Bearer ${key}` }), ...(body ? { 'content-type': 'application/json' } : {}) },
  body: body ? JSON.stringify(body) : undefined,
})

const invoke = async (path, options = {}, repository = new MemoryRepository()) => {
  const response = await handleIntegrationRequest({ request: request(path, options), env: { ICTINUS_INTEGRATION_API_KEY: 'test-key' }, service: new IntegrationService(repository) })
  return { response, json: await response.json(), repository }
}

test('accepts the valid API key and rejects missing or invalid keys', async () => {
  assert.equal((await invoke('/projects')).response.status, 200)
  assert.equal((await invoke('/projects', { key: null })).response.status, 401)
  assert.equal((await invoke('/projects', { key: 'wrong' })).response.status, 401)
})

test('resolves projects by postcode, name, and name plus postcode', async () => {
  const service = new IntegrationService(new MemoryRepository())
  assert.equal((await service.resolveProject('SE18 7RU')).id, GEORGE_ID)
  assert.equal((await service.resolveProject('George')).id, GEORGE_ID)
  assert.equal((await service.resolveProject('George – SE18 7RU')).id, GEORGE_ID)
})

test('returns a structured ambiguity response and never guesses', async () => {
  const result = await invoke('/projects/resolve?name=George&postcode=SE18%207RU', {}, new MemoryRepository({ duplicateGeorge: true }))
  assert.equal(result.response.status, 409)
  assert.equal(result.json.error.code, 'AMBIGUOUS_PROJECT')
  assert.equal(result.json.error.matches.length, 2)
})

test('updates a project and requires confirmation for completion', async () => {
  const repository = new MemoryRepository()
  const normal = await invoke(`/projects/${GEORGE_ID}`, { method: 'PATCH', body: { nextAction: 'Final inspection' } }, repository)
  assert.equal(normal.json.data.result.nextAction, 'Final inspection')
  const rejected = await invoke(`/projects/${GEORGE_ID}`, { method: 'PATCH', body: { status: 'Completed' } }, repository)
  assert.equal(rejected.json.error.code, 'CONFIRMATION_REQUIRED')
  const accepted = await invoke(`/projects/${GEORGE_ID}`, { method: 'PATCH', body: { status: 'Completed', confirmed: true } }, repository)
  assert.equal(accepted.json.data.result.status, 'Completed')
})

test('creates and updates tasks, including human assignee resolution', async () => {
  const repository = new MemoryRepository()
  const created = await invoke(`/projects/${GEORGE_ID}/tasks`, { method: 'POST', body: { title: 'Order tiles', dueDate: '2026-07-25', priority: 'high', assignedTo: 'Konstantinos' } }, repository)
  assert.equal(created.response.status, 201)
  assert.equal(created.json.data.result.priority, 'High')
  assert.equal(created.json.data.result.assignedTo, PROFILE_ID)
  const updated = await invoke(`/tasks/${TASK_ID}`, { method: 'PATCH', body: { completed: true } }, repository)
  assert.equal(updated.json.data.result.status, 'Completed')
})

test('creates payments and enforces confirmation when marking paid', async () => {
  const repository = new MemoryRepository()
  const created = await invoke(`/projects/${GEORGE_ID}/payments`, { method: 'POST', body: { title: 'Stage payment', amount: 1750, dueDate: '2026-07-25', status: 'pending' } }, repository)
  assert.equal(created.response.status, 201)
  assert.equal(created.json.data.result.amount, 1750)
  const rejected = await invoke(`/payments/${PAYMENT_ID}`, { method: 'PATCH', body: { status: 'paid' } }, repository)
  assert.equal(rejected.json.error.code, 'CONFIRMATION_REQUIRED')
  const accepted = await invoke(`/payments/${PAYMENT_ID}`, { method: 'PATCH', body: { status: 'paid', paidDate: '2026-07-21', confirmed: true } }, repository)
  assert.equal(accepted.json.data.result.status, 'Paid')
})

test('creates journal entries and events database-first', async () => {
  const repository = new MemoryRepository()
  const journal = await invoke(`/projects/${GEORGE_ID}/journal`, { method: 'POST', body: { category: 'client', message: 'Colours approved.' } }, repository)
  assert.equal(journal.response.status, 201)
  assert.equal(journal.json.data.result.category, 'Client')
  const event = await invoke(`/projects/${GEORGE_ID}/events`, { method: 'POST', body: { type: 'Site visit', title: 'Final inspection', startDate: '2026-07-25T09:00:00+01:00', endDate: '2026-07-25T10:00:00+01:00' } }, repository)
  assert.equal(event.response.status, 201)
  assert.equal(event.json.data.result.calendarSync, 'not_configured')
  assert.equal(repository.tables.project_events.length, 1)
})

test('logs every mutation with integration actor metadata and before/after values', async () => {
  const repository = new MemoryRepository()
  await invoke(`/projects/${GEORGE_ID}`, { method: 'PATCH', body: { nextAction: 'Call client' } }, repository)
  const log = repository.tables.activity_logs[0]
  assert.equal(log.actor_type, 'integration')
  assert.equal(log.actor_name, 'ChatGPT')
  assert.equal(log.source, 'chatgpt_integration')
  assert.equal(log.action, 'project.updated')
  assert.equal(log.previous_values.next_action, 'Continue')
  assert.equal(log.new_values.next_action, 'Call client')
})

test('returns field validation errors and blocks unsupported permissions', async () => {
  const invalid = await invoke(`/projects/${GEORGE_ID}/payments`, { method: 'POST', body: { title: 'Bad', amount: -1, dueDate: 'bad-date' } })
  assert.equal(invalid.response.status, 422)
  assert.equal(invalid.json.error.code, 'VALIDATION_ERROR')
  assert.ok(invalid.json.error.fields.amount)
  const deletion = await invoke(`/projects/${GEORGE_ID}`, { method: 'DELETE' })
  assert.equal(deletion.response.status, 404)
})

test('normalises canonical project statuses and rejects unsupported project fields', () => {
  assert.equal(projectPatchSchema.parse({ status: 'in_progress' }).status, 'In Progress')
  assert.throws(() => projectPatchSchema.parse({ amountPaid: 750 }), /Unrecognized key/)
})

test('maps only allow-listed project fields and never maps derived financial totals', () => {
  const mapped = mapProjectPatch({ title: 'Interior Repairs', contractValue: 2500, amountPaid: 750, outstandingBalance: 1750 }, '2026-07-20T12:00:00.000Z')
  assert.deepEqual(mapped, { title: 'Interior Repairs', contract_value_pence: 250000, updated_at: '2026-07-20T12:00:00.000Z' })
  assert.equal('amount_paid_pence' in mapped, false)
  assert.equal('outstanding_balance_pence' in mapped, false)
})

test('keeps the project correction atomic, payment-driven, and idempotent', async () => {
  const repository = new MemoryRepository()
  repository.tables.projects.find((row) => row.id === STRATFORD_ID).client.name = 'Stratford'
  const service = new IntegrationService(repository)
  const input = projectCorrectionSchema.parse({
    projectId: STRATFORD_ID,
    address: '17 Waddington Road, London E15 1QF', postcode: 'E15 1QF', title: 'Interior Repairs & Repainting',
    description: 'Repairs and repainting following water damage, covering two bedrooms, hallway and utility cupboard.',
    scope: ['Repairs and repainting following water damage, covering two bedrooms, hallway and utility cupboard.'],
    contractValue: 2500, endDate: '2026-07-21', status: 'in_progress',
    nextAction: 'Complete final inspection and collect the £1,750 final payment.',
    deposit: { amount: 750, percentage: 30 }, finalPayment: { amount: 1750, percentage: 70, dueDate: '2026-07-21' }, confirmed: true,
  })
  const first = await service.applyProjectFinancialCorrection(input)
  const second = await service.applyProjectFinancialCorrection(input)
  assert.equal(first.depositId, second.depositId)
  assert.equal(first.finalPaymentId, second.finalPaymentId)
  assert.equal(repository.tables.payments.filter((row) => row.project_id === STRATFORD_ID && /^(deposit|final payment)$/i.test(row.title)).length, 2)
  assert.equal(repository.lastRpc.project_patch.status, 'In Progress')
  assert.equal('amountPaidPence' in repository.lastRpc.project_patch, false)
  assert.equal('outstandingBalancePence' in repository.lastRpc.project_patch, false)
  assert.equal(repository.tables.projects.find((row) => row.id === STRATFORD_ID).outstanding_balance_pence, 175000)
})

test('returns a safe database error with correlation metadata and no request values', async () => {
  const error = new IntegrationError('DATABASE_ERROR', 'Project update failed.', 500, { requestId: 'request-safe', step: 'activity_log_insert' })
  const repository = new MemoryRepository()
  repository.update = async () => { throw error }
  const result = await invoke(`/projects/${GEORGE_ID}`, { method: 'PATCH', body: { nextAction: 'private client detail' } }, repository)
  assert.equal(result.response.status, 500)
  assert.equal(result.json.error.code, 'DATABASE_ERROR')
  assert.equal(result.json.error.step, 'activity_log_insert')
  assert.equal(JSON.stringify(result.json).includes('private client detail'), false)
})

test('classifies the broken audit trigger as an activity-log database failure', async () => {
  const terminal = { maybeSingle: async () => ({ data: null, error: { code: '42703', message: 'record "new" has no field "project_id"' } }) }
  const chain = { eq: () => chain, select: () => terminal }
  const client = { from: () => ({ update: () => chain }) }
  const repository = new SupabaseIntegrationRepository(client)
  repository.setContext({ requestId: 'request-123', operationId: 'updateProject', route: 'PATCH /projects/id', projectId: GEORGE_ID })
  await assert.rejects(repository.update('projects', GEORGE_ID, { next_action: 'x' }), (error) => {
    assert.equal(error.code, 'DATABASE_ERROR')
    assert.deepEqual(error.details, { requestId: 'request-123', step: 'activity_log_insert' })
    return true
  })
})

test('publishes a valid OpenAPI 3.1 document with unique safe operation IDs', async () => {
  await SwaggerParser.validate(integrationOpenApi)
  assert.equal(integrationOpenApi.openapi, '3.1.0')
  const operations = Object.values(integrationOpenApi.paths).flatMap((path) => Object.values(path).map((operation) => operation.operationId))
  assert.equal(new Set(operations).size, operations.length)
  assert.ok(operations.includes('findProject'))
  assert.equal(Object.keys(integrationOpenApi.paths).some((path) => /delete|users|admin/i.test(path)), false)
})
