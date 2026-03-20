import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import PageHero from '../components/PageHero'
import BeforeAfter from '../components/BeforeAfter'
import Footer from '../components/Footer'
import useScrollReveal from '../hooks/useScrollReveal'

const projects = [
  {
    id: 1,
    title: 'Full Room Decoration',
    category: 'Interior Decoration',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=2032&auto=format&fit=crop',
    description: 'Full interior decoration project including surface preparation, specialist painting, and bespoke wallpapering — delivered to a premium standard for a residential property in Hackney, East London.',
  },
  {
    id: 2,
    title: 'Bathroom Renovation',
    category: 'Bathroom Fitting',
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=2187&auto=format&fit=crop',
    description: 'Complete strip-out and refit including new tiling, fixtures, vanity unit, and all finishing works to a high standard.',
  },
  {
    id: 3,
    title: 'Engineered Flooring',
    category: 'Hard Flooring',
    image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=2070&auto=format&fit=crop',
    description: 'Supply and installation of engineered oak flooring across an open-plan living area, with precision cutting and integrated skirting.',
  },
  {
    id: 4,
    title: 'Full Property Refurbishment',
    category: 'Property Refurbishment',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
    description: 'Multi-room project covering plastering, decorating, flooring, and all finishing carpentry — managed and delivered on schedule.',
  },
  {
    id: 5,
    title: 'Finishing & Detail Work',
    category: 'Finishing Carpentry',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop',
    description: 'Skirting boards, architraves, door hanging, and bespoke shelving installed to complete a high-end interior renovation.',
  },
  {
    id: 6,
    title: 'Commercial Office Refresh',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    description: 'Decorating and finishing works for a Canary Wharf office, delivered to a tight deadline with minimal disruption.',
  },
]

export default function PortfolioPage() {
  useScrollReveal()

  const [featured, ...rest] = projects

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav />
      <PageHero
        breadcrumb="Our Work"
        title="Featured Projects"
        subtitle="A curated selection of completed projects — from single-room transformations to full property refurbishments across London."
      />

      {/* Featured project */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto">

          <div
            data-reveal-scale
            className="group rounded-xl border border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.38)] bg-[#FDFCF9] shadow-sm hover:shadow-lg overflow-hidden transition-all duration-300 mb-10"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="relative w-full lg:w-[56%] flex-shrink-0 overflow-hidden min-h-[260px] sm:min-h-[320px] lg:min-h-[420px]">
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="eager"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FDFCF9]/60 to-transparent lg:hidden" />
              </div>
              <div className="flex flex-col justify-center px-8 py-10 lg:px-12 lg:py-14">
                <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#A88636] mb-3.5 block">
                  {featured.category}
                </span>
                <h3 className="font-['Cormorant_Garamond'] text-[1.5rem] lg:text-[1.75rem] font-semibold text-[#1C1714] mb-5 leading-[1.18]">
                  {featured.title}
                </h3>
                <div className="w-10 h-px bg-[rgba(212,175,55,0.55)] mb-5" />
                <p className="font-['Source_Serif_4'] text-[1rem] text-[#5A5048] leading-[1.75]">
                  {featured.description}
                </p>
              </div>
            </div>
          </div>

          {/* Project grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((p, i) => (
              <div
                key={p.id}
                data-reveal
                style={{ transitionDelay: `${i * 80}ms` }}
                className="group overflow-hidden rounded-xl border border-[rgba(212,175,55,0.2)] hover:border-[rgba(212,175,55,0.4)] bg-[#FDFCF9] shadow-sm hover:-translate-y-[3px] hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-[16/12] overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                  />
                </div>
                <div className="px-6 py-6">
                  <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-[#A88636] mb-2.5 block">
                    {p.category}
                  </span>
                  <h3 className="font-['Cormorant_Garamond'] text-[1.1875rem] font-semibold text-[#1C1714] mb-2.5 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-[#5A5048] text-[0.875rem] font-['Source_Serif_4'] leading-[1.7]">
                    {p.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After */}
      <BeforeAfter />

      {/* CTA */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#1C1714]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        <div className="max-w-3xl mx-auto text-center" data-reveal>
          <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-semibold text-white mb-5">
            Like What You See?
          </h2>
          <p className="font-['Source_Serif_4'] text-[0.95rem] text-[#C4BAB0] leading-relaxed mb-8 max-w-xl mx-auto">
            Let's discuss your project. We'll provide a free quote and timeline.
          </p>
          <Link
            to="/contact"
            className="inline-block font-['Source_Serif_4'] font-semibold text-[0.9rem] tracking-wide px-8 py-3.5 rounded-lg text-[#1C1714] bg-gradient-gold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-[#D4AF37]/30"
          >
            Discuss Your Project
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
