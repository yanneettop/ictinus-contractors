import { Download, Eye, LoaderCircle, Plus, ReceiptText, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { formatDate, formatGBP, londonDateKey } from '../utils/format'
import { EXPENSE_FILE_ACCEPT, EXPENSE_FILE_HELP, friendlyUploadError } from '../utils/fileUploads'
import { DocumentPreview } from './ProjectRecords'

export const expenseCategories = ['Materials', 'Tools & equipment', 'Labour', 'Subcontractors', 'Travel & fuel', 'Parking', 'Waste disposal', 'Office & admin', 'Insurance', 'Other']
const paymentMethods = ['Company card', 'Cash', 'Bank transfer', 'Personal card', 'Other']

export default function ExpensesSection({ title = 'Expenses', description = '', expenses, projects, fixedProjectId = '', onAdd, onUpload, onDelete, storageEnabled, canEdit = false }) {
  const [adding, setAdding] = useState(false)
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  return <section className="jm-detail-card jm-expenses-section">
    <div className="jm-card-heading"><div><h2>{title}</h2><p>{description || `${expenses.length} entr${expenses.length === 1 ? 'y' : 'ies'} · ${formatGBP(total)}`}</p></div>{canEdit && <button type="button" className="jm-button jm-button--small jm-button--secondary" onClick={() => setAdding((open) => !open)}>{adding ? <X size={16} /> : <Plus size={16} />}{adding ? 'Close' : 'Add expense'}</button>}</div>
    {adding && <ExpenseForm projects={projects} fixedProjectId={fixedProjectId} onAdd={onAdd} onUpload={onUpload} storageEnabled={storageEnabled} onSaved={() => setAdding(false)} onCancel={() => setAdding(false)} />}
    <ExpenseList expenses={expenses} projects={projects} onDelete={onDelete} canEdit={canEdit} />
  </section>
}

export function ExpenseForm({ projects, fixedProjectId = '', onAdd, onUpload, storageEnabled, onSaved, onCancel }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState('')
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('')
    const form = event.currentTarget; const formData = new FormData(form); const file = formData.get('attachment')
    const selectedProject = fixedProjectId || String(formData.get('projectId') || '')
    const values = {
      projectId: selectedProject === 'general' ? null : selectedProject || null,
      date: String(formData.get('date')),
      category: String(formData.get('category')),
      supplier: String(formData.get('supplier') || '').trim(),
      description: String(formData.get('description')).trim(),
      amount: Number(formData.get('amount')),
      paymentMethod: String(formData.get('paymentMethod')),
      reference: String(formData.get('reference') || '').trim(),
      notes: String(formData.get('notes') || '').trim(),
    }
    try {
      if (!values.amount || values.amount <= 0) throw new Error('Enter an amount greater than zero.')
      if (file?.size) await onUpload(values, file)
      else await onAdd(values)
      form.reset(); onSaved?.()
    } catch (submitError) { setError(friendlyUploadError(submitError, 'The expense could not be saved. Please try again.')) }
    finally { setBusy(false) }
  }
  return <form className="jm-expense-form" onSubmit={submit}>
    {!fixedProjectId && <label><span>Project</span><select name="projectId" defaultValue="general"><option value="general">General business expense</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.title} · {project.postcode}</option>)}</select></label>}
    <label><span>Date</span><input name="date" type="date" defaultValue={londonDateKey()} required /></label>
    <label><span>Category</span><select name="category">{expenseCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
    <label><span>Amount (£)</span><input name="amount" type="number" min="0.01" step="0.01" inputMode="decimal" placeholder="0.00" required /></label>
    <label><span>Supplier</span><input name="supplier" placeholder="e.g. Screwfix" /></label>
    <label className="jm-field-wide"><span>Description</span><input name="description" placeholder="What was purchased?" required /></label>
    <label><span>Payment method</span><select name="paymentMethod">{paymentMethods.map((method) => <option key={method}>{method}</option>)}</select></label>
    <label><span>Reference</span><input name="reference" placeholder="Receipt or invoice number" /></label>
    <label className="jm-field-wide"><span>Notes</span><textarea name="notes" rows="2" placeholder="Optional notes" /></label>
    {storageEnabled && <label className="jm-field-wide jm-expense-attachment"><span>Receipt or file (optional)</span><input name="attachment" type="file" accept={EXPENSE_FILE_ACCEPT} /><small>{EXPENSE_FILE_HELP}</small></label>}
    {error && <p className="jm-form-error jm-field-wide" role="alert">{error}</p>}
    <footer className="jm-field-wide"><button type="button" className="jm-button jm-button--secondary" onClick={onCancel} disabled={busy}>Cancel</button><button className="jm-button jm-button--primary" type="submit" disabled={busy}>{busy ? <><LoaderCircle className="jm-spin" size={16} />Saving…</> : <><Plus size={16} />Save expense</>}</button></footer>
  </form>
}

export function ExpenseList({ expenses, projects, onDelete, canEdit }) {
  const [preview, setPreview] = useState(null)
  if (!expenses.length) return <div className="jm-expense-empty"><ReceiptText size={28} /><strong>No expenses added yet</strong><span>Add a manual entry or attach a receipt.</span></div>
  return <><div className="jm-expense-list">{[...expenses].sort((a, b) => b.date.localeCompare(a.date)).map((expense) => { const project = projects.find((item) => item.id === expense.projectId); return <article key={expense.id}><span className="jm-expense-icon"><ReceiptText size={18} /></span><div className="jm-expense-main"><strong>{expense.description}</strong><span>{expense.supplier || expense.category} · {project ? `${project.title} · ${project.postcode}` : 'General expense'}</span></div><div><span>Date</span><strong>{formatDate(expense.date)}</strong></div><div><span>Category</span><strong>{expense.category}</strong></div><div className="jm-expense-amount"><span>Amount</span><strong>{formatGBP(expense.amount)}</strong></div><div className="jm-expense-actions">{expense.url && <><button type="button" onClick={() => setPreview(expense)} aria-label={`Preview ${expense.attachmentName}`}><Eye size={16} /></button><a href={expense.url} download aria-label={`Download ${expense.attachmentName}`}><Download size={16} /></a></>}{canEdit && <button type="button" onClick={() => window.confirm(`Delete expense “${expense.description}”?`) && onDelete(expense.id)} aria-label={`Delete ${expense.description}`}><Trash2 size={16} /></button>}</div></article> })}</div>{preview && <DocumentPreview document={{ name: preview.attachmentName || 'Expense attachment', type: 'Expense', storagePath: preview.storagePath, url: preview.url }} onClose={() => setPreview(null)} />}</>
}
