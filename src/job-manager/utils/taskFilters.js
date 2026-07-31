const dateAtUtc = (dateKey) => new Date(`${dateKey}T00:00:00Z`)
const dateKey = (date) => date.toISOString().slice(0, 10)
const moveDays = (value, days) => {
  const date = dateAtUtc(value)
  date.setUTCDate(date.getUTCDate() + days)
  return dateKey(date)
}

export function taskDateRange(filter, today) {
  const current = dateAtUtc(today)
  const daysSinceMonday = (current.getUTCDay() + 6) % 7
  if (filter === 'This week') {
    const start = moveDays(today, -daysSinceMonday)
    return { start, end: moveDays(start, 6) }
  }
  if (filter === 'Next week') {
    const start = moveDays(today, 7 - daysSinceMonday)
    return { start, end: moveDays(start, 6) }
  }
  if (filter === 'This month') {
    const [year, month] = today.split('-').map(Number)
    return { start: `${today.slice(0, 7)}-01`, end: dateKey(new Date(Date.UTC(year, month, 0))) }
  }
  return null
}

export function taskMatchesFilter(task, filter, today) {
  if (filter === 'All') return true
  const operationalStatus = task.completed ? 'Completed' : task.dueDate < today ? 'Overdue' : 'Pending'
  if (['Pending', 'Overdue', 'Completed'].includes(filter)) return operationalStatus === filter
  const range = taskDateRange(filter, today)
  return Boolean(range && task.dueDate >= range.start && task.dueDate <= range.end)
}
