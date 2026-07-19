import { IntegrationError } from './errors.js'

function assertResult(result, operation) {
  if (!result.error) return result.data
  console.error(`Integration database operation failed: ${operation}`, result.error.code || 'unknown')
  throw new IntegrationError('DATABASE_ERROR', 'The request could not be completed.', 500)
}

export class SupabaseIntegrationRepository {
  constructor(client) {
    this.client = client
    this.databaseAuditsMutations = true
  }

  async projects() {
    return assertResult(
      await this.client.from('projects').select('*, client:clients(*), assignee:profiles!projects_assigned_to_fkey(id, display_name, email)').order('created_at', { ascending: false }),
      'list projects',
    )
  }

  async project(id) {
    return assertResult(
      await this.client.from('projects').select('*, client:clients(*), assignee:profiles!projects_assigned_to_fkey(id, display_name, email)').eq('id', id).maybeSingle(),
      'get project',
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
    return assertResult(await query, `list ${table}`)
  }

  async row(table, id) {
    return assertResult(await this.client.from(table).select('*').eq('id', id).maybeSingle(), `get ${table}`)
  }

  async profiles() {
    return assertResult(await this.client.from('profiles').select('id, display_name, email').eq('active', true), 'list profiles')
  }

  async insert(table, values) {
    return assertResult(await this.client.from(table).insert(values).select('*').single(), `insert ${table}`)
  }

  async update(table, id, values) {
    return assertResult(await this.client.from(table).update(values).eq('id', id).select('*').maybeSingle(), `update ${table}`)
  }

  async audit(values) {
    return this.insert('activity_logs', values)
  }
}
