import { useState, useEffect, useRef } from 'react'

const SLIDES = [
  'https://019ae1ec-ea13-75da-8bd7-dfb6402a319f.mochausercontent.com/ChatGPT-Image-Jan-7-2026-01_42_25-AM.png',
  'https://019ae1ec-ea13-75da-8bd7-dfb6402a319f.mochausercontent.com/ChatGPT-Image-Jan-7-2026-02_13_24-AM.png',
]

/* Each slide gets a unique Ken Burns transform so movement feels organic */
const KB_TRANSFORMS = [
  { from: 'scale(1) translate(0%, 0%)', to: 'scale(1.15) translate(-2%, -1%)' },
  { from: 'scale(1.1) translate(1%, 0%)', to: 'scale(1) translate(-1%, 1%)' },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 7000)
    return () => clearInterval(id)
  }, [])

  /* Trigger entrance animation after mount */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative min-h-[70vh] sm:min-h-[86vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden">

      {/* Slideshow backgrounds with Ken Burns */}
      {SLIDES.map((src, i) => {
        const kb = KB_TRANSFORMS[i % KB_TRANSFORMS.length]
        const isActive = current === i
        return (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[1500ms]"
            style={{ opacity: isActive ? 1 : 0 }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${src})`,
                transform: isActive ? kb.to : kb.from,
                transition: isActive
                  ? 'transform 7s ease-in-out'
                  : 'transform 0s',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D0A08]/84 via-[#1A1511]/66 to-[#0C0906]/86" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1410]/60 via-[#1A1410]/35 to-[#1A1410]/18" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 44%, rgba(23,18,14,0.4) 0%, rgba(23,18,14,0.18) 36%, rgba(23,18,14,0) 72%)' }} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 48% 50%, transparent 34%, rgba(10,7,5,0.5) 100%)' }} />
          </div>
        )
      })}

      {/* Content */}
      <div className="relative z-10 text-center px-5 sm:px-8 lg:px-10 max-w-[720px] mx-auto pt-20 sm:pt-28 lg:pt-32 pb-12 sm:pb-20 lg:pb-[5.5rem] lg:-translate-y-1">
        {/* Badge — hidden on mobile for minimal look */}
        <div className={`ict-hero-badge hidden sm:flex transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span>Fully Insured</span>
          <span className="badge-dot" />
          <span>London Based</span>
        </div>

        <h1
          className={`font-['Cormorant_Garamond'] text-[clamp(1.45rem,7.2vw,2rem)] sm:text-[2.9rem] lg:text-[4rem] font-bold text-white max-w-none mx-auto mb-8 sm:mb-9 leading-[1.1] tracking-[0.01em] transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ textShadow: '0 2px 28px rgba(8,5,3,0.75)' }}
        >
          <span className="block whitespace-nowrap">Premium Decorating &amp;</span>
          <span className="block whitespace-nowrap">Refurbishment Services</span>
          <span className="block whitespace-nowrap">Across London</span>
        </h1>

        {/* Decorative gold rule — hidden on mobile */}
        <div className={`hidden sm:block w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-7 sm:mb-11 transition-all duration-1000 delay-[400ms] ${loaded ? 'opacity-100' : 'opacity-0'}`} />

        <p
          className={`hidden sm:block font-['Source_Serif_4'] text-[1.06rem] lg:text-[1.11rem] text-[#F6EEDC]/95 mb-12 max-w-[580px] mx-auto leading-[1.68] transition-all duration-1000 delay-[520ms] ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ textShadow: '0 1px 14px rgba(8,5,3,0.68)' }}
        >
          High-quality decorating, refurbishment, and finishing services across London — combining reliable project management, skilled workmanship, and a professional client experience.
        </p>

        <div className={`flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <button
            onClick={() => scrollTo('quote')}
            className="group font-['Source_Serif_4'] font-semibold text-[0.875rem] sm:text-[0.9375rem] tracking-wide px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-[#1C1714] bg-gradient-gold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#D4AF37]/40 flex items-center justify-center gap-2"
          >
            Request a Free Quote
            <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            onClick={() => scrollTo('services')}
            className="font-['Source_Serif_4'] font-semibold text-[0.875rem] sm:text-[0.9375rem] tracking-wide px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-[#D4AF37] border-2 border-[#D4AF37] bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#1C1714] flex items-center justify-center gap-2"
          >
            View Our Services
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Trust reassurance line — hidden on mobile */}
        <p className={`hidden sm:block mt-7 text-[11px] text-white/35 tracking-[0.22em] uppercase font-['Source_Serif_4'] transition-all duration-1000 delay-[900ms] ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          Free Consultation &nbsp;&middot;&nbsp; No Obligation &nbsp;&middot;&nbsp; Fast Response
        </p>
      </div>

      {/* Scroll indicator — hidden on mobile */}
      <div className="hidden sm:block absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#D4AF37] rounded-full mt-2 animate-bounce" />
        </div>
      </div>

      {/* Slide dots — hidden on mobile */}
      <div className="hidden sm:flex absolute bottom-10 right-6 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              current === i ? 'w-6 h-2 bg-[#D4AF37]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
