import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'

const services = [
  {
    title: 'Painting & Decorating',
    desc: 'Interior and exterior painting with meticulous surface preparation for a flawless, long-lasting finish.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16s1-1 3-1 4 2 6 2 3-1 3-1V4s-1 1-3 1-4-2-6-2-3 1-3 1z" />
        <line x1="4" y1="20" x2="4" y2="16" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: 'Wallpapering',
    desc: 'Precision wallpaper hanging across all paper types, from feature walls to full-room installations.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    ),
  },
  {
    title: 'Plastering',
    desc: 'Professional skimming, patching, and dry-lining for perfectly smooth, paint-ready surfaces throughout.',
    icon: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="2 17 12 22 22 17" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="2 12 12 17 22 12" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: 'Hard Flooring',
    desc: 'Supply and installation of hardwood, engineered, laminate, vinyl, and tile flooring to a premium standard.',
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
    title: 'Bathroom Fitting',
    desc: 'Full bathroom installations including tiling, plumbing fixtures, vanities, and all finishing works.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    ),
  },
  {
    title: 'Property Refurbishment',
    desc: 'Complete property makeovers from strip-out to final finish, managed with precision and delivered on time.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" />
    ),
  },
  {
    title: 'Finishing Carpentry',
    desc: 'Skirting boards, architraves, door hanging, and bespoke detail work for a polished, complete interior.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    ),
  },
]

export default function Services() {
  return (
    <section id="services" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6]">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <p className="ict-section-label">Our Services</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="ict-section-heading">
            Specialist Decorating, Finishing &amp; Refurbishment
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="ict-section-subtitle">
            From single-room decorating to full property refurbishments — professional results
            across residential and commercial projects in London.
          </p>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-10 sm:mb-14" stagger={0.07}>
          {services.map(({ title, desc, icon }, i) => {
            const isFeature = i < 2
            return (
              <StaggerItem key={title}>
                <motion.div
                  whileHover={{ y: -5, transition: { duration: 0.25 } }}
                  className={`group border rounded-[14px] cursor-default transition-colors duration-300 hover:border-[rgba(212,175,55,0.4)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08),0_2px_6px_rgba(212,175,55,0.07)] ${
                    isFeature
                      ? 'bg-[#1C1714] border-[rgba(212,175,55,0.15)] p-6 sm:p-8 shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                      : 'bg-[#FDFCF9] border-[rgba(212,175,55,0.2)] p-5 sm:p-7 shadow-[0_1px_4px_rgba(0,0,0,0.05)]'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-[10px] flex items-center justify-center mb-4 sm:mb-5 transition-colors duration-300 ${
                    isFeature
                      ? 'bg-[rgba(212,175,55,0.15)] group-hover:bg-[rgba(212,175,55,0.25)]'
                      : 'bg-[rgba(212,175,55,0.1)] group-hover:bg-[rgba(212,175,55,0.18)]'
                  }`}>
                    <svg
                      className={`w-[1.25rem] h-[1.25rem] transition-colors duration-300 ${
                        isFeature ? 'text-[#D4AF37]' : 'text-[#B08D2A]'
                      }`}
                      fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"
                    >
                      {icon}
                    </svg>
                  </div>
                  <h3 className={`font-['Cormorant_Garamond'] font-semibold mb-2.5 leading-snug tracking-[-0.01em] transition-colors duration-300 ${
                    isFeature
                      ? 'text-[1.25rem] text-[#F5F0E6] group-hover:text-[#D4AF37]'
                      : 'text-[1.125rem] text-[#1C1714] group-hover:text-[#B08D2A]'
                  }`}>
                    {title}
                  </h3>
                  <p className={`font-['Source_Serif_4'] text-[0.9375rem] leading-[1.68] ${
                    isFeature ? 'text-[#9A9590]' : 'text-[#5A5048]'
                  }`}>
                    {desc}
                  </p>
                </motion.div>
              </StaggerItem>
            )
          })}
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
                className="inline-block font-['Source_Serif_4'] font-semibold text-[0.9375rem] tracking-wide px-8 py-3.5 rounded-lg text-[#B08D2A] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/50"
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
