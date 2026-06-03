import { useEffect, useRef } from 'react'
import { Routes, Route, useLocation, Link, Navigate } from 'react-router-dom'
import { motion, MotionConfig, useScroll, useTransform } from 'motion/react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import TrustRow from './components/TrustRow'
import Services from './components/Services'
import WhoWeWorkWith from './components/WhoWeWorkWith'
import Portfolio from './components/Portfolio'
import Footer from './components/Footer'
import SectionDivider from './components/SectionDivider'
import Reveal from './components/Reveal'
import useScrollReveal from './hooks/useScrollReveal'
import useContactLinkTracking from './hooks/useContactLinkTracking'
import { trackServiceCtaClick } from './utils/tracking'

import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import {
  BathroomFittingPage,
  ElectricalWorksPage,
  FinishingCarpentryPage,
  HardFlooringPage,
  PaintingAndDecoratingPage,
  PlasteringPage,
  PlumbingPage,
  PropertyRefurbishmentExtensionsPage,
} from './pages/ServicePageTemplate'
import PortfolioPage from './pages/PortfolioPage'
import ContactPage from './pages/ContactPage'
import ThankYouPage from './pages/ThankYouPage'

const CHECKATRADE_URL = 'https://www.checkatrade.com/trades/ictinuscontractors'
const MYBUILDER_URL = 'https://www.mybuilder.com/profile/ictinus-contractors'

/* ── Photo Quote Divider ── */
function ParallaxQuote() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-12%', '8%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['16px', '-16px'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0])

  return (
    <div ref={ref} className="relative h-[420px] sm:h-[540px] lg:h-[640px] xl:h-[680px] overflow-hidden bg-[#1C1714]">
      <motion.div
        className="absolute inset-[-18%] bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2100&auto=format&fit=crop)',
          backgroundPosition: 'center 90%',
          y: bgY,
        }}
      />
      <div className="absolute inset-0 bg-[#1C1714]/68" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 48%, rgba(28,23,20,0.2) 0%, rgba(28,23,20,0.54) 74%)' }} />
      <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
        <motion.div style={{ y: textY, opacity: textOpacity }}>
          <motion.div
            className="mx-auto mb-6 h-px w-10 bg-[#D4AF37]/50"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <p className="mx-auto max-w-3xl font-['Cormorant_Garamond'] text-2xl font-semibold italic leading-relaxed text-white/90 sm:text-3xl lg:text-[2.65rem]" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            &ldquo;Quality is never an accident; it is always the result of intelligent effort.&rdquo;
          </p>
          <motion.div
            className="mx-auto mt-6 h-px w-10 bg-[#D4AF37]/50"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>
      </div>
    </div>
  )
}

/* ── Slim Homepage ── */
const proofCards = [
  { value: '9.97/10', label: 'Checkatrade rating' },
  { value: '33', label: 'Customer reviews' },
  { value: '12+', label: 'Years experience' },
  { value: 'London', label: 'Local contractor' },
]

const reviewCards = [
  {
    title: 'Quality work, thorough and detail orientated',
    quote: 'Professional from start to finish, with clear communication, honest quotes and exceptional attention to detail.',
    meta: 'E14 · Checkatrade review',
  },
  {
    title: 'Excellent job',
    quote: 'Reliable, professional and thorough. The flat was repainted to a high standard with a clean, fresh finish.',
    meta: 'E14 · Checkatrade review',
  },
  {
    title: 'Outstanding work and true professionalism',
    quote: 'Detailed, efficient and excellent quality work, completed within the agreed timeframe.',
    meta: 'IG10 · Checkatrade review',
  },
]

const myBuilderStats = [
  { value: '4.9/5', label: 'MyBuilder rating' },
  { value: '31', label: 'MyBuilder reviews' },
  { value: 'Apr 2026', label: 'Latest feedback' },
]

const howWeWorkItems = [
  {
    title: 'Clear communication',
    text: 'You know what is happening, what comes next and how the work is progressing.',
  },
  {
    title: 'Clean, organised work',
    text: 'Work areas are kept tidy and disruption is managed carefully from start to finish.',
  },
  {
    title: 'Careful preparation',
    text: 'Surfaces, details and materials are prepared properly before finishing begins.',
  },
  {
    title: 'Reliable finish',
    text: 'Each project is completed with practical checks and attention to the final result.',
  },
]

function TrustProfileCards() {
  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <motion.article
        className="rounded-lg border border-[#D4AF37]/32 bg-[#FFFEFB] p-6 shadow-[0_16px_44px_rgba(28,23,20,0.08)] sm:p-7"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4, boxShadow: '0 20px 52px rgba(28,23,20,0.1), 0 4px 14px rgba(212,175,55,0.1)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#A88636]">
          Checkatrade Reviews
        </p>
        <h3 className="mt-3 font-['Cormorant_Garamond'] text-[2rem] font-semibold leading-none text-[#1C1714] sm:text-[2.4rem]">
          9.97/10 rating
        </h3>
        <p className="mt-4 font-['Source_Serif_4'] text-[0.96rem] leading-[1.68] text-[#4D433B]">
          33 customer reviews, with consistent feedback for quality, reliability, communication and
          attention to detail.
        </p>
        <a
          href={CHECKATRADE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-6 py-3 font-['Source_Serif_4'] text-[0.92rem] font-semibold tracking-wide text-[#1C1714] shadow-[0_8px_24px_rgba(212,175,55,0.22)] transition-shadow hover:shadow-[0_12px_32px_rgba(212,175,55,0.32)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B08D2A]"
        >
          View Checkatrade Reviews
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H9m8 0v8" />
          </svg>
        </a>
      </motion.article>

      <motion.article
        className="rounded-lg border border-[#D4AF37]/18 bg-[#FDFCF9] p-6 shadow-[0_10px_28px_rgba(28,23,20,0.045)] sm:p-7"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -3, boxShadow: '0 14px 34px rgba(28,23,20,0.07)' }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#A88636]">
          MyBuilder Profile
        </p>
        <h3 className="mt-3 font-['Cormorant_Garamond'] text-[1.75rem] font-semibold leading-tight text-[#1C1714] sm:text-[2.1rem]">
          4.9/5 rating on MyBuilder
        </h3>
        <p className="mt-4 font-['Source_Serif_4'] text-[0.96rem] leading-[1.68] text-[#5A5048]">
          31 MyBuilder reviews add another trust signal alongside Checkatrade, with customers highlighting
          reliability, professionalism and clean finishing work.
        </p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {myBuilderStats.map(({ value, label }) => (
            <div key={label} className="rounded-lg border border-[#D4AF37]/18 bg-[#FFFEFB]/78 px-3 py-3 text-center">
              <p className="font-['Plus_Jakarta_Sans'] text-[1.05rem] font-bold leading-none tracking-[-0.01em] text-[#1C1714]">
                {value}
              </p>
              <p className="mt-1.5 font-['Plus_Jakarta_Sans'] text-[0.58rem] font-semibold uppercase leading-tight tracking-[0.08em] text-[#7A6758]">
                {label}
              </p>
            </div>
          ))}
        </div>
        <a
          href={MYBUILDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/42 px-6 py-3 font-['Source_Serif_4'] text-[0.92rem] font-semibold tracking-wide text-[#B08D2A] transition-colors hover:border-[#D4AF37]/70 hover:bg-[#D4AF37]/8 hover:text-[#8B6C2C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B08D2A]"
        >
          View MyBuilder Profile
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H9m8 0v8" />
          </svg>
        </a>
      </motion.article>
    </div>
  )
}

function PlanningCtaBar() {
  return (
    <section className="bg-[#FAF9F6] px-4 pt-7 pb-8 sm:px-6 sm:pt-8 sm:pb-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="rounded-lg border border-[#D4AF37]/18 bg-[#1C1714] px-5 py-5 text-center shadow-[0_14px_34px_rgba(28,23,20,0.12)] sm:px-8 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:text-left"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl font-semibold leading-tight text-white sm:text-[1.9rem]">
              Planning similar work?
            </h2>
            <p className="mx-auto mt-2 max-w-xl font-['Source_Serif_4'] text-[0.92rem] leading-relaxed text-[#C4BAB0] lg:mx-0">
              Send us a few details about your project and we&rsquo;ll guide you through the next step.
            </p>
          </div>
          <motion.div className="mt-4 inline-block flex-shrink-0 lg:mt-0" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/contact/#quote"
              onClick={() => trackServiceCtaClick({ cta_label: 'Request a Quote', target_path: '/contact#quote' })}
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-7 py-3 font-['Source_Serif_4'] text-[0.95rem] font-semibold tracking-wide text-[#1C1714] shadow-[0_6px_18px_rgba(212,175,55,0.24)] transition-shadow hover:shadow-[0_10px_28px_rgba(212,175,55,0.34)]"
            >
              Request a Quote
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function ReviewsSection() {
  return (
    <section id="testimonials" className="bg-[#FAF9F6] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <Reveal>
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="ict-section-label mb-2">Reviews & Profiles</p>
            <h2 className="mb-4 font-['Cormorant_Garamond'] text-[1.9rem] font-semibold leading-[1.15] text-[#1C1714] md:text-[2.65rem]">
              Trusted by homeowners across London
            </h2>
            <motion.div
              className="mx-auto mb-5 h-px w-16 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
            <p className="mx-auto max-w-2xl font-['Source_Serif_4'] text-[0.96rem] leading-[1.72] text-[#5A5048] sm:text-[1.05rem]">
              From full refurbishments to detailed finishing work, Ictinus Contractors is trusted for clear
              communication, reliable workmanship and a clean professional finish.
            </p>
          </div>

          <TrustProfileCards />

          <div className="mx-auto mt-12 max-w-3xl text-center sm:mt-14">
            <p className="ict-section-label mb-2">Customer Feedback</p>
            <h2 className="mb-4 font-['Cormorant_Garamond'] text-[1.75rem] font-semibold leading-[1.15] text-[#1C1714] md:text-[2.5rem]">
              Checkatrade feedback from London customers
            </h2>
            <p className="mx-auto max-w-2xl font-['Source_Serif_4'] text-[0.9375rem] leading-[1.65] text-[#5A5048] sm:text-[1.03rem]">
              Short excerpts from customer feedback on professionalism, communication, quality workmanship,
              reliability, attention to detail and clean finishes.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-8 lg:grid-cols-4 lg:gap-4">
            {proofCards.map(({ value, label }, i) => (
              <motion.div
                key={`${value}-${label}`}
                className="group rounded-lg border border-[#D4AF37]/18 bg-[#FFFEFB]/78 px-4 py-3.5 text-center shadow-[0_8px_24px_rgba(28,23,20,0.04)] transition-colors duration-300 hover:border-[#D4AF37]/34 hover:bg-[#FDFCF9]"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3, boxShadow: '0 12px 30px rgba(28,23,20,0.07), 0 2px 8px rgba(212,175,55,0.08)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mx-auto mb-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/24 bg-[#D4AF37]/8 transition-colors duration-300 group-hover:border-[#D4AF37]/40 group-hover:bg-[#D4AF37]/14">
                  <svg className="h-4 w-4 text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25L15.75 9.75M12 3.75a8.25 8.25 0 100 16.5 8.25 8.25 0 000-16.5z" />
                  </svg>
                </div>
                <p className="font-['Plus_Jakarta_Sans'] text-[1.25rem] font-bold leading-none tracking-[-0.01em] text-[#1C1714]">
                  {value}
                </p>
                <p className="mt-1 font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#6A5B4C]">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-4 text-center font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#6A5B4C] sm:text-[0.72rem]">
            East London based &middot; Professional refurbishment and finishing work across London
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {reviewCards.map(({ title, quote, meta }, i) => (
              <motion.article
                key={title}
                className="group rounded-lg border border-[#D4AF37]/16 bg-[#FDFCF9] p-4 shadow-[0_10px_28px_rgba(28,23,20,0.045)] transition-colors duration-300 hover:border-[#D4AF37]/34"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, boxShadow: '0 14px 34px rgba(28,23,20,0.075), 0 2px 8px rgba(212,175,55,0.08)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-3 flex gap-1 text-[#D4AF37]" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <svg key={star} className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <h3 className="mb-2 font-['Cormorant_Garamond'] text-[1.2rem] font-semibold leading-tight text-[#1C1714] transition-colors duration-300 group-hover:text-[#B08D2A]">
                  {title}
                </h3>
                <blockquote className="font-['Source_Serif_4'] text-[0.95rem] leading-[1.58] text-[#3D342D]">
                  &ldquo;{quote}&rdquo;
                </blockquote>
                <p className="mt-3 font-['Plus_Jakarta_Sans'] text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-[#A88636]">
                  {meta}
                </p>
              </motion.article>
            ))}
          </div>

          <div className="mt-5 text-center">
            <a
              href={CHECKATRADE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-[#B08D2A] underline decoration-[#D4AF37]/35 underline-offset-4 transition-colors hover:text-[#8B6C2C]"
            >
              Read more reviews on Checkatrade
              <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H9m8 0v8" />
              </svg>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function HomePage() {
  useScrollReveal()

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav />
      <main id="main-content">
        <div className="ict-home-hero-screen">
          <Hero />
          <TrustRow />
        </div>

        <div className="bg-[#1C1714] px-4 py-5 sm:px-6 lg:px-8" aria-hidden="true">
          <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-[#D4AF37]/45 to-transparent" />
        </div>

        {/* Services preview */}
        <Services />

        <SectionDivider variant="curve-up" fromColor="#1C1714" toColor="#F5F0E6" />

        {/* Compact How We Work strip */}
        <section className="bg-[#F5F0E6] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {howWeWorkItems.map(({ title, text }, i) => (
                  <motion.div
                    key={title}
                    className="group rounded-lg border border-[#D4AF37]/18 bg-[#FDFCF9] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.045)] transition-colors duration-300 hover:border-[#D4AF37]/34"
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -3, boxShadow: '0 10px 26px rgba(28,23,20,0.06), 0 2px 8px rgba(212,175,55,0.07)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="font-['Cormorant_Garamond'] text-[1.2rem] font-semibold leading-tight text-[#1C1714] transition-colors duration-300 group-hover:text-[#B08D2A]">
                      {title}
                    </p>
                    <div className="my-3 h-px w-8 bg-[#D4AF37]/40" />
                    <p className="font-['Source_Serif_4'] text-[0.9rem] leading-[1.55] text-[#5A5048]">
                      {text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        <SectionDivider variant="ornament" fromColor="#F5F0E6" />

        {/* Portfolio preview */}
        <Portfolio />

        <PlanningCtaBar />

        {/* Trust and reviews */}
        <ReviewsSection />

        {/* Who We Work With */}
        <WhoWeWorkWith />

        <ParallaxQuote />

        {/* Final CTA */}
        <section className="relative py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#1C1714]">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <p className="mb-5 font-['Source_Serif_4'] text-[1rem] italic leading-relaxed text-[#F6EEDC]/80">
              &ldquo;Clear communication, tidy work and a high-quality finish.&rdquo;
              <span className="mt-2 block font-['Plus_Jakarta_Sans'] text-[0.65rem] not-italic font-semibold uppercase tracking-[0.11em] text-[#D4AF37]/75">
                Verified Checkatrade review
              </span>
            </p>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-5 leading-tight">
              Ready to discuss your project?
            </h2>
            <p className="font-['Source_Serif_4'] text-[0.95rem] text-[#C4BAB0] leading-relaxed mb-8 max-w-2xl mx-auto">
              Tell us what you need and we&rsquo;ll get back to you with clear advice and a free, no-obligation quote.
            </p>
            <div className="flex flex-col items-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/contact/#quote"
                  onClick={() => trackServiceCtaClick({ cta_label: 'Request a Quote', target_path: '/contact#quote' })}
                  className="block font-['Source_Serif_4'] font-semibold text-[0.9rem] tracking-wide px-8 py-3.5 rounded-lg text-[#1C1714] bg-gradient-gold shadow-lg transition-shadow hover:shadow-[0_10px_30px_rgba(212,175,55,0.34)]"
                >
                  Request a Quote
                </Link>
              </motion.div>
              <a
                href={MYBUILDER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 font-['Source_Serif_4'] text-[0.92rem] font-semibold text-[#D4AF37] underline decoration-[#D4AF37]/35 underline-offset-4 transition-colors hover:text-[#F2D774] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
              >
                Prefer using MyBuilder? View our profile
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H9m8 0v8" />
                </svg>
              </a>
            </div>
          </div>
        </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  )
}

/* ── Scroll to top on route change + hash anchor support ── */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const t = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
      return () => clearTimeout(t)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default function App() {
  useContactLinkTracking()

  return (
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/painting-and-decorating" element={<PaintingAndDecoratingPage />} />
        <Route path="/services/property-refurbishment-extensions" element={<PropertyRefurbishmentExtensionsPage />} />
        <Route path="/services/bathroom-fitting" element={<BathroomFittingPage />} />
        <Route path="/services/hard-flooring" element={<HardFlooringPage />} />
        <Route path="/services/plastering" element={<PlasteringPage />} />
        <Route path="/services/finishing-carpentry" element={<FinishingCarpentryPage />} />
        <Route path="/services/electrical-works" element={<ElectricalWorksPage />} />
        <Route path="/services/plumbing" element={<PlumbingPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/request-a-quote" element={<Navigate to="/contact/#quote" replace />} />
        <Route path="/projects" element={<Navigate to="/portfolio/" replace />} />
        <Route path="/services/property-refurbishment-extensions-london" element={<Navigate to="/services/property-refurbishment-extensions/" replace />} />
        <Route path="/services/bathroom-fitting-london" element={<Navigate to="/services/bathroom-fitting/" replace />} />
        <Route path="/services/hard-flooring-london" element={<Navigate to="/services/hard-flooring/" replace />} />
        <Route path="/services/plastering-london" element={<Navigate to="/services/plastering/" replace />} />
        <Route path="/services/painting-decorating-london" element={<Navigate to="/services/painting-and-decorating/" replace />} />
        <Route path="/services/finishing-carpentry-london" element={<Navigate to="/services/finishing-carpentry/" replace />} />
        <Route path="/services/electrical-works-london" element={<Navigate to="/services/electrical-works/" replace />} />
        <Route path="/services/plumbing-london" element={<Navigate to="/services/plumbing/" replace />} />
      </Routes>
    </MotionConfig>
  )
}
