import assert from 'node:assert/strict'
import test from 'node:test'
import { invoiceRows, isInvoiceDocument } from '../src/job-manager/utils/invoices.js'

test('invoice documents are detected without case or whitespace sensitivity', () => {
  assert.equal(isInvoiceDocument({ type: 'Invoice' }), true)
  assert.equal(isInvoiceDocument({ type: ' invoice ' }), true)
  assert.equal(isInvoiceDocument({ type: 'Quotation' }), false)
})

test('central invoice rows include project and client details, newest first', () => {
  const data = {
    documents: [
      { id: 'old', projectId: 'p1', type: 'Invoice', createdAt: '2026-01-01T00:00:00Z' },
      { id: 'quote', projectId: 'p1', type: 'Quotation', createdAt: '2026-03-01T00:00:00Z' },
      { id: 'new', projectId: 'p2', type: 'Invoice', createdAt: '2026-02-01T00:00:00Z' },
    ],
    projects: [{ id: 'p1', clientId: 'c1' }, { id: 'p2', clientId: 'c2' }],
    clients: [{ id: 'c1', name: 'First' }, { id: 'c2', name: 'Second' }],
  }
  const rows = invoiceRows(data)
  assert.deepEqual(rows.map((row) => row.document.id), ['new', 'old'])
  assert.equal(rows[0].client.name, 'Second')
})
