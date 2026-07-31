import assert from 'node:assert/strict'
import test from 'node:test'
import { taskDateRange, taskMatchesFilter } from '../src/job-manager/utils/taskFilters.js'

const today = '2026-07-31' // Friday

test('uses Monday-to-Sunday ranges for this week and next week', () => {
  assert.deepEqual(taskDateRange('This week', today), { start: '2026-07-27', end: '2026-08-02' })
  assert.deepEqual(taskDateRange('Next week', today), { start: '2026-08-03', end: '2026-08-09' })
})

test('uses the complete London calendar month for this month', () => {
  assert.deepEqual(taskDateRange('This month', today), { start: '2026-07-01', end: '2026-07-31' })
  assert.deepEqual(taskDateRange('This month', '2028-02-10'), { start: '2028-02-01', end: '2028-02-29' })
})

test('matches task due dates against the selected period', () => {
  assert.equal(taskMatchesFilter({ dueDate: '2026-08-02', completed: false }, 'This week', today), true)
  assert.equal(taskMatchesFilter({ dueDate: '2026-08-03', completed: false }, 'This week', today), false)
  assert.equal(taskMatchesFilter({ dueDate: '2026-08-03', completed: false }, 'Next week', today), true)
  assert.equal(taskMatchesFilter({ dueDate: '2026-07-01', completed: true }, 'This month', today), true)
})

test('preserves the existing status filters', () => {
  assert.equal(taskMatchesFilter({ dueDate: '2026-07-30', completed: false }, 'Overdue', today), true)
  assert.equal(taskMatchesFilter({ dueDate: '2026-08-01', completed: false }, 'Pending', today), true)
  assert.equal(taskMatchesFilter({ dueDate: '2026-07-01', completed: true }, 'Completed', today), true)
})
