import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'

const SLIDES = [
  'https://019ae1ec-ea13-75da-8bd7-dfb6402a319f.mochausercontent.com/ChatGPT-Image-Jan-7-2026-01_42_25-AM.png',
  'https://019ae1ec-ea13-75da-8bd7-dfb6402a319f.mochausercontent.com/ChatGPT-Image-Jan-7-2026-02_13_24-AM.png',
]

const KB_TRANSFORMS = [
  { from: 'scale(1) translate(0%, 0%)', to: 'scale(1.15) translate(-2%, -1%)' },
  { from: 'scale(1.1) translate(1%, 0%)', to: 'scale(1) translate(-1%, 1%)' },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    if (prefersReducedMotion) return
    const id = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 7000)
    return () => clearInterval(id)
  }, [prefersReducedMotion])

  return (
    <section className="relative min-h-[calc(100svh-82px)] sm:min-h-[86vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden">

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
                transition: prefersReducedMotion ? 'none' : isActive ? 'transform 7s ease-in-out' : 'transform 0s',
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
        {/* Badge */}
        <motion.div
          className="ict-hero-badge hidden sm:flex"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>Fully Insured</span>
          <span className="badge-dot" />
          <span>9.97/10 Checkatrade</span>
          <span className="badge-dot" />
          <span>London Based</span>
        </motion.div>

        <motion.h1
          className="font-['Cormorant_Garamond'] text-[clamp(1.45rem,7.2vw,2rem)] sm:text-[2.9rem] lg:text-[4rem] font-bold text-white max-w-none mx-auto mb-8 sm:mb-9 leading-[1.1] tracking-[0.01em]"
          style={{ textShadow: '0 2px 28px rgba(8,5,3,0.75)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="block whitespace-normal sm:whitespace-nowrap">Premium Decorating &amp;</span>
          <span className="block whitespace-normal sm:whitespace-nowrap">Refurbishment Services</span>
          <span className="block whitespace-normal sm:whitespace-nowrap">Across London</span>
        </motion.h1>

        {/* Gold rule */}
        <motion.div
          className="hidden sm:block w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-7 sm:mb-11"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />

        <motion.p
          className="hidden sm:block font-['Source_Serif_4'] text-[1.06rem] lg:text-[1.11rem] text-[#F6EEDC]/95 mb-12 max-w-[580px] mx-auto leading-[1.68]"
          style={{ textShadow: '0 1px 14px rgba(8,5,3,0.68)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          High-quality decorating, refurbishment, and finishing services across London — combining reliable project management, skilled workmanship, and a professional client experience.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact"
              className="group font-['Source_Serif_4'] font-semibold text-[0.9375rem] sm:text-[1rem] tracking-wide px-8 sm:px-10 py-3.5 sm:py-[1.1rem] rounded-lg text-[#1C1714] bg-gradient-gold shadow-[0_4px_20px_rgba(212,175,55,0.35)] hover:shadow-[0_8px_32px_rgba(212,175,55,0.5)] flex items-center justify-center gap-2"
            >
              Request a Free Quote
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
          <motion.button
            onClick={() => scrollTo('services')}
            className="font-['Source_Serif_4'] font-medium text-[0.875rem] sm:text-[0.9375rem] tracking-wide px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg text-white/70 border border-white/25 bg-white/5 backdrop-blur-sm hover:bg-white/15 hover:text-white hover:border-white/40 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.5)' }}
            whileTap={{ scale: 0.97 }}
          >
            View Our Services
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="hidden sm:block mt-7 text-[11px] text-white/35 tracking-[0.22em] uppercase font-['Source_Serif_4']"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.3 }}
        >
          Free Consultation &nbsp;&middot;&nbsp; No Obligation &nbsp;&middot;&nbsp; Fast Response
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hidden sm:block absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#D4AF37] rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>

      {/* Slide dots */}
      <div className="hidden sm:flex absolute bottom-10 right-6 gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Show hero slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              current === i ? 'w-6 h-2 bg-[#D4AF37]' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
