import { motion } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'

const reasons = [
  {
    title: 'Professional & Reliable',
    description: 'Every project is delivered on time and to specification, backed by full public liability insurance and over 12 years of industry experience.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    ),
  },
  {
    title: 'Clear Communication',
    description: 'A single point of contact from the first enquiry through to handover. You will always know where your project stands and what comes next.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    ),
  },
  {
    title: 'Premium Finish Standards',
    description: 'We work to a consistently high standard using quality materials and refined techniques — adding long-term value and beauty to every space.',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </>
    ),
  },
  {
    title: 'Attention to Detail',
    description: 'From surface preparation to final finishing touches, we take the time to get every detail right — because quality shows in the small things.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    ),
  },
  {
    title: 'London-Wide Coverage',
    description: 'Serving residential and commercial clients across all London boroughs — from East London to Central, South, West, and North.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    ),
  },
  {
    title: 'Trusted Contractor Network',
    description: 'For larger or specialist projects, we coordinate with trusted subcontractors — so you get one point of contact with access to a full range of trades.',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    ),
  },
]

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#1C1714] relative overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="max-w-6xl mx-auto relative z-10">

        <Reveal>
          <div className="text-center mb-10 sm:mb-16">
            <p className="font-['Plus_Jakarta_Sans'] text-[0.8125rem] uppercase tracking-[0.12em] text-[#D4AF37] font-semibold mb-3.5">Why Choose Us</p>
            <h2 className="font-['Cormorant_Garamond'] text-[2.25rem] md:text-[3rem] lg:text-[3.25rem] font-semibold text-white mb-6 leading-[1.15] tracking-[-0.015em] max-w-[28rem] mx-auto">
              Why Clients Trust Ictinus Contractors
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mb-6" />
            <p className="text-[#B8AFA6] text-[1.0625rem] leading-[1.78] max-w-[42rem] mx-auto font-['Source_Serif_4']">
              Rated 9.97 out of 10 on Checkatrade and 4.9 on MyBuilder — our reputation is built on
              consistent results, honest communication, and a professional approach to every project.
            </p>
          </div>
        </Reveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5" stagger={0.08}>
          {reasons.map(({ title, description, icon }) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 2px 8px rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.35)' }}
                transition={{ duration: 0.25 }}
                className="group bg-[#252019] p-5 sm:p-7 rounded-[14px] border border-[rgba(212,175,55,0.12)] h-full"
              >
                <div className="w-10 h-10 bg-[rgba(212,175,55,0.12)] rounded-[10px] flex items-center justify-center mb-3 sm:mb-5 group-hover:bg-[rgba(212,175,55,0.22)] transition-colors duration-300">
                  <svg
                    className="w-[1.15rem] h-[1.15rem] text-[#D4AF37]"
                    fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"
                  >
                    {icon}
                  </svg>
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-[1.125rem] font-semibold text-[#F5F0E6] mb-3 leading-snug tracking-[-0.01em]">
                  {title}
                </h3>
                <p className="text-[#9A9590] text-[0.9375rem] leading-[1.68] font-['Source_Serif_4']">
                  {description}
                </p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
