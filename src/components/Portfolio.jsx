const projects = [
  {
    id: 1,
    title: 'Victorian Home Restoration',
    category: 'Renovation',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'Complete restoration of a Victorian property in Kensington.',
  },
  {
    id: 2,
    title: 'Modern Bathroom Remodel',
    category: 'Bathroom',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2187&auto=format&fit=crop',
    description: 'Luxury bathroom installation with premium fixtures and finishes.',
  },
  {
    id: 3,
    title: 'Contemporary Kitchen',
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=2070&auto=format&fit=crop',
    description: 'Sleek, modern kitchen design with integrated appliances.',
  },
  {
    id: 4,
    title: 'Period Property Extension',
    category: 'Extension',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    description: 'Sympathetic extension to Grade II listed building.',
  },
]

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16" data-reveal>
          <p className="ict-section-label">Portfolio</p>
          <h2 className="ict-section-heading" style={{ transitionDelay: '80ms' }}>Our Work</h2>
          <p className="ict-section-subtitle" style={{ transitionDelay: '160ms' }}>
            Explore some of our recent projects showcasing our commitment to excellence and
            craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <div
              key={p.id}
              data-reveal
              style={{ transitionDelay: `${i * 100}ms` }}
              className="group relative overflow-hidden rounded-lg border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-all duration-500"
            >
              {/* Image */}
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1714]/30 via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1714] via-[#1C1714]/80 to-[#1C1714]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold font-['Lora'] tracking-wider mb-3 w-fit">
                  {p.category}
                </span>
                <h3 className="font-['Playfair_Display'] text-2xl font-bold text-[#D4AF37] mb-2">
                  {p.title}
                </h3>
                <p className="text-[#94A3B8] text-sm font-['Lora'] mb-4">
                  {p.description}
                </p>
                <button
                  onClick={() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#D4AF37] hover:text-[#C9A227] transition-colors flex items-center gap-2 text-sm font-semibold font-['Lora']"
                >
                  Get a Quote
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-block bg-gradient-gold text-[#1C1714] font-semibold font-['Lora'] text-sm tracking-wider px-10 py-4 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#D4AF37]/30"
          >
            Request a Free Quote
          </button>
        </div>
      </div>
    </section>
  )
}
