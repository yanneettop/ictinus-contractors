import { CheckCircle2, Clock3, CreditCard, TriangleAlert, WalletCards } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'
import { formatDate, formatGBP, paymentStatus, projectClient } from '../utils/format'
import { MetricCard, PageHeader } from '../components/UI'

const TODAY = '2026-07-18'
export default function PaymentsPage() {
  const { data, can, markPaymentPaid } = useJobManager(); const [filter, setFilter] = useState('All'); const [projectId, setProjectId] = useState('All'); const [from, setFrom] = useState(''); const [to, setTo] = useState('')
  const rows = useMemo(() => data.payments.map((payment) => ({ ...payment, computedStatus: paymentStatus(payment, TODAY) })).filter((payment) => (filter === 'All' || payment.computedStatus === filter) && (projectId === 'All' || payment.projectId === projectId) && (!from || payment.dueDate >= from) && (!to || payment.dueDate <= to)), [data, filter, projectId, from, to])
  const activeIds = data.projects.filter((project) => ['Confirmed', 'Scheduled', 'In Progress', 'On Hold'].includes(project.status)).map((project) => project.id)
  const contractTotal = data.projects.filter((project) => activeIds.includes(project.id)).reduce((sum, project) => sum + project.contractValue, 0)
  const received = data.payments.filter((payment) => payment.status === 'Paid').reduce((sum, payment) => sum + payment.amount, 0)
  const outstanding = data.payments.filter((payment) => payment.status !== 'Paid').reduce((sum, payment) => sum + payment.amount, 0)
  const dueSoon = data.payments.filter((payment) => payment.status !== 'Paid' && payment.dueDate >= TODAY && payment.dueDate <= '2026-07-31').reduce((sum, payment) => sum + payment.amount, 0)
  return <>
    <PageHeader eyebrow="Financial overview" title="Payments" description="Track every stage without losing sight of the job behind it." />
    <section className="jm-metrics"><MetricCard icon={WalletCards} label="Active contract value" value={formatGBP(contractTotal)} tone="neutral" /><MetricCard icon={CheckCircle2} label="Payments received" value={formatGBP(received)} tone="green" /><MetricCard icon={TriangleAlert} label="Outstanding" value={formatGBP(outstanding)} tone="red" /><MetricCard icon={Clock3} label="Due by month end" value={formatGBP(dueSoon)} tone="orange" /></section>
    <section className="jm-filter-bar jm-filter-bar--payments"><label><span>Payment status</span><select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option><option>Due</option><option>Overdue</option><option>Paid</option></select></label><label><span>Project</span><select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="All">All projects</option>{data.projects.map((project) => <option key={project.id} value={project.id}>{projectClient(data, project)?.name} · {project.postcode}</option>)}</select></label><label><span>From</span><input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label><label><span>To</span><input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label></section>
    <div className="jm-payment-cards">{rows.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((payment) => { const project = data.projects.find((item) => item.id === payment.projectId); return <article key={payment.id} className="jm-payment-card"><div className={`jm-payment-card-icon jm-payment-card-icon--${payment.computedStatus.toLowerCase()}`}><CreditCard size={20} /></div><div className="jm-payment-card-project"><Link to={`/job-manager/projects/${project.id}`}>{projectClient(data, project)?.name}</Link><span>{project.postcode} · {payment.title}</span></div><div><span>Amount</span><strong>{formatGBP(payment.amount)}</strong></div><div><span>Due date</span><strong>{formatDate(payment.dueDate)}</strong></div><div><span>Invoice</span><strong>{payment.invoiceReference}</strong></div><span className={`jm-payment-status jm-payment-status--${payment.computedStatus.toLowerCase()}`}>{payment.computedStatus}</span>{payment.computedStatus !== 'Paid' && can('edit_financials') && <button className="jm-button jm-button--small jm-button--secondary" onClick={() => markPaymentPaid(payment.id)}>Mark paid</button>}</article> })}</div>
  </>
}
