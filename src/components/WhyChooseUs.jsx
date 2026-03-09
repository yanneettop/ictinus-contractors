const reasons = [
  {
    title: 'Professional & Reliable',
    description: 'Every project is delivered on time and to specification, backed by full public liability insurance and over 12 years of industry experience.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    ),
  },
  {
    title: 'Clear Communication',
    description: 'A single point of contact from the first enquiry through to handover. You will always know where your project stands and what comes next.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    ),
  },
  {
    title: 'Premium Finish Standards',
    description: 'We work to a consistently high standard using quality materials and refined techniques — adding long-term value and beauty to every space.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </>
    ),
  },
  {
    title: 'Attention to Detail',
    description: 'From surface preparation to final finishing touches, we take the time to get every detail right — because quality shows in the small things.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    ),
  },
  {
    title: 'London-Wide Coverage',
    description: 'Serving residential and commercial clients across all London boroughs — from East London to Central, South, West, and North.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    ),
  },
  {
    title: 'Trusted Contractor Network',
    description: 'For larger or specialist projects, we coordinate with trusted subcontractors — so you get one point of contact with access to a full range of trades.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    ),
  },
]

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-14" data-reveal>
          <p className="ict-section-label">Why Choose Us</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-[2.5rem] font-semibold text-[#1C1714] mb-5 leading-tight">
            Why Clients Trust Ictinus Contractors
          </h2>
          <p className="text-[#5A5048] text-[0.95rem] leading-relaxed max-w-2xl mx-auto font-['Lora']">
            Rated 9.97 out of 10 on Checkatrade and 4.9 on MyBuilder — our reputation is built on
            consistent results, honest communication, and a professional approach to every project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ title, description, icon }, i) => (
            <div
              key={title}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
              className="group bg-white p-7 rounded-xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/35 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
            >
              <div className="w-11 h-11 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
                <svg
                  className="w-5 h-5 text-[#B08D2A]"
                  fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                >
                  {icon}
                </svg>
              </div>
              <h3 className="font-['Playfair_Display'] text-[1.1rem] font-semibold text-[#1C1714] mb-2">
                {title}
              </h3>
              <p className="text-[#5A5048] text-[0.85rem] leading-relaxed font-['Lora']">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
