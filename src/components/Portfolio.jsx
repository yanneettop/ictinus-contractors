import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'

const GALLERIES = {
  1: [
    { src: '/Portfolio/Room_dec_after.webp',  alt: 'Full Room Decoration — after (1)', label: 'After' },
    { src: '/Portfolio/Room_dec_after2.webp', alt: 'Full Room Decoration — after (2)', label: 'After' },
    { src: '/Portfolio/Room_dec_after3.webp', alt: 'Full Room Decoration — after (3)', label: 'After' },
    { src: '/Portfolio/Room_dec_after4.webp', alt: 'Full Room Decoration — after (4)', label: 'After' },
    { src: '/Portfolio/Room_dec_Before.webp', alt: 'Full Room Decoration — before',    label: 'Before' },
  ],
  2: [
    { src: '/Portfolio/bath_after.webp',  alt: 'Bathroom Renovation — after (1)', label: 'After' },
    { src: '/Portfolio/bath_after2.webp', alt: 'Bathroom Renovation — after (2)', label: 'After' },
    { src: '/Portfolio/bath_before.webp', alt: 'Bathroom Renovation — before',    label: 'Before' },
  ],
}

const projects = [
  {
    id: 1,
    title: 'Full Room Decoration',
    category: 'Interior Decoration',
    location: 'Hackney, East London',
    image: '/Portfolio/Room_dec_after.webp',
    hoverImage: '/Portfolio/Room_dec_Before.webp',
    hasGallery: true,
    description: 'Full interior decoration including surface preparation, specialist painting, and bespoke wallpapering — delivered to a premium standard for a residential property in Hackney.',
  },
  {
    id: 2,
    title: 'Bathroom Renovation',
    category: 'Bathroom Fitting',
    location: 'Stratford, East London',
    image: '/Portfolio/bath_after.webp',
    hoverImage: '/Portfolio/bath_before.webp',
    hasGallery: true,
    description: 'Complete strip-out and refit including new tiling, fixtures, vanity unit, and all finishing works — delivered on time and within budget.',
  },
  {
    id: 3,
    title: 'Engineered Flooring',
    category: 'Hard Flooring',
    location: 'Bethnal Green, East London',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2070&auto=format&fit=crop',
    description: 'Supply and installation of engineered oak flooring across an open-plan living area, with precision cutting, integrated skirting, and a clean, seamless finish.',
  },
  {
    id: 4,
    title: 'Full Property Refurbishment',
    category: 'Property Refurbishment',
    location: 'Canary Wharf',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'Multi-room project covering plastering, decorating, flooring, and all finishing carpentry — coordinated and delivered on schedule with minimal disruption.',
  },
  {
    id: 5,
    title: 'Finishing & Detail Work',
    category: 'Finishing Carpentry',
    location: 'Islington, North London',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    description: 'Skirting boards, architraves, door hanging, and bespoke shelving installed to complete a high-end interior renovation to a precise standard.',
  },
  {
    id: 6,
    title: 'Commercial Office Refresh',
    category: 'Commercial',
    location: 'Canary Wharf',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    description: 'Full decoration and finishing works for a commercial office space, delivered to a tight deadline with minimal disruption to the working environment.',
  },
]

/* ── Gallery Modal ── */
function GalleryModal({ images, title, onClose }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = useCallback((dir) => {
    setDirection(dir)
    setIndex((i) => (i + dir + images.length) % images.length)
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
              src={images[index].src}
              alt={images[index].alt}
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
            {index + 1} / {images.length}
          </span>
          <div className="flex gap-1.5">
            {images.map((_, i) => (
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
          {title} — {images[index].label}
        </p>
      </div>
    </motion.div>
  )
}

/* ── Portfolio Section ── */
export default function Portfolio() {
  const [hoveredId, setHoveredId] = useState(null)
  const [galleryProject, setGalleryProject] = useState(null)
  const [featured, ...rest] = projects

  const openGallery = (project) => {
    if (project.hasGallery) setGalleryProject(project)
  }

  return (
    <section id="portfolio" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto">

        {/* ── Section intro ── */}
        <Reveal>
          <div className="text-center mb-16">
            <p className="ict-section-label">Our Work</p>
            <h2 className="ict-section-heading">Recent Projects</h2>
            <p className="ict-section-subtitle" style={{ maxWidth: '36rem' }}>
              A selection of completed projects across London — from single-room transformations
              to full property refurbishments.
            </p>
          </div>
        </Reveal>

        {/* ── Featured project — Full Room Decoration ── */}
        <Reveal direction="scale" delay={0.1}>
          <motion.div
            onHoverStart={() => setHoveredId(featured.id)}
            onHoverEnd={() => setHoveredId(null)}
            onClick={() => openGallery(featured)}
            whileHover={{ y: -2, boxShadow: '0 14px 36px rgba(0,0,0,0.09), 0 3px 10px rgba(212,175,55,0.07)', borderColor: 'rgba(212,175,55,0.38)' }}
            transition={{ duration: 0.3 }}
            className="group rounded-[14px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] shadow-[0_1px_4px_rgba(0,0,0,0.06)] overflow-hidden mb-8 cursor-pointer"
          >
            <div className="flex flex-col lg:flex-row">

              {/* Image — hover swaps to before photo */}
              <div className="relative w-full lg:w-[56%] flex-shrink-0 overflow-hidden min-h-[260px] sm:min-h-[320px] lg:min-h-[420px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={hoveredId === featured.id ? 'before' : 'after'}
                    src={hoveredId === featured.id ? featured.hoverImage : featured.image}
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
                  {hoveredId === featured.id && (
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
                  {hoveredId === featured.id && (
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
                <div className="flex items-center gap-2 mb-3.5 flex-wrap">
                  <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#A88636]">
                    {featured.category}
                  </span>
                  <span className="text-[#D4AF37]/40 text-[0.6rem]">&#9679;</span>
                  <span className="inline-flex items-center gap-1 font-['Source_Serif_4'] text-[0.75rem] text-[#9A9590]">
                    <svg className="w-3 h-3 text-[#B08D2A]/60 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {featured.location}
                  </span>
                </div>
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
                  {GALLERIES[featured.id]?.length} photos — click to view
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
                onHoverStart={() => setHoveredId(p.id)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => openGallery(p)}
                whileHover={{ y: -3, boxShadow: '0 10px 28px rgba(0,0,0,0.09), 0 2px 8px rgba(212,175,55,0.07)', borderColor: 'rgba(212,175,55,0.4)' }}
                transition={{ duration: 0.25 }}
                className={`group overflow-hidden rounded-[14px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] shadow-[0_1px_4px_rgba(0,0,0,0.06)] ${p.hasGallery ? 'cursor-pointer' : ''}`}
              >
                <div className="relative aspect-[16/12] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={hoveredId === p.id && p.hoverImage ? 'before' : 'after'}
                      src={hoveredId === p.id && p.hoverImage ? p.hoverImage : p.image}
                      alt={p.title}
                      loading="lazy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 w-full h-full object-cover scale-[1.03] group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                      draggable={false}
                    />
                  </AnimatePresence>

                  {/* Before badge */}
                  <AnimatePresence>
                    {hoveredId === p.id && p.hoverImage && (
                      <motion.span
                        className="absolute top-3 left-3 z-10 font-['Plus_Jakarta_Sans'] text-[0.6rem] font-semibold uppercase tracking-[0.13em] bg-[rgba(18,13,10,0.72)] text-white/90 px-2.5 py-[0.28rem] rounded-[4px]"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                      >
                        Before
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* View gallery hint */}
                  <AnimatePresence>
                    {hoveredId === p.id && p.hasGallery && (
                      <motion.div
                        className="absolute inset-0 bg-[#1C1714]/20 flex items-center justify-center z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                          <svg className="w-3.5 h-3.5 text-[#1C1714]" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                          <span className="font-['Source_Serif_4'] text-[0.75rem] font-semibold text-[#1C1714]">View Gallery</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="px-6 py-6">
                  <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                    <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-[#A88636]">
                      {p.category}
                    </span>
                    {p.location && (
                      <>
                        <span className="text-[#D4AF37]/40 text-[0.55rem]">&#9679;</span>
                        <span className="inline-flex items-center gap-1 font-['Source_Serif_4'] text-[0.72rem] text-[#9A9590]">
                          <svg className="w-2.5 h-2.5 text-[#B08D2A]/60 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                          </svg>
                          {p.location}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-[1.1875rem] font-semibold text-[#1C1714] mb-2.5 leading-snug tracking-[-0.01em]">
                    {p.title}
                  </h3>
                  <p className="text-[#5A5048] text-[0.875rem] font-['Source_Serif_4'] leading-[1.7]">
                    {p.description}
                  </p>
                  {p.hasGallery && (
                    <p className="mt-3 inline-flex items-center gap-1.5 text-[#B08D2A] font-['Source_Serif_4'] text-[0.8rem] font-medium">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      {GALLERIES[p.id]?.length} photos
                    </p>
                  )}
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
        {galleryProject && (
          <GalleryModal
            images={GALLERIES[galleryProject.id]}
            title={galleryProject.title}
            onClose={() => setGalleryProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
