import { CalendarCheck, CheckCircle2, CircleDollarSign, ClipboardCheck, FileText, KeyRound, MessageSquareText, Pencil, PlusCircle } from 'lucide-react'
import { formatDate, formatGBP, paymentStatus } from '../utils/format'

const activityIcon = (action) => {
  if (/payment|deposit|invoice/i.test(action)) return CircleDollarSign
  if (/task/i.test(action)) return ClipboardCheck
  if (/document|photo/i.test(action)) return FileText
  if (/journal|note/i.test(action)) return MessageSquareText
  if (/key/i.test(action)) return KeyRound
  if (/edit|status/i.test(action)) return Pencil
  if (/complete/i.test(action)) return CheckCircle2
  return PlusCircle
}

export function ProjectTimeline({ activities, events, payments }) {
  const items = [
    ...activities.map((item) => ({ id: item.id, date: item.createdAt, title: item.action, type: 'activity' })),
    ...events.map((item) => ({ id: item.id, date: item.startDate, title: item.type, detail: item.notes, type: item.colourCategory })),
    ...payments.map((item) => ({ id: `timeline-${item.id}`, date: item.paidDate || item.dueDate, title: `${item.title} ${item.status === 'Paid' ? 'received' : 'due'}`, detail: formatGBP(item.amount), type: paymentStatus(item).toLowerCase() })),
  ].sort((a, b) => a.date.localeCompare(b.date))
  return <section className="jm-detail-card"><div className="jm-card-heading"><div><h2>Project timeline</h2><p>Milestones and scheduled history.</p></div><span>Oldest first</span></div><div className="jm-timeline jm-timeline--expanded">{items.map((item) => { const Icon = item.type === 'activity' ? activityIcon(item.title) : CalendarCheck; return <div key={`${item.type}-${item.id}`}><span className={`jm-timeline-icon jm-timeline-icon--${item.type}`}><Icon size={14} /></span><div><small>{formatDate(item.date, item.date.includes('T'))}</small><strong>{item.title}</strong>{item.detail && <p>{item.detail}</p>}</div></div> })}</div></section>
}

export function ActivityFeed({ activities, users }) {
  const sorted = activities.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return <section className="jm-detail-card"><div className="jm-card-heading"><h2>Activity feed</h2><span>Automatic</span></div><div className="jm-activity-feed">{sorted.map((activity) => { const Icon = activityIcon(activity.action); const actor = users.find((user) => user.id === activity.userId); return <div key={activity.id}><span><Icon size={14} /></span><div><strong>{activity.action}</strong><small>{formatDate(activity.createdAt, true)} · {actor?.name}</small></div></div> })}</div></section>
}
