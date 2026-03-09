const reasons = [
  {
    title: 'Fully Insured',
    description: 'Every project is covered by full public liability insurance, giving you complete peace of mind from start to finish.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    ),
  },
  {
    title: 'Expert Craftsmen',
    description: 'Our team of skilled professionals brings precision and expertise to every project, from structural work to delicate finishing.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    ),
  },
  {
    title: 'Dedicated Project Manager',
    description: 'A dedicated project manager oversees every job, ensuring clear communication, smooth execution, and on-time delivery.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    ),
  },
  {
    title: 'High-End Finishes',
    description: 'We use premium materials and deliver high-end finishes that add long-term value and beauty to your property.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </>
    ),
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6]">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16" data-reveal>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-gradient-gold mb-6">
            Why Choose Ictinus Contractors?
          </h2>
          <p className="text-[#5A5048] text-lg leading-relaxed max-w-2xl mx-auto font-['Lora']">
            Quality, trust, and prestige define everything we do. We deliver high-standard
            craftsmanship with clear communication, reliable project management, and a 10-year
            guarantee on all our work for total peace of mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map(({ title, description, icon }, i) => (
            <div
              key={title}
              data-reveal
              style={{ transitionDelay: `${i * 90}ms` }}
              className="group bg-white p-8 rounded-lg border border-[#D4AF37]/15 hover:border-[#D4AF37]/40 transition-all duration-300 text-center hover:scale-105 hover:-translate-y-2.5 shadow-sm hover:shadow-md"
            >
              <div className="flex justify-center mb-6">
                <svg
                  className="w-12 h-12 text-[#D4AF37] group-hover:rotate-12 transition-transform duration-300"
                  fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                >
                  {icon}
                </svg>
              </div>
              <h3 className="font-['Playfair_Display'] text-xl font-semibold text-[#D4AF37] mb-2 group-hover:text-[#D4AF37] transition-colors">
                {title}
              </h3>
              <p className="text-[#5A5048] text-sm leading-relaxed font-['Lora']">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
