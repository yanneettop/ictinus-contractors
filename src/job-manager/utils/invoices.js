export function isInvoiceDocument(document) {
  const type = String(document?.type || '').trim().toLowerCase()
  const filename = `${document?.name || ''} ${document?.storagePath || ''}`
  return type === 'invoice' || /(^|[^a-z0-9])(invoice|inv[\s_-]*\d+)([^a-z0-9]|$)/i.test(filename)
}

export function invoiceRows(data) {
  return (data?.documents || [])
    .filter(isInvoiceDocument)
    .map((document) => {
      const project = (data.projects || []).find((item) => item.id === document.projectId)
      const client = project ? (data.clients || []).find((item) => item.id === project.clientId) : null
      return { document, project, client }
    })
    .filter((row) => row.project)
    .sort((a, b) => (b.document.createdAt || '').localeCompare(a.document.createdAt || ''))
}
