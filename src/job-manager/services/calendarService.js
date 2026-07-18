export const calendarService = {
  async createExternalEvent() {
    throw new Error('Google Calendar is not connected.')
  },
  async updateExternalEvent() {
    throw new Error('Google Calendar is not connected.')
  },
  async removeExternalEvent() {
    throw new Error('Google Calendar is not connected.')
  },
}

// TODO: Add a Cloudflare Pages server endpoint for Google OAuth, store refresh
// tokens server-side, call the Google Calendar API there, and persist the returned
// event id to ProjectEvent.googleCalendarEventId. Never expose OAuth secrets here.
