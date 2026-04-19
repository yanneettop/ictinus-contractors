import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'
import PortfolioGalleryModal from './PortfolioGalleryModal'
import {
  PORTFOLIO_CARD_PROJECTS,
  PORTFOLIO_FEATURED_PROJECT,
  PORTFOLIO_GALLERIES,
} from './portfolioData'

function MetaLine({ location, tags }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 font-['Source_Serif_4'] text-[0.72rem] text-[#9A9590]">
        <svg
          className="h-2.5 w-2.5 flex-shrink-0 text-[#B08D2A]/60"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
        {location}
      </span>
      <span className="text-[0.55rem] text-[#D4AF37]/35">&#9679;</span>
      <span className="font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#A88636]">
        {tags}
      </span>
    </div>
  )
}

function GalleryCard({ project, hoveredKey, setHoveredKey, openGallery }) {
  const isHovered = hoveredKey === project.key
  const activeImage = isHovered && project.hoverImage ? project.hoverImage : project.image

  return (
    <motion.div
      onHoverStart={() => setHoveredKey(project.key)}
      onHoverEnd={() => setHoveredKey(null)}
      onClick={() => openGallery(project.key)}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && project.hasGallery) {
          event.preventDefault()
          openGallery(project.key)
        }
      }}
      whileHover={{
        y: -3,
        boxShadow: '0 10px 30px rgba(0,0,0,0.09), 0 2px 8px rgba(212,175,55,0.07)',
        borderColor: 'rgba(212,175,55,0.4)',
      }}
      transition={{ duration: 0.25 }}
      className={`group overflow-hidden rounded-[14px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] shadow-[0_1px_4px_rgba(0,0,0,0.06)] ${
        project.hasGallery ? 'cursor-pointer' : ''
      }`}
      role={project.hasGallery ? 'button' : undefined}
      tabIndex={project.hasGallery ? 0 : undefined}
      aria-label={project.hasGallery ? `Open gallery for ${project.title}` : undefined}
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={activeImage}
            alt={project.title}
            loading="lazy"
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 h-full w-full object-cover scale-[1.03] transition-transform duration-500 ease-out group-hover:scale-[1.055]"
          />
        </AnimatePresence>

        <AnimatePresence>
          {isHovered && project.hoverImage && (
            <motion.span
              className="absolute left-3 top-3 z-10 rounded-[4px] bg-[rgba(18,13,10,0.72)] px-2.5 py-[0.28rem] font-['Plus_Jakarta_Sans'] text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-white/90"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.18 }}
            >
              Before
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isHovered && project.hasGallery && (
            <motion.div
              className="absolute inset-0 z-10 flex items-end justify-end bg-[#1C1714]/18 p-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-1.5 rounded-full bg-white/88 px-3 py-1.5 shadow-md backdrop-blur-sm">
                <svg
                  className="h-3 w-3 text-[#1C1714]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <span className="font-['Source_Serif_4'] text-[0.72rem] font-semibold text-[#1C1714]">
                  View Gallery
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 py-5">
        <MetaLine location={project.location} tags={project.tags} />
        <h3 className="mt-2 mb-2 font-['Cormorant_Garamond'] text-[1.15rem] font-semibold leading-snug tracking-[-0.01em] text-[#1C1714] transition-colors duration-300 group-hover:text-[#B08D2A]">
          {project.title}
        </h3>
        <p className="font-['Source_Serif_4'] text-[0.875rem] leading-[1.7] text-[#7A7068]">
          {project.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const [hoveredKey, setHoveredKey] = useState(null)
  const [galleryKey, setGalleryKey] = useState(null)

  const openGallery = (key) => {
    if (PORTFOLIO_GALLERIES[key]) setGalleryKey(key)
  }

  const featuredImage =
    hoveredKey === PORTFOLIO_FEATURED_PROJECT.key && PORTFOLIO_FEATURED_PROJECT.hoverImage
      ? PORTFOLIO_FEATURED_PROJECT.hoverImage
      : PORTFOLIO_FEATURED_PROJECT.image

  return (
    <section id="portfolio" className="bg-[#FAF9F6] px-4 py-16 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-14 sm:mb-16">
            <p className="ict-section-label">Selected Projects</p>
            <h2 className="ict-section-heading">Recent Refurbishment and Finishing Work Across London</h2>
            <p className="ict-section-subtitle" style={{ maxWidth: '38rem' }}>
              A selection of bathroom fitting, flooring, plastering, decorating, and refurbishment
              projects completed with care, precision, and a high standard of finish.
            </p>
          </div>
        </Reveal>

        <Reveal direction="scale" delay={0.1}>
          <motion.div
            onHoverStart={() => setHoveredKey(PORTFOLIO_FEATURED_PROJECT.key)}
            onHoverEnd={() => setHoveredKey(null)}
            onClick={() => openGallery(PORTFOLIO_FEATURED_PROJECT.key)}
            onKeyDown={(event) => {
              if (
                (event.key === 'Enter' || event.key === ' ') &&
                PORTFOLIO_FEATURED_PROJECT.hasGallery
              ) {
                event.preventDefault()
                openGallery(PORTFOLIO_FEATURED_PROJECT.key)
              }
            }}
            whileHover={{
              y: -2,
              boxShadow: '0 16px 40px rgba(0,0,0,0.09), 0 3px 10px rgba(212,175,55,0.07)',
              borderColor: 'rgba(212,175,55,0.38)',
            }}
            transition={{ duration: 0.3 }}
            className={`group mb-6 overflow-hidden rounded-[16px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] shadow-[0_1px_4px_rgba(0,0,0,0.06)] ${
              PORTFOLIO_FEATURED_PROJECT.hasGallery ? 'cursor-pointer' : ''
            }`}
            role={PORTFOLIO_FEATURED_PROJECT.hasGallery ? 'button' : undefined}
            tabIndex={PORTFOLIO_FEATURED_PROJECT.hasGallery ? 0 : undefined}
            aria-label={
              PORTFOLIO_FEATURED_PROJECT.hasGallery
                ? `Open gallery for ${PORTFOLIO_FEATURED_PROJECT.title}`
                : undefined
            }
          >
            <div className="flex flex-col lg:flex-row">
              <div className="relative min-h-[260px] w-full flex-shrink-0 overflow-hidden sm:min-h-[340px] lg:min-h-[440px] lg:w-[60%]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={featuredImage}
                    src={featuredImage}
                    alt={PORTFOLIO_FEATURED_PROJECT.title}
                    loading="eager"
                    draggable={false}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 h-full w-full object-cover scale-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.055]"
                  />
                </AnimatePresence>

                <AnimatePresence>
                  {hoveredKey === PORTFOLIO_FEATURED_PROJECT.key &&
                    PORTFOLIO_FEATURED_PROJECT.hoverImage && (
                      <motion.span
                        className="absolute top-4 left-4 z-10 rounded-[4px] bg-[rgba(18,13,10,0.72)] px-2.5 py-[0.28rem] font-['Plus_Jakarta_Sans'] text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-white/90"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        Before
                      </motion.span>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                  {hoveredKey === PORTFOLIO_FEATURED_PROJECT.key &&
                    PORTFOLIO_FEATURED_PROJECT.hasGallery && (
                      <motion.div
                        className="absolute inset-0 z-10 flex items-end justify-end bg-[#1C1714]/18 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 shadow-md backdrop-blur-sm">
                          <svg
                            className="h-3.5 w-3.5 text-[#1C1714]"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.75"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                            />
                          </svg>
                          <span className="font-['Source_Serif_4'] text-[0.78rem] font-semibold text-[#1C1714]">
                            View Gallery
                          </span>
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FDFCF9]/50 to-transparent lg:hidden" />
              </div>

              <div className="flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-14">
                <MetaLine
                  location={PORTFOLIO_FEATURED_PROJECT.location}
                  tags={PORTFOLIO_FEATURED_PROJECT.tags}
                />

                <h3 className="mt-3 mb-4 font-['Cormorant_Garamond'] text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1C1714] lg:text-[1.875rem]">
                  {PORTFOLIO_FEATURED_PROJECT.title}
                </h3>

                <div className="mb-5 h-px w-10 bg-[rgba(212,175,55,0.5)]" />

                <p className="font-['Source_Serif_4'] text-[0.9375rem] leading-[1.8] text-[#5A5048]">
                  {PORTFOLIO_FEATURED_PROJECT.description}
                </p>
              </div>
            </div>
          </motion.div>
        </Reveal>

        <StaggerContainer className="mb-14 grid grid-cols-1 gap-5 sm:mb-16 sm:grid-cols-2" stagger={0.08}>
          {PORTFOLIO_CARD_PROJECTS.map((project) => (
            <StaggerItem key={project.key}>
              <GalleryCard
                project={project}
                hoveredKey={hoveredKey}
                setHoveredKey={setHoveredKey}
                openGallery={openGallery}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal delay={0.12}>
          <div className="rounded-2xl border border-[#D4AF37]/22 bg-[#FDFCF9] px-8 py-10 text-center shadow-[0_1px_4px_rgba(0,0,0,0.05)] sm:px-14 sm:py-12">
            <h3 className="mb-3 font-['Cormorant_Garamond'] text-[1.5rem] font-semibold leading-snug tracking-[-0.01em] text-[#1C1714] sm:text-[1.75rem]">
              Planning a refurbishment or finishing project in London?
            </h3>
            <div className="mx-auto mb-4 h-px w-10 bg-[#D4AF37]/45" />
            <p className="mx-auto mb-8 max-w-[34rem] font-['Source_Serif_4'] text-[0.9375rem] leading-[1.75] text-[#5A5048]">
              Tell us what you need and we will be happy to discuss the scope, timeline, and next
              steps.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-gold px-9 py-3.5 font-['Source_Serif_4'] text-[0.9375rem] font-semibold tracking-wide text-[#1C1714] shadow-[0_4px_14px_rgba(212,175,55,0.25)]"
              >
                Get a Quote
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {galleryKey && (
          <PortfolioGalleryModal
            images={PORTFOLIO_GALLERIES[galleryKey]}
            title={
              galleryKey === PORTFOLIO_FEATURED_PROJECT.key
                ? PORTFOLIO_FEATURED_PROJECT.title
                : PORTFOLIO_CARD_PROJECTS.find((project) => project.key === galleryKey)?.title ?? ''
            }
            onClose={() => setGalleryKey(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
