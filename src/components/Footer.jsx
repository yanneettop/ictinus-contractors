import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'
import { trackServiceCtaClick } from '../utils/tracking'
import { openCookieSettings } from '../utils/consent'

const mainServices = [
  { label: 'Property Refurbishment & Extensions', to: '/services/property-refurbishment-extensions' },
  { label: 'Bathroom Fitting', to: '/services/bathroom-fitting' },
  { label: 'Hard Flooring', to: '/services/hard-flooring' },
  { label: 'Plastering', to: '/services/plastering' },
  { label: 'Painting & Decorating', to: '/services/painting-and-decorating' },
  { label: 'Finishing Carpentry', to: '/services/finishing-carpentry' },
  { label: 'Electrical Works', to: '/services/electrical-works' },
  { label: 'Plumbing', to: '/services/plumbing' },
]

const quickLinks = [
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Contact', to: '/contact' },
]

const verifiedProfiles = [
  { label: 'Checkatrade', href: 'https://www.checkatrade.com/trades/ictinuscontractors' },
  { label: 'MyBuilder', href: 'https://www.mybuilder.com/profile/ictinus-contractors' },
]

function FooterBrandMark() {
  return (
    <Link
      to="/"
      className="group inline-flex items-center gap-3 sm:gap-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
      aria-label="Go to Ictinus Contractors homepage"
    >
      <img
        src="/logo_trans-120.webp"
        srcSet="/logo_trans-120.webp 120w, /logo_trans-240.webp 240w"
        sizes="(min-width: 1024px) 72px, (min-width: 640px) 62px, 50px"
        alt=""
        width="120"
        height="120"
        loading="lazy"
        decoding="async"
        className="h-[50px] w-auto flex-shrink-0 transition-transform duration-300 group-hover:scale-[1.04] sm:h-[62px] lg:h-[72px]"
      />
      <span className="flex flex-col leading-none text-left">
        <span className="font-['Cormorant_Garamond'] text-[1.42rem] font-semibold uppercase tracking-[0.18em] text-[#D4AF37] sm:text-[1.68rem] sm:tracking-[0.24em]">
          ICTINUS
        </span>
        <span className="mt-1.5 font-['Cormorant_Garamond'] text-[0.84rem] font-semibold uppercase tracking-[0.13em] text-[#D4AF37] sm:mt-2 sm:text-[0.98rem] sm:tracking-[0.16em]">
          CONTRACTORS
        </span>
      </span>
    </Link>
  )
}

export default function Footer() {
  return (
    <footer className="bg-[#1C1714] text-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14" stagger={0.1}>

          {/* Brand column */}
          <StaggerItem><div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <FooterBrandMark />
            </div>
            <p className="font-['Source_Serif_4'] text-[0.9375rem] text-[#C8B8A6] leading-[1.72] mb-4">
              Professional decorating, refurbishment, and finishing services across London.
              Premium results, reliable project management, and clear communication on every job.
            </p>
            <p className="ict-footer-insurance">
              Fully insured · 12+ years experience · London-wide coverage
            </p>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#BFAF9C]">
                Verified profiles
              </p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {verifiedProfiles.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['Source_Serif_4'] text-[0.88rem] text-[#C8B8A6] underline decoration-[#C8B8A6]/45 underline-offset-4 transition-colors hover:text-[#D4AF37] hover:decoration-[#D4AF37]/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div></StaggerItem>

          {/* Quick Links */}
          <StaggerItem><div>
            <p className="font-['Cormorant_Garamond'] text-[0.875rem] font-semibold text-[#F1F5F9]/90 tracking-widest uppercase mb-5">
              Quick Links
            </p>
            <ul className="space-y-2">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    onClick={() => trackServiceCtaClick({
                      cta_label: label,
                      target_path: to,
                      service_name: label,
                    })}
                    className="font-['Source_Serif_4'] text-[0.9375rem] text-[#C8B8A6] underline decoration-[#C8B8A6]/35 underline-offset-4 hover:text-[#D4AF37] hover:decoration-[#D4AF37]/65 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div></StaggerItem>

          {/* Services column */}
          <StaggerItem><div>
            <p className="font-['Cormorant_Garamond'] text-[0.875rem] font-semibold text-[#F1F5F9]/90 tracking-widest uppercase mb-5">
              Services
            </p>
            <ul className="space-y-2">
              {mainServices.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="font-['Source_Serif_4'] text-[0.9375rem] text-[#C8B8A6] underline decoration-[#C8B8A6]/35 underline-offset-4 hover:text-[#D4AF37] hover:decoration-[#D4AF37]/65 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div></StaggerItem>

          {/* Contact column */}
          <StaggerItem><div>
            <p className="font-['Cormorant_Garamond'] text-[0.875rem] font-semibold text-[#F1F5F9]/90 tracking-widest uppercase mb-5">
              Contact Us
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@ictinuscontractors.co.uk" data-link-location="footer contact email" className="font-['Source_Serif_4'] text-[0.9375rem] text-[#C8B8A6] underline decoration-[#C8B8A6]/35 underline-offset-4 hover:text-[#D4AF37] hover:decoration-[#D4AF37]/65 transition-colors">
                  info@ictinuscontractors.co.uk
                </a>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <a href="tel:07586480417" data-link-location="footer contact phone" className="font-['Source_Serif_4'] text-[0.9375rem] text-[#C8B8A6] underline decoration-[#C8B8A6]/35 underline-offset-4 hover:text-[#D4AF37] hover:decoration-[#D4AF37]/65 transition-colors">
                  07586 480417
                </a>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-['Source_Serif_4'] text-[0.9375rem] text-[#C8B8A6]">
                  East London &amp; surrounding boroughs
                </span>
              </div>
              <div className="pt-2">
                <Link
                  to="/contact#quote"
                  onClick={() => trackServiceCtaClick({ cta_label: 'Get a Quote', target_path: '/contact#quote' })}
                  className="inline-block font-['Source_Serif_4'] text-[0.9375rem] font-semibold tracking-wide px-5 py-2.5 rounded-lg bg-gradient-gold text-[#1C1714] transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get a Quote
                </Link>
              </div>
            </div>
          </div></StaggerItem>
        </StaggerContainer>

        {/* Divider + copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <p className="font-['Source_Serif_4'] text-[0.8125rem] text-[#BFAF9C] text-center">
              &copy; {new Date().getFullYear()} Ictinus Contractors. All rights reserved.
            </p>
            <button
              type="button"
              onClick={openCookieSettings}
              className="font-['Source_Serif_4'] text-[0.75rem] text-[#BFAF9C] underline decoration-[#BFAF9C]/45 underline-offset-4 transition-colors duration-200 hover:text-[#D4AF37]/85 hover:decoration-[#D4AF37]/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              Cookie settings
            </button>
          </div>
          <div className="flex flex-col items-center gap-1 sm:items-end">
            <p className="font-['Source_Serif_4'] text-[0.8125rem] text-[#BFAF9C] text-center">
              London, United Kingdom
            </p>
            <p className="font-['Source_Serif_4'] text-[0.75rem] text-[#BFAF9C] text-center">
              Website crafted by{' '}
              <a
                href="https://pixelrebels.space"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E1E5E9] underline decoration-[#E1E5E9]/45 underline-offset-4 transition-colors duration-200 hover:text-[#D4AF37]/85 hover:decoration-[#D4AF37]/65"
              >
                Pixel Rebels
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
