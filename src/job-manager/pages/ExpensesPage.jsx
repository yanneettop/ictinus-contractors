import { Building2, FileCheck2, ReceiptPoundSterling, WalletCards } from 'lucide-react'
import { useMemo, useState } from 'react'
import ExpensesSection, { expenseCategories } from '../components/ExpensesSection'
import { MetricCard, PageHeader } from '../components/UI'
import { useJobManager } from '../context/JobManagerContext'
import { formatGBP, londonDateKey } from '../utils/format'

export default function ExpensesPage() {
  const { data, authMode, can, addExpense, uploadExpense, deleteExpense } = useJobManager()
  const [search, setSearch] = useState(''); const [category, setCategory] = useState('All'); const [projectId, setProjectId] = useState('All'); const [from, setFrom] = useState(''); const [to, setTo] = useState('')
  const month = londonDateKey().slice(0, 7)
  const rows = useMemo(() => (data.expenses || []).filter((expense) => {
    const project = data.projects.find((item) => item.id === expense.projectId)
    const haystack = `${expense.description} ${expense.supplier} ${expense.reference} ${expense.category} ${project?.title || ''} ${project?.postcode || ''}`.toLowerCase()
    return (!search || haystack.includes(search.toLowerCase())) && (category === 'All' || expense.category === category) && (projectId === 'All' || (projectId === 'general' ? !expense.projectId : expense.projectId === projectId)) && (!from || expense.date >= from) && (!to || expense.date <= to)
  }), [data.expenses, data.projects, search, category, projectId, from, to])
  const total = (data.expenses || []).reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const thisMonth = (data.expenses || []).filter((item) => item.date.startsWith(month)).reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const general = (data.expenses || []).filter((item) => !item.projectId).reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const receipts = (data.expenses || []).filter((item) => item.storagePath).length
  return <>
    <PageHeader eyebrow="Cost control" title="Expenses" description="Record project costs and general business spending in one place." />
    <section className="jm-metrics"><MetricCard icon={WalletCards} label="All expenses" value={formatGBP(total)} tone="neutral" /><MetricCard icon={ReceiptPoundSterling} label="This month" value={formatGBP(thisMonth)} tone="orange" /><MetricCard icon={Building2} label="General expenses" value={formatGBP(general)} tone="blue" /><MetricCard icon={FileCheck2} label="Receipts attached" value={receipts} tone="green" /></section>
    <section className="jm-filter-bar jm-expense-filters"><label className="jm-search"><span>Search expenses</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Supplier, description or reference" /></label><label><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option>All</option>{expenseCategories.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Project</span><select value={projectId} onChange={(event) => setProjectId(event.target.value)}><option value="All">All expenses</option><option value="general">General only</option>{data.projects.map((project) => <option key={project.id} value={project.id}>{project.title} · {project.postcode}</option>)}</select></label><label><span>From</span><input type="date" value={from} onChange={(event) => setFrom(event.target.value)} /></label><label><span>To</span><input type="date" value={to} onChange={(event) => setTo(event.target.value)} /></label></section>
    <ExpensesSection expenses={rows} projects={data.projects} description={`${rows.length} expense entr${rows.length === 1 ? 'y' : 'ies'} shown`} onAdd={addExpense} onUpload={uploadExpense} onDelete={deleteExpense} storageEnabled={authMode === 'supabase'} canEdit={can('edit_financials')} />
  </>
}
