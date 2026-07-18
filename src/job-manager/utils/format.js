import { format, isValid, parseISO } from 'date-fns'

export const formatGBP = (value = 0) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(Number(value) || 0)
export const formatDate = (value, withTime = false) => {
  if (!value) return 'Not set'
  const date = typeof value === 'string' ? parseISO(value) : value
  return isValid(date) ? format(date, withTime ? 'd MMM yyyy, HH:mm' : 'd MMM yyyy') : 'Not set'
}
export const mapsUrl = (address, postcode) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address} ${postcode}`)}`
export const projectClient = (data, project) => data.clients.find((client) => client.id === project.clientId)
export const projectUser = (users, project) => users.find((user) => user.id === project.assignedTo)
export const paymentStatus = (payment, today = '2026-07-18') => payment.status === 'Paid' ? 'Paid' : payment.dueDate < today ? 'Overdue' : 'Due'
