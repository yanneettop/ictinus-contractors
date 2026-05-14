import { useEffect } from 'react'
import { trackEmailClick, trackPhoneClick } from '../utils/tracking'

function getLinkLocation(link) {
  return link.dataset.linkLocation || link.getAttribute('aria-label') || link.textContent?.trim()
}

export default function useContactLinkTracking() {
  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest?.('a[href^="tel:"], a[href^="mailto:"]')
      if (!link) return

      const href = link.getAttribute('href') || ''
      const linkLocation = getLinkLocation(link)

      if (href.startsWith('tel:')) {
        trackPhoneClick({
          phone_number: href.replace('tel:', ''),
          link_location: linkLocation,
        })
      }

      if (href.startsWith('mailto:')) {
        trackEmailClick({
          email_address: href.replace('mailto:', '').split('?')[0],
          link_location: linkLocation,
        })
      }
    }

    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}
