import { ZodError } from 'zod'
import { IntegrationError } from './errors.js'
import { integrationOpenApi } from './openapi.js'
import { authenticateIntegration } from './security.js'
import { eventCreateSchema, eventPatchSchema, journalCreateSchema, leadCommunicationSchema, leadConvertSchema, leadCreateSchema, leadLostSchema, leadPatchSchema, leadSiteVisitSchema, leadTaskSchema, paymentCreateSchema, paymentPatchSchema, projectPatchSchema, taskCreateSchema, taskPatchSchema } from './schemas.js'

const jsonHeaders = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' }
const success = (result, message, status = 200) => new Response(JSON.stringify({ success: true, data: { message, result }, error: null }), { status, headers: jsonHeaders })
const failure = (code, message, status, extra = {}) => new Response(JSON.stringify({ success: false, data: null, error: { code, message, ...extra } }), { status, headers: jsonHeaders })

function zodFields(error) {
  return Object.fromEntries(error.issues.map((issue) => [issue.path.join('.') || 'body', issue.message]))
}

async function body(request, schema) {
  const contentType = request.headers.get('content-type') || ''
  if (!contentType.toLowerCase().includes('application/json')) throw new IntegrationError('UNSUPPORTED_MEDIA_TYPE', 'Use Content-Type: application/json.', 415)
  let value
  try { value = await request.json() } catch { throw new IntegrationError('INVALID_JSON', 'The request body is not valid JSON.', 400) }
  return schema.parse(value)
}

function routePath(request) {
  const pathname = new URL(request.url).pathname
  return pathname.slice('/api/integration'.length).replace(/\/+$/, '') || '/'
}

export async function handleIntegrationRequest({ request, env, service }) {
  const path = routePath(request)
  if (request.method === 'GET' && path === '/openapi.json') {
    return new Response(JSON.stringify(integrationOpenApi), { status: 200, headers: { ...jsonHeaders, 'cache-control': 'public, max-age=300' } })
  }
  if (!authenticateIntegration(request, env)) return failure('UNAUTHORIZED', 'Missing or invalid integration API key.', 401)

  const requestId = crypto.randomUUID()
  const operation = (operationId) => service.setRequestContext({ requestId, operationId, route: `${request.method} ${path}` })

  try {
    const url = new URL(request.url)
    if (request.method === 'GET' && path === '/projects') { operation('listProjects'); return success(await service.listProjects(Object.fromEntries(url.searchParams)), 'Projects retrieved.') }
    if (request.method === 'GET' && path === '/projects/resolve') {
      operation('findProject'); const project = await service.resolveProject('', { name: url.searchParams.get('name') || undefined, postcode: url.searchParams.get('postcode') || undefined })
      return success(await service.getProject(project.id), 'Project resolved.')
    }
    if (request.method === 'GET' && path === '/dashboard') { operation('getTodayDashboard'); return success(await service.dashboard(), 'Today Dashboard retrieved.') }
    if (request.method === 'GET' && path === '/payments/outstanding') { operation('listOutstandingPayments'); return success(await service.outstandingPayments(false), 'Outstanding payments retrieved.') }
    if (request.method === 'GET' && path === '/payments/overdue') { operation('listOverduePayments'); return success(await service.outstandingPayments(true), 'Overdue payments retrieved.') }
    if (request.method === 'GET' && path === '/tasks/overdue') { operation('listOverdueTasks'); return success(await service.overdueTasks(), 'Overdue tasks retrieved.') }
    if (request.method === 'GET' && path === '/leads') { operation('listLeads'); return success(await service.listLeads(Object.fromEntries(url.searchParams)), 'Leads retrieved.') }
    if (request.method === 'POST' && path === '/leads') { operation('createLead'); return success(await service.createLead(await body(request, leadCreateSchema)), 'Lead created.', 201) }
    if (request.method === 'GET' && path === '/leads/resolve') { operation('resolveLead'); const lead = await service.resolveLead('', Object.fromEntries(url.searchParams)); return success(await service.getLead(lead.id), 'Lead resolved.') }
    if (request.method === 'GET' && path === '/leads/follow-ups') { operation('listLeadFollowUps'); return success(await service.leadFollowUps(false), 'Lead follow-ups retrieved.') }
    if (request.method === 'GET' && path === '/leads/overdue') { operation('listOverdueLeadActions'); return success(await service.leadFollowUps(true), 'Overdue lead actions retrieved.') }

    let leadMatch = path.match(/^\/leads\/([^/]+)$/)
    if (leadMatch && request.method === 'GET') { operation('getLead'); return success(await service.getLead(leadMatch[1]), 'Lead retrieved.') }
    if (leadMatch && request.method === 'PATCH') { operation('updateLead'); return success(await service.patchLead(leadMatch[1], await body(request, leadPatchSchema)), 'Lead updated.') }
    leadMatch = path.match(/^\/leads\/([^/]+)\/communications$/)
    if (leadMatch && request.method === 'POST') { operation('logLeadCommunication'); return success(await service.logLeadCommunication(leadMatch[1], await body(request, leadCommunicationSchema)), 'Communication logged.', 201) }
    leadMatch = path.match(/^\/leads\/([^/]+)\/site-visits$/)
    if (leadMatch && request.method === 'POST') { operation('createLeadSiteVisit'); return success(await service.createLeadSiteVisit(leadMatch[1], await body(request, leadSiteVisitSchema)), 'Site visit created.', 201) }
    leadMatch = path.match(/^\/leads\/([^/]+)\/tasks$/)
    if (leadMatch && request.method === 'POST') { operation('createLeadTask'); return success(await service.createLeadTask(leadMatch[1], await body(request, leadTaskSchema)), 'Lead task created.', 201) }
    leadMatch = path.match(/^\/leads\/([^/]+)\/convert$/)
    if (leadMatch && request.method === 'POST') { operation('convertLeadToProject'); return success(await service.convertLead(leadMatch[1], await body(request, leadConvertSchema)), 'Lead converted.') }
    leadMatch = path.match(/^\/leads\/([^/]+)\/mark-lost$/)
    if (leadMatch && request.method === 'POST') { operation('markLeadLost'); return success(await service.markLeadLost(leadMatch[1], await body(request, leadLostSchema)), 'Lead marked lost.') }

    let match = path.match(/^\/projects\/([^/]+)$/)
    if (match && request.method === 'GET') { operation('getProject'); return success(await service.getProject(match[1]), 'Project retrieved.') }
    if (match && request.method === 'PATCH') { operation('updateProject'); return success(await service.patchProject(match[1], await body(request, projectPatchSchema)), 'Project updated.') }

    match = path.match(/^\/projects\/([^/]+)\/tasks$/)
    if (match && request.method === 'POST') { operation('createProjectTask'); return success(await service.createTask(match[1], await body(request, taskCreateSchema)), 'Task created.', 201) }
    match = path.match(/^\/tasks\/([^/]+)$/)
    if (match && request.method === 'PATCH') { operation('updateTask'); return success(await service.patchTask(match[1], await body(request, taskPatchSchema)), 'Task updated.') }

    match = path.match(/^\/projects\/([^/]+)\/payments$/)
    if (match && request.method === 'POST') { operation('createProjectPayment'); return success(await service.createPayment(match[1], await body(request, paymentCreateSchema)), 'Payment created.', 201) }
    match = path.match(/^\/payments\/([^/]+)$/)
    if (match && request.method === 'PATCH') { operation('updatePayment'); return success(await service.patchPayment(match[1], await body(request, paymentPatchSchema)), 'Payment updated.') }

    match = path.match(/^\/projects\/([^/]+)\/journal$/)
    if (match && request.method === 'POST') { operation('createJournalEntry'); return success(await service.createJournal(match[1], await body(request, journalCreateSchema)), 'Journal entry created.', 201) }
    match = path.match(/^\/projects\/([^/]+)\/events$/)
    if (match && request.method === 'POST') { operation('createProjectEvent'); return success(await service.createEvent(match[1], await body(request, eventCreateSchema)), 'Event created.', 201) }
    match = path.match(/^\/events\/([^/]+)$/)
    if (match && request.method === 'PATCH') { operation('updateProjectEvent'); return success(await service.patchEvent(match[1], await body(request, eventPatchSchema)), 'Event updated.') }

    return failure('NOT_FOUND', 'Integration endpoint not found.', 404)
  } catch (error) {
    if (error instanceof ZodError) return failure('VALIDATION_ERROR', 'Request validation failed.', 422, { fields: zodFields(error) })
    if (error instanceof IntegrationError) {
      const extra = error.details || {}
      if (error.code === 'AMBIGUOUS_PROJECT') return failure(error.code, error.message, error.status, { matches: extra.matches })
      if (error.code === 'AMBIGUOUS_LEAD') return failure(error.code, error.message, error.status, { matches: extra.matches })
      if (error.code === 'DATABASE_ERROR') return failure(error.code, error.message, error.status, { requestId: extra.requestId || requestId, step: extra.step || 'database_transaction' })
      return failure(error.code, error.message, error.status, Object.keys(extra).length ? { details: extra } : {})
    }
    console.error('Unhandled integration API error', error?.name || 'Error')
    return failure('INTERNAL_ERROR', 'The request could not be completed.', 500)
  }
}
