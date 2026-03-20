import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import PageHero from '../components/PageHero'
import WhyChooseUs from '../components/WhyChooseUs'
import HowWeWork from '../components/HowWeWork'
import Testimonials from '../components/Testimonials'
import AreasWeCover from '../components/AreasWeCover'
import Footer from '../components/Footer'
import useScrollReveal from '../hooks/useScrollReveal'

const highlights = [
  { stat: '12+', label: 'Years in the Industry' },
  { stat: '30+', label: 'Verified Client Reviews' },
  { stat: '9.97', label: 'Out of 10 on Checkatrade' },
  { stat: '4.9/5', label: 'MyBuilder Rating' },
]

const values = [
  {
    title: 'Professional Team',
    desc: 'Skilled tradespeople delivering premium results on every project, from single rooms to full refurbishments.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />,
  },
  {
    title: 'Trusted Specialist Network',
    desc: 'For larger projects, we coordinate with vetted subcontractors across plastering, flooring, plumbing, and electrical — one point of contact, consistent quality.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />,
  },
  {
    title: 'Clear Communication',
    desc: 'A dedicated point of contact from initial enquiry through to completion. You always know where your project stands.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />,
  },
  {
    title: 'London-Wide Coverage',
    desc: 'Serving residential and commercial clients across all London boroughs — from East London to Central, South, West, and North.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />,
  },
]

export default function AboutPage() {
  useScrollReveal()

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav />
      <PageHero
        breadcrumb="About Us"
        title="A London Contractor Brand Built on Quality"
        subtitle="Over 12 years of industry experience delivering premium decorating, refurbishment, and finishing services across London."
      />

      {/* Main about section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Story */}
            <div data-reveal-left>
              <p className="ict-section-label text-left mb-2">Our Story</p>
              <h2 className="font-['Cormorant_Garamond'] text-[1.75rem] md:text-[2.25rem] font-semibold text-[#1C1714] mb-6 leading-[1.2] tracking-[-0.015em] text-left">
                Founded on Craftsmanship, Driven by Standards
              </h2>
              <div className="space-y-4 font-['Source_Serif_4'] text-[0.9375rem] sm:text-[1rem] text-[#5A5048] leading-[1.75]">
                <p>
                  Ictinus Contractors is a London-based contractor brand specialising in decorating,
                  refurbishment, and interior finishing. With over 12 years of industry experience
                  and a reputation built on quality workmanship, reliability, and strong communication,
                  the company delivers a professional service for homeowners, landlords, and businesses
                  across London.
                </p>
                <p>
                  Founded by Konstantinos, a skilled contractor with deep expertise across decorating,
                  plastering, flooring, and property refurbishment, Ictinus Contractors has grown into
                  a trusted brand supported by a reliable network of specialist tradespeople — ensuring
                  every project is delivered to a consistently high standard.
                </p>
                <p>
                  Whether it's a single-room refresh or a full property refurbishment, the team brings
                  the same level of care, precision, and professionalism to every job.
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-block mt-8 font-['Source_Serif_4'] font-semibold text-[0.9375rem] tracking-wide px-7 py-3.5 rounded-lg text-[#1C1714] bg-gradient-gold transition-all duration-300 hover:scale-105 shadow-md hover:shadow-[#D4AF37]/30"
              >
                Get a Free Quote
              </Link>
            </div>

            {/* Stats + Values */}
            <div data-reveal-right style={{ transitionDelay: '200ms' }}>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {highlights.map(({ stat, label }) => (
                  <div
                    key={label}
                    className="text-center p-4 sm:p-5 bg-[#FDFCF9] rounded-xl border border-[rgba(212,175,55,0.2)] shadow-sm"
                  >
                    <span className="block font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#B08D2A]">
                      {stat}
                    </span>
                    <span className="block font-['Source_Serif_4'] text-[0.8rem] text-[#5A5048] mt-1 leading-snug">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {values.map(({ title, desc, icon }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[rgba(212,175,55,0.12)] flex items-center justify-center mt-0.5">
                      <svg className="w-4.5 h-4.5 text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        {icon}
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-['Cormorant_Garamond'] text-[1.05rem] font-semibold text-[#1C1714] mb-1">{title}</h3>
                      <p className="font-['Source_Serif_4'] text-[0.9rem] text-[#5A5048] leading-[1.65]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <HowWeWork />
      <Testimonials />
      <AreasWeCover />

      {/* CTA */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#1C1714]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        <div className="max-w-3xl mx-auto text-center" data-reveal>
          <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-semibold text-white mb-5">
            Ready to Start Your Project?
          </h2>
          <p className="font-['Source_Serif_4'] text-[0.95rem] text-[#C4BAB0] leading-relaxed mb-8 max-w-xl mx-auto">
            Get in touch for a free quote and professional advice.
          </p>
          <Link
            to="/contact"
            className="inline-block font-['Source_Serif_4'] font-semibold text-[0.9rem] tracking-wide px-8 py-3.5 rounded-lg text-[#1C1714] bg-gradient-gold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#D4AF37]/30"
          >
            Request a Quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
