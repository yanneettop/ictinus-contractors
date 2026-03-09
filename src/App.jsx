import { useEffect } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import TrustRow from './components/TrustRow'
import Services from './components/Services'
import SmallerProjects from './components/SmallerProjects'
import WhyChooseUs from './components/WhyChooseUs'
import Portfolio from './components/Portfolio'
import BeforeAfter from './components/BeforeAfter'
import Testimonials from './components/Testimonials'
import QuoteForm from './components/QuoteForm'
import AreasWeCover from './components/AreasWeCover'
import Footer from './components/Footer'

export default function App() {
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
      <Services />
      <SmallerProjects />
      <WhyChooseUs />
      <Portfolio />
      <BeforeAfter />
      <Testimonials />
      <QuoteForm />
      <AreasWeCover />
      <Footer />
    </div>
  )
}
