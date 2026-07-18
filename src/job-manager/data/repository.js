import { initialData } from './seed'

const STORAGE_KEY = 'ictinus-job-manager-data-v1'

const clone = (value) => JSON.parse(JSON.stringify(value))
const newId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const migrate = (source) => {
  const data = { ...clone(initialData), ...source }
  data.version = 2
  data.journalEntries = source.journalEntries || clone(initialData.journalEntries)
  data.photos = source.photos || clone(initialData.photos)
  data.clients = (source.clients || initialData.clients).map((client) => ({ preferredContact: 'Phone', bestContactTime: '', emergencyContact: '', ...client }))
  data.tasks = (source.tasks || initialData.tasks).map((task) => ({ status: task.completed ? 'Completed' : 'Pending', ...task }))
  data.documents = (source.documents || initialData.documents).map((document) => ({ createdAt: new Date().toISOString(), uploadedBy: 'user-ioannis', ...document }))
  return data
}

export const localRepository = {
  async load() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      const seeded = migrate(initialData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    try {
      const migrated = migrate(JSON.parse(stored))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
      return migrated
    } catch { return clone(initialData) }
  },
  async save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
  },
  async reset() {
    const seeded = migrate(initialData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
    return seeded
  },
  createId: newId,
}

// Supabase replacement point: implement this same load/save/reset contract using
// typed table queries, then inject that repository into JobManagerProvider.
