import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'

const CHECKATRADE_URL = 'https://www.checkatrade.com/trades/ictinuscontractors'
const MYBUILDER_URL = 'https://www.mybuilder.com/profile/ictinus-contractors'

const reviews = [
  {
    id: 1,
    name: 'Verified Reviewer',
    location: 'Walthamstow, E11',
    project: 'Painting & Decorating',
    rating: 5,
    source: 'Checkatrade',
    text: 'Konstantinos and his team from Ictinus did a fantastic job painting and decorating my flat. They were super professional, easy to communicate with, and the results are beautiful! I\'m really happy with their work and would definitely recommend Ictinus to anyone looking for great painters and decorators in London.',
  },
  {
    id: 2,
    name: 'Andy',
    location: 'Southwark',
    project: 'Lime Wash Paint — Guest Bedroom',
    rating: 5,
    source: 'MyBuilder',
    text: 'Konstantinos did an absolutely cracking job with the lime wash paint. He\'s clearly done this before and knows exactly what he\'s doing. Professional, tidy, and the finish is stunning.',
  },
  {
    id: 3,
    name: 'Verified Reviewer',
    location: 'Bethnal Green, E1',
    project: 'Full Flat Renovation',
    rating: 5,
    source: 'Checkatrade',
    text: 'I couldn\'t be happier with the incredible job done by Konstantinos and his team. The entire team was professional, efficient, and paid great attention to every detail throughout the renovation of my flat. The quality of their work exceeded my expectations, and the owner personally made sure everything was perfect from start to finish.',
  },
  {
    id: 4,
    name: 'Alexandra',
    location: 'London',
    project: 'Bathroom Renovation',
    rating: 5,
    source: 'MyBuilder',
    text: 'Konstantinos did an excellent job in our bathroom. He fitted marble tiling on our uneven floor, installed fixtures, and the attention to detail was outstanding. Highly recommended for bathroom work.',
  },
  {
    id: 5,
    name: 'Verified Reviewer',
    location: 'Loughton, IG10',
    project: 'Full House Renovation & Painting',
    rating: 5,
    source: 'Checkatrade',
    text: 'Kostas is an exceptionally professional builder. He recently completed a full renovation and painted my entire house. The experience was outstanding — his work was detailed, efficient, and of excellent quality. He demonstrated great attention to detail and completed everything within the agreed timeframe.',
  },
  {
    id: 6,
    name: 'Verified Reviewer',
    location: 'Bow, E2',
    project: 'Flat Refurbishment',
    rating: 5,
    source: 'Checkatrade',
    text: 'Kostas made it look effortless and it looks just perfect. He turned up always on time and finished the job in the time frame we agreed. He is very reliable which is a rare thing these days. I am very pleased with him and the work he has done for me. Highly recommend!',
  },
  {
    id: 7,
    name: 'Victoria',
    location: 'Greenwich',
    project: 'Kitchen Tiling & Painting',
    rating: 5,
    source: 'MyBuilder',
    text: 'We hired Konstantinos to do some kitchen tiling and painting. He did an amazing job of both and even went above and beyond to help with extra details. Very professional and great results.',
  },
  {
    id: 8,
    name: 'Verified Reviewer',
    location: 'Eltham, SE3',
    project: 'Decorating, Flooring & Carpentry',
    rating: 5,
    source: 'Checkatrade',
    text: 'Great work from Konstantinos. Very friendly and helpful. Helped us with a big project which included decorating, floor/skirting/architrave fitting and did it to a top standard. Would recommend!',
  },
  {
    id: 9,
    name: 'Kate',
    location: 'Forest Hill',
    project: 'Ceiling Plastering',
    rating: 5,
    source: 'MyBuilder',
    text: 'Great communication, great flexibility and a competitive quote compared to others I received. Very happy with the plastering work — neat, tidy, and finished to a high standard.',
  },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function SourceBadge({ source }) {
  const href = source === 'Checkatrade' ? CHECKATRADE_URL : MYBUILDER_URL
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[0.7rem] font-['Plus_Jakarta_Sans'] font-medium uppercase tracking-[0.08em] text-[#B08D2A]/80 hover:text-[#D4AF37] transition-colors"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
      via {source}
    </a>
  )
}

function ReviewCard({ review, featured = false }) {
  return (
    <motion.div
      className={`
        bg-white rounded-xl border border-[#D4AF37]/15 shadow-sm
        flex flex-col h-full
        ${featured ? 'p-6 sm:p-8' : 'p-5 sm:p-6'}
      `}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(212,175,55,0.1)', borderColor: 'rgba(212,175,55,0.3)' }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center justify-between mb-3">
        <svg className={`${featured ? 'w-8 h-8' : 'w-6 h-6'} text-[#D4AF37]/40 flex-shrink-0`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
        <SourceBadge source={review.source} />
      </div>

      <p className={`
        text-[#1C1714] leading-[1.75] italic font-['Source_Serif_4'] flex-grow mb-5
        ${featured ? 'text-[1rem] sm:text-[1.1rem]' : 'text-[0.9rem] sm:text-[0.95rem]'}
      `}>
        &ldquo;{review.text}&rdquo;
      </p>

      <div className="w-10 h-px bg-[#D4AF37]/20 mb-4" />

      <div className="flex items-center justify-between gap-3 flex-shrink-0">
        <div>
          <h4 className={`
            font-['Cormorant_Garamond'] font-semibold text-[#1C1714] mb-0.5
            ${featured ? 'text-[1.05rem]' : 'text-[0.95rem]'}
          `}>
            {review.name}
          </h4>
          <p className="text-[#9A9590] text-[0.8rem] font-['Source_Serif_4'] leading-snug">
            {review.location} &middot; {review.project}
          </p>
        </div>
        <Stars count={review.rating} />
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  const [page, setPage] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [direction, setDirection] = useState(1)
  const prefersReducedMotion = useReducedMotion()

  const cardsPerPage = 3
  const totalPages = Math.ceil(reviews.length / cardsPerPage)

  const nextPage = useCallback(() => {
    setDirection(1)
    setPage((p) => (p + 1) % totalPages)
  }, [totalPages])

  const prevPage = useCallback(() => {
    setDirection(-1)
    setPage((p) => (p - 1 + totalPages) % totalPages)
  }, [totalPages])

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return
    const timer = setInterval(nextPage, 6000)
    return () => clearInterval(timer)
  }, [isPaused, nextPage, prefersReducedMotion])

  const visibleReviews = reviews.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage
  )

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
  }

  return (
    <section id="testimonials" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6]">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="text-center mb-8 sm:mb-14">
            <p className="ict-section-label">Testimonials</p>
            <h2 className="ict-section-heading">What Our Clients Say</h2>
            <p className="ict-section-subtitle">
              Rated 9.97/10 on Checkatrade and 4.9/5 on MyBuilder — with over 60 verified reviews
              from homeowners and businesses across London.
            </p>
          </div>
        </Reveal>

        {/* Trust badges — clickable links to profiles */}
        <Reveal delay={0.1}>
          <div className="flex flex-nowrap justify-center gap-1.5 sm:gap-4 mb-8 sm:mb-12">
            {[
              { val: '9.97/10', label: 'Checkatrade', type: 'star', href: CHECKATRADE_URL },
              { val: '4.9/5', label: 'MyBuilder', type: 'star', href: MYBUILDER_URL },
              { val: '60+', label: 'Reviews', type: 'check', href: null },
            ].map(({ val, label, type, href }) => {
              const badge = (
                <div className={`flex items-center gap-1 sm:gap-2 bg-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#D4AF37]/20 shadow-sm ${href ? 'hover:border-[#D4AF37]/40 hover:shadow-md transition-all cursor-pointer' : ''}`}>
                  {type === 'star' ? (
                    <svg className="hidden sm:block w-5 h-5 fill-[#D4AF37]" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ) : (
                    <svg className="hidden sm:block w-5 h-5 text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  )}
                  <span className="font-['Source_Serif_4'] text-[0.75rem] sm:text-[0.875rem] font-semibold text-[#1C1714]">{val}</span>
                  <span className="font-['Source_Serif_4'] text-[0.6875rem] sm:text-[0.8125rem] text-[#5A5048]">{label}</span>
                </div>
              )

              return href ? (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                  {badge}
                </a>
              ) : (
                <div key={label}>{badge}</div>
              )
            })}
          </div>
        </Reveal>

        {/* Desktop: 3-card grid with AnimatePresence */}
        <div
          className="hidden md:block"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-3 gap-5 mb-8"
            >
              {visibleReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <ReviewCard review={review} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4">
            <motion.button
              onClick={prevPage}
              className="w-10 h-10 rounded-full bg-white border border-[#D4AF37]/25 flex items-center justify-center text-[#B08D2A] shadow-sm"
              whileHover={{ scale: 1.1, borderColor: 'rgba(212,175,55,0.6)' }}
              whileTap={{ scale: 0.9 }}
              aria-label="Previous testimonials"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => { setDirection(i > page ? 1 : -1); setPage(i) }}
                  className={`h-2.5 rounded-full ${
                    i === page ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]/20'
                  }`}
                  animate={{ width: i === page ? 28 : 10 }}
                  whileHover={{ backgroundColor: i === page ? '#D4AF37' : 'rgba(212,175,55,0.4)' }}
                  transition={{ duration: 0.3 }}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextPage}
              className="w-10 h-10 rounded-full bg-white border border-[#D4AF37]/25 flex items-center justify-center text-[#B08D2A] shadow-sm"
              whileHover={{ scale: 1.1, borderColor: 'rgba(212,175,55,0.6)' }}
              whileTap={{ scale: 0.9 }}
              aria-label="Next testimonials"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-4">
          {reviews.slice(0, 3).map((review, i) => (
            <Reveal key={review.id} delay={i * 0.1}>
              <ReviewCard review={review} />
            </Reveal>
          ))}
          <p className="text-center pt-2">
            <Link
              to="/contact"
              className="font-['Source_Serif_4'] text-[0.875rem] text-[#B08D2A] hover:text-[#D4AF37] transition-colors underline underline-offset-4 decoration-[#D4AF37]/30"
            >
              Join 60+ satisfied clients &rarr;
            </Link>
          </p>
        </div>

      </div>
    </section>
  )
}
