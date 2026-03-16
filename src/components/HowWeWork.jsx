const steps = [
  {
    num: '01',
    title: 'Initial Enquiry',
    desc: 'Get in touch by phone, email, or through our quote form. Tell us about your project and we will arrange a convenient time to discuss your requirements.',
  },
  {
    num: '02',
    title: 'Free Quote & Consultation',
    desc: 'We visit your property to assess the scope of work, answer your questions, and provide a detailed, transparent quote — at no obligation.',
  },
  {
    num: '03',
    title: 'Planning & Confirmation',
    desc: 'Once you are happy to proceed, we confirm the schedule, agree on materials, and plan the project timeline so there are no surprises.',
  },
  {
    num: '04',
    title: 'Project Delivery',
    desc: 'Our team carries out the work to an agreed standard, keeping you informed throughout. We work cleanly, respectfully, and on schedule.',
  },
  {
    num: '05',
    title: 'Final Handover',
    desc: 'We complete a walkthrough together to ensure you are fully satisfied. The space is left clean, finished, and ready to enjoy.',
  },
]

export default function HowWeWork() {
  return (
    <section id="how-we-work" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-14" data-reveal>
          <p className="ict-section-label">Our Process</p>
          <h2 className="ict-section-heading">How We Work</h2>
          <p className="ict-section-subtitle">
            A structured, professional approach to every project — from first contact to final handover.
          </p>
        </div>

        <div className="space-y-0">
          {steps.map(({ num, title, desc }, i) => (
            <div
              key={num}
              data-reveal
              style={{ transitionDelay: `${i * 80}ms` }}
              className="relative flex gap-6 sm:gap-8 pb-10 last:pb-0"
            >
              {/* Timeline line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[1.375rem] sm:left-[1.625rem] top-12 bottom-0 w-px bg-[#D4AF37]/20" />
              )}

              {/* Number circle */}
              <div className="flex-shrink-0 w-11 h-11 sm:w-[3.25rem] sm:h-[3.25rem] rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center z-10">
                <span className="font-['Cormorant_Garamond'] text-[0.85rem] sm:text-[0.95rem] font-bold text-[#B08D2A]">{num}</span>
              </div>

              {/* Content */}
              <div className="pt-1 pb-2">
                <h3 className="font-['Cormorant_Garamond'] text-[1.125rem] font-semibold text-[#1C1714] mb-2.5">{title}</h3>
                <p className="font-['Source_Serif_4'] text-[0.9375rem] text-[#5A5048] leading-[1.7] max-w-xl">{desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
