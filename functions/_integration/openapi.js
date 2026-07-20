const errorSchema = {
  type: 'object',
  required: ['success', 'data', 'error'],
  properties: {
    success: { const: false },
    data: { type: 'null' },
    error: {
      type: 'object',
      required: ['code', 'message'],
      properties: {
        code: { type: 'string', examples: ['VALIDATION_ERROR'] },
        message: { type: 'string' },
        fields: { type: 'object', additionalProperties: { type: 'string' } },
        matches: { type: 'array', items: { $ref: '#/components/schemas/ProjectSummary' } },
      },
    },
  },
}

const successResponse = (description = 'Successful response.') => ({
  description,
  content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
})

const standardResponses = {
  400: { description: 'Invalid JSON or request.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
  401: { description: 'Missing or invalid integration API key.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
  404: { description: 'Entity not found.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
  409: { description: 'Confirmation required or project lookup is ambiguous.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
  422: { description: 'Validation failed.', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
}

const jsonBody = (schema, description) => ({
  required: true,
  description,
  content: { 'application/json': { schema } },
})

const projectParameter = { name: 'projectId', in: 'path', required: true, description: 'Project UUID, unique client name, postcode, or client name plus postcode.', schema: { type: 'string' }, examples: { uuid: { value: '00000000-0000-4000-8000-000000000001' }, friendly: { value: 'George – SE18 7RU' } } }
const entityParameter = (name, label) => ({ name, in: 'path', required: true, description: `${label} UUID.`, schema: { type: 'string', format: 'uuid' } })

const taskFields = {
  title: { type: 'string', minLength: 1, maxLength: 240 },
  dueDate: { type: 'string', format: 'date' },
  priority: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium' },
  assignedTo: { type: ['string', 'null'], description: 'Existing profile UUID or an unambiguous active team-member name.' },
  completed: { type: 'boolean', default: false },
}

const paymentFields = {
  title: { type: 'string', minLength: 1, maxLength: 240 },
  percentage: { type: 'number', minimum: 0, maximum: 100, default: 0 },
  amount: { type: 'number', exclusiveMinimum: 0, description: 'GBP amount, for example 1750 means £1,750.' },
  dueDate: { type: 'string', format: 'date' },
  paidDate: { type: ['string', 'null'], format: 'date' },
  status: { type: 'string', enum: ['due', 'pending', 'paid'], default: 'due' },
  invoiceReference: { type: 'string', maxLength: 120 },
  notes: { type: 'string', maxLength: 4000 },
  confirmed: { type: 'boolean', description: 'Required when marking a payment paid or changing the amount of a final payment.' },
}

const eventFields = {
  type: { type: 'string', minLength: 1, maxLength: 240 }, title: { type: 'string', minLength: 1, maxLength: 240 },
  startDate: { type: 'string', format: 'date-time' }, endDate: { type: 'string', format: 'date-time' },
  allDay: { type: 'boolean', default: false }, location: { type: 'string', maxLength: 500 }, notes: { type: 'string', maxLength: 4000 },
  colourCategory: { type: 'string', enum: ['green', 'blue', 'orange', 'red', 'purple', 'grey'], default: 'green' },
}
const leadParameter = entityParameter('leadId', 'Lead')
const leadFields = { clientName:{type:'string'},email:{type:'string',format:'email'},phone:{type:'string'},postcode:{type:'string'},fullAddress:{type:'string'},projectType:{type:'string'},enquirySummary:{type:'string'},estimatedValue:{type:'number',minimum:0},budget:{type:'number',minimum:0},stage:{type:'string',enum:['New','Contacted','Site Visit Booked','Site Visit Completed','Quote Preparing','Quote Sent','Follow-up Due','Negotiation','Won','Lost','Archived']},priority:{type:'string',enum:['Low','Normal','High','Urgent']},source:{type:'string'},sourceReference:{type:'string'},assignedTo:{type:['string','null'],format:'uuid'},preferredContactMethod:{type:'string'},preferredContactTime:{type:'string'},nextAction:{type:'string'},nextActionDueAt:{type:['string','null'],format:'date-time'},internalNotes:{type:'string'},barkCreditsSpent:{type:'number',minimum:0},confirmed:{type:'boolean'} }

export const integrationOpenApi = {
  openapi: '3.1.0',
  info: { title: 'Ictinus Job Manager Integration API', version: '1.0.0', description: 'Private, audited API for authorised ChatGPT Actions. Currency values are GBP and dates are ISO 8601 in the Europe/London business timezone.' },
  servers: [{ url: 'https://www.ictinuscontractors.co.uk/api/integration' }],
  security: [{ bearerAuth: [] }],
  paths: {
    '/leads': { get:{operationId:'listLeads',summary:'List leads',parameters:[{name:'stage',in:'query',schema:{type:'string'}},{name:'source',in:'query',schema:{type:'string'}},{name:'assignedTo',in:'query',schema:{type:'string',format:'uuid'}}],responses:{200:successResponse(),...standardResponses}},post:{operationId:'createLead',summary:'Create a lead',requestBody:jsonBody({type:'object',required:['clientName','projectType'],additionalProperties:false,properties:leadFields}),responses:{201:successResponse(),...standardResponses}} },
    '/leads/resolve': { get:{operationId:'resolveLead',summary:'Resolve one lead safely',parameters:[{name:'id',in:'query',schema:{type:'string',format:'uuid'}},{name:'name',in:'query',schema:{type:'string'}},{name:'postcode',in:'query',schema:{type:'string'}},{name:'phone',in:'query',schema:{type:'string'}},{name:'email',in:'query',schema:{type:'string'}}],responses:{200:successResponse(),...standardResponses}} },
    '/leads/follow-ups': {get:{operationId:'listLeadFollowUps',summary:'List lead follow-ups',responses:{200:successResponse(),...standardResponses}}},
    '/leads/overdue': {get:{operationId:'listOverdueLeadActions',summary:'List overdue lead actions',responses:{200:successResponse(),...standardResponses}}},
    '/leads/{leadId}': {get:{operationId:'getLead',summary:'Get lead and linked records',parameters:[leadParameter],responses:{200:successResponse(),...standardResponses}},patch:{operationId:'updateLead',summary:'Update a lead',parameters:[leadParameter],requestBody:jsonBody({type:'object',minProperties:1,additionalProperties:false,properties:leadFields}),responses:{200:successResponse(),...standardResponses}}},
    '/leads/{leadId}/communications': {post:{operationId:'logLeadCommunication',summary:'Log a communication (does not send it)',parameters:[leadParameter],requestBody:jsonBody({type:'object',required:['type','summary'],properties:{type:{type:'string'},direction:{type:'string'},occurredAt:{type:'string',format:'date-time'},summary:{type:'string'},note:{type:'string'},attachmentUrl:{type:'string',format:'uri'},externalLink:{type:'string',format:'uri'}}}),responses:{201:successResponse(),...standardResponses}}},
    '/leads/{leadId}/site-visits': {post:{operationId:'createLeadSiteVisit',summary:'Create a lead site visit',parameters:[leadParameter],requestBody:jsonBody({type:'object',required:['startDate'],properties:{startDate:{type:'string',format:'date-time'},endDate:{type:'string',format:'date-time'},notes:{type:'string'}}}),responses:{201:successResponse(),...standardResponses}}},
    '/leads/{leadId}/tasks': {post:{operationId:'createLeadTask',summary:'Create a lead task',parameters:[leadParameter],requestBody:jsonBody({type:'object',required:['title','dueDate'],properties:{title:{type:'string'},dueDate:{type:'string',format:'date'},priority:{type:'string'},assignedTo:{type:['string','null'],format:'uuid'}}}),responses:{201:successResponse(),...standardResponses}}},
    '/leads/{leadId}/convert': {post:{operationId:'convertLeadToProject',summary:'Convert a won lead to one project transactionally',parameters:[leadParameter],requestBody:jsonBody({type:'object',required:['startDate','endDate','confirmed'],properties:{title:{type:'string'},startDate:{type:'string',format:'date'},endDate:{type:'string',format:'date'},assignedTo:{type:['string','null'],format:'uuid'},contractValue:{type:'number'},confirmed:{const:true}}}),responses:{200:successResponse(),...standardResponses}}},
    '/leads/{leadId}/mark-lost': {post:{operationId:'markLeadLost',summary:'Mark a lead lost with a reason',parameters:[leadParameter],requestBody:jsonBody({type:'object',required:['reason','confirmed'],properties:{reason:{type:'string'},notes:{type:'string'},confirmed:{const:true}}}),responses:{200:successResponse(),...standardResponses}}},
    '/projects': { get: { operationId: 'listProjects', summary: 'List projects', parameters: [
      { name: 'name', in: 'query', schema: { type: 'string' }, description: 'Filter by client or project name.' },
      { name: 'postcode', in: 'query', schema: { type: 'string' } },
      { name: 'status', in: 'query', schema: { type: 'string' } },
    ], responses: { 200: successResponse(), ...standardResponses } } },
    '/projects/resolve': { get: { operationId: 'findProject', summary: 'Resolve one project safely', description: 'Returns one project, NOT_FOUND, or AMBIGUOUS_PROJECT. Never guesses.', parameters: [
      { name: 'name', in: 'query', schema: { type: 'string' } }, { name: 'postcode', in: 'query', schema: { type: 'string' } },
    ], responses: { 200: successResponse(), ...standardResponses } } },
    '/projects/{projectId}': {
      get: { operationId: 'getProject', summary: 'Get a project and its related records', parameters: [projectParameter], responses: { 200: successResponse(), ...standardResponses } },
      patch: { operationId: 'updateProject', summary: 'Update a project', description: 'confirmed:true is required for contract value changes, completing a project, or reopening a completed project.', parameters: [projectParameter], requestBody: jsonBody({ $ref: '#/components/schemas/ProjectPatch' }), responses: { 200: successResponse('Project updated and audited.'), ...standardResponses } },
    },
    '/projects/{projectId}/tasks': { post: { operationId: 'createProjectTask', summary: 'Create a project task', parameters: [projectParameter], requestBody: jsonBody({ $ref: '#/components/schemas/TaskCreate' }), responses: { 201: successResponse('Task created and audited.'), ...standardResponses } } },
    '/tasks/{taskId}': { patch: { operationId: 'updateTask', summary: 'Update a task', parameters: [entityParameter('taskId', 'Task')], requestBody: jsonBody({ type: 'object', additionalProperties: false, minProperties: 1, properties: taskFields }), responses: { 200: successResponse(), ...standardResponses } } },
    '/projects/{projectId}/payments': { post: { operationId: 'createProjectPayment', summary: 'Create a project payment', parameters: [projectParameter], requestBody: jsonBody({ $ref: '#/components/schemas/PaymentCreate' }), responses: { 201: successResponse('Payment created and audited.'), ...standardResponses } } },
    '/payments/{paymentId}': { patch: { operationId: 'updatePayment', summary: 'Update a payment', description: 'confirmed:true is required when marking paid or changing a final-payment amount.', parameters: [entityParameter('paymentId', 'Payment')], requestBody: jsonBody({ type: 'object', additionalProperties: false, minProperties: 1, properties: paymentFields }), responses: { 200: successResponse(), ...standardResponses } } },
    '/projects/{projectId}/journal': { post: { operationId: 'createJournalEntry', summary: 'Create a project journal entry', parameters: [projectParameter], requestBody: jsonBody({ $ref: '#/components/schemas/JournalCreate' }), responses: { 201: successResponse(), ...standardResponses } } },
    '/projects/{projectId}/events': { post: { operationId: 'createProjectEvent', summary: 'Create a project event', description: 'Writes to the app database first. calendarSync is not_configured until a real Google sync is available.', parameters: [projectParameter], requestBody: jsonBody({ $ref: '#/components/schemas/EventCreate' }), responses: { 201: successResponse(), ...standardResponses } } },
    '/events/{eventId}': { patch: { operationId: 'updateProjectEvent', summary: 'Update an existing event without creating a duplicate', parameters: [entityParameter('eventId', 'Event')], requestBody: jsonBody({ type: 'object', additionalProperties: false, minProperties: 1, properties: eventFields }), responses: { 200: successResponse(), ...standardResponses } } },
    '/dashboard': { get: { operationId: 'getDashboardSummary', summary: 'Get dashboard summary', responses: { 200: successResponse(), ...standardResponses } } },
    '/payments/outstanding': { get: { operationId: 'listOutstandingPayments', summary: 'List all unpaid payments', responses: { 200: successResponse(), ...standardResponses } } },
    '/payments/overdue': { get: { operationId: 'listOverduePayments', summary: 'List overdue unpaid payments', responses: { 200: successResponse(), ...standardResponses } } },
    '/tasks/overdue': { get: { operationId: 'listOverdueTasks', summary: 'List overdue incomplete tasks', responses: { 200: successResponse(), ...standardResponses } } },
  },
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'API key', description: 'Use the private ICTINUS_INTEGRATION_API_KEY.' } },
    schemas: {
      SuccessResponse: { type: 'object', required: ['success', 'data', 'error'], properties: { success: { const: true }, data: { type: 'object', required: ['message', 'result'], properties: { message: { type: 'string' }, result: {} } }, error: { type: 'null' } } },
      ErrorResponse: errorSchema,
      ProjectSummary: { type: 'object', properties: { id: { type: 'string', format: 'uuid' }, clientName: { type: 'string' }, title: { type: 'string' }, postcode: { type: 'string' }, status: { type: 'string' } } },
      ProjectLookup: { type: 'object', additionalProperties: false, properties: { id: { type: 'string', format: 'uuid' }, name: { type: 'string' }, clientName: { type: 'string' }, postcode: { type: 'string' } }, anyOf: [{ required: ['id'] }, { required: ['name'] }, { required: ['clientName'] }, { required: ['postcode'] }] },
      ProjectPatch: { type: 'object', additionalProperties: false, minProperties: 1, properties: { project: { $ref: '#/components/schemas/ProjectLookup' }, title: { type: 'string' }, projectType: { type: 'string' }, description: { type: 'string' }, status: { type: 'string', enum: ['Enquiry', 'Quoted', 'Confirmed', 'Scheduled', 'In Progress', 'On Hold', 'Completed', 'Cancelled'] }, address: { type: 'string' }, postcode: { type: 'string' }, startDate: { type: 'string', format: 'date' }, endDate: { type: 'string', format: 'date' }, estimatedDuration: { type: 'string' }, contractValue: { type: 'number', minimum: 0 }, accessNotes: { type: 'string' }, parkingNotes: { type: 'string' }, keyStatus: { type: 'string' }, internalNotes: { type: 'string' }, nextAction: { type: 'string' }, scope: { type: 'array', items: { type: 'string' } }, provisional: { type: 'boolean' }, confirmed: { type: 'boolean', description: 'Required for sensitive project changes.' } } },
      TaskCreate: { type: 'object', additionalProperties: false, required: ['title', 'dueDate'], properties: { project: { $ref: '#/components/schemas/ProjectLookup' }, ...taskFields }, examples: [{ project: { name: 'George', postcode: 'SE18 7RU' }, title: 'Order bathroom tiles', dueDate: '2026-07-25', priority: 'high' }] },
      PaymentCreate: { type: 'object', additionalProperties: false, required: ['title', 'amount', 'dueDate'], properties: { project: { $ref: '#/components/schemas/ProjectLookup' }, ...paymentFields }, examples: [{ title: 'Final payment', amount: 1750, dueDate: '2026-07-21', status: 'pending' }] },
      JournalCreate: { type: 'object', additionalProperties: false, required: ['message'], properties: { project: { $ref: '#/components/schemas/ProjectLookup' }, category: { type: 'string', enum: ['General', 'Client', 'Materials', 'Payments', 'Site', 'Issue', 'Variation', 'Completion'], default: 'General' }, message: { type: 'string', minLength: 1, maxLength: 10000 } }, examples: [{ category: 'Client', message: 'Client approved the final paint colours.' }] },
      EventCreate: { type: 'object', additionalProperties: false, required: ['type', 'title', 'startDate', 'endDate'], properties: { project: { $ref: '#/components/schemas/ProjectLookup' }, ...eventFields } },
    },
  },
}
