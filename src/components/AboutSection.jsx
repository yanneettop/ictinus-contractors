const highlights = [
  { stat: '12+', label: 'Years in the Industry' },
  { stat: '30+', label: 'Verified Client Reviews' },
  { stat: '9.97', label: 'Out of 10 on Checkatrade' },
]

export default function AboutSection() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="bg-[#FAF9F6] py-20 px-4 sm:px-6 lg:px-8" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Copy */}
          <div data-reveal>
            <p className="ict-section-label text-left mb-2">About Ictinus Contractors</p>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-[#1C1714] mb-6 leading-tight text-left">
              A London Contractor Brand<br />Built on Quality
            </h2>
            <div className="space-y-4 font-['Lora'] text-[0.95rem] text-[#5A5048] leading-relaxed">
              <p>
                Ictinus Contractors is a London-based contractor brand specialising in decorating,
                refurbishment, and interior finishing. With over 12 years of industry experience
                and a reputation built on quality workmanship, reliability, and strong communication,
                the company delivers a professional service for homeowners, landlords, and businesses
                across London.
              </p>
              <p>
                Founded by Konstantinos, a skilled contractor with deep expertise across decorating,
                plastering, flooring, and property refurbishment, Ictinus Contractors has grown into
                a trusted brand supported by a reliable network of specialist tradespeople — ensuring
                every project is delivered to a consistently high standard.
              </p>
              <p>
                Whether it's a single-room refresh or a full property refurbishment, the team brings
                the same level of care, precision, and professionalism to every job.
              </p>
            </div>
            <button
              onClick={() => scrollTo('quote')}
              className="mt-8 font-['Lora'] font-semibold text-[0.9rem] tracking-wide px-6 py-3 rounded-lg text-[#1C1714] bg-gradient-gold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-[#D4AF37]/30"
            >
              Get a Free Quote
            </button>
          </div>

          {/* Right — Stats + Values */}
          <div data-reveal style={{ transitionDelay: '200ms' }}>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {highlights.map(({ stat, label }, i) => (
                <div
                  key={label}
                  className="text-center p-4 bg-white rounded-xl border border-[rgba(212,175,55,0.15)] shadow-sm"
                >
                  <span className="block font-['Playfair_Display'] text-2xl md:text-3xl font-bold text-[#B08D2A]">
                    {stat}
                  </span>
                  <span className="block font-['Lora'] text-[0.78rem] text-[#5A5048] mt-1 leading-snug">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Values list */}
            <div className="space-y-4">
              {[
                { title: 'Professional Team', desc: 'Skilled tradespeople delivering premium results on every project.' },
                { title: 'Trusted Network', desc: 'Specialist subcontractors for plastering, flooring, plumbing, and more.' },
                { title: 'Clear Communication', desc: 'A dedicated point of contact from initial enquiry through to completion.' },
                { title: 'London-Wide Coverage', desc: 'Serving residential and commercial clients across all London boroughs.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(212,175,55,0.12)] flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-['Playfair_Display'] text-[1rem] font-semibold text-[#1C1714] mb-0.5">{title}</h3>
                    <p className="font-['Lora'] text-[0.85rem] text-[#5A5048] leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
