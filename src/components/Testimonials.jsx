import { motion } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'

const CHECKATRADE_URL = 'https://www.checkatrade.com/trades/ictinuscontractors'
const MYBUILDER_URL = 'https://www.mybuilder.com/profile/ictinus-contractors'

const reviews = [
  {
    id: 1,
    project: 'Refurbishment project',
    text: 'We were very happy with the quality of the work. The project was completed on time and with no additional costs.',
  },
  {
    id: 2,
    project: 'Bathroom fitting',
    text: 'Good communication throughout, attended as agreed, and returned promptly to resolve outstanding items.',
  },
  {
    id: 3,
    project: 'Residential project',
    text: 'Punctual, professional, and the job went very smoothly. We would certainly use them again.',
  },
]

const badges = [
  { val: '9.97/10', label: 'Checkatrade', href: CHECKATRADE_URL, icon: 'star' },
  { val: '4.9/5',   label: 'MyBuilder',   href: MYBUILDER_URL,   icon: 'star' },
  { val: '31',      label: 'Reviews',     href: null,            icon: 'check' },
]

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <motion.div
      className="bg-white rounded-xl border border-[#D4AF37]/15 shadow-sm p-6 sm:p-7 flex flex-col h-full"
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.32)' }}
      transition={{ duration: 0.25 }}
    >
      {/* Stars + quote mark row */}
      <div className="flex items-center justify-between mb-4">
        <Stars />
        <svg className="w-6 h-6 text-[#D4AF37]/30 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Quote */}
      <p className="font-['Source_Serif_4'] text-[0.9375rem] sm:text-[1rem] text-[#1C1714] leading-[1.78] italic flex-grow mb-5">
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Divider */}
      <div className="w-8 h-px bg-[#D4AF37]/30 mb-4" />

      {/* Attribution */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="font-['Cormorant_Garamond'] font-semibold text-[0.9375rem] text-[#1C1714] leading-snug">
            MyBuilder reviewer
          </p>
          <p className="font-['Source_Serif_4'] text-[0.78rem] text-[#9A9590] mt-0.5">
            {review.project}
          </p>
        </div>
        <a
          href={MYBUILDER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[0.68rem] font-['Plus_Jakarta_Sans'] font-semibold uppercase tracking-[0.09em] text-[#B08D2A]/70 hover:text-[#D4AF37] transition-colors flex-shrink-0"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
          MyBuilder
        </a>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <Reveal>
          <div className="text-center mb-10 sm:mb-12">
            <p className="ict-section-label">Testimonials</p>
            <h2 className="ict-section-heading">What Our Clients Say</h2>
            <p className="ict-section-subtitle">
              Rated 9.97/10 on Checkatrade and 4.9/5 on MyBuilder across 31 verified reviews
              from homeowners and businesses across London.
            </p>
          </div>
        </Reveal>

        {/* Trust badges */}
        <Reveal delay={0.08}>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12">
            {badges.map(({ val, label, href, icon }) => {
              const inner = (
                <div className={`flex items-center gap-1.5 sm:gap-2 bg-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full border border-[#D4AF37]/20 shadow-sm ${href ? 'hover:border-[#D4AF37]/45 hover:shadow-md transition-all' : ''}`}>
                  {icon === 'star' ? (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-[#D4AF37] flex-shrink-0" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#B08D2A] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  )}
                  <span className="font-['Source_Serif_4'] text-[0.8125rem] sm:text-[0.9375rem] font-semibold text-[#1C1714]">{val}</span>
                  <span className="font-['Source_Serif_4'] text-[0.75rem] sm:text-[0.8125rem] text-[#5A5048]">{label}</span>
                </div>
              )
              return href ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">{inner}</a>
              ) : (
                <div key={label}>{inner}</div>
              )
            })}
          </div>
        </Reveal>

        {/* Review cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5" stagger={0.09}>
          {reviews.map((review) => (
            <StaggerItem key={review.id}>
              <ReviewCard review={review} />
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  )
}
