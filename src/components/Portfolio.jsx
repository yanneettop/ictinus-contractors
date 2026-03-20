import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'

const GALLERY = [
  { src: '/Portfolio/Room_dec_after.png',  alt: 'Full Room Decoration — after (1)' },
  { src: '/Portfolio/Room_dec_after2.png', alt: 'Full Room Decoration — after (2)' },
  { src: '/Portfolio/Room_dec_after3.png', alt: 'Full Room Decoration — after (3)' },
  { src: '/Portfolio/Room_dec_after4.png', alt: 'Full Room Decoration — after (4)' },
  { src: '/Portfolio/Room_dec_Before.png', alt: 'Full Room Decoration — before' },
]

const projects = [
  {
    id: 1,
    title: 'Full Room Decoration',
    category: 'Interior Decoration',
    image: '/Portfolio/Room_dec_after.png',
    hoverImage: '/Portfolio/Room_dec_Before.png',
    hasGallery: true,
    description: 'Full interior decoration project including surface preparation, specialist painting, and bespoke wallpapering — delivered to a premium standard for a residential property in Hackney, East London.',
  },
  {
    id: 2,
    title: 'Bathroom Renovation',
    category: 'Bathroom Fitting',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2187&auto=format&fit=crop',
    description: 'Complete strip-out and refit including new tiling, fixtures, vanity unit, and all finishing works to a high standard.',
  },
  {
    id: 3,
    title: 'Engineered Flooring',
    category: 'Hard Flooring',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2070&auto=format&fit=crop',
    description: 'Supply and installation of engineered oak flooring across an open-plan living area, with precision cutting and integrated skirting.',
  },
  {
    id: 4,
    title: 'Full Property Refurbishment',
    category: 'Property Refurbishment',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'Multi-room project covering plastering, decorating, flooring, and all finishing carpentry — managed and delivered on schedule.',
  },
  {
    id: 5,
    title: 'Finishing & Detail Work',
    category: 'Finishing Carpentry',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    description: 'Skirting boards, architraves, door hanging, and bespoke shelving installed to complete a high-end interior renovation.',
  },
  {
    id: 6,
    title: 'Commercial Office Refresh',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    description: 'Decorating and finishing works for a Canary Wharf office, delivered to a tight deadline with minimal disruption.',
  },
]

/* ── Gallery Modal ── */
function GalleryModal({ onClose }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback((dir) => {
    setDirection(dir)
    setIndex((i) => (i + dir + GALLERY.length) % GALLERY.length)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, go])

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -60 : 60 }),
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0D0A08]/92 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl mx-4 flex flex-col items-center">

        {/* Close */}
        <motion.button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close gallery"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        {/* Image */}
        <div className="relative w-full overflow-hidden rounded-[14px] bg-[#1C1714] shadow-2xl" style={{ aspectRatio: '16/10' }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.img
              key={index}
              src={GALLERY[index].src}
              alt={GALLERY[index].alt}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full object-contain"
              draggable={false}
            />
          </AnimatePresence>

          {/* Prev / Next */}
          {[-1, 1].map((dir) => (
            <motion.button
              key={dir}
              onClick={() => go(dir)}
              className={`absolute top-1/2 -translate-y-1/2 ${dir === -1 ? 'left-3' : 'right-3'} w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-colors`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label={dir === -1 ? 'Previous' : 'Next'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={dir === -1 ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
              </svg>
            </motion.button>
          ))}
        </div>

        {/* Counter + dots */}
        <div className="flex items-center gap-3 mt-5">
          <span className="font-['Source_Serif_4'] text-[0.8rem] text-white/40 tabular-nums">
            {index + 1} / {GALLERY.length}
          </span>
          <div className="flex gap-1.5">
            {GALLERY.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }}
                className="h-1.5 rounded-full"
                animate={{ width: i === index ? 20 : 6, backgroundColor: i === index ? '#D4AF37' : 'rgba(255,255,255,0.25)' }}
                transition={{ duration: 0.3 }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Caption */}
        <p className="font-['Source_Serif_4'] text-[0.8125rem] text-white/40 mt-3 tracking-wide">
          Full Room Decoration — {index < GALLERY.length - 1 ? 'After' : 'Before'}
        </p>
      </div>
    </motion.div>
  )
}

/* ── Portfolio Section ── */
export default function Portfolio() {
  const [isHovered, setIsHovered] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [featured, ...rest] = projects

  return (
    <section id="portfolio" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto">

        {/* ── Section intro ── */}
        <Reveal>
          <div className="text-center mb-16">
            <p className="ict-section-label">Selected Work</p>
            <h2 className="ict-section-heading">Featured Projects</h2>
            <p className="ict-section-subtitle" style={{ maxWidth: '36rem' }}>
              A curated selection of completed projects — from single-room transformations
              to full property refurbishments across London.
            </p>
          </div>
        </Reveal>

        {/* ── Featured project — Full Room Decoration ── */}
        <Reveal direction="scale" delay={0.1}>
          <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => setGalleryOpen(true)}
            whileHover={{ y: -2, boxShadow: '0 14px 36px rgba(0,0,0,0.09), 0 3px 10px rgba(212,175,55,0.07)', borderColor: 'rgba(212,175,55,0.38)' }}
            transition={{ duration: 0.3 }}
            className="group rounded-[14px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden mb-8 cursor-pointer"
          >
            <div className="flex flex-col lg:flex-row">

              {/* Image — hover swaps to before photo */}
              <div className="relative w-full lg:w-[56%] flex-shrink-0 overflow-hidden min-h-[260px] sm:min-h-[320px] lg:min-h-[420px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={isHovered ? 'before' : 'after'}
                    src={isHovered ? featured.hoverImage : featured.image}
                    alt={featured.title}
                    loading="eager"
                    draggable={false}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover scale-[1.03] group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                  />
                </AnimatePresence>

                {/* Before/After badge */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.span
                      className="absolute top-4 left-4 z-10 font-['Plus_Jakarta_Sans'] text-[0.6rem] font-semibold uppercase tracking-[0.13em] bg-[rgba(18,13,10,0.72)] text-white/90 px-2.5 py-[0.28rem] rounded-[4px]"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      Before
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Click to view gallery hint */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute inset-0 bg-[#1C1714]/20 flex items-center justify-center z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-lg">
                        <svg className="w-4 h-4 text-[#1C1714]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <span className="font-['Source_Serif_4'] text-[0.8rem] font-semibold text-[#1C1714]">View Gallery</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FDFCF9]/60 to-transparent lg:hidden" />
              </div>

              {/* Content — right side */}
              <div className="flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-14">
                <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#A88636] mb-3.5 block">
                  {featured.category}
                </span>
                <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] lg:text-[1.75rem] font-semibold text-[#1C1714] mb-5 leading-[1.18] tracking-[-0.02em]">
                  {featured.title}
                </h3>
                <div className="w-10 h-px bg-[rgba(212,175,55,0.55)] mb-5" />
                <p className="font-['Source_Serif_4'] text-[1rem] text-[#5A5048] leading-[1.75] mb-6">
                  {featured.description}
                </p>
                <div className="inline-flex items-center gap-2 text-[#B08D2A] font-['Source_Serif_4'] text-[0.875rem] font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                  {GALLERY.length} photos — click to view
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>

        {/* ── Supporting project grid ── */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7" stagger={0.08}>
          {rest.map((p) => (
            <StaggerItem key={p.id}>
              <motion.div
                whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.09), 0 2px 8px rgba(212,175,55,0.07)', borderColor: 'rgba(212,175,55,0.4)' }}
                transition={{ duration: 0.25 }}
                className="group overflow-hidden rounded-[14px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
              >
                <div className="aspect-[16/12] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="px-6 py-6">
                  <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-[#A88636] mb-2.5 block">
                    {p.category}
                  </span>
                  <h3 className="font-['Cormorant_Garamond'] text-[1.1875rem] font-semibold text-[#1C1714] mb-2.5 leading-snug tracking-[-0.01em]">
                    {p.title}
                  </h3>
                  <p className="text-[#5A5048] text-[0.875rem] font-['Source_Serif_4'] leading-[1.7]">
                    {p.description}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* ── Section CTA ── */}
        <Reveal delay={0.15}>
          <div className="text-center mt-14 flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2.5 font-['Source_Serif_4'] font-semibold text-[0.9375rem] tracking-wide px-9 py-3.5 rounded-lg bg-gradient-gold text-[#1C1714] shadow-[0_4px_14px_rgba(212,175,55,0.25)]"
              >
                View All Projects
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-block font-['Source_Serif_4'] font-semibold text-[0.9375rem] tracking-wide px-8 py-3.5 rounded-lg text-[#B08D2A] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50"
              >
                Discuss Your Project
              </Link>
            </motion.div>
          </div>
        </Reveal>

      </div>

      {/* ── Gallery Modal ── */}
      <AnimatePresence>
        {galleryOpen && <GalleryModal onClose={() => setGalleryOpen(false)} />}
      </AnimatePresence>
    </section>
  )
}
