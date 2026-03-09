const services = [
  {
    title: 'General Building',
    desc: 'Structural work, extensions, and general construction projects carried out to the highest standard.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" />
      </>
    ),
  },
  {
    title: 'Full Renovations',
    desc: 'Complete property makeovers from strip-out to final finish, managed with precision and care.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    ),
  },
  {
    title: 'Bathroom Fitting',
    desc: 'Full bathroom installations including tiling, plumbing fixtures, and all finishing works.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    ),
  },
  {
    title: 'Painting & Decorating',
    desc: 'Interior and exterior painting with meticulous preparation for a clean, long-lasting finish.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16s1-1 3-1 4 2 6 2 3-1 3-1V4s-1 1-3 1-4-2-6-2-3 1-3 1z" />
        <line x1="4" y1="20" x2="4" y2="16" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: 'Flooring',
    desc: 'Supply and installation of hardwood, laminate, vinyl, and tile flooring throughout your property.',
    icon: (
      <>
        <rect x="3"  y="3"  width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="3"  width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3"  y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: 'Plasterboarding',
    desc: 'Professional dry-lining, partition walls, and plastering for smooth, impeccable surfaces.',
    icon: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="2 17 12 22 22 17" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="2 12 12 17 22 12" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
]

export default function Services() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto">

        <p className="ict-section-label" data-reveal>What We Do</p>
        <h2 className="ict-section-heading" data-reveal style={{ transitionDelay: '80ms' }}>Expert Craftsmanship Across All Trades</h2>
        <p className="ict-section-subtitle" data-reveal style={{ transitionDelay: '160ms' }}>
          From structural work to the finest finishing details — we take on projects of all sizes
          across residential and commercial properties in London.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map(({ title, desc, icon }, i) => (
            <div
              key={title}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
              className="group bg-white border border-[#D4AF37]/15 rounded-xl p-6 hover-lift cursor-default"
            >
              <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 group-hover:bg-[#D4AF37]/20">
                <svg
                  className="w-6 h-6 text-[#D4AF37] group-hover:text-[#D4AF37] transition-colors duration-300"
                  fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"
                >
                  {icon}
                </svg>
              </div>
              <h3 className="font-['Playfair_Display'] text-lg font-semibold text-[#1C1714] mb-2 group-hover:text-[#B08D2A] transition-colors duration-300">
                {title}
              </h3>
              <p className="font-['Lora'] text-sm text-[#5A5048] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => scrollTo('quote')}
            className="font-['Lora'] font-semibold text-sm tracking-wider px-8 py-3.5 rounded-lg bg-gradient-gold text-[#1C1714] transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(212,175,55,0.25)]"
          >
            Request a Free Quote
          </button>
        </div>
      </div>
    </section>
  )
}
