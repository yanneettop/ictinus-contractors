export const leadStages = ['New', 'Contacted', 'Site Visit Booked', 'Site Visit Completed', 'Quote Preparing', 'Quote Sent', 'Follow-up Due', 'Negotiation', 'Won', 'Lost', 'Archived']
export const activeLeadStages = leadStages.filter((stage) => !['Won', 'Lost', 'Archived'].includes(stage))
export const leadSources = ['Website', 'Google Business Profile', 'Google Search', 'Referral', 'Bark', 'Checkatrade', 'Social Media', 'Repeat Client', 'Other']
export const projectTypes = ['Interior Painting', 'Exterior Painting', 'Decorating', 'Property Refurbishment', 'Kitchen Painting', 'Repairs', 'Commercial', 'Other']

export function leadAttention(lead, now = new Date()) {
  return activeLeadStages.includes(lead.stage) && lead.nextActionDueAt && new Date(lead.nextActionDueAt) <= now
}

export function findLeadDuplicates(leads, candidate, excludedId) {
  const cleanPhone = (value) => (value || '').replace(/\D/g, '')
  const email = (candidate.email || '').trim().toLowerCase(); const phone = cleanPhone(candidate.phone); const postcode = (candidate.postcode || '').replace(/\s/g, '').toUpperCase(); const name = (candidate.clientName || '').trim().toLowerCase()
  return leads.filter((lead) => lead.id !== excludedId && ((email && lead.email?.toLowerCase() === email) || (phone && cleanPhone(lead.phone) === phone) || (name && postcode && lead.clientName?.toLowerCase() === name && lead.postcode?.replace(/\s/g, '').toUpperCase() === postcode)))
}
