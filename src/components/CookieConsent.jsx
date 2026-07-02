import { useEffect, useState } from 'react'
import {
  getStoredConsent,
  initConsent,
  onOpenCookieSettings,
  saveConsent,
} from '../utils/consent'

const AUTO_SHOW_DELAY_MS = 2200

function Toggle({ id, label, description, checked, disabled, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div>
        <label
          htmlFor={id}
          className={`block font-['Source_Serif_4'] text-[0.84rem] font-semibold text-[#1C1714] ${disabled ? '' : 'cursor-pointer'}`}
        >
          {label}
        </label>
        <p className="mt-0.5 font-['Source_Serif_4'] text-[0.82rem] leading-snug text-[#3E3832]">
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
    let showTimer
    const stored = initConsent()
    if (!stored) {
      showTimer = window.setTimeout(() => {
        setVisible(true)
      }, AUTO_SHOW_DELAY_MS)
    } else {
      setAnalytics(stored.analytics)
      setMarketing(stored.marketing)
    }

    const unsubscribe = onOpenCookieSettings(() => {
      if (showTimer) window.clearTimeout(showTimer)
      const current = getStoredConsent()
      setAnalytics(Boolean(current?.analytics))
      setMarketing(Boolean(current?.marketing))
      setExpanded(true)
      setVisible(true)
    })

    return () => {
      if (showTimer) window.clearTimeout(showTimer)
      unsubscribe?.()
    }
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
    "rounded-[5px] bg-[#1C1714] px-4 py-2 font-['Source_Serif_4'] text-[0.94rem] font-semibold text-[#FDFBF6] transition-colors hover:bg-[#33291F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D2A]"
  const secondaryBtn =
    "rounded-[5px] border border-[#1C1714]/24 bg-white/55 px-4 py-2 font-['Source_Serif_4'] text-[0.94rem] font-semibold text-[#1C1714] transition-colors hover:border-[#1C1714]/45 hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D2A]"
  const tertiaryBtn =
    "px-2 py-2 font-['Source_Serif_4'] text-[0.94rem] font-semibold text-[#3E3832] underline decoration-[#C5A048]/70 underline-offset-4 transition-colors hover:text-[#1C1714] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B08D2A]"

  return (
    <aside
      role="region"
      aria-labelledby="cookie-consent-title"
      className={`cookie-consent-shell fixed bottom-3 left-1/2 z-[60] w-[calc(100%-1.5rem)] -translate-x-1/2 overflow-y-auto rounded-md border border-white/75 bg-[rgba(255,253,247,0.94)] shadow-[0_12px_34px_rgba(28,23,20,0.15)] backdrop-blur-md sm:bottom-5 ${
        expanded ? 'max-h-[78vh] max-w-[720px] p-4 sm:p-5' : 'max-w-[860px] px-3.5 py-2.5 sm:px-4'
      }`}
    >
      <div className={`gap-3 ${expanded ? 'block' : 'flex flex-col sm:flex-row sm:items-center sm:justify-between'}`}>
        <div className={expanded ? '' : 'min-w-0 sm:pr-3'}>
          <h2
            id="cookie-consent-title"
            className={`font-['Source_Serif_4'] font-semibold leading-tight text-[#1C1714] ${
              expanded ? 'text-[1.22rem]' : 'text-[1rem] sm:text-[1.08rem]'
            }`}
          >
            Cookie preferences
          </h2>
          <p
            className={`font-['Source_Serif_4'] font-medium text-[#2F2A25] ${
              expanded
                ? 'mt-2 text-[0.9rem] leading-relaxed'
                : 'mt-0.5 text-[0.86rem] leading-snug sm:max-w-[540px]'
            }`}
          >
            We use essential cookies, plus optional analytics and marketing cookies if you allow them.
          </p>
        </div>

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

        <div className={`flex flex-wrap items-center gap-2 ${expanded ? 'mt-4' : 'shrink-0 sm:justify-end'}`}>
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
                Reject
              </button>
              <button type="button" className={tertiaryBtn} onClick={() => setExpanded(true)}>
                Customise
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
