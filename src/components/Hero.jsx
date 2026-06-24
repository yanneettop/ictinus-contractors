import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import { trackServiceCtaClick } from '../utils/tracking'

const SLIDES = [
  { name: 'hero-main-original', width: 1536, height: 1024 },
  { name: 'hero-townhouse-hallway', width: 1536, height: 1024 },
  { name: 'hero-renovated-bathroom', width: 1619, height: 971 },
  { name: 'hero-finished-bedroom', width: 1536, height: 1024 },
]

const HERO_WIDTHS = [640, 960, 1280, 1536]

function heroSrc(slide, width, format = 'webp') {
  return `/hero/${slide.name}-${width}.${format}`
}

function heroSrcSet(slide, format = 'webp') {
  return HERO_WIDTHS
    .filter((width) => width <= slide.width)
    .map((width) => `${heroSrc(slide, width, format)} ${width}w`)
    .join(', ')
}

const SLIDE_INTERVAL_MS = 5500
const CROSSFADE_MS = 2400
const KEN_BURNS_MS = 12000

const KB_TRANSFORMS = [
  { from: 'scale(1.02) translate(0%, 0%)', to: 'scale(1.06) translate(-1%, -0.5%)' },
  { from: 'scale(1.05) translate(0.5%, 0%)', to: 'scale(1.01) translate(-0.5%, 0.5%)' },
  { from: 'scale(1.03) translate(-0.5%, 0.5%)', to: 'scale(1.07) translate(0.75%, -0.75%)' },
  { from: 'scale(1.04) translate(0.25%, -0.25%)', to: 'scale(1.02) translate(-0.75%, 0.5%)' },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [heroStarted, setHeroStarted] = useState(false)
  const [exitingSlides, setExitingSlides] = useState([])
  const previousSlide = useRef(0)
  const prefersReducedMotion = useReducedMotion()
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    if (prefersReducedMotion) {
      setHeroStarted(true)
      return
    }

    const frame = requestAnimationFrame(() => setHeroStarted(true))
    return () => cancelAnimationFrame(frame)
  }, [prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return
    const id = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [prefersReducedMotion])

  useEffect(() => {
    const outgoing = previousSlide.current
    previousSlide.current = current

    if (outgoing === current) return undefined

    setExitingSlides((slides) => [...new Set([...slides, outgoing])])
    const timeout = setTimeout(() => {
      setExitingSlides((slides) => slides.filter((slide) => slide !== outgoing))
    }, CROSSFADE_MS)

    return () => clearTimeout(timeout)
  }, [current])

  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden">

      {/* Slideshow backgrounds with Ken Burns */}
      {SLIDES.map((slide, i) => {
        const kb = KB_TRANSFORMS[i % KB_TRANSFORMS.length]
        const isActive = current === i
        const isExiting = exitingSlides.includes(i)
        if (!isActive && !isExiting) return null

        return (
          <div
            key={slide.name}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              opacity: isActive ? 1 : 0,
              transitionDuration: `${CROSSFADE_MS}ms`,
              willChange: 'opacity',
            }}
          >
            <picture
              className="absolute inset-0 block"
              style={{
                transform: heroStarted && (isActive || isExiting) ? kb.to : kb.from,
                transition: prefersReducedMotion ? 'none' : isActive ? `transform ${KEN_BURNS_MS}ms ease-in-out` : 'transform 0s',
                willChange: 'transform',
              }}
            >
              <source type="image/avif" srcSet={heroSrcSet(slide, 'avif')} sizes="100vw" />
              <source type="image/webp" srcSet={heroSrcSet(slide, 'webp')} sizes="100vw" />
              <img
                src={heroSrc(slide, Math.min(1536, slide.width), 'webp')}
                srcSet={heroSrcSet(slide, 'webp')}
                sizes="100vw"
                alt=""
                width={slide.width}
                height={slide.height}
                loading={i === 0 ? 'eager' : 'lazy'}
                fetchpriority={i === 0 ? 'high' : 'auto'}
                decoding="async"
                className="h-full w-full object-cover object-center"
                draggable={false}
              />
            </picture>
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
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Reliable Refurbishment &amp; Decorating Across London
        </motion.h1>

        {/* Gold rule */}
        <motion.div
          className="w-14 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6 sm:mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />

        <motion.p
          className="font-['Source_Serif_4'] text-[1rem] sm:text-[1.05rem] lg:text-[1.04rem] xl:text-[1.07rem] text-[#F6EEDC]/95 mb-9 sm:mb-11 max-w-[520px] mx-auto leading-[1.55] sm:leading-[1.6]"
          style={{ textShadow: '0 1px 14px rgba(8,5,3,0.68)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Clean, organised property improvement work for homeowners, landlords and businesses, delivered with clear communication from start to finish.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact#quote"
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
