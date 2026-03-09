export default function FinalCTA() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#1C1714] overflow-hidden">
      {/* Subtle gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="max-w-3xl mx-auto text-center relative z-10" data-reveal>
        <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl font-semibold text-white mb-5 leading-tight">
          Planning Your Next Property Project?
        </h2>
        <p className="font-['Lora'] text-[0.95rem] text-[#C4BAB0] leading-relaxed mb-10 max-w-2xl mx-auto">
          Speak to Ictinus Contractors for a free quote and professional advice on decorating,
          refurbishment, and finishing works across London.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollTo('quote')}
            className="font-['Lora'] font-semibold text-[0.9rem] tracking-wide px-8 py-3.5 rounded-lg text-[#1C1714] bg-gradient-gold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#D4AF37]/30"
          >
            Request a Quote
          </button>
          <a
            href="mailto:info@ictinuscontractors.co.uk"
            className="font-['Lora'] font-semibold text-[0.9rem] tracking-wide px-8 py-3.5 rounded-lg text-[#D4AF37] border border-[#D4AF37]/40 transition-all duration-300 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/60 text-center"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}
