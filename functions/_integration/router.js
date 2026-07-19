import { ZodError } from 'zod'
import { IntegrationError } from './errors.js'
import { integrationOpenApi } from './openapi.js'
import { authenticateIntegration } from './security.js'
import { eventCreateSchema, eventPatchSchema, journalCreateSchema, paymentCreateSchema, paymentPatchSchema, projectPatchSchema, taskCreateSchema, taskPatchSchema } from './schemas.js'

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

  try {
    const url = new URL(request.url)
    if (request.method === 'GET' && path === '/projects') return success(await service.listProjects(Object.fromEntries(url.searchParams)), 'Projects retrieved.')
    if (request.method === 'GET' && path === '/projects/resolve') {
      const project = await service.resolveProject('', { name: url.searchParams.get('name') || undefined, postcode: url.searchParams.get('postcode') || undefined })
      return success(await service.getProject(project.id), 'Project resolved.')
    }
    if (request.method === 'GET' && path === '/dashboard') return success(await service.dashboard(), 'Dashboard summary retrieved.')
    if (request.method === 'GET' && path === '/payments/outstanding') return success(await service.outstandingPayments(false), 'Outstanding payments retrieved.')
    if (request.method === 'GET' && path === '/payments/overdue') return success(await service.outstandingPayments(true), 'Overdue payments retrieved.')
    if (request.method === 'GET' && path === '/tasks/overdue') return success(await service.overdueTasks(), 'Overdue tasks retrieved.')

    let match = path.match(/^\/projects\/([^/]+)$/)
    if (match && request.method === 'GET') return success(await service.getProject(match[1]), 'Project retrieved.')
    if (match && request.method === 'PATCH') return success(await service.patchProject(match[1], await body(request, projectPatchSchema)), 'Project updated.')

    match = path.match(/^\/projects\/([^/]+)\/tasks$/)
    if (match && request.method === 'POST') return success(await service.createTask(match[1], await body(request, taskCreateSchema)), 'Task created.', 201)
    match = path.match(/^\/tasks\/([^/]+)$/)
    if (match && request.method === 'PATCH') return success(await service.patchTask(match[1], await body(request, taskPatchSchema)), 'Task updated.')

    match = path.match(/^\/projects\/([^/]+)\/payments$/)
    if (match && request.method === 'POST') return success(await service.createPayment(match[1], await body(request, paymentCreateSchema)), 'Payment created.', 201)
    match = path.match(/^\/payments\/([^/]+)$/)
    if (match && request.method === 'PATCH') return success(await service.patchPayment(match[1], await body(request, paymentPatchSchema)), 'Payment updated.')

    match = path.match(/^\/projects\/([^/]+)\/journal$/)
    if (match && request.method === 'POST') return success(await service.createJournal(match[1], await body(request, journalCreateSchema)), 'Journal entry created.', 201)
    match = path.match(/^\/projects\/([^/]+)\/events$/)
    if (match && request.method === 'POST') return success(await service.createEvent(match[1], await body(request, eventCreateSchema)), 'Event created.', 201)
    match = path.match(/^\/events\/([^/]+)$/)
    if (match && request.method === 'PATCH') return success(await service.patchEvent(match[1], await body(request, eventPatchSchema)), 'Event updated.')

    return failure('NOT_FOUND', 'Integration endpoint not found.', 404)
  } catch (error) {
    if (error instanceof ZodError) return failure('VALIDATION_ERROR', 'Request validation failed.', 422, { fields: zodFields(error) })
    if (error instanceof IntegrationError) {
      const extra = error.details || {}
      if (error.code === 'AMBIGUOUS_PROJECT') return failure(error.code, error.message, error.status, { matches: extra.matches })
      return failure(error.code, error.message, error.status, Object.keys(extra).length ? { details: extra } : {})
    }
    console.error('Unhandled integration API error', error?.name || 'Error')
    return failure('INTERNAL_ERROR', 'The request could not be completed.', 500)
  }
}

