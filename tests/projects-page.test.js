import assert from 'node:assert/strict'
import test from 'node:test'
import { isCompletedProject, unpaidFinalPayment } from '../src/job-manager/utils/projects.js'

test('separates only Completed projects from the active pipeline', () => {
  assert.equal(isCompletedProject({ status: 'Completed' }), true)
  assert.equal(isCompletedProject({ status: 'In Progress' }), false)
  assert.equal(isCompletedProject({ status: 'On Hold' }), false)
})

test('finds an unpaid final payment and preserves its due date', () => {
  const data = { payments: [
    { id: 'deposit', projectId: 'project-1', title: 'Deposit', status: 'Paid', dueDate: '2026-07-01' },
    { id: 'final', projectId: 'project-1', title: 'Final payment', status: 'Due', dueDate: '2026-08-15' },
    { id: 'other', projectId: 'project-2', title: 'Final payment', status: 'Due', dueDate: '2026-09-01' },
  ] }
  assert.deepEqual(unpaidFinalPayment(data, 'project-1'), data.payments[1])
  assert.equal(unpaidFinalPayment(data, 'project-1').dueDate, '2026-08-15')
})

test('does not flag paid final payments or non-final stages', () => {
  assert.equal(unpaidFinalPayment({ payments: [{ projectId: 'project-1', title: 'Final payment', status: 'Paid', dueDate: '2026-08-15' }] }, 'project-1'), null)
  assert.equal(unpaidFinalPayment({ payments: [{ projectId: 'project-1', title: 'Stage payment', status: 'Due', dueDate: '2026-08-15' }] }, 'project-1'), null)
})
