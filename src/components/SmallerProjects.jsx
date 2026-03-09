const cards = [
  {
    title: 'TV & Media Wall Mounting',
    desc: 'Secure, level installations with concealed cabling for a clean, finished look.',
    icon: (
      <>
        <rect x="2" y="7" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 2l-5 5-5-5" />
      </>
    ),
  },
  {
    title: 'Door Repairs & Adjustments',
    desc: 'Sticking doors, hinge replacements, and frame adjustments handled with precision.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: 'Silicone & Bathroom Sealing',
    desc: 'Professional resealing of baths, showers, and sinks to prevent leaks and mould.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 17l10 5 10-5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12l10 5 10-5" />
      </>
    ),
  },
  {
    title: 'Lighting & Electrical Fittings',
    desc: 'Pendant lights, downlights, and switch upgrades installed safely and neatly.',
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    ),
  },
  {
    title: 'Minor Plumbing Repairs',
    desc: 'Tap replacements, toilet repairs, and small leak fixes resolved efficiently.',
    icon: (
      <path
        strokeLinecap="round" strokeLinejoin="round"
        d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
      />
    ),
  },
  {
    title: 'Furniture & Built-in Installation',
    desc: 'Flat-pack assembly, shelving, and bespoke built-in units fitted to your specification.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </>
    ),
  },
]

export default function SmallerProjects() {
  return (
    <section className="ict-small-projects">
      <div className="ict-small-projects-inner">
        <p className="ict-section-label">Home Maintenance</p>
        <h2 className="ict-section-heading">Smaller Projects &amp; Home Maintenance</h2>
        <p className="ict-section-subtitle">
          We also take on carefully executed small residential projects across London.
        </p>

        <div className="ict-small-grid">
          {cards.map(({ title, desc, icon }, i) => (
            <div key={title} className="ict-small-card" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="ict-small-card-icon">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  {icon}
                </svg>
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>

        <p className="ict-section-closing">
          Whether it&rsquo;s a small improvement or part of a larger renovation, every project is
          completed with the same attention to detail.
        </p>
      </div>
    </section>
  )
}
