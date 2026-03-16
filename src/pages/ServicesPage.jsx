import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useSEO } from '../hooks/useSEO'

/* ─── Service detail data ─────────────────────────────────────────── */
const SERVICES = [
  {
    id: 'painting-decorating',
    label: 'Painting & Decorating',
    headline: 'Painting & Decorating in London',
    tag: 'Interior & Exterior Specialists',
    intro: `London property owners trust Ictinus Contractors for painting and decorating that goes beyond a quick coat of paint. Proper surface preparation is at the heart of everything we do — filling, sanding, priming, and caulking before a single brush stroke ensures a result that looks exceptional and lasts for years.`,
    body: `Our painting services cover interior rooms, hallways, kitchens, and bathrooms through to exterior facades, masonry, and timber. Whether you are refreshing a rental property, preparing a home for sale, or undertaking a full redecoration, we match materials to the job: breathable paints for older properties, specialist kitchen and bathroom formulations where moisture is a factor, and premium brands for commercial spaces.

We work across all London boroughs — from Victorian terraces in Hackney and Islington to modern apartments in Canary Wharf and Stratford — bringing the same level of care and precision to every project, regardless of size.`,
    includes: [
      'Full surface preparation — filling, sanding, sealing',
      'Ceiling painting and coving detail',
      'Feature walls and accent colours',
      'Interior woodwork: doors, skirting, and architraves',
      'Exterior masonry, render, and timber painting',
      'Colour consultancy and finish advice',
    ],
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16s1-1 3-1 4 2 6 2 3-1 3-1V4s-1 1-3 1-4-2-6-2-3 1-3 1z" />
        <line x1="4" y1="20" x2="4" y2="16" strokeLinecap="round" />
      </>
    ),
  },
  {
    id: 'wallpapering',
    label: 'Wallpapering',
    headline: 'Professional Wallpaper Hanging in London',
    tag: 'All Paper Types & Styles',
    intro: `A well-hung feature wall or fully papered room transforms a space in a way that paint alone cannot achieve. Ictinus Contractors specialises in precision wallpaper hanging across all paper types — from standard vinyl through to textured, grasscloth, fabric-backed, and heavyweight designer papers that demand expert technique.`,
    body: `Correct preparation is essential for lasting results. We line walls where needed to achieve a flat base, properly align patterns across joins, and finish edges cleanly at ceiling lines and architraves. Our team has experience with all repeat formats including straight-match, half-drop, and random designs.

Whether it is a single feature wall in a residential living room, a complete renovation of a listed property with delicate heritage papers, or a high-specification commercial interior, we deliver a finish that is clean, precise, and built to last.`,
    includes: [
      'Wall preparation and lining paper application',
      'Standard and luxury vinyl wallpapers',
      'Feature walls and full-room installations',
      'Grasscloth, fabric-backed, and textured papers',
      'Pattern matching across all repeat types',
      'Careful protection of surrounding surfaces throughout',
    ],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    ),
  },
  {
    id: 'plastering',
    label: 'Plastering',
    headline: 'Plastering Services in London',
    tag: 'Skimming, Patching & Dry-Lining',
    intro: `Smooth, paint-ready walls are the foundation of any quality decoration. Ictinus Contractors provides professional plastering services across London — from a full re-skim of a single room to extensive multi-room works on residential and commercial properties.`,
    body: `We carry out skim plastering over existing surfaces, patch repairs following pipework or electrical works, and full dry-lining where speed and thermal performance matter. Every plastered surface is finished to a consistent, high-quality level and handed over ready for decoration.

Good plastering is invisible — you only notice it when it is done poorly. Our team understands this and works to a standard that ensures the final painted or wallpapered result reflects the premium finish the project demands. We work throughout London, including Hackney, Shoreditch, Islington, Kensington, and Southwark.`,
    includes: [
      'Skim plastering and full room re-skimming',
      'Patch and repair plastering (post-pipework, post-electrical)',
      'Dry-lining and plasterboard installation',
      'Coving and cornice installation',
      'External and internal render',
      'Pre-decoration surface preparation and assessment',
    ],
    icon: (
      <>
        <polygon points="12 2 2 7 12 12 22 7 12 2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="2 17 12 22 22 17" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="2 12 12 17 22 12" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: 'hard-flooring',
    label: 'Hard Flooring',
    headline: 'Hard Flooring Installation in London',
    tag: 'Engineered Wood, LVT, Tile & More',
    intro: `The right floor makes or breaks an interior. Ictinus Contractors installs hard flooring across London to a precision finish — engineered wood, solid hardwood, luxury vinyl tile (LVT), laminate, and porcelain or ceramic tiling for bathrooms, kitchens, and living areas.`,
    body: `Our installation process starts with proper subfloor assessment and preparation: levelling screeds where necessary, laying acoustic underlay where required, and acclimating timber products to the installation environment. The result is a floor that looks premium and performs long-term — without the movement, squeaking, or lifting that shortcuts produce.

We work on both residential and commercial flooring projects, from a single room in a Hackney apartment to multi-floor refurbishments in commercial offices across Central London.`,
    includes: [
      'Engineered and solid hardwood flooring',
      'Luxury vinyl tile (LVT) and vinyl plank',
      'Laminate flooring installation',
      'Porcelain and ceramic tile installation',
      'Subfloor preparation, levelling, and moisture management',
      'Stair nosings, threshold strips, and finishing trims',
    ],
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    id: 'bathroom-fitting',
    label: 'Bathroom Fitting',
    headline: 'Bathroom Fitting & Installation in London',
    tag: 'Full Installations & Refurbishments',
    intro: `A bathroom refurbishment is one of the highest-value investments in a property — and one that demands careful coordination of trades. Ictinus Contractors manages bathroom fitting end-to-end across London, handling tiling, all plumbing connections, vanity and fixture installation, and every finishing detail.`,
    body: `We work with clients' chosen sanitaryware and tiles or advise on supplier selections where preferred. Our bathroom projects range from straightforward refreshes — new tiling, shower enclosures, and fresh sanitary fittings — to complete strip-out and refurbishment of en-suites, family bathrooms, and hotel-standard guest bathrooms in high-end residential properties.

Every bathroom project is planned carefully before work begins. We coordinate all trades, manage the programme, and leave you with a finished, fully tested, spotless bathroom on handover.`,
    includes: [
      'Full bathroom strip-out and refurbishment',
      'Floor and wall tiling (all sizes and formats)',
      'Bath, shower enclosure, and walk-in shower installation',
      'Vanity units and WC fitting',
      'All plumbing connections and water pressure testing',
      'Towel rail, mirror, and accessory fitting',
    ],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    ),
  },
  {
    id: 'property-refurbishment',
    label: 'Property Refurbishment',
    headline: 'Property Refurbishment in London',
    tag: 'Residential & Commercial Projects',
    intro: `End-to-end property refurbishments are where Ictinus Contractors delivers most value. We manage complex, multi-trade projects for residential landlords, property developers, and owner-occupiers — coordinating all works from initial strip-out through to final snagging and handover.`,
    body: `Whether you are preparing a flat for the rental market, undertaking a full renovation of a Victorian terrace, or refreshing a commercial office for new tenants, our project management approach ensures trades are sequenced correctly, materials arrive on time, and the programme is delivered within the agreed budget and timeline.

We are trusted by landlords across East and Central London for reliable, cost-effective refurbishment work that maximises rental value and minimises void periods. Our experience spans properties from studio flats to multi-floor residential buildings and commercial premises.`,
    includes: [
      'Full property refurbishment management and coordination',
      'Residential and commercial projects of all scales',
      'Pre-sale and pre-rental property makeovers',
      'Multi-room coordinated decorating and flooring',
      'Kitchen and bathroom refurbishments within the project',
      'Landlord and developer refurbishments with minimal disruption',
    ],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" />
    ),
  },
  {
    id: 'finishing-carpentry',
    label: 'Finishing Carpentry',
    headline: 'Finishing Carpentry & Detail Work in London',
    tag: 'Skirting, Architraves & Bespoke Joinery',
    intro: `The details define the quality of a finish. Ictinus Contractors provides finishing carpentry and joinery services across London that bring a project to completion with precision — skirting boards fitted tight to the floor, architraves mitred clean at corners, and doors hanging square and closing without resistance.`,
    body: `Our finishing carpentry covers the full range of interior details: from standard MDF skirting and architrave installation in new builds to bespoke hardwood features and built-in storage in premium residential properties. We work alongside decorators and main contractors, or as the lead trade, to ensure every last detail is executed to the standard the project deserves.

Good finishing carpentry is what elevates a well-decorated room into something that feels truly complete and considered. We bring that discipline to every project we work on across London.`,
    includes: [
      'Skirting board supply and installation (MDF, hardwood)',
      'Architraves and door casings — all profiles',
      'Internal door hanging and lining sets',
      'Dado rails, picture rails, and feature panelling',
      'Built-in shelving, alcove units, and storage',
      'Bespoke timber features and custom joinery details',
    ],
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    ),
  },
]

/* ─── FAQ data ─────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'How much does painting and decorating cost in London?',
    a: `The cost depends on the size of the space, the condition of surfaces, and materials specified. A single bedroom typically ranges from £400–£700 fully decorated; a full house redecoration across multiple rooms is quoted per project. Ictinus Contractors provides free, detailed, written quotes with no obligation — contact us to arrange an assessment.`,
  },
  {
    q: 'Are Ictinus Contractors fully insured?',
    a: `Yes. Ictinus Contractors carries full public liability insurance on every project. Confirmation of cover can be provided before any work begins.`,
  },
  {
    q: 'Which London boroughs do you cover?',
    a: `We operate across all London boroughs. Our core coverage includes Hackney, Shoreditch, Bethnal Green, Islington, Tower Hamlets, Canary Wharf, Stratford, Camden, Kensington, Chelsea, Greenwich, Fulham, Southwark, Lewisham, Brixton, and Central London. If you are unsure whether we cover your area, contact us with your postcode.`,
  },
  {
    q: 'How long does a full property refurbishment take?',
    a: `Timescales depend on the scope of works. A two-bedroom flat refurbishment typically takes 3–6 weeks; larger properties or more extensive schemes are programmed individually. Every project begins with a detailed schedule of works agreed before we start, so you always know what to expect.`,
  },
  {
    q: 'Do you provide free quotes for decorating and refurbishment work?',
    a: `Yes. We provide free, no-obligation, written quotes for all projects — from a single room to a full property refurbishment. Submit your details through our enquiry form or contact us directly at info@ictinuscontractors.co.uk to arrange a site visit.`,
  },
  {
    q: 'Do you work on commercial as well as residential properties?',
    a: `Yes. We undertake both residential and commercial projects including offices, retail units, landlord refurbishments, and hospitality interiors. Our team understands the importance of working efficiently and with minimal disruption in occupied or operational commercial environments.`,
  },
]

/* ─── Schema injection ─────────────────────────────────────────────── */
function injectSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
      {
        '@type': 'ItemList',
        name: 'Decorating and Refurbishment Services in London',
        description: 'Professional decorating, plastering, flooring, bathroom fitting and property refurbishment services across London by Ictinus Contractors.',
        url: 'https://ictinuscontractors.co.uk/services',
        numberOfItems: SERVICES.length,
        itemListElement: SERVICES.map(({ id, headline }, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: headline,
          url: `https://ictinuscontractors.co.uk/services#${id}`,
        })),
      },
    ],
  }

  const existing = document.querySelector('#services-schema')
  if (existing) existing.remove()
  const el = document.createElement('script')
  el.id = 'services-schema'
  el.type = 'application/ld+json'
  el.textContent = JSON.stringify(schema)
  document.head.appendChild(el)
  return () => el.remove()
}

/* ─── Service Icon wrapper ────────────────────────────────────────── */
function ServiceIcon({ paths }) {
  return (
    <svg
      className="w-5 h-5 text-[#D4AF37]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {paths}
    </svg>
  )
}

/* ─── Jump nav ────────────────────────────────────────────────────── */
function ServiceJumpNav() {
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <nav
      aria-label="Services navigation"
      className="bg-white border-b border-[#D4AF37]/15 sticky top-[4rem] md:top-[4.5rem] z-40 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
        <div className="flex gap-0 min-w-max py-0">
          {SERVICES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="font-['Source_Serif_4'] text-[0.72rem] font-medium tracking-wide text-[#5A5048] px-4 py-3.5 whitespace-nowrap hover:text-[#B08D2A] hover:bg-[#D4AF37]/05 border-b-2 border-transparent hover:border-[#D4AF37]/50 transition-all duration-200"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

/* ─── Individual service section ──────────────────────────────────── */
function ServiceSection({ service, index }) {
  const navigate = useNavigate()
  const isEven = index % 2 === 0

  return (
    <section
      id={service.id}
      className={`py-16 sm:py-20 px-4 sm:px-6 lg:px-8 scroll-mt-28 ${
        isEven ? 'bg-[#FAF9F6]' : 'bg-[#F5F0E6]'
      }`}
    >
      <div className="max-w-5xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start`}>

          {/* Content column */}
          <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/12 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                <ServiceIcon paths={service.icon} />
              </div>
              <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] uppercase tracking-[0.1em] text-[#A88636] font-600">
                {service.tag}
              </span>
            </div>

            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-semibold text-[#1C1714] mb-4 leading-snug">
              {service.headline}
            </h2>

            <p className="font-['Source_Serif_4'] text-[0.93rem] text-[#3D342E] leading-relaxed mb-4">
              {service.intro}
            </p>
            {service.body.split('\n\n').map((para, i) => (
              <p key={i} className="font-['Source_Serif_4'] text-[0.93rem] text-[#5A5048] leading-relaxed mb-4">
                {para}
              </p>
            ))}

            <button
              onClick={() => navigate('/#quote')}
              className="inline-flex items-center gap-2 font-['Source_Serif_4'] font-semibold text-[0.85rem] tracking-wide px-6 py-3 rounded-lg bg-gradient-gold text-[#1C1714] transition-all duration-200 hover:-translate-y-0.5 shadow-[0_4px_14px_rgba(212,175,55,0.2)] mt-2"
            >
              Request a Free Quote
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Includes card */}
          <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
            <div className="bg-white rounded-2xl border border-[#D4AF37]/18 p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
              <h3 className="font-['Cormorant_Garamond'] text-[1rem] font-semibold text-[#1C1714] mb-5 flex items-center gap-2">
                <span className="w-5 h-px bg-[#D4AF37] flex-shrink-0" />
                What&rsquo;s Included
              </h3>
              <ul className="space-y-3">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg
                      className="w-4 h-4 text-[#B08D2A] mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-['Source_Serif_4'] text-[0.875rem] text-[#3D342E] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-[#D4AF37]/12">
                <p className="font-['Source_Serif_4'] text-[0.8rem] text-[#9A9590] leading-relaxed italic">
                  Free, no-obligation written quote provided before any work begins.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── Areas section ────────────────────────────────────────────────── */
const AREAS = [
  'Hackney', 'Shoreditch', 'Bethnal Green', 'Islington',
  'Canary Wharf', 'Tower Hamlets', 'Stratford', 'Greenwich',
  'Camden', 'Kensington', 'Chelsea', 'Fulham',
  'Southwark', 'Lewisham', 'Brixton', 'Central London',
]

function AreasSection() {
  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#EEE8DC] border-t border-[#D4AF37]/15">
      <div className="max-w-4xl mx-auto text-center">
        <p className="ict-section-label">Coverage</p>
        <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-[1.75rem] font-semibold text-[#1C1714] mb-3">
          Decorating Services Across London
        </h2>
        <p className="font-['Source_Serif_4'] text-[0.93rem] text-[#5A5048] leading-relaxed mb-8 max-w-2xl mx-auto">
          Based in East London, Ictinus Contractors delivers painting and decorating, plastering, flooring,
          bathroom fitting and property refurbishment services to clients across all London boroughs including:
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {AREAS.map((a) => (
            <span
              key={a}
              className="font-['Source_Serif_4'] text-[0.82rem] font-medium text-[#1C1714] bg-white border border-[#D4AF37]/28 rounded-full px-4 py-1.5"
            >
              {a}
            </span>
          ))}
        </div>
        <p className="font-['Source_Serif_4'] text-[0.88rem] text-[#5A5048]">
          Not sure if we cover your postcode?{' '}
          <a
            href="mailto:info@ictinuscontractors.co.uk"
            className="text-[#B08D2A] font-semibold underline underline-offset-2 hover:text-[#8b6c2c] transition-colors"
          >
            Drop us an email
          </a>{' '}
          and we&rsquo;ll confirm availability.
        </p>
      </div>
    </section>
  )
}

/* ─── FAQ section ──────────────────────────────────────────────────── */
function FAQSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
      <div className="max-w-3xl mx-auto">
        <p className="ict-section-label">FAQ</p>
        <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-semibold text-[#1C1714] text-center mb-12 leading-snug">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {FAQS.map(({ q, a }) => (
            <div
              key={q}
              className="bg-white rounded-xl border border-[#D4AF37]/15 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
            >
              <h3 className="font-['Cormorant_Garamond'] text-[1rem] font-semibold text-[#1C1714] mb-3 leading-snug">
                {q}
              </h3>
              <p className="font-['Source_Serif_4'] text-[0.88rem] text-[#5A5048] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Final CTA ────────────────────────────────────────────────────── */
function PageCTA() {
  const navigate = useNavigate()
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#1C1714] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      <div className="max-w-3xl mx-auto text-center">
        <p className="font-['Plus_Jakarta_Sans'] text-[0.72rem] uppercase tracking-[0.1em] text-[#A88636] font-semibold mb-3">
          Get Started
        </p>
        <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-semibold text-white mb-5 leading-tight">
          Ready to Discuss Your London Project?
        </h2>
        <p className="font-['Source_Serif_4'] text-[0.95rem] text-[#C4BAB0] leading-relaxed mb-10 max-w-2xl mx-auto">
          Request a free, no-obligation written quote from Ictinus Contractors.
          We cover all London boroughs and respond within one working day.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/#quote')}
            className="font-['Source_Serif_4'] font-semibold text-[0.9rem] tracking-wide px-8 py-3.5 rounded-lg text-[#1C1714] bg-gradient-gold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Request a Free Quote
          </button>
          <a
            href="mailto:info@ictinuscontractors.co.uk"
            className="font-['Source_Serif_4'] font-semibold text-[0.9rem] tracking-wide px-8 py-3.5 rounded-lg text-[#D4AF37] border border-[#D4AF37]/40 transition-all duration-300 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/60 text-center"
          >
            info@ictinuscontractors.co.uk
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Main page ────────────────────────────────────────────────────── */
export default function ServicesPage() {
  useSEO({
    title: 'Decorating & Refurbishment Services in London | Ictinus Contractors',
    description:
      'Expert painting & decorating, plastering, bathroom fitting, hard flooring installation and property refurbishment across London. 9.97/10 Checkatrade. Fully insured. Free quotes.',
    canonical: 'https://ictinuscontractors.co.uk/services',
    ogTitle: 'Decorating & Refurbishment Services in London | Ictinus Contractors',
    ogDescription:
      'Professional decorating, plastering, bathroom fitting and property refurbishment across London. 9.97/10 Checkatrade. Free quotes.',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    return injectSchema()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav />

      {/* ── Page Hero ── */}
      <header className="relative bg-[#1C1714] pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?auto=format&fit=crop&w=1400&q=60')] bg-cover bg-center opacity-10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 mb-6">
            <a href="/" className="font-['Plus_Jakarta_Sans'] text-[0.7rem] text-[#C9B09A] hover:text-[#D4AF37] transition-colors uppercase tracking-wider">
              Home
            </a>
            <svg className="w-3 h-3 text-[#D4AF37]/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] text-[#D4AF37] uppercase tracking-wider">Services</span>
          </nav>

          <p className="font-['Plus_Jakarta_Sans'] text-[0.72rem] uppercase tracking-[0.1em] text-[#A88636] font-semibold mb-4">
            FULLY INSURED · LONDON BASED · 12+ YEARS EXPERIENCE
          </p>

          <h1 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-white mb-5 leading-tight">
            Professional Decorating &amp; Refurbishment Services in London
          </h1>

          <p className="font-['Source_Serif_4'] text-[1rem] sm:text-[1.05rem] text-[#C4BAB0] leading-relaxed mb-8 max-w-2xl mx-auto">
            Painting &amp; decorating, plastering, bathroom fitting, hard flooring installation, and full property
            refurbishment — delivered to a premium standard across all London boroughs.
          </p>

          {/* Trust bar */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8">
            {[
              '9.97/10 Checkatrade',
              '4.9/5 MyBuilder',
              '30+ Verified Reviews',
              'Free Written Quotes',
            ].map((t) => (
              <span key={t} className="font-['Source_Serif_4'] text-[0.8rem] text-[#D4AF37]/80 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                {t}
              </span>
            ))}
          </div>

          <a
            href="#painting-decorating"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('painting-decorating')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 font-['Source_Serif_4'] font-semibold text-[0.9rem] tracking-wide px-8 py-3.5 rounded-lg text-[#1C1714] bg-gradient-gold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            View All Services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </header>

      {/* ── Sticky service jump nav ── */}
      <ServiceJumpNav />

      {/* ── Intro context ── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-[#EEE8DC] border-b border-[#D4AF37]/15">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-['Source_Serif_4'] text-[0.95rem] text-[#3D342E] leading-relaxed">
            Ictinus Contractors is a professional London contractor specialising in decorating, refurbishment,
            and finishing. We serve homeowners, landlords, and commercial clients from our East London base —
            rated <strong className="text-[#B08D2A]">9.97/10 on Checkatrade</strong> and{' '}
            <strong className="text-[#B08D2A]">4.9/5 on MyBuilder</strong> across 30+ verified reviews.
            Every project is fully insured and backed by 12+ years of experience across London.
          </p>
        </div>
      </section>

      {/* ── Seven service sections ── */}
      <main>
        {SERVICES.map((service, i) => (
          <ServiceSection key={service.id} service={service} index={i} />
        ))}
      </main>

      {/* ── Areas ── */}
      <AreasSection />

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── Final CTA ── */}
      <PageCTA />

      <Footer />
    </div>
  )
}
