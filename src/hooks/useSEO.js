import { useEffect } from 'react'

/**
 * useSEO — sets document title, meta description, canonical, and OG tags.
 * Falls back gracefully if any element doesn't exist.
 */
export function useSEO({ title, description, canonical, ogTitle, ogDescription }) {
  useEffect(() => {
    const prev = {
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
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
    linkCanon.href = canonical || window.location.href

    // --- OG title ---
    const ogTitleEl = document.querySelector('meta[property="og:title"]')
    if (ogTitleEl) ogTitleEl.setAttribute('content', ogTitle || title)

    // --- OG description ---
    const ogDescEl = document.querySelector('meta[property="og:description"]')
    if (ogDescEl) ogDescEl.setAttribute('content', ogDescription || description)

    // --- OG url ---
    const ogUrlEl = document.querySelector('meta[property="og:url"]')
    if (ogUrlEl) ogUrlEl.setAttribute('content', canonical || window.location.href)

    // Restore on unmount
    return () => {
      document.title = prev.title
      if (metaDesc && prev.desc) metaDesc.setAttribute('content', prev.desc)
      if (linkCanon && prev.canonical) linkCanon.href = prev.canonical
    }
  }, [title, description, canonical, ogTitle, ogDescription])
}
