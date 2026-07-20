import { IntegrationError } from './errors.js'

function constraintFromError(error) {
  return error?.message?.match(/constraint "([^"]+)"/i)?.[1] || null
}

function mutationStep(error, operation) {
  const message = error?.message || ''
  if (/record "new" has no field "project_id"|audit_service_role_mutation|activity_logs/i.test(message)) return 'activity_log_insert'
  return operation.replaceAll(' ', '_')
}

function assertResult(result, operation, context = {}) {
  if (!result.error) return result.data
  const step = mutationStep(result.error, operation)
  console.error('Integration database operation failed', JSON.stringify({
    requestId: context.requestId,
    operationId: context.operationId,
    route: context.route,
    projectId: context.projectId,
    mutationStep: step,
    databaseCode: result.error.code || 'unknown',
    safeMessage: result.error.message || 'Database request failed',
    constraint: constraintFromError(result.error),
    activityLogFailure: step === 'activity_log_insert',
  }))
  const label = operation.startsWith('update projects') ? 'Project update failed.' : 'The database operation failed.'
  throw new IntegrationError('DATABASE_ERROR', label, 500, { requestId: context.requestId, step })
}

export class SupabaseIntegrationRepository {
  constructor(client) {
    this.client = client
    this.databaseAuditsMutations = true
    this.context = {}
  }

  setContext(context) { this.context = { ...this.context, ...context } }

  async projects() {
    return assertResult(
      await this.client.from('projects').select('*, client:clients(*), assignee:profiles!projects_assigned_to_fkey(id, display_name, email)').order('created_at', { ascending: false }),
      'list projects', this.context,
    )
  }

  async project(id) {
    return assertResult(
      await this.client.from('projects').select('*, client:clients(*), assignee:profiles!projects_assigned_to_fkey(id, display_name, email)').eq('id', id).maybeSingle(),
      'get project', this.context,
    )
  }

  async projectBundle(id) {
    const [project, tasks, payments, journal, events] = await Promise.all([
      this.project(id),
      this.rows('tasks', 'project_id', id),
      this.rows('payments', 'project_id', id),
      this.rows('journal_entries', 'project_id', id),
      this.rows('project_events', 'project_id', id),
    ])
    return { project, tasks, payments, journal, events }
  }

  async rows(table, column, value) {
    let query = this.client.from(table).select('*')
    if (column) query = query.eq(column, value)
    return assertResult(await query, `list ${table}`, this.context)
  }

  async row(table, id) {
    return assertResult(await this.client.from(table).select('*').eq('id', id).maybeSingle(), `get ${table}`, this.context)
  }

  async profiles() {
    return assertResult(await this.client.from('profiles').select('id, display_name, email').eq('active', true), 'list profiles')
  }

  async insert(table, values) {
    return assertResult(await this.client.from(table).insert(values).select('*').single(), `insert ${table}`, this.context)
  }

  async update(table, id, values) {
    return assertResult(await this.client.from(table).update(values).eq('id', id).select('*').maybeSingle(), `update ${table}`, this.context)
  }

  async audit(values) {
    return this.insert('activity_logs', values)
  }

  async rpc(name, values) {
    return assertResult(await this.client.rpc(name, values), `rpc ${name}`, this.context)
  }
}
