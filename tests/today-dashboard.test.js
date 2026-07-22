import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { buildTodayDashboard, calculateProjectHealth, dashboardQuickActions } from '../src/job-manager/utils/todayDashboard.js'

const today = '2026-07-22'
const base = () => ({
  clients: [{ id: 'client-1', name: 'Emma' }],
  projects: [{ id: 'project-1', clientId: 'client-1', title: 'Painting', status: 'In Progress', postcode: 'E15 2DB', startDate: '2026-07-20', endDate: '2026-07-30', nextAction: 'Awaiting client colour approval' }],
  tasks: [], payments: [], events: [], leads: [], activities: [], journalEntries: [], documents: [],
})

test('dashboard aggregates today, overdue, schedule, follow-ups and upcoming records', () => {
  const data = base()
  data.tasks.push({ id: 'late-task', projectId: 'project-1', title: 'Order paint', dueDate: '2026-07-20', completed: false }, { id: 'today-task', projectId: 'project-1', title: 'Protect floors', dueDate: today, completed: false })
  data.payments.push({ id: 'late-payment', projectId: 'project-1', title: 'Deposit', amount: 900, dueDate: '2026-07-19', status: 'Due' })
  data.events.push({ id: 'visit', projectId: 'project-1', type: 'Site visit', title: 'Emma – E15', startDate: '2026-07-22T09:00:00Z', endDate: '2026-07-22T10:00:00Z' })
  data.leads.push({ id: 'lead-1', clientName: 'Kris', stage: 'Quote Sent', nextAction: 'Follow up quote', nextActionDueAt: '2026-07-21T10:00:00Z' })
  const dashboard = buildTodayDashboard(data, { today })
  assert.deepEqual(dashboard.summary, { activeProjects: 1, tasksDueToday: 1, overdueTasks: 1, outstandingPayments: 900, siteVisitsToday: 1, leadsRequiringFollowUp: 1 })
  assert.equal(dashboard.schedule[0].client, 'Emma')
  assert.equal(dashboard.attention.some((item) => item.reason === 'Quotation requires follow-up'), true)
})

test('priority ordering puts overdue payments before tasks, follow-ups, visits and today tasks', () => {
  const data = base()
  data.payments.push({ id: 'payment', projectId: 'project-1', title: 'Final payment', amount: 500, dueDate: '2026-07-21', status: 'Due' })
  data.tasks.push({ id: 'late', projectId: 'project-1', title: 'Late task', dueDate: '2026-07-21', completed: false }, { id: 'today', projectId: 'project-1', title: 'Today task', dueDate: today, completed: false })
  data.leads.push({ id: 'lead', clientName: 'Kris', stage: 'Quote Sent', nextAction: 'Call Kris', nextActionDueAt: '2026-07-21' })
  data.events.push({ id: 'visit', projectId: 'project-1', type: 'Site visit', title: 'Visit', startDate: `${today}T09:00:00Z`, endDate: `${today}T10:00:00Z` })
  assert.deepEqual(buildTodayDashboard(data, { today }).actionItems.map((item) => item.kind), ['payment', 'task', 'lead', 'event', 'task'])
})

test('project health uses transparent overdue, schedule, materials and approval rules', () => {
  const data = base()
  data.projects[0].endDate = '2026-07-21'
  data.tasks.push({ projectId: 'project-1', dueDate: '2026-07-20', completed: false })
  const health = calculateProjectHealth(data.projects[0], data, today)
  assert.equal(health.status, 'At Risk')
  assert.equal(health.reasons.includes('Schedule has passed its finish date'), true)
  assert.equal(health.reasons.includes('Client approval is outstanding'), true)
})

test('empty dashboard exposes zero summaries and no urgent actions', () => {
  const dashboard = buildTodayDashboard({ projects: [], clients: [], tasks: [], payments: [], events: [], leads: [], activities: [] }, { today })
  assert.equal(dashboard.actionItems.length, 0)
  assert.equal(dashboard.attention.length, 0)
  assert.equal(dashboard.summary.overdueTasks, 0)
})

test('permission visibility hides financial and CRM actions from site managers', () => {
  assert.deepEqual(dashboardQuickActions('site_manager'), ['Task', 'Site Note', 'Upload Photo'])
  assert.equal(dashboardQuickActions('administrator').includes('Payment'), true)
  assert.equal(dashboardQuickActions('administrator').includes('Lead'), true)
})

test('dashboard includes a phone layout with stacked cards and a floating action button', async () => {
  const [page, css] = await Promise.all([readFile(new URL('../src/job-manager/pages/DashboardPage.jsx', import.meta.url), 'utf8'), readFile(new URL('../src/job-manager/manager.css', import.meta.url), 'utf8')])
  assert.match(page, /jm-today-fab/)
  assert.match(css, /@media\(max-width:680px\)/)
  assert.match(css, /\.jm-today-summary\{grid-template-columns:1fr 1fr;/)
})
