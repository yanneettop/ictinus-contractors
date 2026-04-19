import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'
import FloatingElements from './FloatingElements'

const services = [
  {
    title: 'Property Refurbishment & Extensions',
    desc: 'Complete property refurbishments and extension works, from structural improvements and layout changes to high-quality finishing throughout.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" />
    ),
  },
  {
    title: 'Bathroom Fitting',
    desc: 'Full bathroom installations including tiling, plumbing fixtures, sanitaryware, vanities, and all finishing works delivered to a high standard.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    ),
  },
  {
    title: 'Hard Flooring',
    desc: 'Supply and installation of hardwood, engineered wood, laminate, vinyl, and tile flooring with precise fitting and a clean finish.',
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: 'Plastering',
    desc: 'Professional plastering, skimming, patch repairs, and surface preparation for smooth, durable, paint-ready walls and ceilings.',
    icon: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="2 17 12 22 22 17" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="2 12 12 17 22 12" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: 'Painting & Decorating',
    desc: 'Interior and exterior painting with careful preparation, neat application, and long-lasting finishes across residential and commercial spaces.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16s1-1 3-1 4 2 6 2 3-1 3-1V4s-1 1-3 1-4-2-6-2-3 1-3 1z" />
        <line x1="4" y1="20" x2="4" y2="16" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: 'Finishing Carpentry',
    desc: 'Skirting boards, architraves, door hanging, boxing-in, panelling, and detailed finishing carpentry for a polished interior result.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    ),
  },
  {
    title: 'Electrical Works',
    desc: 'Reliable electrical works including first fix, second fix, lighting, sockets, switches, fault finding, and finishing installations.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
  {
    title: 'Plumbing',
    desc: 'General plumbing works including pipework, fittings, sanitary installations, repairs, adjustments, and finishing connections.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
        <line x1="5" y1="5" x2="5.01" y2="5" strokeLinecap="round" strokeWidth="2.5" />
      </>
    ),
  },
]

export default function Services() {
  return (
    <section id="services" className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#1C1714] overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #D4AF37 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      <FloatingElements />

      <div className="relative max-w-6xl mx-auto">

        <Reveal>
          <p className="ict-section-label !text-[#D4AF37]/70">Our Services</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="ict-section-heading !text-[#FAF9F6]">
            Specialist Refurbishment, Finishing &amp; Property Improvement Services
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="ict-section-subtitle !text-[#9A9590]">
            From bathrooms and flooring to full property refurbishments and extension works, we deliver
            high-quality residential and commercial services across London with a professional finish.
          </p>
        </Reveal>

        {/* Decorative divider */}
        <Reveal delay={0.2}>
          <div className="flex items-center justify-center gap-3 mb-12 sm:mb-16">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4AF37]/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4AF37]/40" />
          </div>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-12 sm:mb-16" stagger={0.07}>
          {services.map(({ title, desc, icon }, i) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
                className="group relative h-full rounded-2xl cursor-default overflow-hidden"
              >
                {/* Card background with border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#D4AF37]/[0.12] to-[#D4AF37]/[0.04] p-px">
                  <div className="h-full w-full rounded-2xl bg-[#252019]" />
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-[#D4AF37]/[0.08] to-transparent" />

                <div className="relative p-6 sm:p-8">
                  {/* Number + Icon row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#D4AF37]/[0.1] group-hover:bg-[#D4AF37]/[0.2] transition-colors duration-300 ring-1 ring-[#D4AF37]/[0.15]">
                      <svg
                        className="w-5 h-5 text-[#D4AF37] transition-colors duration-300"
                        fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"
                      >
                        {icon}
                      </svg>
                    </div>
                    <span className="font-['Cormorant_Garamond'] text-[2rem] font-light leading-none text-[#D4AF37]/[0.15] group-hover:text-[#D4AF37]/[0.3] transition-colors duration-300 select-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="font-['Cormorant_Garamond'] font-semibold text-[1.3rem] mb-3 leading-snug tracking-[-0.01em] text-[#FAF9F6] group-hover:text-[#D4AF37] transition-colors duration-300">
                    {title}
                  </h3>

                  {/* Gold accent line */}
                  <div className="w-8 h-px bg-[#D4AF37]/30 group-hover:w-12 group-hover:bg-[#D4AF37]/60 transition-all duration-400 mb-3" />

                  <p className="font-['Source_Serif_4'] text-[0.9375rem] leading-[1.75] text-[#9A9590] group-hover:text-[#B5AFA8] transition-colors duration-300">
                    {desc}
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Reveal>
          <div className="text-center flex flex-col sm:flex-row gap-3 justify-center">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 font-['Source_Serif_4'] font-semibold text-[0.9375rem] tracking-wide px-8 py-3.5 rounded-lg bg-gradient-gold text-[#1C1714] shadow-[0_4px_14px_rgba(212,175,55,0.25)]"
              >
                View All Services
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-block font-['Source_Serif_4'] font-semibold text-[0.9375rem] tracking-wide px-8 py-3.5 rounded-lg text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-colors duration-300"
              >
                Request a Free Quote
              </Link>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
