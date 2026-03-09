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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

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
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/65" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C1714]/40 to-transparent" />
          </div>
        )
      })}

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-32 pb-20">

        {/* Badge */}
        <div className={`ict-hero-badge transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span>Fully Insured</span>
          <span className="badge-dot" />
          <span>London Based</span>
        </div>

        <h1
          className={`font-['Playfair_Display'] text-4xl md:text-6xl font-bold text-white mb-6 leading-tight transition-all duration-1000 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.45)' }}
        >
          Handyman &amp; Renovation<br />Work in London
        </h1>

        <p
          className={`font-['Lora'] text-lg md:text-xl text-[#CBD5E1] mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}
        >
          Small projects to full refurbishments. High standards, clean finish, clear communication.
        </p>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <button
            onClick={() => scrollTo('quote')}
            className="group font-['Lora'] font-semibold text-base tracking-wide px-8 py-4 rounded-lg text-[#1C1714] bg-gradient-gold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#D4AF37]/40 flex items-center justify-center gap-2"
          >
            Request a Quote
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            onClick={() => scrollTo('services')}
            className="font-['Lora'] font-semibold text-base tracking-wide px-8 py-4 rounded-lg text-[#D4AF37] border-2 border-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#1C1714] flex items-center justify-center gap-2"
          >
            View Services
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#D4AF37] rounded-full mt-2 animate-bounce" />
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-10 right-6 flex gap-2">
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
