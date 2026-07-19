import { requireSupabase } from '../services/supabaseClient'

const clone = (value) => structuredClone(value)
const pounds = (pence) => Number(pence || 0) / 100
const pence = (poundsValue) => Math.round(Number(poundsValue || 0) * 100)
let snapshot = null

const maps = {
  clients: (row) => ({ id: row.id, name: row.name, phone: row.phone, email: row.email, preferredContact: row.preferred_contact, bestContactTime: row.best_contact_time, emergencyContact: row.emergency_contact, createdAt: row.created_at, updatedAt: row.updated_at }),
  projects: (row) => ({ id: row.id, clientId: row.client_id, title: row.title, projectType: row.project_type, description: row.description, status: row.status, address: row.address, postcode: row.postcode, startDate: row.start_date, endDate: row.end_date, estimatedDuration: row.estimated_duration, assignedTo: row.assigned_to, contractValue: pounds(row.contract_value_pence), amountPaid: pounds(row.amount_paid_pence), outstandingBalance: pounds(row.outstanding_balance_pence), accessNotes: row.access_notes, parkingNotes: row.parking_notes, keyStatus: row.key_status, internalNotes: row.internal_notes, nextAction: row.next_action, scope: row.scope || [], provisional: row.provisional, createdAt: row.created_at, updatedAt: row.updated_at }),
  events: (row) => ({ id: row.id, projectId: row.project_id, type: row.type, title: row.title, startDate: row.start_date, endDate: row.end_date, allDay: row.all_day, location: row.location, notes: row.notes, colourCategory: row.colour_category, googleCalendarEventId: row.google_calendar_event_id, createdBy: row.created_by, createdAt: row.created_at, updatedAt: row.updated_at }),
  tasks: (row) => ({ id: row.id, projectId: row.project_id, title: row.title, dueDate: row.due_date, assignedTo: row.assigned_to, priority: row.priority, completed: row.completed, status: row.completed ? 'Completed' : 'Pending', createdBy: row.created_by, createdAt: row.created_at, updatedAt: row.updated_at }),
  payments: (row) => ({ id: row.id, projectId: row.project_id, title: row.title, percentage: Number(row.percentage), amount: pounds(row.amount_pence), dueDate: row.due_date, paidDate: row.paid_date || '', status: row.status, invoiceReference: row.invoice_reference, notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at }),
  documents: (row) => ({ id: row.id, projectId: row.project_id, type: row.type, name: row.name, url: row.external_url || '', storagePath: row.storage_path, uploadedBy: row.uploaded_by, createdAt: row.created_at }),
  photos: (row) => ({ id: row.id, projectId: row.project_id, stage: row.stage, title: row.title, url: '', storagePath: row.storage_path, uploadedBy: row.uploaded_by, createdAt: row.created_at }),
  journalEntries: (row) => ({ id: row.id, projectId: row.project_id, userId: row.user_id, category: row.category, message: row.message, createdAt: row.created_at, updatedAt: row.updated_at }),
  activities: (row) => ({ id: row.id, projectId: row.project_id, userId: row.user_id, action: row.action, createdAt: row.created_at }),
  users: (row) => ({ id: row.id, name: row.display_name, role: row.role, email: row.email, active: row.active }),
}

const dbMaps = {
  clients: (row) => ({ id: row.id, name: row.name, phone: row.phone || '', email: row.email || '', preferred_contact: row.preferredContact || 'Phone', best_contact_time: row.bestContactTime || '', emergency_contact: row.emergencyContact || '', updated_at: row.updatedAt || new Date().toISOString() }),
  projects: (row) => ({ id: row.id, client_id: row.clientId, title: row.title, project_type: row.projectType, description: row.description || '', status: row.status, address: row.address, postcode: row.postcode, start_date: row.startDate, end_date: row.endDate, estimated_duration: row.estimatedDuration || '', assigned_to: row.assignedTo || null, contract_value_pence: pence(row.contractValue), amount_paid_pence: pence(row.amountPaid), outstanding_balance_pence: pence(row.outstandingBalance), access_notes: row.accessNotes || '', parking_notes: row.parkingNotes || '', key_status: row.keyStatus || '', internal_notes: row.internalNotes || '', next_action: row.nextAction || '', scope: row.scope || [], provisional: Boolean(row.provisional), updated_at: row.updatedAt || new Date().toISOString() }),
  events: (row) => ({ id: row.id, project_id: row.projectId, type: row.type, title: row.title, start_date: row.startDate, end_date: row.endDate, all_day: Boolean(row.allDay), location: row.location || '', notes: row.notes || '', colour_category: row.colourCategory || 'green', google_calendar_event_id: row.googleCalendarEventId || null, created_by: row.createdBy || null, updated_at: row.updatedAt || new Date().toISOString() }),
  tasks: (row) => ({ id: row.id, project_id: row.projectId, title: row.title, due_date: row.dueDate, assigned_to: row.assignedTo || null, priority: row.priority, completed: Boolean(row.completed), created_by: row.createdBy || null, updated_at: row.updatedAt || new Date().toISOString() }),
  payments: (row) => ({ id: row.id, project_id: row.projectId, title: row.title, percentage: Number(row.percentage || 0), amount_pence: pence(row.amount), due_date: row.dueDate, paid_date: row.paidDate || null, status: row.status, invoice_reference: row.invoiceReference || '', notes: row.notes || '', updated_at: row.updatedAt || new Date().toISOString() }),
  documents: (row) => ({ id: row.id, project_id: row.projectId, type: row.type, name: row.name, external_url: row.storagePath ? null : row.url, storage_path: row.storagePath || null, uploaded_by: row.uploadedBy }),
  photos: (row) => ({ id: row.id, project_id: row.projectId, stage: row.stage, title: row.title, storage_path: row.storagePath, uploaded_by: row.uploadedBy }),
  journalEntries: (row) => ({ id: row.id, project_id: row.projectId, user_id: row.userId, category: row.category, message: row.message, updated_at: row.updatedAt || new Date().toISOString() }),
  activities: (row) => ({ id: row.id, project_id: row.projectId, user_id: row.userId, action: row.action, created_at: row.createdAt }),
}

const tableNames = { clients: 'clients', projects: 'projects', events: 'project_events', tasks: 'tasks', payments: 'payments', documents: 'documents', photos: 'project_photos', journalEntries: 'journal_entries', activities: 'activity_logs' }

async function selectAll(client, table, order = 'created_at') {
  const { data, error } = await client.from(table).select('*').order(order, { ascending: true })
  if (error) throw error
  return data
}

async function signedUrl(client, path) {
  if (!path) return ''
  const { data, error } = await client.storage.from('ictinus-project-files').createSignedUrl(path, 3600)
  return error ? '' : data.signedUrl
}

async function syncCollection(client, key, current, previous) {
  const table = tableNames[key]; const mapper = dbMaps[key]
  const currentIds = new Set(current.map((row) => row.id)); const removed = previous.filter((row) => !currentIds.has(row.id)).map((row) => row.id)
  if (removed.length) { const { error } = await client.from(table).delete().in('id', removed); if (error) throw error }
  const previousById = new Map(previous.map((row) => [row.id, row])); const changed = current.filter((row) => JSON.stringify(mapper(row)) !== JSON.stringify(mapper(previousById.get(row.id) || {}))).map(mapper)
  if (changed.length) { const { error } = await client.from(table).upsert(changed); if (error) throw error }
}

export const supabaseRepository = {
  mode: 'supabase',
  createId: () => crypto.randomUUID(),
  async load() {
    const client = requireSupabase()
    const [profiles, clients, projects, events, tasks, payments, documents, photos, journalEntries, activities] = await Promise.all([
      selectAll(client, 'profiles'), selectAll(client, 'clients'), selectAll(client, 'projects'), selectAll(client, 'project_events'), selectAll(client, 'tasks'), selectAll(client, 'payments'), selectAll(client, 'documents'), selectAll(client, 'project_photos'), selectAll(client, 'journal_entries'), selectAll(client, 'activity_logs'),
    ])
    const data = { version: 3, users: profiles.map(maps.users), clients: clients.map(maps.clients), projects: projects.map(maps.projects), events: events.map(maps.events), tasks: tasks.map(maps.tasks), payments: payments.map(maps.payments), documents: documents.map(maps.documents), photos: photos.map(maps.photos), journalEntries: journalEntries.map(maps.journalEntries), activities: activities.map(maps.activities) }
    await Promise.all([...data.documents, ...data.photos].map(async (item) => { if (item.storagePath) item.url = await signedUrl(client, item.storagePath) }))
    snapshot = clone(data)
    return data
  },
  async save(data) {
    const client = requireSupabase(); const previous = snapshot || { clients: [], projects: [], events: [], tasks: [], payments: [], documents: [], photos: [], journalEntries: [], activities: [] }
    for (const key of ['clients', 'projects', 'events', 'tasks', 'payments', 'documents', 'photos', 'journalEntries', 'activities']) await syncCollection(client, key, data[key] || [], previous[key] || [])
    snapshot = clone(data)
    return data
  },
  async reset() { throw new Error('Production data cannot be reset from the client.') },
  subscribe(onChange, onStatus) {
    const client = requireSupabase(); let timer
    const channel = client.channel('job-manager-sync').on('postgres_changes', { event: '*', schema: 'public' }, () => {
      clearTimeout(timer); timer = setTimeout(async () => {
        try { onChange(await this.load()) }
        catch { onStatus?.('offline') }
      }, 250)
    }).subscribe((status) => {
      if (status === 'SUBSCRIBED') onStatus?.('live')
      else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') onStatus?.('offline')
      else if (status === 'CLOSED') onStatus?.('connecting')
    })
    return () => { clearTimeout(timer); client.removeChannel(channel) }
  },
  async uploadFile(projectId, file, kind) {
    if (file.size > 25 * 1024 * 1024) throw new Error('Files must be 25 MB or smaller.')
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']; if (!allowed.includes(file.type)) throw new Error('Use JPG, PNG, WebP or PDF files.')
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-'); const path = `${projectId}/${kind}/${crypto.randomUUID()}-${safeName}`; const client = requireSupabase()
    const { error } = await client.storage.from('ictinus-project-files').upload(path, file, { upsert: false, contentType: file.type }); if (error) throw error
    return { storagePath: path, url: await signedUrl(client, path) }
  },
  async deleteFile(path) { if (!path) return; const { error } = await requireSupabase().storage.from('ictinus-project-files').remove([path]); if (error) throw error },
}
