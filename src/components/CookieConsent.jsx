import { useEffect, useState } from 'react'
import {
  getStoredConsent,
  initConsent,
  onOpenCookieSettings,
  saveConsent,
} from '../utils/consent'

function Toggle({ id, label, description, checked, disabled, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div>
        <label
          htmlFor={id}
          className={`block font-['Plus_Jakarta_Sans'] text-[0.8rem] font-semibold text-[#1C1714] ${disabled ? '' : 'cursor-pointer'}`}
        >
          {label}
        </label>
        <p className="mt-0.5 font-['Source_Serif_4'] text-[0.8rem] leading-snug text-[#5A5048]">
          {description}
        </p>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative mt-0.5 h-[22px] w-[40px] flex-shrink-0 rounded-full transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D2A] ${
          checked ? 'bg-[#C5A048]' : 'bg-[#D8D2C6]'
        } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow-sm transition-[left] duration-200 ${
            checked ? 'left-[21px]' : 'left-[3px]'
          }`}
        />
      </button>
    </div>
  )
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const stored = initConsent()
    if (!stored) {
      setVisible(true)
    } else {
      setAnalytics(stored.analytics)
      setMarketing(stored.marketing)
    }

    return onOpenCookieSettings(() => {
      const current = getStoredConsent()
      setAnalytics(Boolean(current?.analytics))
      setMarketing(Boolean(current?.marketing))
      setExpanded(true)
      setVisible(true)
    })
  }, [])

  if (!visible) return null

  const close = () => {
    setVisible(false)
    setExpanded(false)
  }

  const decide = (a, m) => {
    saveConsent({ analytics: a, marketing: m })
    setAnalytics(a)
    setMarketing(m)
    close()
  }

  const primaryBtn =
    "rounded-[5px] bg-[#1C1714] px-4 py-2 font-['Plus_Jakarta_Sans'] text-[0.78rem] font-semibold text-[#F9F7F2] transition-colors hover:bg-[#33291F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D2A]"
  const secondaryBtn =
    "rounded-[5px] border border-[#1C1714]/22 px-4 py-2 font-['Plus_Jakarta_Sans'] text-[0.78rem] font-semibold text-[#1C1714] transition-colors hover:border-[#1C1714]/45 hover:bg-[#1C1714]/4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D2A]"
  const tertiaryBtn =
    "px-2 py-2 font-['Plus_Jakarta_Sans'] text-[0.78rem] font-semibold text-[#5A5048] underline decoration-[#C5A048]/50 underline-offset-4 transition-colors hover:text-[#1C1714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D2A]"

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      className="fixed bottom-3 left-3 right-3 z-[60] max-h-[80vh] overflow-y-auto rounded-md border border-[#1C1714]/12 bg-[#F9F7F2]/95 p-5 shadow-[0_18px_48px_rgba(28,23,20,0.16)] backdrop-blur-sm sm:bottom-6 sm:left-6 sm:right-auto sm:w-full sm:max-w-[440px]"
    >
      <h2
        id="cookie-consent-title"
        className="font-['Cormorant_Garamond'] text-[1.25rem] font-semibold leading-tight text-[#1C1714]"
      >
        Cookie preferences
      </h2>
      <p className="mt-2 font-['Source_Serif_4'] text-[0.85rem] leading-relaxed text-[#4A4A4A]">
        We use essential cookies to keep the site working. Optional analytics and marketing
        cookies help us understand enquiries and improve the website experience.
      </p>

      {expanded && (
        <div className="mt-3 divide-y divide-[#1C1714]/8 border-y border-[#1C1714]/10">
          <Toggle
            id="cookie-toggle-necessary"
            label="Strictly necessary cookies"
            description="Required for core website and form functionality."
            checked
            disabled
          />
          <Toggle
            id="cookie-toggle-analytics"
            label="Analytics cookies"
            description="Help us understand site usage and improve enquiries."
            checked={analytics}
            onChange={setAnalytics}
          />
          <Toggle
            id="cookie-toggle-marketing"
            label="Marketing cookies"
            description="Used for future advertising and conversion measurement."
            checked={marketing}
            onChange={setMarketing}
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {expanded ? (
          <>
            <button type="button" className={primaryBtn} onClick={() => decide(analytics, marketing)}>
              Save preferences
            </button>
            <button type="button" className={secondaryBtn} onClick={() => decide(true, true)}>
              Accept all
            </button>
            <button type="button" className={tertiaryBtn} onClick={() => decide(false, false)}>
              Reject optional
            </button>
          </>
        ) : (
          <>
            <button type="button" className={primaryBtn} onClick={() => decide(true, true)}>
              Accept all
            </button>
            <button type="button" className={secondaryBtn} onClick={() => decide(false, false)}>
              Reject optional
            </button>
            <button type="button" className={tertiaryBtn} onClick={() => setExpanded(true)}>
              Customise
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
