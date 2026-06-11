const STORAGE_KEY = 'ictinus-cookie-consent'
const CONSENT_VERSION = 1
const OPEN_SETTINGS_EVENT = 'ict:open-cookie-settings'

const isBrowser = typeof window !== 'undefined'

// Guards so third-party scripts are injected at most once per page load,
// no matter how many times preferences are re-saved.
const loadedScripts = {
  clarity: false,
  ahrefs: false,
}

export function getStoredConsent() {
  if (!isBrowser) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed?.version !== CONSENT_VERSION) return null
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    }
  } catch {
    return null
  }
}

export function saveConsent({ analytics, marketing }) {
  const consent = { necessary: true, analytics: Boolean(analytics), marketing: Boolean(marketing) }
  if (isBrowser) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: CONSENT_VERSION, ...consent, savedAt: new Date().toISOString() })
      )
    } catch {
      // Private mode / storage blocked: consent still applies for this session.
    }
  }
  applyConsent(consent)
  return consent
}

/* ── Script loaders (one per tool, easy to extend) ── */

function loadClarity() {
  if (loadedScripts.clarity || window.clarity) return
  loadedScripts.clarity = true
  ;(function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) }
    t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y)
  })(window, document, 'clarity', 'script', 'wlxga8ml5b')
}

function loadAhrefs() {
  if (loadedScripts.ahrefs) return
  loadedScripts.ahrefs = true
  const script = document.createElement('script')
  script.src = 'https://analytics.ahrefs.com/analytics.js'
  script.async = true
  script.setAttribute('data-key', 'U2RJvTWO/kzFnks+BT6ZGw')
  document.head.appendChild(script)
}

/* ── Apply consent to all tracking tools ── */

export function applyConsent(consent) {
  if (!isBrowser || !consent) return

  // Google Consent Mode v2 (gtag.js loads with defaults denied in index.html).
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
    })
  }

  if (consent.analytics) {
    loadClarity()
    loadAhrefs()
  }

  // Future marketing-only scripts (Meta Pixel, Google Ads remarketing, …)
  // get their loader called here behind `consent.marketing`.
}

// Re-apply a previously stored choice on page load.
export function initConsent() {
  const stored = getStoredConsent()
  if (stored) applyConsent(stored)
  return stored
}

/* ── Reopen-settings event (footer link → banner) ── */

export function openCookieSettings() {
  if (isBrowser) window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT))
}

export function onOpenCookieSettings(handler) {
  if (!isBrowser) return () => {}
  window.addEventListener(OPEN_SETTINGS_EVENT, handler)
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, handler)
}
