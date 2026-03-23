/**
 * Smooth section transition dividers.
 *
 * Variants:
 *   "curve-down"   — light section flowing into dark section (cream → dark)
 *   "curve-up"     — dark section flowing into light section (dark → cream)
 *   "ornament"     — subtle gold ornamental line between same-tone sections
 *   "angle-down"   — angled cut, light → dark
 *   "angle-up"     — angled cut, dark → light
 */
export default function SectionDivider({ variant = 'curve-down', fromColor, toColor, className = '' }) {
  if (variant === 'ornament') {
    return (
      <div className={`relative py-2 bg-[${fromColor || '#FAF9F6'}] ${className}`}>
        <div className="flex items-center justify-center gap-4 px-4">
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#D4AF37]/30" />
          <svg width="20" height="20" viewBox="0 0 20 20" className="text-[#D4AF37]/40 flex-shrink-0">
            <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="currentColor" />
          </svg>
          <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#D4AF37]/30" />
        </div>
      </div>
    )
  }

  const from = fromColor || (variant.includes('down') ? '#FAF9F6' : '#1C1714')
  const to = toColor || (variant.includes('down') ? '#1C1714' : '#FAF9F6')

  if (variant === 'curve-down') {
    return (
      <div className={`relative -mb-px ${className}`} style={{ background: from }}>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="block w-full h-[40px] sm:h-[60px] lg:h-[80px]"
          fill="none"
        >
          <path
            d="M0,0 C360,80 1080,80 1440,0 L1440,80 L0,80 Z"
            fill={to}
          />
        </svg>
      </div>
    )
  }

  if (variant === 'curve-up') {
    return (
      <div className={`relative -mb-px ${className}`} style={{ background: to }}>
        <svg
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
          className="block w-full h-[40px] sm:h-[60px] lg:h-[80px]"
          fill="none"
        >
          <path
            d="M0,80 C360,0 1080,0 1440,80 L1440,0 L0,0 Z"
            fill={from}
          />
        </svg>
      </div>
    )
  }

  if (variant === 'angle-down') {
    return (
      <div className={`relative -mb-px ${className}`} style={{ background: to }}>
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="block w-full h-[30px] sm:h-[45px] lg:h-[60px]"
          fill="none"
        >
          <polygon points="0,0 1440,0 1440,60" fill={from} />
        </svg>
      </div>
    )
  }

  if (variant === 'angle-up') {
    return (
      <div className={`relative -mb-px ${className}`} style={{ background: to }}>
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="block w-full h-[30px] sm:h-[45px] lg:h-[60px]"
          fill="none"
        >
          <polygon points="0,0 0,60 1440,0" fill={from} />
        </svg>
      </div>
    )
  }

  return null
}
