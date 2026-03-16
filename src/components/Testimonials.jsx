import { useState } from 'react'

const reviews = [
  {
    id: 1,
    name: 'James W.',
    location: 'Hackney, London',
    project: 'Full Interior Decoration',
    rating: 5,
    text: 'Professional, reliable, and easy to communicate with throughout the project. The finish quality was excellent and everything was completed on schedule.',
  },
  {
    id: 2,
    name: 'Sophie M.',
    location: 'Islington, London',
    project: 'Bathroom Refurbishment',
    rating: 5,
    text: 'Completed to a high standard and delivered within the agreed timeframe. Konstantinos kept us informed at every stage and the attention to detail was impressive.',
  },
  {
    id: 3,
    name: 'Daniel & Claire R.',
    location: 'Stratford, London',
    project: 'Property Refurbishment',
    rating: 5,
    text: 'Excellent attention to detail and a very smooth overall experience. The team was well-organised and respectful of our home throughout the entire refurbishment.',
  },
  {
    id: 4,
    name: 'Rebecca T.',
    location: 'Canary Wharf, London',
    project: 'Painting & Wallpapering',
    rating: 5,
    text: 'Friendly, organised, and highly dependable from start to finish. The decorating work transformed our flat and we have already recommended Ictinus to friends.',
  },
  {
    id: 5,
    name: 'Mark P.',
    location: 'Greenwich, London',
    project: 'Flooring & Finishing',
    rating: 5,
    text: 'Top-quality workmanship and a genuinely professional service. The flooring installation was flawless and the finishing carpentry was done to a very high standard.',
  },
]

function Stars({ count }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-[#D4AF37]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const prev = () => setActive((a) => (a - 1 + reviews.length) % reviews.length)
  const next = () => setActive((a) => (a + 1) % reviews.length)
  const r = reviews[active]

  return (
    <section id="testimonials" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6]">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-8 sm:mb-14" data-reveal>
          <p className="ict-section-label">Testimonials</p>
          <h2 className="ict-section-heading">What Our Clients Say</h2>
          <p className="ict-section-subtitle">
            Rated 9.97/10 on Checkatrade and 4.9/5 on MyBuilder — with over 30 verified reviews
            from homeowners and businesses across London.
          </p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-nowrap justify-center gap-1.5 sm:gap-4 mb-6 sm:mb-10" data-reveal>
          <div className="flex items-center gap-1 sm:gap-2 bg-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#D4AF37]/20 shadow-sm">
            <svg className="hidden sm:block w-5 h-5 fill-[#D4AF37]" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-['Lora'] text-[0.75rem] sm:text-[0.875rem] font-semibold text-[#1C1714]">9.97/10</span>
            <span className="font-['Lora'] text-[0.6875rem] sm:text-[0.8125rem] text-[#5A5048]">Checkatrade</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 bg-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#D4AF37]/20 shadow-sm">
            <svg className="hidden sm:block w-5 h-5 fill-[#D4AF37]" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-['Lora'] text-[0.75rem] sm:text-[0.875rem] font-semibold text-[#1C1714]">4.9/5</span>
            <span className="font-['Lora'] text-[0.6875rem] sm:text-[0.8125rem] text-[#5A5048]">MyBuilder</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 bg-white px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-[#D4AF37]/20 shadow-sm">
            <svg className="hidden sm:block w-5 h-5 text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
            <span className="font-['Lora'] text-[0.75rem] sm:text-[0.875rem] font-semibold text-[#1C1714]">30+</span>
            <span className="font-['Lora'] text-[0.6875rem] sm:text-[0.8125rem] text-[#5A5048]">Reviews</span>
          </div>
        </div>

        {/* Review card */}
        <div className="relative" data-reveal>
          <div className="bg-white p-5 sm:p-8 md:p-10 rounded-xl border border-[#D4AF37]/15 shadow-sm">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37]/50 mb-3 sm:mb-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <p className="text-[#1C1714] text-[1rem] sm:text-[1.125rem] md:text-[1.25rem] leading-[1.75] sm:leading-[1.82] mb-5 sm:mb-8 italic font-['Lora']">
              &ldquo;{r.text}&rdquo;
            </p>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h4 className="font-['Playfair_Display'] text-[1.125rem] font-semibold text-[#1C1714] mb-1">
                  {r.name}
                </h4>
                <p className="text-[#5A5048] text-[0.875rem] font-['Lora'] leading-snug">
                  {r.project} &middot; {r.location}
                </p>
              </div>
              <Stars count={r.rating} />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 flex items-center justify-center text-[#B08D2A] transition-all duration-300 shadow-sm"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === active
                      ? 'w-7 bg-[#D4AF37]'
                      : 'w-2.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 flex items-center justify-center text-[#B08D2A] transition-all duration-300 shadow-sm"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
