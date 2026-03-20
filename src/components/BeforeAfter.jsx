import { useState, useRef, useEffect } from 'react'

/* ── Draggable comparison slider ──────────────────────────────────── */
function ComparisonSlider({ before, after }) {
  const [pos, setPos]       = useState(50)
  const containerRef        = useRef(null)
  const dragging            = useRef(false)

  useEffect(() => {
    const getPos = (clientX) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return 50
      return Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 2), 98)
    }

    const onUp       = ()  => { dragging.current = false }
    const onMove     = (e) => { if (dragging.current) setPos(getPos(e.clientX)) }
    const onTouchMove = (e) => {
      if (!dragging.current) return
      e.preventDefault()
      setPos(getPos(e.touches[0].clientX))
    }

    window.addEventListener('mouseup',    onUp)
    window.addEventListener('mousemove',  onMove)
    window.addEventListener('touchend',   onUp)
    window.addEventListener('touchmove',  onTouchMove, { passive: false })
    return () => {
      window.removeEventListener('mouseup',    onUp)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('touchend',   onUp)
      window.removeEventListener('touchmove',  onTouchMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden cursor-ew-resize select-none"
      style={{ touchAction: 'none' }}
      onMouseDown={() => { dragging.current = true }}
      onTouchStart={() => { dragging.current = true }}
      role="slider"
      aria-valuenow={Math.round(pos)}
      aria-label="Drag to compare before and after"
    >
      {/* ── Base layer — Before image ── */}
      <div className="aspect-[16/9]">
        <img
          src={before.src}
          alt={before.alt}
          draggable="false"
          loading="lazy"
          className="w-full h-full object-cover block pointer-events-none"
        />
      </div>

      {/* ── Overlay — After image, clipped from the right ── */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img
          src={after.src}
          alt={after.alt}
          draggable="false"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* ── Divider line ── */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/60 pointer-events-none"
        style={{ left: `${pos}%` }}
      />

      {/* ── Handle ── */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white shadow-[0_2px_14px_rgba(0,0,0,0.28),0_1px_4px_rgba(0,0,0,0.14)] flex items-center justify-center pointer-events-none z-10"
        style={{ left: `${pos}%` }}
      >
        {/* Horizontal double-arrow icon */}
        <svg
          className="w-[1.05rem] h-[1.05rem] text-[#2E2620] flex-shrink-0"
          fill="none" viewBox="0 0 20 20"
          stroke="currentColor" strokeWidth="2.25"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 8l-3 3 3 3M14 8l3 3-3 3" />
        </svg>
      </div>

      {/* ── BEFORE label ── */}
      <span className="absolute top-3.5 left-4 pointer-events-none z-10">
        <span className="font-['Plus_Jakarta_Sans'] text-[0.6rem] font-semibold uppercase tracking-[0.13em] bg-[rgba(18,13,10,0.68)] text-white/95 px-2.5 py-[0.28rem] rounded-[4px]">
          Before
        </span>
      </span>

      {/* ── AFTER label ── */}
      <span className="absolute top-3.5 right-4 pointer-events-none z-10">
        <span className="font-['Plus_Jakarta_Sans'] text-[0.6rem] font-semibold uppercase tracking-[0.13em] bg-[rgba(212,175,55,0.88)] text-[#1C1714] px-2.5 py-[0.28rem] rounded-[4px]">
          After
        </span>
      </span>

      {/* ── Drag hint — faint, bottom-centre ── */}
      <span className="absolute bottom-3.5 left-1/2 -translate-x-1/2 pointer-events-none z-10">
        <span className="font-['Plus_Jakarta_Sans'] text-[0.575rem] font-medium uppercase tracking-[0.1em] text-white/45">
          ← drag to compare →
        </span>
      </span>
    </div>
  )
}

/* ── Data ─────────────────────────────────────────────────────────── */
const pairs = [
  {
    id: 1,
    title: 'Full Room Decoration',
    scope: 'Plastering repairs · Specialist painting · Full decorating',
    before: {
      src: '/Portfolio/Room_dec_Before.png',
      alt: 'Living room before decoration',
    },
    after: {
      src: '/Portfolio/Room_dec_after.png',
      alt: 'Living room after decoration',
    },
    caption: 'From dated and worn to a clean, polished finish — careful surface preparation and skilled decorating, delivered to a premium standard.',
  },
  {
    id: 2,
    title: 'Bathroom Refurbishment',
    scope: 'Full strip-out · Premium tiling · Fixtures & vanity · Finishing works',
    before: {
      src: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop',
      alt: 'Bathroom before refurbishment',
    },
    after: {
      src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1200&auto=format&fit=crop',
      alt: 'Bathroom after refurbishment',
    },
    caption: 'A complete refit from a tired, dated bathroom to a refined, functional space — every detail selected and fitted to a high standard.',
  },
]

/* ── Section ──────────────────────────────────────────────────────── */
export default function BeforeAfter() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="ict-ba-section">
      <div className="ict-ba-inner">

        {/* Section intro */}
        <div className="text-center mb-14" data-reveal>
          <p className="ict-section-label">Transformations</p>
          <h2 className="ict-section-heading" style={{ maxWidth: '22rem', marginInline: 'auto' }}>
            Before &amp; After
          </h2>
          <p className="ict-section-subtitle" style={{ maxWidth: '34rem' }}>
            The proof of our workmanship — every transformation delivered with
            precision, care, and a finish that lasts.
          </p>
        </div>

        {/* Comparison pairs */}
        <div className="space-y-10">
          {pairs.map(({ id, title, scope, before, after, caption }, i) => (
            <div
              key={id}
              data-reveal
              style={{ transitionDelay: `${i * 120}ms` }}
              className="bg-[#FDFCF9] rounded-[14px] border border-[rgba(212,175,55,0.2)] shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden"
            >
              {/* ── Comparison slider — flush to card edges ── */}
              <ComparisonSlider before={before} after={after} />

              {/* ── Project details ── */}
              <div className="px-7 py-7 sm:px-8 sm:py-8">
                {/* Title + scope row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-y-3 gap-x-8 mb-5">
                  <h3 className="font-['Cormorant_Garamond'] text-[1.25rem] font-semibold text-[#1C1714] leading-snug tracking-[-0.01em] flex-shrink-0">
                    {title}
                  </h3>
                  <p className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[#A88636] sm:text-right leading-[1.7]">
                    {scope}
                  </p>
                </div>

                {/* Thin gold rule */}
                <div className="w-8 h-px bg-[rgba(212,175,55,0.45)] mb-5" />

                {/* Caption */}
                <p className="font-['Source_Serif_4'] text-[0.9375rem] text-[#5A5048] leading-[1.72]">
                  {caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Microcopy + CTA */}
        <div className="text-center mt-14" data-reveal>
          <p className="font-['Source_Serif_4'] text-[0.9375rem] italic text-[#7A6E65] mb-6 leading-[1.7]">
            Clear transformation, careful execution, lasting finish.
          </p>
          <button
            onClick={() => scrollTo('quote')}
            className="inline-flex items-center gap-2.5 font-['Source_Serif_4'] font-semibold text-[0.9375rem] tracking-wide px-8 py-3.5 rounded-lg bg-gradient-gold text-[#1C1714] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_4px_14px_rgba(212,175,55,0.25)]"
          >
            Discuss a Similar Project
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  )
}
