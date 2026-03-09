const projects = [
  {
    id: 1,
    title: 'Full Room Decoration',
    category: 'Painting & Decorating',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2032&auto=format&fit=crop',
    description: 'Complete interior decoration including preparation, painting, and wallpapering for a residential property in Hackney.',
  },
  {
    id: 2,
    title: 'Bathroom Upgrade',
    category: 'Bathroom Fitting',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2187&auto=format&fit=crop',
    description: 'Full bathroom strip-out and refit with new tiling, fixtures, vanity unit, and finishing works.',
  },
  {
    id: 3,
    title: 'Engineered Flooring Installation',
    category: 'Hard Flooring',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2070&auto=format&fit=crop',
    description: 'Supply and installation of engineered oak flooring across an open-plan living area with precision cutting and skirting.',
  },
  {
    id: 4,
    title: 'Interior Refurbishment',
    category: 'Property Refurbishment',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'Multi-room refurbishment including plastering, decorating, flooring, and all finishing carpentry details.',
  },
  {
    id: 5,
    title: 'Finishing & Detail Work',
    category: 'Finishing Carpentry',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    description: 'Skirting boards, architraves, door hanging, and bespoke shelving fitted to complete a high-end interior renovation.',
  },
  {
    id: 6,
    title: 'Commercial Office Refresh',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    description: 'Decorating and finishing works for a Canary Wharf office space, delivered to a tight deadline with minimal disruption.',
  },
]

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6]">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14" data-reveal>
          <p className="ict-section-label">Portfolio</p>
          <h2 className="ict-section-heading">Featured Projects</h2>
          <p className="ict-section-subtitle">
            A selection of recent work showcasing the range and quality of our decorating,
            refurbishment, and finishing services across London.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <div
              key={p.id}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
              className="group relative overflow-hidden rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/35 transition-all duration-500 bg-white shadow-sm hover:shadow-md"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#B08D2A] text-[0.7rem] font-semibold font-['Lora'] tracking-wider mb-2">
                  {p.category}
                </span>
                <h3 className="font-['Playfair_Display'] text-[1.1rem] font-semibold text-[#1C1714] mb-1.5">
                  {p.title}
                </h3>
                <p className="text-[#5A5048] text-[0.82rem] font-['Lora'] leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-block bg-gradient-gold text-[#1C1714] font-semibold font-['Lora'] text-sm tracking-wider px-8 py-3.5 rounded-lg hover:-translate-y-0.5 transition-all duration-300 shadow-[0_4px_14px_rgba(212,175,55,0.25)]"
          >
            Discuss Your Project
          </button>
        </div>
      </div>
    </section>
  )
}
