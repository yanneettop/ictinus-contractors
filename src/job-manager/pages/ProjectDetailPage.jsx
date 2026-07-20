import { ArrowLeft, CalendarDays, CalendarPlus, Check, CheckCircle2, ClipboardPlus, CreditCard, Edit3, FilePlus2, Mail, MapPin, MessageCircle, MessageSquarePlus, Phone, Plus, ReceiptText, Trash2, UserRound } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useJobManager } from '../context/JobManagerContext'
import { formatDate, mapsUrl, projectClient, projectUser } from '../utils/format'
import { communicationService, googleCalendarService, invoiceService, locationService } from '../services/integrationServices'
import { EmptyState, StatusBadge, statuses } from '../components/UI'
import { FinancialControlCard, PaymentHistory, ProjectHealthCard, ProjectMetrics, ProjectProgress } from '../components/ProjectSummary'
import { ClientInformationCard, LocationCard } from '../components/ProjectContacts'
import ProjectJournal from '../components/ProjectJournal'
import ProjectTasks from '../components/ProjectTasks'
import { DocumentsSection, PhotoGallery } from '../components/ProjectRecords'
import { ActivityFeed, ProjectTimeline } from '../components/ProjectHistory'

const eventColours = { Work: 'green', 'Site visit': 'blue', 'Key collection': 'blue', Payment: 'red', Materials: 'orange', Inspection: 'grey', Handover: 'grey' }

export default function ProjectDetailPage() {
  const { id } = useParams(); const navigate = useNavigate()
  const { data, user, users, can, authMode, updateProjectStatus, deleteProject, addTask, toggleTask, addPayment, markPaymentPaid, addDocument, uploadDocument, deleteDocument, addEvent, addJournalEntry, updateJournalEntry, deleteJournalEntry, addPhoto, uploadPhoto, deletePhoto } = useJobManager()
  const [confirmDelete, setConfirmDelete] = useState(false); const [message, setMessage] = useState(''); const [journalComposer, setJournalComposer] = useState(0)
  const project = data.projects.find((item) => item.id === id)
  if (!project) return <EmptyState title="Project not found" text="This project may have been removed." action={<Link className="jm-button jm-button--secondary" to="/job-manager/projects">Back to projects</Link>} />
  const client = projectClient(data, project); const assignee = projectUser(users, project)
  const payments = data.payments.filter((item) => item.projectId === id).sort((a, b) => a.dueDate.localeCompare(b.dueDate)); const tasks = data.tasks.filter((item) => item.projectId === id)
  const documents = data.documents.filter((item) => item.projectId === id); const journal = (data.journalEntries || []).filter((item) => item.projectId === id); const photos = (data.photos || []).filter((item) => item.projectId === id)
  const activities = data.activities.filter((item) => item.projectId === id); const events = data.events.filter((item) => item.projectId === id)
  const submitTask = (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); addTask(id, { title: values.title, dueDate: values.dueDate, assignedTo: values.assignedTo, priority: values.priority }); closeActionForm(event) }
  const submitPayment = (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); addPayment(id, { ...values, status: 'Due', notes: '' }); closeActionForm(event) }
  const submitDocument = async (event) => { event.preventDefault(); const formData = new FormData(event.currentTarget); const file = formData.get('file'); const values = { name: formData.get('name'), type: formData.get('type'), url: formData.get('url') || '' }; try { if (authMode === 'supabase') { if (!file?.size) throw new Error('Choose a PDF or image to store in the account.'); await uploadDocument(id, values, file) } else { if (!values.url) throw new Error('Add an external file URL.'); await addDocument(id, values) } closeActionForm(event) } catch (uploadError) { setMessage(uploadError.message) } }
  const submitEvent = (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(event.currentTarget)); addEvent(id, { ...values, endDate: values.endDate || values.startDate, allDay: true, location: `${project.address} ${project.postcode}`, notes: '', colourCategory: eventColours[values.type] || 'blue' }); closeActionForm(event) }
  const openJournal = () => { setJournalComposer((value) => value + 1); setTimeout(() => document.getElementById('project-journal')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0) }
  const generateInvoice = () => setMessage(invoiceService.generate().message)

  return <>
    <Link className="jm-back-link" to="/job-manager/projects"><ArrowLeft size={17} />Back to projects</Link>
    <header className="jm-project-hero"><div className="jm-project-hero-main"><div className="jm-project-title-line"><p>{client?.name}</p><StatusBadge status={project.status} /></div><h1>{project.title}</h1><div className="jm-project-hero-meta"><a href={mapsUrl(project.address, project.postcode)} target="_blank" rel="noreferrer"><MapPin size={16} />{project.address}, {project.postcode}</a><span><UserRound size={16} />{assignee?.name}</span><span>{formatDate(project.startDate)} – {formatDate(project.endDate)}</span></div><ProjectProgress project={project} /></div><div className="jm-status-control"><label>Project status<select value={project.status} onChange={(event) => updateProjectStatus(id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label>{can('edit_projects') && <Link to={`/job-manager/projects/${id}/edit`}><Edit3 size={15} />Edit project</Link>}</div></header>

    {can('view_financials') && <FinancialControlCard project={project} payments={payments} canEdit={can('edit_financials')} onMarkPaid={markPaymentPaid} />}
    {message && <div className="jm-operation-notice"><span>{message}</span><button onClick={() => setMessage('')}>Dismiss</button></div>}

    <div className="jm-quick-actions jm-quick-actions--control" aria-label="Project actions">
      <a href={communicationService.phoneUrl(client)}><Phone size={18} />Call client</a><a href={communicationService.emailUrl(client, project)}><Mail size={18} />Email client</a><a href={communicationService.whatsappUrl(client, project)} target="_blank" rel="noreferrer"><MessageCircle size={18} />WhatsApp</a><a href={locationService.mapsUrl(project)} target="_blank" rel="noreferrer"><MapPin size={18} />Google Maps</a><a href={googleCalendarService.projectUrl(project)} target="_blank" rel="noreferrer"><CalendarDays size={18} />Calendar</a>
      <details><summary><ClipboardPlus size={18} />Add task</summary><ActionForm onSubmit={submitTask}><label>Task title<input name="title" required /></label><label>Due date<input name="dueDate" type="date" required /></label><label>Assigned to<select name="assignedTo">{users.map((user) => <option key={user.id} value={user.id}>{user.name}</option>)}</select></label><label>Priority<select name="priority"><option>Medium</option><option>High</option><option>Low</option></select></label></ActionForm></details>
      <button onClick={openJournal}><MessageSquarePlus size={18} />Add note</button>
      <details><summary><CalendarPlus size={18} />Add event</summary><ActionForm onSubmit={submitEvent}><label>Event type<select name="type">{Object.keys(eventColours).map((type) => <option key={type}>{type}</option>)}</select></label><label>Start date<input name="startDate" type="date" required /></label><label>End date<input name="endDate" type="date" /></label></ActionForm></details>
      <details><summary><FilePlus2 size={18} />Add document</summary><ActionForm onSubmit={submitDocument}><label>Name<input name="name" required /></label><label>Type<select name="type"><option>Quotation</option><option>Invoice</option><option>Payment schedule</option><option>Photos</option><option>Contract</option><option>Certificate</option><option>Other</option></select></label>{authMode === 'supabase' ? <label>Upload to private storage<input name="file" type="file" accept="application/pdf,image/jpeg,image/png,image/webp" required /></label> : <label>External URL<input name="url" type="url" placeholder="https://" required /></label>}</ActionForm></details>
      {can('edit_financials') && <><details><summary><CreditCard size={18} />Add payment</summary><ActionForm onSubmit={submitPayment}><label>Stage<input name="title" placeholder="Deposit, mid-project…" required /></label><label>Amount (£)<input name="amount" type="number" min="0" required /></label><label>Percentage<input name="percentage" type="number" min="0" max="100" /></label><label>Due date<input name="dueDate" type="date" required /></label><label>Invoice reference<input name="invoiceReference" required /></label></ActionForm></details><button onClick={generateInvoice}><ReceiptText size={18} />Generate invoice</button></>}
      {project.status !== 'Completed' && <button onClick={() => updateProjectStatus(id, 'Completed')}><CheckCircle2 size={18} />Mark completed</button>}
    </div>

    <div className="jm-detail-layout"><div className="jm-detail-main">
      <section className="jm-detail-card"><h2>Overview</h2><p className="jm-description">{project.description || 'No project description added.'}</p>{project.scope?.length > 0 && <div className="jm-scope"><h3>Scope of works</h3><ul>{project.scope.map((item) => <li key={item}><Check size={15} />{item}</li>)}</ul></div>}<div className="jm-info-grid"><Info title="Next action" text={project.nextAction} /><Info title="Internal notes" text={project.internalNotes} /></div></section>
      <ProjectJournal key={journalComposer} entries={journal} users={users} canManage={(entry) => can('edit_projects') || entry.userId === user.id} onAdd={(values) => addJournalEntry(id, values)} onUpdate={updateJournalEntry} onDelete={(entryId) => window.confirm('Delete this journal note?') && deleteJournalEntry(entryId)} startOpen={journalComposer > 0} />
      <ProjectTasks tasks={tasks} users={users} onToggle={toggleTask} />
      <DocumentsSection documents={documents} users={users} canDelete={(document) => can('edit_projects') || document.uploadedBy === user.id} onDelete={(documentId) => window.confirm('Remove this document link?') && deleteDocument(documentId)} />
      <PhotoGallery photos={photos} users={users} canDelete={(photo) => can('edit_projects') || photo.uploadedBy === user.id} onDelete={(photoId) => window.confirm('Delete this project photo?') && deletePhoto(photoId)} onAdd={(values) => addPhoto(id, values)} onUpload={(values, file) => uploadPhoto(id, values, file)} storageEnabled={authMode === 'supabase'} />
      {can('view_financials') && <PaymentHistory payments={payments} canEdit={can('edit_financials')} onMarkPaid={markPaymentPaid} />}
      <ProjectTimeline activities={activities} events={events} payments={can('view_financials') ? payments : []} />
    </div><aside className="jm-detail-side">
      <ProjectHealthCard project={project} tasks={tasks} payments={can('view_financials') ? payments : []} />
      <ProjectMetrics project={project} tasks={tasks} payments={can('view_financials') ? payments : []} photos={photos} documents={documents} />
      <ClientInformationCard client={client} project={project} />
      <LocationCard project={project} />
      <ActivityFeed activities={activities} users={users} />
      {can('delete_projects') && <section className="jm-danger-zone"><h3>Project controls</h3>{confirmDelete ? <div><p>Delete this project and all its local records?</p><button className="jm-button jm-button--danger" onClick={() => { deleteProject(id); navigate('/job-manager/projects') }}><Trash2 size={16} />Yes, delete</button><button className="jm-button jm-button--secondary" onClick={() => setConfirmDelete(false)}>Cancel</button></div> : <button onClick={() => setConfirmDelete(true)}><Trash2 size={16} />Delete project</button>}</section>}
    </aside></div>
  </>
}

function closeActionForm(event) { event.currentTarget.reset(); event.currentTarget.closest('details').removeAttribute('open') }
function Info({ title, text }) { return <div><span>{title}</span><p>{text || 'Not added'}</p></div> }
function ActionForm({ children, onSubmit }) { return <form className="jm-action-popover" onSubmit={onSubmit}>{children}<button className="jm-button jm-button--primary" type="submit"><Plus size={16} />Add</button></form> }
