import assert from 'node:assert/strict'
import { createClient } from '@supabase/supabase-js'
import { SupabaseIntegrationRepository } from '../functions/_integration/repository.js'
import { handleIntegrationRequest } from '../functions/_integration/router.js'
import { projectCorrectionSchema } from '../functions/_integration/schemas.js'
import { IntegrationService } from '../functions/_integration/service.js'

const projectId = '7742c853-98c3-43e7-a0d0-84a694363f3c'
const client = createClient('https://tgzluhuipfxetpuhwcmv.supabase.co', process.env.SUPABASE_SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
const repository = new SupabaseIntegrationRepository(client)
const service = new IntegrationService(repository)
service.setRequestContext({ requestId: crypto.randomUUID(), operationId: 'correctStratfordProject', route: 'internal atomic correction', projectId })

const correction = projectCorrectionSchema.parse({
  projectId,
  address: '17 Waddington Road, London E15 1QF',
  postcode: 'E15 1QF',
  title: 'Interior Repairs & Repainting',
  description: 'Repairs and repainting following water damage, covering two bedrooms, hallway and utility cupboard.',
  scope: ['Repairs and repainting following water damage, covering two bedrooms, hallway and utility cupboard.'],
  contractValue: 2500,
  endDate: '2026-07-21',
  status: 'in_progress',
  nextAction: 'Complete final inspection and collect the £1,750 final payment.',
  deposit: { amount: 750, percentage: 30 },
  finalPayment: { amount: 1750, percentage: 70, dueDate: '2026-07-21' },
  confirmed: true,
})

// Allow for small clock skew between the workstation and Postgres.
const startedAt = new Date(Date.now() - 60_000).toISOString()
const first = await service.applyProjectFinancialCorrection(correction)
const second = await service.applyProjectFinancialCorrection(correction)
assert.equal(first.depositId, second.depositId)
assert.equal(first.finalPaymentId, second.finalPaymentId)

// Exercise the same authenticated PATCH/GET handler deployed to production,
// against the production database, without printing or rotating the live key.
const verificationKey = crypto.randomUUID()
const integrationRequest = (path, method = 'GET', requestBody) => new Request(`https://www.ictinuscontractors.co.uk/api/integration${path}`, {
  method,
  headers: { authorization: `Bearer ${verificationKey}`, ...(requestBody ? { 'content-type': 'application/json' } : {}) },
  body: requestBody ? JSON.stringify(requestBody) : undefined,
})
const patchResponse = await handleIntegrationRequest({
  request: integrationRequest(`/projects/${projectId}`, 'PATCH', {
    address: correction.address, postcode: correction.postcode, title: correction.title,
    description: correction.description, scope: correction.scope, contractValue: correction.contractValue,
    endDate: correction.endDate, status: 'in_progress', nextAction: correction.nextAction, confirmed: true,
  }),
  env: { ICTINUS_INTEGRATION_API_KEY: verificationKey }, service,
})
assert.equal(patchResponse.status, 200)
const patchResult = await patchResponse.json()
assert.equal(patchResult.data.result.outstandingBalance, 1750)
const getResponse = await handleIntegrationRequest({ request: integrationRequest(`/projects/${projectId}`), env: { ICTINUS_INTEGRATION_API_KEY: verificationKey }, service })
assert.equal(getResponse.status, 200)
const getResult = await getResponse.json()
const dashboardResponse = await handleIntegrationRequest({ request: integrationRequest('/dashboard'), env: { ICTINUS_INTEGRATION_API_KEY: verificationKey }, service })
assert.equal(dashboardResponse.status, 200)
const dashboardResult = await dashboardResponse.json()

const { data: project, error: projectError } = await client.from('projects').select('id,title,description,address,postcode,status,end_date,contract_value_pence,amount_paid_pence,outstanding_balance_pence,next_action,scope,client:clients(name)').eq('id', projectId).single()
if (projectError) throw projectError
const { data: payments, error: paymentError } = await client.from('payments').select('id,title,percentage,amount_pence,due_date,paid_date,status,invoice_reference').eq('project_id', projectId).order('title')
if (paymentError) throw paymentError
const { data: logs, error: logError } = await client.from('activity_logs').select('id,action,entity_type,entity_id,actor_type,actor_name,source,created_at').eq('project_id', projectId).gte('created_at', startedAt).order('created_at')
if (logError) throw logError

assert.equal(project.client.name, 'Stratford')
assert.equal(project.address, correction.address)
assert.equal(project.postcode, correction.postcode)
assert.equal(project.title, correction.title)
assert.equal(project.description, correction.description)
assert.deepEqual(project.scope, correction.scope)
assert.equal(project.contract_value_pence, 250000)
assert.equal(project.amount_paid_pence, 75000)
assert.equal(project.outstanding_balance_pence, 175000)
assert.equal(project.end_date, correction.endDate)
assert.equal(project.status, 'In Progress')
assert.equal(project.next_action, correction.nextAction)

const depositRows = payments.filter((payment) => payment.title.trim().toLowerCase() === 'deposit')
const finalRows = payments.filter((payment) => payment.title.trim().toLowerCase() === 'final payment')
assert.equal(depositRows.length, 1)
assert.equal(finalRows.length, 1)
assert.deepEqual({ amount: depositRows[0].amount_pence, percentage: Number(depositRows[0].percentage), status: depositRows[0].status }, { amount: 75000, percentage: 30, status: 'Paid' })
assert.ok(depositRows[0].paid_date)
assert.deepEqual({ amount: finalRows[0].amount_pence, percentage: Number(finalRows[0].percentage), status: finalRows[0].status, dueDate: finalRows[0].due_date, paidDate: finalRows[0].paid_date }, { amount: 175000, percentage: 70, status: 'Due', dueDate: '2026-07-21', paidDate: null })
assert.ok(logs.length >= 10)
assert.ok(logs.every((log) => log.actor_type === 'integration' && log.actor_name === 'ChatGPT' && log.source === 'chatgpt_integration'))

console.log(JSON.stringify({
  idempotent: true,
  project,
  payments,
  correctionActivityLogs: logs.length,
  paymentIds: { deposit: first.depositId, finalPayment: first.finalPaymentId },
  apiProject: getResult.data.result,
  dashboard: dashboardResult.data.result,
}, null, 2))
