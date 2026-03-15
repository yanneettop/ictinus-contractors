const projects = [
  {
    id: 1,
    title: 'Full Room Decoration',
    category: 'Interior Decoration',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2032&auto=format&fit=crop',
    description: 'Full interior decoration project including surface preparation, specialist painting, and bespoke wallpapering — delivered to a premium standard for a residential property in Hackney, East London.',
  },
  {
    id: 2,
    title: 'Bathroom Renovation',
    category: 'Bathroom Fitting',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2187&auto=format&fit=crop',
    description: 'Complete strip-out and refit including new tiling, fixtures, vanity unit, and all finishing works to a high standard.',
  },
  {
    id: 3,
    title: 'Engineered Flooring',
    category: 'Hard Flooring',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2070&auto=format&fit=crop',
    description: 'Supply and installation of engineered oak flooring across an open-plan living area, with precision cutting and integrated skirting.',
  },
  {
    id: 4,
    title: 'Full Property Refurbishment',
    category: 'Property Refurbishment',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'Multi-room project covering plastering, decorating, flooring, and all finishing carpentry — managed and delivered on schedule.',
  },
  {
    id: 5,
    title: 'Finishing & Detail Work',
    category: 'Finishing Carpentry',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    description: 'Skirting boards, architraves, door hanging, and bespoke shelving installed to complete a high-end interior renovation.',
  },
  {
    id: 6,
    title: 'Commercial Office Refresh',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    description: 'Decorating and finishing works for a Canary Wharf office, delivered to a tight deadline with minimal disruption.',
  },
]

export default function Portfolio() {
  const [featured, ...rest] = projects

  return (
    <section id="portfolio" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6]">
      <div className="max-w-6xl mx-auto">

        {/* ── Section intro ── */}
        <div className="text-center mb-16" data-reveal>
          <p className="ict-section-label">Selected Work</p>
          <h2 className="ict-section-heading">Featured Projects</h2>
          <p className="ict-section-subtitle" style={{ maxWidth: '36rem' }}>
            A curated selection of completed projects — from single-room transformations
            to full property refurbishments across London.
          </p>
        </div>

        {/* ── Featured project — full-width horizontal card ── */}
        <div
          data-reveal
          className="group rounded-[14px] border border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.38)] bg-[#FDFCF9] shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:-translate-y-[2px] hover:shadow-[0_14px_36px_rgba(0,0,0,0.09),0_3px_10px_rgba(212,175,55,0.07)] overflow-hidden transition-all duration-300 mb-8"
        >
          <div className="flex flex-col lg:flex-row">

            {/* Image — left 56%, pinned to fill the container */}
            <div className="relative w-full lg:w-[56%] flex-shrink-0 overflow-hidden min-h-[260px] sm:min-h-[320px] lg:min-h-[420px]">
              <img
                src={featured.image}
                alt={featured.title}
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              />
              {/* Subtle vignette at bottom edge for seamless blending on mobile */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FDFCF9]/60 to-transparent lg:hidden" />
            </div>

            {/* Content — right side, vertically centred */}
            <div className="flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-14">
              <span className="font-['Montserrat'] text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#A88636] mb-3.5 block">
                {featured.category}
              </span>
              <h3 className="font-['Playfair_Display'] text-[1.5rem] lg:text-[1.75rem] font-semibold text-[#1C1714] mb-5 leading-[1.18] tracking-[-0.02em]">
                {featured.title}
              </h3>
              {/* Thin gold rule — editorial detail */}
              <div className="w-10 h-px bg-[rgba(212,175,55,0.55)] mb-5" />
              <p className="font-['Lora'] text-[1rem] text-[#5A5048] leading-[1.75]">
                {featured.description}
              </p>
            </div>
          </div>
        </div>

        {/* ── Supporting project grid — 5 cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {rest.map((p, i) => (
            <div
              key={p.id}
              data-reveal
              style={{ transitionDelay: `${(i + 1) * 80}ms` }}
              className="group overflow-hidden rounded-[14px] border border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.4)] bg-[#FDFCF9] shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(0,0,0,0.09),0_2px_8px_rgba(212,175,55,0.07)] transition-all duration-300"
            >
              {/* Image */}
              <div className="aspect-[16/11] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                />
              </div>

              {/* Text content */}
              <div className="px-6 py-6">
                <span className="font-['Montserrat'] text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-[#A88636] mb-2.5 block">
                  {p.category}
                </span>
                <h3 className="font-['Playfair_Display'] text-[1.1875rem] font-semibold text-[#1C1714] mb-2.5 leading-snug tracking-[-0.01em]">
                  {p.title}
                </h3>
                <p className="text-[#5A5048] text-[0.875rem] font-['Lora'] leading-[1.7]">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Section CTA ── */}
        <div className="text-center mt-14">
          <button
            onClick={() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })}
            className="group inline-flex items-center gap-2.5 font-['Lora'] font-semibold text-[0.9375rem] tracking-wide px-9 py-3.5 rounded-lg bg-gradient-gold text-[#1C1714] hover:-translate-y-0.5 transition-all duration-300 shadow-[0_4px_14px_rgba(212,175,55,0.25)]"
          >
            Discuss Your Project
            <svg
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

      </div>
    </section>
  )
}
