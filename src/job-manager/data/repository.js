import { initialData } from './seed'

const STORAGE_KEY = 'ictinus-job-manager-data-v1'

const clone = (value) => JSON.parse(JSON.stringify(value))
const newId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const migrate = (source) => {
  const data = { ...clone(initialData), ...source }
  data.version = 5
  data.leads = source.leads || []
  data.leadCommunications = source.leadCommunications || []
  data.leadQuotes = source.leadQuotes || []
  data.journalEntries = source.journalEntries || clone(initialData.journalEntries)
  data.photos = source.photos || clone(initialData.photos)
  data.clients = (source.clients || initialData.clients).map((client) => ({ preferredContact: 'Phone', bestContactTime: '', emergencyContact: '', ...client }))
  data.tasks = (source.tasks || initialData.tasks).map((task) => ({ status: task.completed ? 'Completed' : 'Pending', ...task }))
  data.documents = (source.documents || initialData.documents).map((document) => ({ createdAt: new Date().toISOString(), uploadedBy: 'user-admin', ...document }))
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
  async convertLead(leadId, conversion = {}) {
    const data = await this.load()
    const lead = data.leads.find((item) => item.id === leadId)
    if (!lead) throw new Error('Lead not found.')
    if (lead.convertedProjectId) return lead.convertedProjectId
    const quote = data.leadQuotes.find((item) => item.id === lead.quoteId) || [...data.leadQuotes].reverse().find((item) => item.leadId === leadId)
    const clientId = newId('client'); const projectId = newId('project'); const now = new Date().toISOString()
    data.clients.push({ id: clientId, name: lead.clientName, email: lead.email, phone: lead.phone, preferredContact: lead.preferredContactMethod })
    const value = Number(conversion.contractValue || quote?.amount || lead.estimatedValue || 0)
    data.projects.unshift({ id: projectId, clientId, title: conversion.title || quote?.projectTitle || `${lead.projectType} - ${lead.clientName}`, projectType: quote?.projectType || lead.projectType, description: quote?.description || lead.enquirySummary, status: 'Confirmed', address: quote?.address || lead.fullAddress, postcode: quote?.postcode || lead.postcode, startDate: conversion.startDate || quote?.startDate || now.slice(0, 10), endDate: conversion.endDate || quote?.endDate || conversion.startDate || now.slice(0, 10), assignedTo: conversion.assignedTo || lead.assignedTo, contractValue: value, amountPaid: 0, outstandingBalance: value, internalNotes: [lead.internalNotes, quote?.reference ? `Accepted quote: ${quote.reference}` : ''].filter(Boolean).join('\n'), nextAction: 'Plan confirmed works', scope: quote?.scope || [], provisional: false, createdAt: now, updatedAt: now })
    lead.stage = 'Won'; lead.convertedProjectId = projectId; lead.updatedAt = now
    data.events.forEach((item) => { if (item.leadId === leadId) { item.projectId = projectId; item.leadId = null } })
    data.tasks.forEach((item) => { if (item.leadId === leadId) { item.projectId = projectId; item.leadId = null } })
    data.documents.forEach((item) => { if (item.leadId === leadId) { item.projectId = projectId; item.leadId = null } })
    await this.save(data); return projectId
  },
}

// This repository is deliberately limited to the fictional browser demo.
