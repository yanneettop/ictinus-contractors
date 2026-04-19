import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'

const mainServices = [
  'Painting & Decorating',
  'Wallpapering',
  'Plastering',
  'Hard Flooring',
  'Bathroom Fitting',
  'Property Refurbishment',
  'Finishing Carpentry',
]

const quickLinks = [
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Contact', to: '/contact' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1C1714] text-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-14" stagger={0.1}>

          {/* Brand column */}
          <StaggerItem><div className="sm:col-span-2 lg:col-span-1">
            <p className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold tracking-[0.15em] text-gradient-gold mb-2">
              ICTINUS
            </p>
            <p className="font-['Plus_Jakarta_Sans'] text-[0.7rem] uppercase tracking-[0.2em] text-white/30 mb-5">Contractors</p>
            <p className="font-['Source_Serif_4'] text-[0.9375rem] text-[#94A3B8] leading-[1.72] mb-4">
              Professional decorating, refurbishment, and finishing services across London.
              Premium results, reliable project management, and clear communication on every job.
            </p>
            <p className="ict-footer-insurance">
              Fully insured · 12+ years experience · London-wide coverage
            </p>
          </div></StaggerItem>

          {/* Quick Links */}
          <StaggerItem><div>
            <h4 className="font-['Cormorant_Garamond'] text-[0.875rem] font-semibold text-[#F1F5F9]/90 tracking-widest uppercase mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="font-['Source_Serif_4'] text-[0.9375rem] text-[#94A3B8] hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div></StaggerItem>

          {/* Services column */}
          <StaggerItem><div>
            <h4 className="font-['Cormorant_Garamond'] text-[0.875rem] font-semibold text-[#F1F5F9]/90 tracking-widest uppercase mb-5">
              Services
            </h4>
            <ul className="space-y-2">
              {mainServices.map((s) => (
                <li key={s}>
                  <Link
                    to="/services"
                    className="font-['Source_Serif_4'] text-[0.9375rem] text-[#94A3B8] hover:text-[#D4AF37] transition-colors duration-200"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div></StaggerItem>

          {/* Contact column */}
          <StaggerItem><div>
            <h4 className="font-['Cormorant_Garamond'] text-[0.875rem] font-semibold text-[#F1F5F9]/90 tracking-widest uppercase mb-5">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@ictinuscontractors.co.uk" className="font-['Source_Serif_4'] text-[0.9375rem] text-[#94A3B8] hover:text-[#D4AF37] transition-colors">
                  info@ictinuscontractors.co.uk
                </a>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                <a href="tel:07586480417" className="font-['Source_Serif_4'] text-[0.9375rem] text-[#94A3B8] hover:text-[#D4AF37] transition-colors">
                  07586 480417
                </a>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-['Source_Serif_4'] text-[0.9375rem] text-[#94A3B8]">
                  East London &amp; surrounding boroughs
                </span>
              </div>
              <div className="pt-2">
                <Link
                  to="/contact"
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
          <p className="font-['Source_Serif_4'] text-[0.8125rem] text-[#94A3B8]/60 text-center">
            &copy; {new Date().getFullYear()} Ictinus Contractors. All rights reserved.
          </p>
          <p className="font-['Source_Serif_4'] text-[0.8125rem] text-[#94A3B8]/60 text-center">
            London, United Kingdom
          </p>
        </div>
      </div>
    </footer>
  )
}
