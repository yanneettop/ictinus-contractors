import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'
import PortfolioGalleryModal from './PortfolioGalleryModal'
import {
  PORTFOLIO_CARD_PROJECTS,
  PORTFOLIO_FEATURED_PROJECT,
  PORTFOLIO_GALLERIES,
} from './portfolioData'

const RESPONSIVE_IMAGE_META = {
  '/Portfolio/full-property-refurbishment-london-reception-room.webp': { name: 'full-property-refurbishment-london-reception-room', width: 1537, height: 1023 },
  '/Portfolio/full-property-refurbishment-london-galley-kitchen.webp': { name: 'full-property-refurbishment-london-galley-kitchen', width: 1536, height: 1024 },
  '/Portfolio/bathroom-renovation-london-walk-in-shower.webp': { name: 'bathroom-renovation-london-walk-in-shower', width: 1536, height: 1024 },
  '/Portfolio/bathroom-renovation-london-freestanding-bath.webp': { name: 'bathroom-renovation-london-freestanding-bath', width: 1536, height: 1024 },
  '/Portfolio/painting-finishing-london-living-room.webp': { name: 'painting-finishing-london-living-room', width: 1536, height: 1024 },
  '/Portfolio/painting-finishing-london-hallway-staircase.webp': { name: 'painting-finishing-london-hallway-staircase', width: 1024, height: 1536 },
  '/Portfolio/flooring_hero.webp': { name: 'flooring_hero', width: 1448, height: 1086 },
  '/Portfolio/flooring_hero_before.png': { name: 'flooring_hero_before', width: 1448, height: 1086 },
  '/Portfolio/plastering_hero.webp': { name: 'plastering_hero', width: 1475, height: 1067 },
  '/Portfolio/plastering_hero_before.png': { name: 'plastering_hero_before', width: 1449, height: 1086 },
}

const PORTFOLIO_WIDTHS = [480, 800, 1200]

function responsivePortfolioSrc(src, width = 800) {
  const meta = RESPONSIVE_IMAGE_META[src]
  return meta ? `/Portfolio/responsive/${meta.name}-${width}.webp` : src
}

function responsivePortfolioSrcSet(src) {
  const meta = RESPONSIVE_IMAGE_META[src]
  if (!meta) return undefined
  return PORTFOLIO_WIDTHS
    .filter((width) => width <= meta.width)
    .map((width) => `${responsivePortfolioSrc(src, width)} ${width}w`)
    .join(', ')
}

function responsivePortfolioSize(src) {
  return RESPONSIVE_IMAGE_META[src] ?? { width: 1200, height: 900 }
}

function MetaLine({ location, serviceType }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#A88636]">
        {serviceType}
      </span>
      <span className="text-[0.55rem] text-[#D4AF37]/35">&#9679;</span>
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
    </div>
  )
}

function GalleryCard({ project, hoveredKey, setHoveredKey, toggledKey, setToggledKey, openGallery }) {
  const isActive = hoveredKey === project.key || toggledKey === project.key
  const activeImage = isActive && project.hoverImage ? project.hoverImage : project.image
  const activeImageSize = responsivePortfolioSize(activeImage)

  const handleImageTap = () => {
    if (project.hoverImage) {
      setToggledKey(toggledKey === project.key ? null : project.key)
    } else if (project.hasGallery) {
      openGallery(project.key)
    }
  }

  const handleGalleryClick = (event) => {
    event.stopPropagation()
    openGallery(project.key)
  }

  return (
    <motion.div
      onHoverStart={() => setHoveredKey(project.key)}
      onHoverEnd={() => setHoveredKey(null)}
      whileHover={{
        y: -3,
        boxShadow: '0 10px 30px rgba(0,0,0,0.09), 0 2px 8px rgba(212,175,55,0.07)',
        borderColor: 'rgba(212,175,55,0.4)',
      }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-[14px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
    >
      <div
        className={`relative aspect-[16/11] overflow-hidden ${project.hoverImage || project.hasGallery ? 'cursor-pointer' : ''}`}
        onClick={handleImageTap}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            handleImageTap()
          }
        }}
        role={project.hoverImage || project.hasGallery ? 'button' : undefined}
        tabIndex={project.hoverImage || project.hasGallery ? 0 : undefined}
        aria-label={project.hoverImage ? `Toggle before/after for ${project.title}` : undefined}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={responsivePortfolioSrc(activeImage)}
            srcSet={responsivePortfolioSrcSet(activeImage)}
            sizes="(min-width: 1024px) 560px, (min-width: 640px) 50vw, 100vw"
            alt={project.title}
            loading="lazy"
            decoding="async"
            width={activeImageSize.width}
            height={activeImageSize.height}
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 h-full w-full object-cover scale-[1.03] transition-transform duration-500 ease-out group-hover:scale-[1.055]"
          />
        </AnimatePresence>

        <AnimatePresence>
          {isActive && project.hoverImage && (
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
          {isActive && project.hasGallery && (
            <motion.div
              className="absolute inset-0 z-10 flex items-end justify-end bg-[#1C1714]/18 p-3 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                type="button"
                onClick={handleGalleryClick}
                aria-label={`Open gallery for ${project.title}`}
                className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/88 px-3 py-1.5 shadow-md backdrop-blur-sm"
              >
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
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 py-5">
        <MetaLine location={project.location} serviceType={project.category} />
        <h3 className="mt-2 mb-2 font-['Cormorant_Garamond'] text-[1.15rem] font-semibold leading-snug tracking-[-0.01em] text-[#1C1714] transition-colors duration-300 group-hover:text-[#B08D2A]">
          {project.title}
        </h3>
        <p className="font-['Source_Serif_4'] text-[0.875rem] leading-[1.7] text-[#7A7068]">
          {project.description}
        </p>
        <button
          type="button"
          onClick={() => project.hasGallery ? openGallery(project.key) : undefined}
          className="group/project mt-4 inline-flex items-center gap-1.5 font-['Source_Serif_4'] text-[0.85rem] font-semibold text-[#B08D2A] transition-colors hover:text-[#8B6C2C]"
        >
          View Project
          <svg className="h-3.5 w-3.5 transition-transform duration-200 group-hover/project:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const [hoveredKey, setHoveredKey] = useState(null)
  const [toggledKey, setToggledKey] = useState(null)
  const [galleryKey, setGalleryKey] = useState(null)

  const openGallery = (key) => {
    if (PORTFOLIO_GALLERIES[key]) setGalleryKey(key)
  }

  const featuredKey = PORTFOLIO_FEATURED_PROJECT.key
  const featuredActive = hoveredKey === featuredKey || toggledKey === featuredKey
  const featuredImage =
    featuredActive && PORTFOLIO_FEATURED_PROJECT.hoverImage
      ? PORTFOLIO_FEATURED_PROJECT.hoverImage
      : PORTFOLIO_FEATURED_PROJECT.image
  const featuredImageSize = responsivePortfolioSize(featuredImage)

  const handleFeaturedImageTap = () => {
    if (PORTFOLIO_FEATURED_PROJECT.hoverImage) {
      setToggledKey(toggledKey === featuredKey ? null : featuredKey)
    } else if (PORTFOLIO_FEATURED_PROJECT.hasGallery) {
      openGallery(featuredKey)
    }
  }

  const handleFeaturedGalleryClick = (event) => {
    event.stopPropagation()
    openGallery(featuredKey)
  }

  return (
    <section id="portfolio" className="bg-[#FAF9F6] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-10 sm:mb-12">
            <p className="ict-section-label">Selected Projects</p>
            <h2 className="ict-section-heading">Recent Refurbishment and Finishing Work Across London</h2>
            <p className="ict-section-subtitle" style={{ maxWidth: '38rem' }}>
              A selection of recent decorating, flooring, plastering, bathroom and refurbishment
              work completed with clean preparation and attention to detail.
            </p>
          </div>
        </Reveal>

        <Reveal direction="scale" delay={0.1}>
          <motion.div
            onHoverStart={() => setHoveredKey(featuredKey)}
            onHoverEnd={() => setHoveredKey(null)}
            whileHover={{
              y: -2,
              boxShadow: '0 16px 40px rgba(0,0,0,0.09), 0 3px 10px rgba(212,175,55,0.07)',
              borderColor: 'rgba(212,175,55,0.38)',
            }}
            transition={{ duration: 0.3 }}
            className="group mb-6 overflow-hidden rounded-[16px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
          >
            <div className="flex flex-col lg:flex-row">
              <div
                className={`relative min-h-[260px] w-full flex-shrink-0 overflow-hidden sm:min-h-[340px] lg:min-h-[440px] lg:w-[60%] ${PORTFOLIO_FEATURED_PROJECT.hoverImage || PORTFOLIO_FEATURED_PROJECT.hasGallery ? 'cursor-pointer' : ''}`}
                onClick={handleFeaturedImageTap}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleFeaturedImageTap()
                  }
                }}
                role={PORTFOLIO_FEATURED_PROJECT.hoverImage || PORTFOLIO_FEATURED_PROJECT.hasGallery ? 'button' : undefined}
                tabIndex={PORTFOLIO_FEATURED_PROJECT.hoverImage || PORTFOLIO_FEATURED_PROJECT.hasGallery ? 0 : undefined}
                aria-label={PORTFOLIO_FEATURED_PROJECT.hoverImage ? `Toggle before/after for ${PORTFOLIO_FEATURED_PROJECT.title}` : undefined}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={featuredImage}
                    src={responsivePortfolioSrc(featuredImage, 1200)}
                    srcSet={responsivePortfolioSrcSet(featuredImage)}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    alt={PORTFOLIO_FEATURED_PROJECT.title}
                    loading="lazy"
                    decoding="async"
                    width={featuredImageSize.width}
                    height={featuredImageSize.height}
                    draggable={false}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 h-full w-full object-cover scale-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.055]"
                  />
                </AnimatePresence>

                <AnimatePresence>
                  {featuredActive &&
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
                  {featuredActive &&
                    PORTFOLIO_FEATURED_PROJECT.hasGallery && (
                      <motion.div
                        className="absolute inset-0 z-10 flex items-end justify-end bg-[#1C1714]/18 p-4 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button
                          type="button"
                          onClick={handleFeaturedGalleryClick}
                          aria-label={`Open gallery for ${PORTFOLIO_FEATURED_PROJECT.title}`}
                          className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 shadow-md backdrop-blur-sm"
                        >
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
                        </button>
                      </motion.div>
                    )}
                </AnimatePresence>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FDFCF9]/50 to-transparent lg:hidden" />
              </div>

              <div className="flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-14">
                <MetaLine
                  location={PORTFOLIO_FEATURED_PROJECT.location}
                  serviceType={PORTFOLIO_FEATURED_PROJECT.category}
                />

                <h3 className="mt-3 mb-4 font-['Cormorant_Garamond'] text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1C1714] lg:text-[1.875rem]">
                  {PORTFOLIO_FEATURED_PROJECT.title}
                </h3>

                <div className="mb-5 h-px w-10 bg-[rgba(212,175,55,0.5)]" />

                <p className="font-['Source_Serif_4'] text-[0.9375rem] leading-[1.8] text-[#5A5048]">
                  {PORTFOLIO_FEATURED_PROJECT.description}
                </p>
                <button
                  type="button"
                  onClick={() => openGallery(PORTFOLIO_FEATURED_PROJECT.key)}
                  className="group/project mt-6 inline-flex items-center gap-2 self-start rounded-lg border border-[#D4AF37]/25 px-5 py-2.5 font-['Source_Serif_4'] text-[0.9rem] font-semibold text-[#B08D2A] transition-colors hover:border-[#D4AF37]/45 hover:bg-[#D4AF37]/8"
                >
                  View Project
                  <svg className="h-4 w-4 transition-transform duration-200 group-hover/project:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2" stagger={0.08}>
          {PORTFOLIO_CARD_PROJECTS.map((project) => (
            <StaggerItem key={project.key}>
              <GalleryCard
                project={project}
                hoveredKey={hoveredKey}
                setHoveredKey={setHoveredKey}
                toggledKey={toggledKey}
                setToggledKey={setToggledKey}
                openGallery={openGallery}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

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
