import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Hero from './components/Hero'
import TrustRow from './components/TrustRow'
import AboutSection from './components/AboutSection'
import Services from './components/Services'
import WhyChooseUs from './components/WhyChooseUs'
import Portfolio from './components/Portfolio'
import BeforeAfter from './components/BeforeAfter'
import HowWeWork from './components/HowWeWork'
import Testimonials from './components/Testimonials'
import QuoteForm from './components/QuoteForm'
import FinalCTA from './components/FinalCTA'
import AreasWeCover from './components/AreasWeCover'
import Footer from './components/Footer'
import ServicesPage from './pages/ServicesPage'

/* ── Scroll-reveal for the homepage ── */
function HomePage() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('ict-visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav />
      <Hero />
      <TrustRow />
      <AboutSection />
      <Services />
      <WhyChooseUs />
      <Portfolio />
      <BeforeAfter />
      <HowWeWork />
      <Testimonials />
      <QuoteForm />
      <FinalCTA />
      <AreasWeCover />
      <Footer />
    </div>
  )
}

/* ── Scroll to hash anchor after navigation (e.g. /#quote) ── */
function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const t = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 120)
      return () => clearTimeout(t)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
      </Routes>
    </>
  )
}
