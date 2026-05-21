import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useSEO } from '../hooks/useSEO'
import { trackServiceCtaClick, trackThankYouView } from '../utils/tracking'

let lastThankYouViewAt = 0

export default function ThankYouPage() {
  useSEO({
    title: 'Thank You | Ictinus Contractors',
    description: 'Thank you for contacting Ictinus Contractors. Your quote request has been received.',
    canonical: 'https://www.ictinuscontractors.co.uk/thank-you/',
    robots: 'noindex, nofollow',
  })

  useEffect(() => {
    const now = Date.now()
    if (now - lastThankYouViewAt < 1000) return
    lastThankYouViewAt = now
    trackThankYouView({ page_path: window.location.pathname })
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav />
      <main id="main-content">
        <section className="relative overflow-hidden bg-[#1C1714] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=70')] bg-cover bg-center opacity-[0.12]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1714]/30 via-[#1C1714]/76 to-[#1C1714]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="mb-4 font-['Plus_Jakarta_Sans'] text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#A88636]">
              Enquiry received
            </p>
            <h1 className="font-['Cormorant_Garamond'] text-[2.35rem] font-semibold leading-[1.06] text-white sm:text-[3.15rem] lg:text-[3.85rem]">
              Thank You — We&rsquo;ve Received Your Enquiry
            </h1>
            <p className="mx-auto mt-6 max-w-2xl font-['Source_Serif_4'] text-[1rem] leading-[1.75] text-[#E8DFC9] sm:text-[1.08rem]">
              Thank you for contacting Ictinus Contractors. Your quote request has been received and a member of the team will review your details and get back to you as soon as possible.
            </p>
            <p className="mx-auto mt-4 max-w-xl font-['Source_Serif_4'] text-[0.95rem] leading-relaxed text-[#C4BAB0]">
              If your project is urgent, you can call us directly.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="tel:07586480417"
                data-link-location="thank-you primary call button"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-gold px-8 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold tracking-wide text-[#1C1714] shadow-[0_6px_18px_rgba(212,175,55,0.24)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Call 07586 480417
              </a>
              <Link
                to="/services"
                onClick={() => trackServiceCtaClick({ cta_label: 'View Our Services', target_path: '/services' })}
                className="inline-flex items-center justify-center rounded-lg border border-[#D4AF37]/40 px-8 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold tracking-wide text-[#D4AF37] transition-colors duration-200 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10"
              >
                View Our Services
              </Link>
              <Link
                to="/"
                onClick={() => trackServiceCtaClick({ cta_label: 'Back to Home', target_path: '/' })}
                className="inline-flex items-center justify-center rounded-lg border border-white/24 px-8 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold tracking-wide text-[#E8DFC9] transition-colors duration-200 hover:border-white/40 hover:bg-white/8"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
