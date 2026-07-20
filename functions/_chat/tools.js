import { IntegrationError } from '../_integration/errors.js'
import { eventCreateSchema, journalCreateSchema, paymentCreateSchema, paymentPatchSchema, projectPatchSchema, taskCreateSchema, taskPatchSchema } from '../_integration/schemas.js'

const projectReference = { type: 'string', description: 'Project UUID, client name, postcode, or client name plus postcode.' }

const definitions = [
  { type: 'function', name: 'list_projects', description: 'List or filter Ictinus projects.', parameters: { type: 'object', additionalProperties: false, properties: { name: { type: 'string' }, postcode: { type: 'string' }, status: { type: 'string' } } } },
  { type: 'function', name: 'get_project', description: 'Get one project and its tasks, events, journal and permitted financial information.', parameters: { type: 'object', additionalProperties: false, required: ['projectId'], properties: { projectId: projectReference } } },
  { type: 'function', name: 'get_dashboard', description: 'Get a current operational dashboard summary.', parameters: { type: 'object', additionalProperties: false, properties: {} } },
  { type: 'function', name: 'list_outstanding_payments', description: 'List all unpaid payments. Administrators only.', parameters: { type: 'object', additionalProperties: false, properties: { overdueOnly: { type: 'boolean' } } } },
  { type: 'function', name: 'list_overdue_tasks', description: 'List overdue incomplete tasks.', parameters: { type: 'object', additionalProperties: false, properties: {} } },
  { type: 'function', name: 'update_project', description: 'Update an existing project. Sensitive changes require confirmed=true.', parameters: { type: 'object', additionalProperties: false, required: ['projectId'], properties: { projectId: projectReference, title: { type: 'string' }, projectType: { type: 'string' }, description: { type: 'string' }, status: { type: 'string' }, address: { type: 'string' }, postcode: { type: 'string' }, startDate: { type: 'string', format: 'date' }, endDate: { type: 'string', format: 'date' }, estimatedDuration: { type: 'string' }, contractValue: { type: 'number' }, accessNotes: { type: 'string' }, parkingNotes: { type: 'string' }, keyStatus: { type: 'string' }, internalNotes: { type: 'string' }, nextAction: { type: 'string' }, provisional: { type: 'boolean' }, confirmed: { type: 'boolean' } } } },
  { type: 'function', name: 'create_task', description: 'Create a project task.', parameters: { type: 'object', additionalProperties: false, required: ['projectId', 'title', 'dueDate'], properties: { projectId: projectReference, title: { type: 'string' }, dueDate: { type: 'string', format: 'date' }, priority: { type: 'string', enum: ['low', 'medium', 'high'] }, assignedTo: { type: ['string', 'null'] }, completed: { type: 'boolean' } } } },
  { type: 'function', name: 'update_task', description: 'Update or complete a task.', parameters: { type: 'object', additionalProperties: false, required: ['taskId'], properties: { taskId: { type: 'string', format: 'uuid' }, title: { type: 'string' }, dueDate: { type: 'string', format: 'date' }, priority: { type: 'string', enum: ['low', 'medium', 'high'] }, assignedTo: { type: ['string', 'null'] }, completed: { type: 'boolean' } } } },
  { type: 'function', name: 'create_payment', description: 'Create a project payment. Administrators only.', parameters: { type: 'object', additionalProperties: false, required: ['projectId', 'title', 'amount', 'dueDate'], properties: { projectId: projectReference, title: { type: 'string' }, percentage: { type: 'number' }, amount: { type: 'number' }, dueDate: { type: 'string', format: 'date' }, paidDate: { type: ['string', 'null'], format: 'date' }, status: { type: 'string', enum: ['due', 'pending', 'paid'] }, invoiceReference: { type: 'string' }, notes: { type: 'string' }, confirmed: { type: 'boolean' } } } },
  { type: 'function', name: 'update_payment', description: 'Update or mark a payment paid. Administrators only; sensitive changes require confirmed=true.', parameters: { type: 'object', additionalProperties: false, required: ['paymentId'], properties: { paymentId: { type: 'string', format: 'uuid' }, title: { type: 'string' }, percentage: { type: 'number' }, amount: { type: 'number' }, dueDate: { type: 'string', format: 'date' }, paidDate: { type: ['string', 'null'], format: 'date' }, status: { type: 'string', enum: ['due', 'pending', 'paid'] }, invoiceReference: { type: 'string' }, notes: { type: 'string' }, confirmed: { type: 'boolean' } } } },
  { type: 'function', name: 'add_journal_entry', description: 'Add a journal note to a project.', parameters: { type: 'object', additionalProperties: false, required: ['projectId', 'message'], properties: { projectId: projectReference, category: { type: 'string' }, message: { type: 'string' } } } },
  { type: 'function', name: 'create_event', description: 'Add a site or project event to the live calendar.', parameters: { type: 'object', additionalProperties: false, required: ['projectId', 'type', 'title', 'startDate', 'endDate'], properties: { projectId: projectReference, type: { type: 'string' }, title: { type: 'string' }, startDate: { type: 'string', format: 'date-time' }, endDate: { type: 'string', format: 'date-time' }, allDay: { type: 'boolean' }, location: { type: 'string' }, notes: { type: 'string' }, colourCategory: { type: 'string', enum: ['green', 'blue', 'orange', 'red', 'purple', 'grey'] } } } },
]

const financialTools = new Set(['list_outstanding_payments', 'create_payment', 'update_payment'])
const operationalProjectFields = new Set(['status', 'accessNotes', 'parkingNotes', 'keyStatus', 'internalNotes', 'nextAction', 'confirmed'])

export function toolsForRole(role) {
  return role === 'administrator' ? definitions : definitions.filter((tool) => !financialTools.has(tool.name))
}

function redactFinancials(value) {
  if (Array.isArray(value)) return value.map(redactFinancials)
  if (!value || typeof value !== 'object') return value
  const redacted = {}
  const blocked = new Set(['contractValue', 'amountPaid', 'outstandingBalance', 'payments', 'financials', 'amount', 'percentage', 'invoiceReference', 'paidDate'])
  for (const [key, item] of Object.entries(value)) if (!blocked.has(key)) redacted[key] = redactFinancials(item)
  return redacted
}

const without = (object, keys) => Object.fromEntries(Object.entries(object).filter(([key]) => !keys.includes(key)))

export async function executeTool(service, role, name, rawArguments) {
  if (financialTools.has(name) && role !== 'administrator') throw new IntegrationError('FORBIDDEN', 'Financial chat actions require an administrator.', 403)

  let result
  if (name === 'list_projects') result = await service.listProjects(rawArguments)
  else if (name === 'get_project') result = await service.getProject(rawArguments.projectId)
  else if (name === 'get_dashboard') result = await service.dashboard()
  else if (name === 'list_outstanding_payments') result = await service.outstandingPayments(Boolean(rawArguments.overdueOnly))
  else if (name === 'list_overdue_tasks') result = await service.overdueTasks()
  else if (name === 'update_project') {
    const input = without(rawArguments, ['projectId'])
    if (role !== 'administrator' && Object.keys(input).some((key) => !operationalProjectFields.has(key))) throw new IntegrationError('FORBIDDEN', 'Site managers can only update operational project fields.', 403)
    result = await service.patchProject(rawArguments.projectId, projectPatchSchema.parse(input))
  } else if (name === 'create_task') result = await service.createTask(rawArguments.projectId, taskCreateSchema.parse(without(rawArguments, ['projectId'])))
  else if (name === 'update_task') result = await service.patchTask(rawArguments.taskId, taskPatchSchema.parse(without(rawArguments, ['taskId'])))
  else if (name === 'create_payment') result = await service.createPayment(rawArguments.projectId, paymentCreateSchema.parse(without(rawArguments, ['projectId'])))
  else if (name === 'update_payment') result = await service.patchPayment(rawArguments.paymentId, paymentPatchSchema.parse(without(rawArguments, ['paymentId'])))
  else if (name === 'add_journal_entry') result = await service.createJournal(rawArguments.projectId, journalCreateSchema.parse(without(rawArguments, ['projectId'])))
  else if (name === 'create_event') result = await service.createEvent(rawArguments.projectId, eventCreateSchema.parse(without(rawArguments, ['projectId'])))
  else throw new IntegrationError('UNKNOWN_TOOL', 'The requested operation is not available.', 400)

  return role === 'administrator' ? result : redactFinancials(result)
}

