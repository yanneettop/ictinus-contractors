import { useState } from 'react'
import { motion } from 'motion/react'
import Reveal, { StaggerContainer, StaggerItem } from './Reveal'

const steps = [
  {
    num: '01',
    title: 'Initial Enquiry',
    desc: 'Get in touch by phone, email, or through our quote form. Tell us about your project and we will arrange a convenient time to discuss your requirements.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Free Quote & Consultation',
    desc: 'We visit your property to assess the scope of work, answer your questions, and provide a detailed, transparent quote — at no obligation.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Planning & Confirmation',
    desc: 'Once you are happy to proceed, we confirm the schedule, agree on materials, and plan the project timeline so there are no surprises.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Project Delivery',
    desc: 'Our team carries out the work to an agreed standard, keeping you informed throughout. We work cleanly, respectfully, and on schedule.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384-3.196m0 0a2.009 2.009 0 00-.009 0m.009 0l.009-.001M21.007 8.82A2.009 2.009 0 0021 8.819m.007.001L15.42 12.01m5.587-3.19v6.375a2.007 2.007 0 01-1.003 1.738L12 21l-8.004-4.076A2.007 2.007 0 013 15.186V8.812a2.007 2.007 0 011.003-1.738L12 3l7.997 4.074A2.007 2.007 0 0121 8.812v.007z" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Final Handover',
    desc: 'We complete a walkthrough together to ensure you are fully satisfied. The space is left clean, finished, and ready to enjoy.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
]

export default function HowWeWork() {
  const [activeStep, setActiveStep] = useState(null)

  return (
    <section id="how-we-work" className="py-16 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <div className="text-center mb-14 sm:mb-20">
            <p className="ict-section-label">Our Process</p>
            <h2 className="ict-section-heading">How We Work</h2>
            <p className="ict-section-subtitle">
              A structured, professional approach to every project — from first contact to final handover.
            </p>
          </div>
        </Reveal>

        {/* Horizontal steps - desktop */}
        <Reveal delay={0.1}>
        <div className="hidden md:block">
          {/* Step circles + connecting line */}
          <div className="relative flex items-center justify-between mb-12">
            {/* Connecting line behind circles */}
            <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/30 to-[#D4AF37]/10" />

            {steps.map(({ num, icon }, i) => (
              <motion.button
                key={num}
                onClick={() => setActiveStep(activeStep === i ? null : i)}
                className="group relative z-10 flex flex-col items-center cursor-pointer"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={activeStep === i
                    ? { scale: 1.1, backgroundColor: '#D4AF37', borderColor: '#D4AF37' }
                    : { scale: 1, backgroundColor: '#ffffff', borderColor: 'rgba(212,175,55,0.25)' }
                  }
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center border-2
                    ${activeStep === i
                      ? 'text-white shadow-lg shadow-[#D4AF37]/25'
                      : 'text-[#B08D2A] group-hover:shadow-md'
                    }
                  `}
                >
                  {icon}
                </motion.div>
                <span className={`
                  mt-3 font-['Cormorant_Garamond'] text-[0.8rem] font-semibold tracking-wider uppercase transition-colors duration-300
                  ${activeStep === i ? 'text-[#D4AF37]' : 'text-[#9A9590]'}
                `}>
                  Step {num}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Step content cards */}
          <div className="grid grid-cols-5 gap-4">
            {steps.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                onClick={() => setActiveStep(activeStep === i ? null : i)}
                animate={activeStep === i
                  ? { y: -4, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', borderColor: 'rgba(212,175,55,0.3)' }
                  : { y: 0, boxShadow: '0 0px 0px 0px rgba(0,0,0,0)', borderColor: 'transparent' }
                }
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className={`
                  relative p-5 rounded-xl cursor-pointer border
                  ${activeStep === i
                    ? 'bg-white'
                    : 'bg-[#F5F0E6]/50 hover:bg-white'
                  }
                `}
              >
                <h3 className={`
                  font-['Cormorant_Garamond'] text-[1.05rem] font-semibold mb-2 transition-colors duration-300
                  ${activeStep === i ? 'text-[#D4AF37]' : 'text-[#1C1714]'}
                `}>
                  {title}
                </h3>
                <p className={`
                  font-['Source_Serif_4'] text-[0.85rem] leading-[1.7] transition-all duration-500
                  ${activeStep === i ? 'text-[#5A5048] max-h-40 opacity-100' : 'text-[#9A9590] max-h-40 opacity-70'}
                `}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        </Reveal>

        {/* Mobile: vertical cards */}
        <StaggerContainer className="md:hidden space-y-4" stagger={0.08}>
          {steps.map(({ num, title, desc, icon }) => (
            <StaggerItem key={num}>
            <div
              className="flex gap-4 items-start bg-white p-5 rounded-xl border border-[#D4AF37]/15 shadow-sm"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center text-[#B08D2A]">
                {icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-['Cormorant_Garamond'] text-[0.75rem] font-bold text-[#D4AF37] tracking-wider">
                    {num}
                  </span>
                  <h3 className="font-['Cormorant_Garamond'] text-[1.05rem] font-semibold text-[#1C1714]">
                    {title}
                  </h3>
                </div>
                <p className="font-['Source_Serif_4'] text-[0.875rem] text-[#5A5048] leading-[1.7]">
                  {desc}
                </p>
              </div>
            </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  )
}
