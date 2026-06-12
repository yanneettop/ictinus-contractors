import { useEffect } from 'react'

const SITE_ORIGIN = 'https://www.ictinuscontractors.co.uk'

function normalizeCanonical(canonical) {
  const url = new URL(canonical || window.location.pathname, SITE_ORIGIN)

  url.protocol = 'https:'
  url.hostname = 'www.ictinuscontractors.co.uk'
  url.search = ''
  url.hash = ''

  if (url.pathname.length > 1) {
    url.pathname = url.pathname.replace(/\/+$/, '')
  }

  return url.toString()
}

/**
 * useSEO — sets document title, meta description, canonical, and OG tags.
 * Falls back gracefully if any element doesn't exist.
 */
export function useSEO({ title, description, canonical, ogTitle, ogDescription, robots }) {
  useEffect(() => {
    const existingRobots = document.querySelector('meta[name="robots"]')
    const prev = {
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      robots: existingRobots?.content,
      hadRobots: Boolean(existingRobots),
    }

    // --- Title ---
    document.title = title

    // --- Meta description ---
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', description)

    // --- Canonical ---
    let linkCanon = document.querySelector('link[rel="canonical"]')
    if (!linkCanon) {
      linkCanon = document.createElement('link')
      linkCanon.rel = 'canonical'
      document.head.appendChild(linkCanon)
    }
    const canonicalUrl = normalizeCanonical(canonical)
    linkCanon.href = canonicalUrl

    // --- Robots ---
    let robotsMeta = document.querySelector('meta[name="robots"]')
    if (robots) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta')
        robotsMeta.name = 'robots'
        document.head.appendChild(robotsMeta)
      }
      robotsMeta.setAttribute('content', robots)
    }

    // --- OG title ---
    const ogTitleEl = document.querySelector('meta[property="og:title"]')
    if (ogTitleEl) ogTitleEl.setAttribute('content', ogTitle || title)

    // --- OG description ---
    const ogDescEl = document.querySelector('meta[property="og:description"]')
    if (ogDescEl) ogDescEl.setAttribute('content', ogDescription || description)

    // --- OG url ---
    const ogUrlEl = document.querySelector('meta[property="og:url"]')
    if (ogUrlEl) ogUrlEl.setAttribute('content', canonicalUrl)

    // Restore on unmount
    return () => {
      document.title = prev.title
      if (metaDesc && prev.desc) metaDesc.setAttribute('content', prev.desc)
      if (linkCanon && prev.canonical) linkCanon.href = prev.canonical
      if (robotsMeta) {
        if (prev.hadRobots && prev.robots) {
          robotsMeta.setAttribute('content', prev.robots)
        } else {
          robotsMeta.remove()
        }
      }
    }
  }, [title, description, canonical, ogTitle, ogDescription, robots])
}
