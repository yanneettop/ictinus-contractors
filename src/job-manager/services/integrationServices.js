import { mapsUrl } from '../utils/format'

const normalisePhone = (phone = '') => phone.replace(/\D/g, '').replace(/^0/, '44')

export const communicationService = {
  phoneUrl: (client) => `tel:${client.phone.replace(/\s/g, '')}`,
  emailUrl: (client, project) => `mailto:${client.email}?subject=${encodeURIComponent(`Ictinus · ${project.title}`)}`,
  whatsappUrl: (client, project) => `https://wa.me/${normalisePhone(client.phone)}?text=${encodeURIComponent(`Hello ${client.name.split(' ')[0]}, a quick update about ${project.title}: `)}`,
  copyClientDetails: (client) => navigator.clipboard.writeText(`${client.name}\n${client.phone}\n${client.email}`),
}

export const locationService = {
  mapsUrl: (project) => mapsUrl(project.address, project.postcode),
  copyAddress: (project) => navigator.clipboard.writeText(`${project.address}, ${project.postcode}`),
}

export const googleCalendarService = {
  projectUrl: (project) => {
    const dates = `${project.startDate.replaceAll('-', '')}/${project.endDate.replaceAll('-', '')}`
    const params = new URLSearchParams({ action: 'TEMPLATE', text: project.title, dates, location: `${project.address}, ${project.postcode}`, details: `Ictinus project · ${project.status}` })
    return `https://calendar.google.com/calendar/render?${params}`
  },
}

export const invoiceService = {
  generate: () => ({ available: false, message: 'Invoice generation will be connected to the server-side document service.' }),
}

// Future adapters: replace browser URLs/clipboard calls with audited server-side
// Supabase, Google, Twilio/WhatsApp and email integrations without changing UI code.
