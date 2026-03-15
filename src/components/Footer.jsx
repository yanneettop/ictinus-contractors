const mainServices = [
  'Painting & Decorating',
  'Wallpapering',
  'Plastering',
  'Hard Flooring',
  'Bathroom Fitting',
  'Property Refurbishment',
  'Finishing Carpentry',
]

export default function Footer() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="bg-[#1C1714] text-white px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand column */}
          <div>
            <p className="font-['Playfair_Display'] text-xl font-bold tracking-widest text-gradient-gold mb-4">
              ICTINUS
            </p>
            <p className="font-['Lora'] text-[0.9375rem] text-[#94A3B8] leading-[1.72] mb-4">
              Professional decorating, refurbishment, and finishing services across London.
              Premium results, reliable project management, and clear communication on every job.
            </p>
            <p className="ict-footer-insurance">
              Fully insured · 12+ years experience · London-wide coverage
            </p>
          </div>

          {/* Services column */}
          <div>
            <h4 className="font-['Playfair_Display'] text-[0.875rem] font-semibold text-[#F1F5F9]/90 tracking-widest uppercase mb-5">
              Services
            </h4>
            <ul className="space-y-2">
              {mainServices.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => scrollTo('services')}
                    className="font-['Lora'] text-[0.9375rem] text-[#94A3B8] hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="font-['Playfair_Display'] text-[0.875rem] font-semibold text-[#F1F5F9]/90 tracking-widest uppercase mb-5">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-['Lora'] text-[0.9375rem] text-[#94A3B8]">
                  info@ictinuscontractors.co.uk
                </span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-['Lora'] text-[0.9375rem] text-[#94A3B8]">
                  East London &amp; surrounding boroughs
                </span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => scrollTo('quote')}
                  className="font-['Lora'] text-[0.9375rem] font-semibold tracking-wide px-5 py-2.5 rounded-lg bg-gradient-gold text-[#1C1714] transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get a Quote
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider + copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-['Lora'] text-[0.8125rem] text-[#94A3B8]/60 text-center">
            &copy; {new Date().getFullYear()} Ictinus Contractors. All rights reserved.
          </p>
          <p className="font-['Lora'] text-[0.8125rem] text-[#94A3B8]/60 text-center">
            London, United Kingdom
          </p>
        </div>
      </div>
    </footer>
  )
}
