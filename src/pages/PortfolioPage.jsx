import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Nav from '../components/Nav'
import PageHero from '../components/PageHero'
import Footer from '../components/Footer'
import Reveal, { StaggerContainer, StaggerItem } from '../components/Reveal'
import PortfolioGalleryModal from '../components/PortfolioGalleryModal'
import useScrollReveal from '../hooks/useScrollReveal'
import {
  PORTFOLIO_CARD_PROJECTS,
  PORTFOLIO_FEATURED_PROJECT,
  PORTFOLIO_GALLERIES,
  PORTFOLIO_PAGE_PROJECTS,
} from '../components/portfolioData'

function MetaLine({ category, location, tags }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-[#A88636]">
        {category}
      </span>
      <span className="text-[0.55rem] text-[#D4AF37]/35">&#9679;</span>
      <span className="inline-flex items-center gap-1 font-['Source_Serif_4'] text-[0.75rem] text-[#9A9590]">
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
      <span className="font-['Source_Serif_4'] text-[0.75rem] text-[#7A7068]">{tags}</span>
    </div>
  )
}

function ProjectTile({ project, hoveredKey, setHoveredKey, openGallery }) {
  const isHovered = hoveredKey === project.key
  const image = isHovered && project.hoverImage ? project.hoverImage : project.image
  const galleryCount = PORTFOLIO_GALLERIES[project.key]?.length ?? 0

  return (
    <motion.article
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
        y: -4,
        boxShadow: '0 14px 32px rgba(0,0,0,0.09), 0 4px 12px rgba(212,175,55,0.08)',
        borderColor: 'rgba(212,175,55,0.38)',
      }}
      transition={{ duration: 0.28 }}
      className={`group overflow-hidden rounded-[16px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] shadow-sm ${
        project.hasGallery ? 'cursor-pointer' : ''
      }`}
      role={project.hasGallery ? 'button' : undefined}
      tabIndex={project.hasGallery ? 0 : undefined}
      aria-label={project.hasGallery ? `Open gallery for ${project.title}` : undefined}
    >
      <div className="relative aspect-[16/11] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={image}
            src={image}
            alt={project.title}
            loading="lazy"
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 h-full w-full object-cover scale-[1.03] transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        </AnimatePresence>

        <AnimatePresence>
          {isHovered && project.hoverImage && (
            <motion.span
              className="absolute left-4 top-4 z-10 rounded-[4px] bg-[rgba(18,13,10,0.72)] px-2.5 py-[0.28rem] font-['Plus_Jakarta_Sans'] text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-white/90"
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
              className="absolute inset-0 z-10 flex items-end justify-between bg-gradient-to-t from-[#1C1714]/45 via-[#1C1714]/10 to-transparent p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="rounded-full border border-white/25 bg-white/12 px-3 py-1 font-['Plus_Jakarta_Sans'] text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
                {galleryCount} images
              </span>
              <span className="rounded-full bg-white/90 px-3 py-1.5 font-['Source_Serif_4'] text-[0.74rem] font-semibold text-[#1C1714] shadow-md">
                View Gallery
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 py-6">
        <MetaLine category={project.category} location={project.location} tags={project.tags} />
        <h3 className="mt-3 mb-3 font-['Cormorant_Garamond'] text-[1.25rem] font-semibold leading-[1.15] tracking-[-0.01em] text-[#1C1714] transition-colors duration-300 group-hover:text-[#B08D2A]">
          {project.title}
        </h3>
        <p className="font-['Source_Serif_4'] text-[0.92rem] leading-[1.75] text-[#5A5048]">
          {project.description}
        </p>
      </div>
    </motion.article>
  )
}

export default function PortfolioPage() {
  useScrollReveal()

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
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav />

      <main id="main-content">
        <PageHero
          breadcrumb="Our Work"
          title="Featured Projects"
          subtitle="A curated selection of completed refurbishment, decorating, and bathroom fitting work across London, with real before-and-after project galleries."
        />

        <section className="bg-[#FAF9F6] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mb-12 grid gap-6 rounded-[20px] border border-[rgba(212,175,55,0.16)] bg-[#FDFCF9] p-8 shadow-sm lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:p-10">
                <div>
                  <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#A88636]">
                    Portfolio Overview
                  </p>
                  <h2 className="font-['Cormorant_Garamond'] text-[2rem] font-semibold leading-[1.02] tracking-[-0.03em] text-[#1C1714] sm:text-[2.5rem]">
                    Real refurbishment work, documented with before-and-after detail.
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-[#FAF7F0] px-5 py-4">
                    <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1C1714]">
                      {Object.keys(PORTFOLIO_GALLERIES).length}
                    </div>
                    <p className="mt-1 font-['Source_Serif_4'] text-[0.88rem] text-[#6B625A]">
                      Live project galleries
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#FAF7F0] px-5 py-4">
                    <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1C1714]">
                      {PORTFOLIO_PAGE_PROJECTS.length}
                    </div>
                    <p className="mt-1 font-['Source_Serif_4'] text-[0.88rem] text-[#6B625A]">
                      Core service showcases
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[#FAF7F0] px-5 py-4">
                    <div className="font-['Cormorant_Garamond'] text-3xl font-semibold text-[#1C1714]">
                      12+
                    </div>
                    <p className="mt-1 font-['Source_Serif_4'] text-[0.88rem] text-[#6B625A]">
                      Refurbishment photos
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal direction="scale" delay={0.05}>
              <motion.article
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
                  boxShadow: '0 18px 44px rgba(0,0,0,0.1), 0 4px 12px rgba(212,175,55,0.08)',
                  borderColor: 'rgba(212,175,55,0.35)',
                }}
                transition={{ duration: 0.3 }}
                className="group mb-8 overflow-hidden rounded-[20px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] shadow-sm"
                role="button"
                tabIndex={0}
                aria-label={`Open gallery for ${PORTFOLIO_FEATURED_PROJECT.title}`}
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
                        className="absolute inset-0 h-full w-full object-cover object-center scale-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.055]"
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
                      category={PORTFOLIO_FEATURED_PROJECT.category}
                      location={PORTFOLIO_FEATURED_PROJECT.location}
                      tags={PORTFOLIO_FEATURED_PROJECT.tags}
                    />

                    <h3 className="mt-3 mb-4 font-['Cormorant_Garamond'] text-[1.6rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1C1714] lg:text-[1.875rem]">
                      {PORTFOLIO_FEATURED_PROJECT.title}
                    </h3>

                    <div className="mb-5 h-px w-10 bg-[rgba(212,175,55,0.5)]" />

                    <p className="mb-6 font-['Source_Serif_4'] text-[0.9375rem] leading-[1.8] text-[#5A5048]">
                      {PORTFOLIO_FEATURED_PROJECT.longDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                      <span className="rounded-full bg-[#FAF7F0] px-4 py-2 font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#A88636]">
                        {PORTFOLIO_GALLERIES.refurb.length} before and after images
                      </span>
                      <span className="font-['Source_Serif_4'] text-[0.88rem] font-semibold text-[#1C1714]">
                        Open gallery
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            </Reveal>

            <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2" stagger={0.08}>
              {PORTFOLIO_CARD_PROJECTS.map((project) => (
                <StaggerItem key={project.key}>
                  <ProjectTile
                    project={project}
                    hoveredKey={hoveredKey}
                    setHoveredKey={setHoveredKey}
                    openGallery={openGallery}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <section className="relative bg-[#1C1714] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
          <div className="mx-auto max-w-3xl text-center" data-reveal>
            <h2 className="mb-5 font-['Cormorant_Garamond'] text-2xl font-semibold text-white sm:text-3xl">
              Like what you see?
            </h2>
            <p className="mx-auto mb-8 max-w-xl font-['Source_Serif_4'] text-[0.95rem] leading-relaxed text-[#C4BAB0]">
              If you are planning a refurbishment, bathroom fit-out, or decorating project, we can
              talk through the scope and provide a free quote.
            </p>
            <Link
              to="/contact"
              className="inline-block rounded-lg bg-gradient-gold px-8 py-3.5 font-['Source_Serif_4'] text-[0.9rem] font-semibold tracking-wide text-[#1C1714] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-[#D4AF37]/30"
            >
              Discuss Your Project
            </Link>
          </div>
        </section>
      </main>

      <Footer />

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
    </div>
  )
}
