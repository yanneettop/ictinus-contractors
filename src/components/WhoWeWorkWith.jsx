import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'

const audiences = [
  {
    title: 'Your Home, Done Properly',
    audience: 'Homeowners',
    description:
      "Whether you're refreshing a single room or undertaking a full renovation, we deliver the quality and care your home deserves — with clear communication and no unnecessary disruption.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    ),
  },
  {
    title: 'Fast Turnarounds. Lettable Standards.',
    audience: 'Landlords',
    description:
      "We understand the importance of turning a property around quickly and to a standard that attracts quality tenants. Our team works efficiently and leaves every job clean and ready to let.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
      />
    ),
  },
  {
    title: 'Reliable. Responsive. Easy to Work With.',
    audience: 'Letting Agents & Property Managers',
    description:
      "Whether it's a void refurbishment or routine maintenance works, we communicate clearly, keep disruption to a minimum, and deliver a consistent standard every time.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
      />
    ),
  },
  {
    title: 'Professional Results for Commercial Spaces',
    audience: 'Shops & Small Businesses',
    description:
      "From office refreshes to shopfit decoration, we bring the same premium finish to your workspace — and work around your hours to keep downtime to a minimum.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
      />
    ),
  },
]

export default function WhoWeWorkWith() {
  return (
    <section id="who-we-work-with" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6]">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="text-center mb-12 sm:mb-16">
            <p className="ict-section-label">Our Clients</p>
            <h2 className="ict-section-heading">Who We Work With</h2>
            <p className="ict-section-subtitle">
              From first-time homeowners to experienced property investors — we work with
              a wide range of clients across London.
            </p>
          </div>
        </Reveal>

        <StaggerContainer
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          stagger={0.09}
        >
          {audiences.map(({ title, audience, description, icon }) => (
            <StaggerItem key={audience}>
              <motion.div
                whileHover={{
                  y: -4,
                  boxShadow: '0 10px 28px rgba(0,0,0,0.07), 0 2px 8px rgba(212,175,55,0.08)',
                  borderColor: 'rgba(212,175,55,0.4)',
                }}
                transition={{ duration: 0.25 }}
                className="group bg-[#FDFCF9] border border-[rgba(212,175,55,0.2)] rounded-[14px] p-6 sm:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.05)] h-full flex flex-col"
              >
                {/* Icon + audience tag */}
                <div className="flex items-center gap-3.5 mb-5">
                  <motion.div
                    className="w-11 h-11 rounded-[10px] bg-[rgba(212,175,55,0.1)] group-hover:bg-[rgba(212,175,55,0.18)] transition-colors duration-300 flex items-center justify-center flex-shrink-0"
                    whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }}
                  >
                    <svg
                      className="w-5 h-5 text-[#B08D2A]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      {icon}
                    </svg>
                  </motion.div>
                  <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-[#A88636]">
                    {audience}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-['Cormorant_Garamond'] text-[1.2rem] sm:text-[1.3rem] font-semibold text-[#1C1714] mb-3 leading-[1.22] tracking-[-0.01em] group-hover:text-[#B08D2A] transition-colors duration-300">
                  {title}
                </h3>

                {/* Divider */}
                <div className="w-8 h-px bg-[rgba(212,175,55,0.4)] mb-4" />

                {/* Body */}
                <p className="font-['Source_Serif_4'] text-[0.9375rem] text-[#5A5048] leading-[1.72] flex-grow">
                  {description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <Reveal delay={0.15}>
          <div className="text-center mt-12 sm:mt-14">
            <p className="font-['Source_Serif_4'] text-[0.9375rem] text-[#5A5048] mb-5">
              Not sure which category fits? We&rsquo;re happy to advise — just get in touch.
            </p>
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 font-['Source_Serif_4'] font-semibold text-[0.9375rem] tracking-wide px-9 py-3.5 rounded-lg bg-gradient-gold text-[#1C1714] shadow-[0_4px_14px_rgba(212,175,55,0.25)]"
              >
                Get a Free Quote
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </Reveal>

      </div>
    </section>
  )
}
