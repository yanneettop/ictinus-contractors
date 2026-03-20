import Nav from '../components/Nav'
import PageHero from '../components/PageHero'
import QuoteForm from '../components/QuoteForm'
import AreasWeCover from '../components/AreasWeCover'
import Footer from '../components/Footer'
import useScrollReveal from '../hooks/useScrollReveal'

const contactMethods = [
  {
    title: 'Email Us',
    value: 'info@ictinuscontractors.co.uk',
    href: 'mailto:info@ictinuscontractors.co.uk',
    desc: 'We respond within 1–2 business days',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    ),
  },
  {
    title: 'Location',
    value: 'East London & all boroughs',
    href: null,
    desc: 'London-wide coverage',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    ),
  },
  {
    title: 'Availability',
    value: 'Mon – Sat, 8am – 6pm',
    href: null,
    desc: 'Free consultations by appointment',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
]

export default function ContactPage() {
  useScrollReveal()

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav />
      <PageHero
        breadcrumb="Contact"
        title="Get in Touch"
        subtitle="Request a free quote, ask a question, or tell us about your project. We'd love to hear from you."
      />

      {/* Contact methods */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#F5F0E6]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {contactMethods.map(({ title, value, href, desc, icon }, i) => (
              <div
                key={title}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
                className="bg-white p-5 sm:p-6 rounded-xl border border-[rgba(212,175,55,0.15)] shadow-sm text-center"
              >
                <div className="w-11 h-11 rounded-full bg-[rgba(212,175,55,0.1)] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-[1rem] font-semibold text-[#1C1714] mb-1">{title}</h3>
                {href ? (
                  <a href={href} className="font-['Source_Serif_4'] text-[0.875rem] text-[#B08D2A] hover:text-[#D4AF37] transition-colors font-medium">
                    {value}
                  </a>
                ) : (
                  <p className="font-['Source_Serif_4'] text-[0.875rem] text-[#1C1714] font-medium">{value}</p>
                )}
                <p className="font-['Source_Serif_4'] text-[0.8rem] text-[#9A9590] mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote form */}
      <QuoteForm />

      <AreasWeCover />
      <Footer />
    </div>
  )
}
