import { AlertTriangle, CalendarClock, CheckCircle2, CircleDollarSign, FileText, Image, ListChecks, TimerReset } from 'lucide-react'
import { differenceInCalendarDays, isAfter, isBefore, parseISO, startOfDay } from 'date-fns'
import { formatDate, formatGBP, londonDateKey, paymentStatus } from '../utils/format'
import { ProgressBar } from './UI'

const today = () => startOfDay(new Date())

export function getScheduleMetrics(project) {
  const start = parseISO(project.startDate); const end = parseISO(project.endDate); const now = today()
  const totalDays = Math.max(1, differenceInCalendarDays(end, start) + 1)
  const elapsedDays = isBefore(now, start) ? 0 : Math.min(totalDays, differenceInCalendarDays(now, start) + 1)
  const percentage = project.status === 'Completed' ? 100 : Math.max(0, Math.min(100, Math.round((elapsedDays / totalDays) * 100)))
  const remainingDays = isAfter(now, end) ? 0 : Math.max(0, differenceInCalendarDays(end, now))
  return { totalDays, elapsedDays, percentage, remainingDays }
}

export function ProjectProgress({ project }) {
  const metrics = getScheduleMetrics(project)
  return <div className="jm-project-progress"><div className="jm-project-progress-title"><span>Project progress</span><strong>{metrics.percentage}%</strong></div><div className="jm-project-progress-bar" role="progressbar" aria-valuenow={metrics.percentage} aria-valuemin="0" aria-valuemax="100"><span style={{ width: `${metrics.percentage}%` }} /></div><div className="jm-project-progress-dates"><div><span>Started</span><strong>{formatDate(project.startDate)}</strong></div><div><span>Estimated completion</span><strong>{formatDate(project.endDate)}</strong></div><div><span>Remaining</span><strong>{metrics.remainingDays} days</strong></div></div></div>
}

export function FinancialControlCard({ project, payments, canEdit, onMarkPaid }) {
  const paidPercentage = project.contractValue ? Math.round((project.amountPaid / project.contractValue) * 100) : 0
  return <section className="jm-financial-control"><div className="jm-financial-totals"><div><span>Contract</span><strong>{formatGBP(project.contractValue)}</strong></div><div><span>Paid</span><strong>{formatGBP(project.amountPaid)}</strong></div><div><span>Outstanding</span><strong>{formatGBP(project.outstandingBalance)}</strong></div><div className="jm-financial-progress"><span>Payment progress</span><ProgressBar paid={project.amountPaid} total={project.contractValue} /><b>{paidPercentage}%</b></div></div><div className="jm-financial-stages">{payments.map((payment) => { const status = paymentStatus(payment); return <div key={payment.id}><span className={`jm-stage-state jm-stage-state--${status.toLowerCase()}`}>{status === 'Paid' ? <CheckCircle2 size={15} /> : <CircleDollarSign size={15} />}</span><div><strong>{payment.title}</strong><small>{status === 'Paid' ? `Paid ${formatDate(payment.paidDate)}` : `${status} ${formatDate(payment.dueDate)}`}</small></div><b>{formatGBP(payment.amount)}</b>{status !== 'Paid' && canEdit && <button onClick={() => onMarkPaid(payment.id)}>Mark paid</button>}</div> })}</div></section>
}

export function ProjectHealthCard({ project, tasks, payments }) {
  const todayIso = londonDateKey()
  const overdueTasks = tasks.filter((task) => !task.completed && task.dueDate < todayIso).length
  const latePayments = payments.filter((payment) => paymentStatus(payment, todayIso) === 'Overdue').length
  const lateCompletion = project.status !== 'Completed' && project.endDate < todayIso
  const score = overdueTasks + latePayments + (lateCompletion ? 2 : 0)
  const health = score >= 3 ? { level: 'Red', text: 'Delayed. Immediate action required.', tone: 'red' } : score > 0 ? { level: 'Amber', text: `${score} item${score === 1 ? '' : 's'} need attention.`, tone: 'amber' } : { level: 'Green', text: 'Everything on schedule.', tone: 'green' }
  return <section className="jm-detail-card jm-health-card"><div className="jm-card-heading"><h2>Project health</h2><AlertTriangle size={18} /></div><div className={`jm-health jm-health--${health.tone}`}><span /><div><strong>{health.level}</strong><p>{health.text}</p></div></div>{score > 0 && <small>{overdueTasks} overdue task{overdueTasks === 1 ? '' : 's'} · {latePayments} late payment{latePayments === 1 ? '' : 's'}</small>}</section>
}

export function ProjectMetrics({ project, tasks, payments, photos, documents }) {
  const schedule = getScheduleMetrics(project); const completedTasks = tasks.filter((task) => task.completed).length; const completedPayments = payments.filter((payment) => payment.status === 'Paid').length
  const metrics = [
    [TimerReset, 'Days running', schedule.elapsedDays], [CalendarClock, 'Days remaining', schedule.remainingDays], [CheckCircle2, 'Tasks completed', completedTasks],
    [ListChecks, 'Tasks remaining', tasks.length - completedTasks], [CircleDollarSign, 'Payments completed', completedPayments], [Image, 'Photos uploaded', photos.length], [FileText, 'Documents uploaded', documents.length],
  ]
  return <section className="jm-detail-card"><div className="jm-card-heading"><h2>Project metrics</h2><span>Live</span></div><div className="jm-project-metrics">{metrics.map(([Icon, label, value]) => <div key={label}><Icon size={16} /><span>{label}</span><strong>{value}</strong></div>)}</div></section>
}

export function PaymentHistory({ payments, canEdit, onMarkPaid }) {
  return <section className="jm-detail-card"><div className="jm-card-heading"><div><h2>Payment history</h2><p>All contract payment stages.</p></div><span>{payments.length} stages</span></div><div className="jm-payment-history">{payments.map((payment) => { const status = paymentStatus(payment); return <article key={payment.id}><div><strong>{payment.title}</strong><span>{payment.percentage ? `${payment.percentage}% · ` : ''}{payment.invoiceReference}</span></div><strong>{formatGBP(payment.amount)}</strong><div><span>Due</span><strong>{formatDate(payment.dueDate)}</strong></div><div><span>Paid</span><strong>{payment.paidDate ? formatDate(payment.paidDate) : 'Pending'}</strong></div><span className={`jm-payment-status jm-payment-status--${status.toLowerCase()}`}>{status}</span>{payment.notes && <p>{payment.notes}</p>}{status !== 'Paid' && canEdit && <button onClick={() => onMarkPaid(payment.id)}>Mark paid</button>}</article> })}</div></section>
}
