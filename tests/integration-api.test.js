import assert from 'node:assert/strict'
import test from 'node:test'
import SwaggerParser from '@apidevtools/swagger-parser'
import { integrationOpenApi } from '../functions/_integration/openapi.js'
import { handleIntegrationRequest } from '../functions/_integration/router.js'
import { IntegrationService } from '../functions/_integration/service.js'

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

test('publishes a valid OpenAPI 3.1 document with unique safe operation IDs', async () => {
  await SwaggerParser.validate(integrationOpenApi)
  assert.equal(integrationOpenApi.openapi, '3.1.0')
  const operations = Object.values(integrationOpenApi.paths).flatMap((path) => Object.values(path).map((operation) => operation.operationId))
  assert.equal(new Set(operations).size, operations.length)
  assert.ok(operations.includes('findProject'))
  assert.equal(Object.keys(integrationOpenApi.paths).some((path) => /delete|users|admin/i.test(path)), false)
})

