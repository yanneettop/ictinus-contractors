import { format, isValid, parseISO } from 'date-fns'

export const formatGBP = (value = 0) => new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(Number(value) || 0)
export const londonDateKey = (date = new Date()) => {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date).map((part) => [part.type, part.value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}
export const monthEndDateKey = (dateKey = londonDateKey()) => {
  const [year, month] = dateKey.split('-').map(Number)
  return new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10)
}
export const formatDate = (value, withTime = false) => {
  if (!value) return 'Not set'
  const date = typeof value === 'string' ? parseISO(value) : value
  return isValid(date) ? format(date, withTime ? 'd MMM yyyy, HH:mm' : 'd MMM yyyy') : 'Not set'
}
export const mapsUrl = (address, postcode) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address} ${postcode}`)}`
export const projectClient = (data, project) => data.clients.find((client) => client.id === project.clientId)
export const projectUser = (users, project) => users.find((user) => user.id === project.assignedTo)
export const paymentStatus = (payment, today = londonDateKey()) => payment.status === 'Paid' ? 'Paid' : payment.dueDate < today ? 'Overdue' : 'Due'
