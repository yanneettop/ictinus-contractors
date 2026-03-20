import { motion } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'

const highlights = [
  { stat: '12+', label: 'Years in the Industry' },
  { stat: '30+', label: 'Verified Client Reviews' },
  { stat: '9.97', label: 'Out of 10 on Checkatrade' },
]

export default function AboutSection() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="bg-[#FAF9F6] py-16 sm:py-28 px-4 sm:px-6 lg:px-8" id="about">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

          {/* Left — Copy */}
          <Reveal direction="left">
            <p className="ict-section-label text-left mb-2">About Ictinus Contractors</p>
            <h2 className="font-['Cormorant_Garamond'] text-[1.75rem] md:text-[2.625rem] font-semibold text-[#1C1714] mb-5 md:mb-7 leading-[1.2] tracking-[-0.015em] text-left">
              A London Contractor Brand<br />Built on Quality
            </h2>
            <div className="space-y-4 sm:space-y-5 font-['Source_Serif_4'] text-[0.9375rem] sm:text-[1.0625rem] text-[#5A5048] leading-[1.7] sm:leading-[1.78]">
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
            <motion.button
              onClick={() => scrollTo('quote')}
              className="mt-8 font-['Source_Serif_4'] font-semibold text-[0.9375rem] tracking-wide px-6 py-3 rounded-lg text-[#1C1714] bg-gradient-gold shadow-md"
              whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(212,175,55,0.3)' }}
              whileTap={{ scale: 0.97 }}
            >
              Get a Free Quote
            </motion.button>
          </Reveal>

          {/* Right — Stats + Values */}
          <Reveal direction="right" delay={0.2}>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-10">
              {highlights.map(({ stat, label }, i) => (
                <div
                  key={label}
                  className="text-center p-3 sm:p-5 bg-[#FDFCF9] rounded-[10px] sm:rounded-[12px] border border-[rgba(212,175,55,0.2)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                >
                  <span className="block font-['Cormorant_Garamond'] text-xl sm:text-2xl md:text-3xl font-bold text-[#B08D2A]">
                    {stat}
                  </span>
                  <span className="block font-['Source_Serif_4'] text-[0.6875rem] sm:text-[0.8125rem] text-[#5A5048] mt-1 leading-snug">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Values list */}
            <div className="space-y-3 sm:space-y-4">
              {[
                { title: 'Professional Team', desc: 'Skilled tradespeople delivering premium results on every project.' },
                { title: 'Trusted Network', desc: 'Specialist subcontractors for plastering, flooring, plumbing, and more.' },
                { title: 'Clear Communication', desc: 'A dedicated point of contact from initial enquiry through to completion.' },
                { title: 'London-Wide Coverage', desc: 'Serving residential and commercial clients across all London boroughs.' },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgba(212,175,55,0.12)] flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-['Cormorant_Garamond'] text-[1.0625rem] font-semibold text-[#1C1714] mb-1">{title}</h3>
                    <p className="font-['Source_Serif_4'] text-[0.9375rem] text-[#5A5048] leading-[1.65]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}
