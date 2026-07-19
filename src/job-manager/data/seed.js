export const demoUsers = [
  { id: 'user-admin', name: 'Demo Administrator', role: 'administrator', email: 'admin@example.test', username: 'admin', password: 'demo123' },
  { id: 'user-manager', name: 'Demo Site Manager', role: 'site_manager', email: 'manager@example.test', username: 'manager', password: 'demo123' },
]

// Public, fictional data used only when Supabase environment variables are absent.
// Never place real customer or project information in this browser bundle.
export const initialData = {
  version: 3,
  clients: [
    { id: 'client-sample', name: 'Sample Client', phone: '07000 000000', email: 'client@example.test', preferredContact: 'Phone', bestContactTime: 'Weekdays', emergencyContact: '' },
  ],
  projects: [
    {
      id: 'project-sample', clientId: 'client-sample', title: 'Sample Refurbishment', projectType: 'Property refurbishment',
      description: 'Fictional project for demonstrating the Job Manager.', status: 'In Progress', address: '1 Example Street, London', postcode: 'SW1A 1AA',
      startDate: '2026-07-20', endDate: '2026-08-14', estimatedDuration: '4 weeks', assignedTo: 'user-manager',
      contractValue: 10000, amountPaid: 3000, outstandingBalance: 7000, accessNotes: 'Demo access notes.', parkingNotes: 'Demo parking notes.',
      keyStatus: 'On site', internalNotes: 'This record contains no real customer information.', nextAction: 'Review sample schedule',
      scope: ['Preparation', 'Refurbishment works', 'Final inspection'], createdAt: '2026-07-01T09:00:00Z', updatedAt: '2026-07-19T09:00:00Z', provisional: false,
    },
  ],
  payments: [
    { id: 'payment-deposit', projectId: 'project-sample', title: 'Deposit', percentage: 30, amount: 3000, dueDate: '2026-07-15', paidDate: '2026-07-15', status: 'Paid', invoiceReference: 'SAMPLE-001', notes: '' },
    { id: 'payment-balance', projectId: 'project-sample', title: 'Balance', percentage: 70, amount: 7000, dueDate: '2026-08-14', paidDate: '', status: 'Due', invoiceReference: 'SAMPLE-002', notes: '' },
  ],
  events: [
    { id: 'event-sample-work', projectId: 'project-sample', type: 'Work', title: 'Sample – SW1A 1AA', startDate: '2026-07-20', endDate: '2026-08-14', allDay: true, location: '1 Example Street, London SW1A 1AA', notes: '', colourCategory: 'green', googleCalendarEventId: null },
  ],
  tasks: [
    { id: 'task-sample', projectId: 'project-sample', title: 'Review sample schedule', dueDate: '2026-07-20', assignedTo: 'user-admin', priority: 'High', completed: false, status: 'Pending' },
  ],
  documents: [],
  journalEntries: [
    { id: 'journal-sample', projectId: 'project-sample', userId: 'user-manager', category: 'Site', message: 'Example site note for the demo workspace.', createdAt: '2026-07-19T09:00:00Z', updatedAt: '2026-07-19T09:00:00Z' },
  ],
  photos: [],
  activities: [
    { id: 'activity-sample', projectId: 'project-sample', userId: 'user-admin', action: 'Sample project created', createdAt: '2026-07-01T09:00:00Z' },
  ],
}
