export const isCompletedProject = (project) => project.status === 'Completed'

export function finalPayment(data, projectId) {
  return (data.payments || [])
    .filter((payment) => payment.projectId === projectId && /\bfinal\b/i.test(payment.title || ''))
    .sort((first, second) => (second.dueDate || '').localeCompare(first.dueDate || ''))[0] || null
}

export function unpaidFinalPayment(data, projectId) {
  const payment = finalPayment(data, projectId)
  return payment && payment.status !== 'Paid' ? payment : null
}
