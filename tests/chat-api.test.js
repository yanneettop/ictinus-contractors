import assert from 'node:assert/strict'
import test from 'node:test'
import { authenticateChatUser } from '../functions/_chat/auth.js'
import { runChat } from '../functions/_chat/service.js'
import { executeTool, toolsForRole } from '../functions/_chat/tools.js'

function authClient({ valid = true, active = true, role = 'administrator' } = {}) {
  return {
    auth: { async getUser() { return valid ? { data: { user: { id: 'user-1' } }, error: null } : { data: { user: null }, error: new Error('invalid') } } },
    from() { return { select() { return this }, eq() { return this }, async maybeSingle() { return { data: active ? { id: 'user-1', display_name: 'Ioannis', role, active } : null, error: null } } } },
  }
}

test('chat authentication rejects invalid sessions and inactive profiles', async () => {
  assert.equal((await authenticateChatUser(authClient({ valid: false }), 'bad')).error.status, 401)
  assert.equal((await authenticateChatUser(authClient({ active: false }), 'token')).error.status, 403)
  assert.equal((await authenticateChatUser(authClient(), 'token')).profile.role, 'administrator')
})

test('site managers do not receive financial tools', () => {
  const siteTools = toolsForRole('site_manager').map((tool) => tool.name)
  assert.equal(siteTools.includes('list_outstanding_payments'), false)
  assert.equal(siteTools.includes('create_payment'), false)
  assert.equal(toolsForRole('administrator').some((tool) => tool.name === 'create_payment'), true)
  assert.equal(siteTools.includes('create_lead'), false)
  assert.equal(toolsForRole('administrator').some((tool) => tool.name === 'create_lead'), true)
})

test('site managers cannot execute financial or protected project mutations', async () => {
  const service = { outstandingPayments: async () => [], patchProject: async () => ({}) }
  await assert.rejects(() => executeTool(service, 'site_manager', 'list_outstanding_payments', {}), (error) => error.code === 'FORBIDDEN')
  await assert.rejects(() => executeTool(service, 'site_manager', 'update_project', { projectId: 'George', contractValue: 5000 }), (error) => error.code === 'FORBIDDEN')
  await assert.rejects(() => executeTool(service, 'site_manager', 'create_lead', { clientName: 'Alex', projectType: 'Painting' }), (error) => error.code === 'FORBIDDEN')
})

test('administrator assistant can create a validated CRM lead', async () => {
  let received
  const service = { createLead: async (input) => { received = input; return { id: 'lead-1', ...input, duplicateWarning: null } } }
  const result = await executeTool(service, 'administrator', 'create_lead', { clientName: 'Alex Example', projectType: 'Interior Painting', phone: '07111 111111', priority: 'High', source: 'Referral' })
  assert.equal(received.clientName, 'Alex Example')
  assert.equal(received.stage, 'New')
  assert.equal(result.id, 'lead-1')
})

test('site manager project reads redact financial values', async () => {
  const service = { getProject: async () => ({ id: 'project-1', title: 'Test', contractValue: 1000, payments: [{ amount: 500 }], nextAction: 'Visit site' }) }
  const result = await executeTool(service, 'site_manager', 'get_project', { projectId: 'Test' })
  assert.equal(result.contractValue, undefined)
  assert.equal(result.payments, undefined)
  assert.equal(result.nextAction, 'Visit site')
})

test('site manager dashboard hides financial priorities while retaining operational work', async () => {
  const service = { dashboard: async () => ({ summary: { activeProjects: 2, outstandingPayments: 900 }, counts: { overduePayments: 1 }, actionItems: [{ id: 'payment', kind: 'payment', adminOnly: true, title: 'Invoice overdue' }, { id: 'task', kind: 'task', title: 'Protect floors' }], health: [{ projectId: 'one', reasons: ['1 overdue payment', '2 overdue tasks'] }] }) }
  const result = await executeTool(service, 'site_manager', 'get_dashboard', {})
  assert.equal(result.summary.outstandingPayments, undefined)
  assert.equal(result.counts.overduePayments, undefined)
  assert.deepEqual(result.actionItems.map((item) => item.kind), ['task'])
  assert.deepEqual(result.health[0].reasons, ['2 overdue tasks'])
})

test('chat completes an OpenAI function-call loop and returns action metadata', async () => {
  const originalFetch = globalThis.fetch
  let call = 0
  const requests = []
  globalThis.fetch = async (_url, options) => {
    call += 1
    requests.push(JSON.parse(options.body))
    const payload = call === 1
      ? { id: 'resp-1', output: [{ type: 'function_call', name: 'list_overdue_tasks', call_id: 'call-1', arguments: '{}' }] }
      : { id: 'resp-2', output_text: 'There are no overdue tasks.', output: [] }
    return new Response(JSON.stringify(payload), { status: 200, headers: { 'content-type': 'application/json' } })
  }
  try {
    const result = await runChat({ apiKey: 'secret', model: 'test-model', role: 'site_manager', userName: 'Ioannis', messages: [{ role: 'user', content: 'Any overdue tasks?' }], service: { overdueTasks: async () => [] } })
    assert.equal(result.message, 'There are no overdue tasks.')
    assert.deepEqual(result.actions, [{ name: 'list_overdue_tasks', success: true }])
    assert.equal(call, 2)
    assert.ok(requests.every((payload) => payload.instructions.includes('Never put ** around words.')))
    assert.ok(requests.every((payload) => payload.instructions.includes('warm, natural and practical tone')))
  } finally { globalThis.fetch = originalFetch }
})
