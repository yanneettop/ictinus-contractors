import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { trackServiceCtaClick } from '../utils/tracking'

const SLIDES = [
  'https://019ae1ec-ea13-75da-8bd7-dfb6402a319f.mochausercontent.com/ChatGPT-Image-Jan-7-2026-01_42_25-AM.png',
  'https://019ae1ec-ea13-75da-8bd7-dfb6402a319f.mochausercontent.com/ChatGPT-Image-Jan-7-2026-02_13_24-AM.png',
]

const KB_TRANSFORMS = [
  { from: 'scale(1.02) translate(0%, 0%)', to: 'scale(1.06) translate(-1%, -0.5%)' },
  { from: 'scale(1.05) translate(0.5%, 0%)', to: 'scale(1.01) translate(-0.5%, 0.5%)' },
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
    <section className="relative flex flex-1 items-center justify-center overflow-hidden">

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
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D0A08]/70 via-[#1A1511]/58 to-[#0C0906]/72" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1410]/68 via-[#1A1410]/42 to-[#1A1410]/18" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 46%, rgba(18,13,10,0.5) 0%, rgba(18,13,10,0.28) 34%, rgba(18,13,10,0.06) 68%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(12,9,6,0.42) 0%, rgba(12,9,6,0.1) 54%, rgba(12,9,6,0.22) 100%)' }} />
          </div>
        )
      })}

      {/* Content */}
      <div className="relative z-10 text-center px-5 sm:px-8 lg:px-10 max-w-[680px] mx-auto pt-24 sm:pt-28 lg:pt-24 xl:pt-28 pb-8 sm:pb-10 lg:pb-8 xl:pb-10 lg:-translate-y-1">
        <motion.h1
          className="font-['Cormorant_Garamond'] text-[clamp(2rem,8vw,2.45rem)] sm:text-[2.85rem] lg:text-[3.2rem] xl:text-[3.45rem] font-bold text-white max-w-[680px] mx-auto mb-6 sm:mb-8 leading-[1.08] sm:leading-[1.1] tracking-[0.01em]"
          style={{ textShadow: '0 2px 28px rgba(8,5,3,0.75)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          Reliable Refurbishment &amp; Decorating Across London
        </motion.h1>

        {/* Gold rule */}
        <motion.div
          className="w-14 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6 sm:mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />

        <motion.p
          className="font-['Source_Serif_4'] text-[1rem] sm:text-[1.05rem] lg:text-[1.04rem] xl:text-[1.07rem] text-[#F6EEDC]/95 mb-9 sm:mb-11 max-w-[520px] mx-auto leading-[1.55] sm:leading-[1.6]"
          style={{ textShadow: '0 1px 14px rgba(8,5,3,0.68)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Clean, organised property improvement work for homeowners, landlords and businesses, delivered with clear communication from start to finish.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact/#quote"
              onClick={() => trackServiceCtaClick({ cta_label: 'Request a Quote', target_path: '/contact#quote' })}
              className="group font-['Source_Serif_4'] font-semibold text-[1rem] tracking-wide px-8 sm:px-10 py-3.5 sm:py-[1.1rem] rounded-lg text-[#1C1714] bg-gradient-gold shadow-[0_8px_26px_rgba(197,160,72,0.38)] ring-1 ring-[#E8C96D]/35 hover:shadow-[0_12px_38px_rgba(197,160,72,0.5)] flex items-center justify-center gap-2"
            >
              Request a Quote
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
          <motion.button
            type="button"
            onClick={() => scrollTo('testimonials')}
            className="font-['Source_Serif_4'] font-semibold text-[0.95rem] tracking-wide px-7 sm:px-8 py-3 sm:py-3.5 rounded-lg text-white border border-white/42 bg-[#1C1714]/28 backdrop-blur-sm shadow-[0_6px_22px_rgba(0,0,0,0.16)] hover:bg-[#1C1714]/38 hover:border-white/58 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] flex items-center justify-center gap-2"
            whileHover={{ scale: 1.03, borderColor: 'rgba(255,255,255,0.5)' }}
            whileTap={{ scale: 0.97 }}
          >
            View Our Reviews
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}
