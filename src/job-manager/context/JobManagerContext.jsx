import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { demoUsers } from '../data/seed'
import { localRepository } from '../data/repository'
import { supabaseRepository } from '../data/supabaseRepository'
import { authService, supabaseConfigured } from '../services/authService'

const JobManagerContext = createContext(null)
const defaultRepository = supabaseConfigured ? supabaseRepository : localRepository

export function JobManagerProvider({ children, repository = defaultRepository }) {
  const [data, setData] = useState(null)
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)
  const [error, setError] = useState('')
  const [realtimeStatus, setRealtimeStatus] = useState(repository.mode === 'supabase' ? 'connecting' : 'local')
  const [lastSyncedAt, setLastSyncedAt] = useState(null)
  const dataRef = useRef(null)
  const saveQueue = useRef(Promise.resolve())

  useEffect(() => {
    let active = true
    authService.getUser().then((nextUser) => { if (active) setUser(nextUser) }).catch((authError) => setError(authError.message)).finally(() => { if (active) setAuthReady(true) })
    const unsubscribe = authService.onAuthStateChange((nextUser) => { setUser(nextUser); if (!nextUser) setData(null) })
    return () => { active = false; unsubscribe() }
  }, [])

  useEffect(() => {
    if (!user) return undefined
    let active = true
    repository.load().then((next) => { if (active) { dataRef.current = next; setData(next); setLastSyncedAt(new Date()); if (repository.mode !== 'supabase') setRealtimeStatus('local') } }).catch(() => { setRealtimeStatus('offline'); setError('The project data could not be loaded.') })
    const unsubscribe = repository.subscribe?.((next) => { if (active) { dataRef.current = next; setData(next); setLastSyncedAt(new Date()) } }, (status) => { if (active) setRealtimeStatus(status) })
    return () => { active = false; unsubscribe?.() }
  }, [repository, user])

  const commit = useCallback(async (updater) => {
    const current = dataRef.current
    if (!current) throw new Error('Project data is still loading.')
    const next = typeof updater === 'function' ? updater(current) : updater
    dataRef.current = next
    setData(next)
    const operation = saveQueue.current.catch(() => undefined).then(() => repository.save(next))
    saveQueue.current = operation
    return operation.catch(async () => {
      setError('Your latest change could not be saved. The shared data has been reloaded.')
      const restored = await repository.load()
      dataRef.current = restored
      setData(restored)
      throw new Error('The change could not be saved.')
    })
  }, [repository])

  const login = async (identifier, password) => {
    const nextUser = await authService.signIn(identifier, password)
    setUser(nextUser)
    return nextUser
  }
  const logout = async () => { await authService.signOut(); dataRef.current = null; setUser(null); setData(null) }
  const can = (permission) => {
    if (!user) return false
    if (user.role === 'administrator') return true
    return ['view_projects', 'update_status', 'complete_tasks', 'add_site_notes', 'view_schedule'].includes(permission)
  }

  const addActivity = (draft, projectId, action) => {
    draft.activities.unshift({ id: repository.createId('activity'), projectId, userId: user.id, action, createdAt: new Date().toISOString() })
  }

  const addLeadActivity = (draft, leadId, action) => {
    draft.activities.unshift({ id: repository.createId('activity'), projectId: null, leadId, userId: user.id, action, entityType: 'lead', entityId: leadId, source: 'job_manager', createdAt: new Date().toISOString() })
  }

  const saveLead = async (values, leadId) => {
    const id = leadId || repository.createId('lead'); const now = new Date().toISOString()
    await commit((current) => {
      const next = structuredClone(current)
      const record = { clientName: values.clientName, email: values.email || '', phone: values.phone || '', postcode: (values.postcode || '').toUpperCase(), fullAddress: values.fullAddress || '', projectType: values.projectType || 'Other', enquirySummary: values.enquirySummary || '', estimatedValue: values.estimatedValue === '' ? null : Number(values.estimatedValue || 0), budget: values.budget === '' ? null : Number(values.budget || 0), stage: values.stage || 'New', priority: values.priority || 'Normal', source: values.source || 'Other', sourceReference: values.sourceReference || '', assignedTo: values.assignedTo || null, preferredContactMethod: values.preferredContactMethod || 'Phone', preferredContactTime: values.preferredContactTime || '', nextAction: values.nextAction || '', nextActionDueAt: values.nextActionDueAt || null, internalNotes: values.internalNotes || '', updatedBy: user.id, updatedAt: now }
      if (leadId) Object.assign(next.leads.find((item) => item.id === leadId), record)
      else next.leads.unshift({ id, ...record, siteVisitStatus: 'Not booked', reminderStatus: 'None', barkCreditsSpent: Number(values.barkCreditsSpent || 0), createdBy: user.id, createdAt: now })
      addLeadActivity(next, id, leadId ? 'Lead updated' : 'Lead created'); return next
    }); return id
  }
  const updateLeadStage = (leadId, stage) => commit((current) => { const next = structuredClone(current); const lead = next.leads.find((item) => item.id === leadId); lead.stage = stage; lead.updatedAt = new Date().toISOString(); addLeadActivity(next, leadId, `Stage changed to ${stage}`); return next })
  const logLeadCommunication = (leadId, values) => commit((current) => { const next = structuredClone(current); const now = new Date().toISOString(); next.leadCommunications.unshift({ id: repository.createId('lead-communication'), leadId, type: values.type, direction: values.direction, occurredAt: values.occurredAt || now, summary: values.summary, note: values.note || '', externalLink: values.externalLink || null, authorId: user.id, createdAt: now }); const lead = next.leads.find((item) => item.id === leadId); lead.lastContactedAt = now; if (!lead.firstContactedAt) lead.firstContactedAt = now; if (lead.stage === 'New') lead.stage = 'Contacted'; addLeadActivity(next, leadId, `${values.type} logged: ${values.summary}`); return next })
  const addLeadTask = (leadId, values) => commit((current) => { const next = structuredClone(current); next.tasks.push({ id: repository.createId('task'), projectId: null, leadId, title: values.title, dueDate: values.dueDate, assignedTo: values.assignedTo || user.id, priority: values.priority || 'Normal', completed: false, status: 'Pending', createdBy: user.id }); addLeadActivity(next, leadId, `Task added: ${values.title}`); return next })
  const bookLeadVisit = (leadId, values) => commit((current) => { const next = structuredClone(current); const lead = next.leads.find((item) => item.id === leadId); next.events.push({ id: repository.createId('event'), projectId: null, leadId, type: 'Site visit', title: `${lead.clientName} – ${lead.postcode}`, startDate: values.startDate, endDate: values.endDate || values.startDate, allDay: false, location: `${lead.fullAddress} ${lead.postcode}`.trim(), notes: values.notes || '', colourCategory: 'blue', googleCalendarEventId: null, syncStatus: 'not_configured', createdBy: user.id }); lead.siteVisitDate = values.startDate; lead.siteVisitStatus = 'Booked'; lead.stage = 'Site Visit Booked'; if (lead.source === 'Bark') lead.barkSiteVisitBooked = true; addLeadActivity(next, leadId, 'Site visit booked'); return next })
  const markLeadLost = (leadId, values) => commit((current) => { const next = structuredClone(current); const lead = next.leads.find((item) => item.id === leadId); Object.assign(lead, { stage: 'Lost', lostReason: values.reason, lostNotes: values.notes || '', updatedAt: new Date().toISOString() }); addLeadActivity(next, leadId, `Lead lost: ${values.reason}`); return next })
  const convertLead = async (leadId, values) => { const projectId = await repository.convertLead(leadId, values); await refreshData(); return projectId }

  const saveProject = async (values, projectId) => {
    const savedId = projectId || repository.createId('project')
    await commit((current) => {
      const next = structuredClone(current)
      let client = next.clients.find((item) => item.id === values.clientId)
      if (!client) {
        client = { id: repository.createId('client'), name: values.clientName, phone: values.clientPhone || '', email: values.clientEmail || '' }
        next.clients.push(client)
      } else if (values.clientName) {
        Object.assign(client, { name: values.clientName, phone: values.clientPhone || client.phone, email: values.clientEmail || client.email })
      }
      const numericContract = Number(values.contractValue) || 0
      const paid = projectId ? next.payments.filter((item) => item.projectId === projectId && item.status === 'Paid').reduce((sum, item) => sum + item.amount, 0) : 0
      const projectValues = {
        title: values.title, projectType: values.projectType, description: values.description || '', status: values.status,
        address: values.address, postcode: values.postcode.toUpperCase(), startDate: values.startDate, endDate: values.endDate,
        estimatedDuration: values.estimatedDuration || '', assignedTo: values.assignedTo, contractValue: numericContract,
        accessNotes: values.accessNotes || '', parkingNotes: values.parkingNotes || '', keyStatus: values.keyStatus || 'Not collected',
        internalNotes: values.internalNotes || '', nextAction: values.nextAction || 'Review project', scope: values.scopeText ? values.scopeText.split('\n').filter(Boolean) : [],
        provisional: Boolean(values.provisional), updatedAt: new Date().toISOString(), clientId: client.id, amountPaid: paid, outstandingBalance: Math.max(0, numericContract - paid),
      }
      if (projectId) {
        const index = next.projects.findIndex((item) => item.id === projectId)
        next.projects[index] = { ...next.projects[index], ...projectValues }
        addActivity(next, projectId, 'Project updated')
      } else {
        next.projects.unshift({ id: savedId, ...projectValues, createdAt: new Date().toISOString() })
        next.events.push({ id: repository.createId('event'), projectId: savedId, type: 'Work', title: `${client.name.split(' ')[0]} – ${projectValues.postcode}`, startDate: values.startDate, endDate: values.endDate, allDay: true, location: `${values.address} ${projectValues.postcode}`, notes: '', colourCategory: values.provisional ? 'yellow' : 'green', googleCalendarEventId: null })
        addActivity(next, savedId, 'Project created')
      }
      return next
    })
    return savedId
  }

  const updateProjectStatus = (projectId, status) => commit((current) => {
    const next = structuredClone(current); const project = next.projects.find((item) => item.id === projectId)
    project.status = status; project.updatedAt = new Date().toISOString(); addActivity(next, projectId, `Status changed to ${status}`); return next
  })
  const deleteProject = (projectId) => commit((current) => {
    const next = structuredClone(current)
    next.projects = next.projects.filter((item) => item.id !== projectId)
    for (const key of ['payments', 'events', 'tasks', 'documents', 'journalEntries', 'photos', 'activities']) next[key] = next[key].filter((item) => item.projectId !== projectId)
    return next
  })
  const addTask = (projectId, values) => commit((current) => {
    const next = structuredClone(current); next.tasks.push({ id: repository.createId('task'), projectId, ...values, completed: false, status: 'Pending' }); addActivity(next, projectId, `Task added: ${values.title}`); return next
  })
  const toggleTask = (taskId) => commit((current) => {
    const next = structuredClone(current); const task = next.tasks.find((item) => item.id === taskId); task.completed = !task.completed; task.status = task.completed ? 'Completed' : 'Pending'; addActivity(next, task.projectId, task.completed ? `Task completed: ${task.title}` : `Task reopened: ${task.title}`); return next
  })
  const addPayment = (projectId, values) => commit((current) => {
    const next = structuredClone(current); next.payments.push({ id: repository.createId('payment'), projectId, ...values, amount: Number(values.amount), percentage: Number(values.percentage) || 0, paidDate: values.status === 'Paid' ? (values.paidDate || new Date().toISOString().slice(0, 10)) : '' });
    recalculateProject(next, projectId); addActivity(next, projectId, `Payment stage added: ${values.title}`); return next
  })
  const markPaymentPaid = (paymentId) => commit((current) => {
    const next = structuredClone(current); const payment = next.payments.find((item) => item.id === paymentId); payment.status = 'Paid'; payment.paidDate = new Date().toISOString().slice(0, 10); recalculateProject(next, payment.projectId); addActivity(next, payment.projectId, `Payment received: ${payment.title}`); return next
  })
  const addDocument = (projectId, values) => commit((current) => {
    const next = structuredClone(current); next.documents.push({ id: repository.createId('document'), projectId, ...values, createdAt: new Date().toISOString(), uploadedBy: user.id }); addActivity(next, projectId, `Document added: ${values.name}`); return next
  })
  const deleteDocument = async (documentId) => {
    const document = data.documents.find((item) => item.id === documentId); await repository.deleteFile?.(document?.storagePath)
    return commit((current) => { const next = structuredClone(current); next.documents = next.documents.filter((item) => item.id !== documentId); addActivity(next, document.projectId, `Document removed: ${document.name}`); return next })
  }
  const addEvent = (projectId, values) => commit((current) => {
    const next = structuredClone(current); const project = next.projects.find((item) => item.id === projectId); const client = next.clients.find((item) => item.id === project.clientId)
    next.events.push({ id: repository.createId('event'), projectId, ...values, title: `${client.name.split(' ')[0]} – ${project.postcode}`, allDay: values.allDay ?? true, googleCalendarEventId: null }); addActivity(next, projectId, `${values.type} added to calendar`); return next
  })
  const addJournalEntry = (projectId, values) => commit((current) => {
    const next = structuredClone(current); const now = new Date().toISOString(); next.journalEntries.unshift({ id: repository.createId('journal'), projectId, userId: user.id, ...values, createdAt: now, updatedAt: now }); addActivity(next, projectId, `Journal note added · ${values.category}`); return next
  })
  const updateJournalEntry = (entryId, values) => commit((current) => {
    const next = structuredClone(current); const entry = next.journalEntries.find((item) => item.id === entryId); Object.assign(entry, values, { updatedAt: new Date().toISOString() }); addActivity(next, entry.projectId, `Journal note edited · ${entry.category}`); return next
  })
  const deleteJournalEntry = (entryId) => commit((current) => {
    const next = structuredClone(current); const entry = next.journalEntries.find((item) => item.id === entryId); next.journalEntries = next.journalEntries.filter((item) => item.id !== entryId); addActivity(next, entry.projectId, 'Journal note deleted'); return next
  })
  const addPhoto = (projectId, values) => commit((current) => {
    const next = structuredClone(current); next.photos.unshift({ id: repository.createId('photo'), projectId, ...values, createdAt: new Date().toISOString(), uploadedBy: user.id }); addActivity(next, projectId, `Photo added · ${values.stage}`); return next
  })
  const deletePhoto = async (photoId) => {
    const photo = data.photos.find((item) => item.id === photoId); await repository.deleteFile?.(photo?.storagePath)
    return commit((current) => { const next = structuredClone(current); next.photos = next.photos.filter((item) => item.id !== photoId); addActivity(next, photo.projectId, `Photo removed · ${photo.stage}`); return next })
  }
  const uploadDocument = async (projectId, values, file) => {
    const uploaded = await repository.uploadFile(projectId, file, 'documents')
    return addDocument(projectId, { ...values, ...uploaded })
  }
  const uploadPhoto = async (projectId, values, file) => {
    const uploaded = await repository.uploadFile(projectId, file, 'photos')
    return addPhoto(projectId, { ...values, ...uploaded })
  }
  const resetData = () => repository.reset().then((next) => { dataRef.current = next; setData(next); return next })
  const refreshData = () => repository.load().then((next) => { dataRef.current = next; setData(next); setLastSyncedAt(new Date()); return next })
  const resetPassword = (email) => authService.resetPassword(email)
  const updatePassword = (password) => authService.updatePassword(password)

  const value = { data, user, users: data?.users || demoUsers, error, setError, authReady, authMode: authService.mode, realtimeStatus, lastSyncedAt, login, logout, resetPassword, updatePassword, can, saveProject, updateProjectStatus, deleteProject, addTask, toggleTask, addPayment, markPaymentPaid, addDocument, uploadDocument, deleteDocument, addEvent, addJournalEntry, updateJournalEntry, deleteJournalEntry, addPhoto, uploadPhoto, deletePhoto, resetData, refreshData, saveLead, updateLeadStage, logLeadCommunication, addLeadTask, bookLeadVisit, markLeadLost, convertLead }
  return <JobManagerContext.Provider value={value}>{children}</JobManagerContext.Provider>
}

function recalculateProject(data, projectId) {
  const project = data.projects.find((item) => item.id === projectId)
  const paid = data.payments.filter((item) => item.projectId === projectId && item.status === 'Paid').reduce((sum, item) => sum + Number(item.amount), 0)
  project.amountPaid = paid; project.outstandingBalance = Math.max(0, project.contractValue - paid)
}

export const useJobManager = () => {
  const context = useContext(JobManagerContext)
  if (!context) throw new Error('useJobManager must be used inside JobManagerProvider')
  return context
}
