import { useState } from 'react'

const reviews = [
  {
    id: 1,
    name: 'Sarah Thompson',
    location: 'Kensington, London',
    rating: 5,
    text: 'Ictinus Contractors transformed our Victorian home beautifully. Their attention to detail and professionalism exceeded our expectations. The team was punctual, respectful, and the quality of workmanship is outstanding.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Michael Davies',
    location: 'Chelsea, London',
    rating: 5,
    text: "From start to finish, the experience was seamless. They completed our bathroom renovation on time and within budget. The craftsmanship is exceptional and we couldn't be happier with the results.",
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Emily Roberts',
    location: 'Notting Hill, London',
    rating: 5,
    text: 'Outstanding service from consultation to completion. The team at Ictinus are true professionals who care about their work. Our kitchen looks absolutely stunning and functions perfectly.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
  },
]

function Stars({ count }) {
  return (
    <div className="flex gap-1">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-5 h-5 fill-[#D4AF37]" viewBox="0 0 20 20">
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
    <section
      id="testimonials"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6]"
    >
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-16">
          <p className="text-[#D4AF37] text-sm tracking-widest uppercase mb-2 font-['Lora']">
            Testimonials
          </p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-[#5A5048] max-w-2xl mx-auto leading-relaxed font-['Lora']">
            Don&rsquo;t just take our word for it. Here&rsquo;s what our satisfied clients have to
            say about working with us.
          </p>
        </div>

        <div className="relative" data-reveal>
          {/* Card */}
          <div className="bg-white p-8 md:p-12 rounded-lg border border-[#D4AF37]/15 shadow-sm">
            {/* Large quote icon */}
            <svg className="w-12 h-12 text-[#D4AF37]/60 mb-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <p className="text-[#1C1714] text-lg md:text-xl leading-relaxed mb-8 italic font-['Lora']">
              &ldquo;{r.text}&rdquo;
            </p>

            <div className="flex items-center gap-4 mb-6">
              <img
                src={r.image}
                alt={r.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37]"
              />
              <div>
                <h4 className="font-['Playfair_Display'] text-xl font-semibold text-[#D4AF37]">
                  {r.name}
                </h4>
                <p className="text-[#5A5048] text-sm font-['Lora']">{r.location}</p>
              </div>
            </div>

            <Stars count={r.rating} />
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 flex items-center justify-center text-[#B08D2A] transition-all duration-300 shadow-sm"
              aria-label="Previous testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    i === active
                      ? 'w-8 bg-[#D4AF37]'
                      : 'w-3 bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 flex items-center justify-center text-[#B08D2A] transition-all duration-300 shadow-sm"
              aria-label="Next testimonial"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
