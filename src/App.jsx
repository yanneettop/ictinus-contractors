import { useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { motion, MotionConfig } from 'motion/react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import TrustRow from './components/TrustRow'
import Services from './components/Services'
import WhoWeWorkWith from './components/WhoWeWorkWith'
import Portfolio from './components/Portfolio'
import WhyChooseUs from './components/WhyChooseUs'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import Reveal from './components/Reveal'
import useScrollReveal from './hooks/useScrollReveal'

import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import ContactPage from './pages/ContactPage'

/* ── Slim Homepage ── */
function HomePage() {
  useScrollReveal()

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav />
      <main id="main-content">
        <Hero />
        <TrustRow />

      {/* Short intro */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <p className="ict-section-label mb-2">About Ictinus Contractors</p>
            <h2 className="font-['Cormorant_Garamond'] text-[1.75rem] md:text-[2.5rem] font-semibold text-[#1C1714] mb-5 leading-[1.15]">
              A London Contractor Brand Built on Quality
            </h2>
            <p className="font-['Source_Serif_4'] text-[0.9375rem] sm:text-[1.0625rem] text-[#5A5048] leading-[1.78] mb-8">
              With over 12 years of industry experience and a reputation built on quality workmanship,
              reliability, and strong communication, Ictinus Contractors delivers a professional service
              for homeowners, landlords, and businesses across London.
            </p>
            <motion.div whileHover={{ scale: 1.04 }} className="inline-block">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 font-['Source_Serif_4'] font-medium text-[0.9375rem] text-[#B08D2A] hover:text-[#D4AF37] transition-colors group"
              >
                Learn more about us
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </section>

        {/* Services preview */}
        <Services />

        {/* Who We Work With */}
        <WhoWeWorkWith />

        {/* Portfolio preview */}
        <Portfolio />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Photo divider */}
        <div className="relative h-[240px] sm:h-[320px] lg:h-[380px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2100&auto=format&fit=crop)' }}
        />
        <div className="absolute inset-0 bg-[#1C1714]/60" />
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <Reveal direction="scale">
            <p className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl lg:text-4xl font-semibold text-white/90 italic max-w-2xl leading-relaxed" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              &ldquo;Quality is never an accident; it is always the result of intelligent effort.&rdquo;
            </p>
          </Reveal>
        </div>
        </div>

        <Testimonials />

        {/* Final CTA */}
        <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#1C1714]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-5 leading-tight">
              Ready to Get Started?
            </h2>
            <p className="font-['Source_Serif_4'] text-[0.95rem] text-[#C4BAB0] leading-relaxed mb-10 max-w-2xl mx-auto">
              Tell us about your project and we'll come back to you with a clear, no-obligation quote.
              Most enquiries are answered within one business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/contact"
                  className="block font-['Source_Serif_4'] font-semibold text-[0.9rem] tracking-wide px-8 py-3.5 rounded-lg text-[#1C1714] bg-gradient-gold shadow-lg"
                >
                  Get Your Free Quote
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="mailto:info@ictinuscontractors.co.uk"
                  className="block font-['Source_Serif_4'] font-semibold text-[0.9rem] tracking-wide px-8 py-3.5 rounded-lg text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/60 text-center"
                >
                  Email Us Directly
                </a>
              </motion.div>
            </div>
            <p className="mt-6 font-['Source_Serif_4'] text-[0.8125rem] text-white/30 tracking-[0.15em] uppercase">
              Free Consultation &nbsp;&middot;&nbsp; No Obligation &nbsp;&middot;&nbsp; Fast Response
            </p>
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
  return (
    <MotionConfig reducedMotion="user">
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </MotionConfig>
  )
}
