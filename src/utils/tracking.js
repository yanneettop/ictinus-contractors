const isBrowser = typeof window !== 'undefined'

function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '')
  )
}

export function trackEvent(eventName, params = {}) {
  if (!isBrowser || !eventName) return

  try {
    const eventParams = cleanParams({
      page_path: window.location.pathname,
      ...params,
    })

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams)
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: eventName,
        ...eventParams,
      })
    }

    if (import.meta.env.DEV) {
      console.debug('[tracking]', eventName, eventParams)
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[tracking] event skipped', eventName, error)
    }
  }
}

export function trackQuoteFormSubmit(params = {}) {
  trackEvent('quote_form_submit', params)
}

export function trackThankYouView(params = {}) {
  trackEvent('thank_you_view', params)
}

export function trackPhoneClick(params = {}) {
  trackEvent('phone_click', params)
}

export function trackEmailClick(params = {}) {
  trackEvent('email_click', params)
}

export function trackServiceCtaClick(params = {}) {
  trackEvent('service_cta_click', {
    source_page: isBrowser ? window.location.pathname : undefined,
    ...params,
  })
}

export function trackWhatsAppClick(params = {}) {
  trackEvent('whatsapp_click', params)
}
