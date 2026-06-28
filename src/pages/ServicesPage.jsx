import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { useSEO } from '../hooks/useSEO'
import { trackServiceCtaClick } from '../utils/tracking'

/* ─── Icons ───────────────────────────────────────────────────────── */
const ICONS = {
  refurbishment: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" />
  ),
  bathroom: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  ),
  painting: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16s1-1 3-1 4 2 6 2 3-1 3-1V4s-1 1-3 1-4-2-6-2-3 1-3 1z" />
      <line x1="4" y1="20" x2="4" y2="16" strokeLinecap="round" />
    </>
  ),
  plastering: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="2 17 12 22 22 17" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="2 12 12 17 22 12" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  flooring: (
    <>
      <rect x="3" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="14" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="3" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  carpentry: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
  ),
  electrical: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  ),
  plumbing: (
    <>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      <line x1="5" y1="5" x2="5.01" y2="5" strokeLinecap="round" strokeWidth="2.5" />
    </>
  ),
}

/* ─── Main services (enquiry-driving, larger blocks) ──────────────── */
const MAIN_SERVICES = [
  {
    id: 'property-refurbishment',
    title: 'Property Refurbishment & Extensions',
    tag: 'Full Projects, Managed End to End',
    href: '/services/property-refurbishment-extensions',
    cta: 'View service',
    icon: ICONS.refurbishment,
    desc: 'Full property refurbishments and extension finishing for London homes and flats. We plan the work, coordinate the trades and manage the project from strip-out through to a clean, finished handover.',
    points: [
      'Whole-property and single-room refurbishments',
      'Layout changes and extension finishing',
      'Coordinated multi-trade project management',
      'Flats, houses and staged or phased works',
      'Clear written schedule agreed before work begins',
    ],
  },
  {
    id: 'bathroom-fitting',
    title: 'Bathroom Fitting & Renovation',
    tag: 'Full Strip-Out to Finishing',
    href: '/services/bathroom-fitting',
    cta: 'View service',
    icon: ICONS.bathroom,
    desc: 'Complete bathroom renovation across London — from a straightforward refresh to a full strip-out and refit, with tiling, fixtures and plumbing handled from start to finish.',
    points: [
      'Full bathroom strip-out and renovation',
      'Wall and floor tiling in all formats',
      'Bath, shower and walk-in shower installation',
      'Vanity units, WC and fixture fitting',
      'All plumbing connections tested before handover',
    ],
  },
  {
    id: 'painting-decorating',
    title: 'Painting & Decorating',
    tag: 'Careful Preparation, Clean Finish',
    href: '/services/painting-and-decorating',
    cta: 'View service',
    icon: ICONS.painting,
    desc: 'Interior and exterior painting and decorating across London, built on proper preparation — filling, sanding and priming before a clean, long-lasting finish.',
    points: [
      'Full surface preparation before painting',
      'Walls, ceilings and coving',
      'Interior woodwork, doors and skirting',
      'Exterior masonry, render and timber',
      'Feature walls and colour advice',
    ],
  },
  {
    id: 'plastering',
    title: 'Plastering & Surface Preparation',
    tag: 'Smooth, Paint-Ready Surfaces',
    href: '/services/plastering',
    cta: 'View service',
    icon: ICONS.plastering,
    desc: 'Skimming, patching and surface preparation that gives walls and ceilings a smooth, paint-ready finish for refurbishment and decorating work.',
    points: [
      'Skimming and full re-skims',
      'Patch and repair plastering',
      'Dry-lining and plasterboard',
      'Surface preparation before decorating',
      'Making good after pipework or electrical',
    ],
  },
]

/* ─── Supporting trades (part of complete projects) ───────────────── */
const SUPPORTING_TRADES = [
  {
    id: 'hard-flooring',
    title: 'Hard Flooring Installation',
    href: '/services/hard-flooring',
    cta: 'Request a Flooring Quote',
    icon: ICONS.flooring,
    desc: 'Engineered wood, laminate, LVT and tile flooring installed over a properly prepared subfloor for a clean, hard-wearing result.',
  },
  {
    id: 'finishing-carpentry',
    title: 'Finishing Carpentry & Detail Work',
    href: '/services/finishing-carpentry',
    cta: 'Discuss Finishing Details',
    icon: ICONS.carpentry,
    desc: 'Skirting, architraves, doors and detail joinery fitted precisely to complete a refurbishment, bathroom or kitchen project.',
  },
  {
    id: 'electrical-works',
    title: 'Electrical Works',
    href: '/services/electrical-works',
    cta: 'Ask About Electrical Work',
    icon: ICONS.electrical,
    desc: 'Electrical works for refurbishments, kitchens, bathrooms and property upgrades, coordinated within the wider project with suitably qualified input where required.',
  },
  {
    id: 'plumbing',
    title: 'Plumbing',
    href: '/services/plumbing',
    cta: 'Ask About Plumbing Work',
    icon: ICONS.plumbing,
    desc: 'Plumbing support for bathrooms, kitchens and refurbishment projects, coordinated cleanly with the rest of the work.',
  },
]

/* ─── Trust points ────────────────────────────────────────────────── */
const TRUST_POINTS = [
  'Clear written quotations before work starts',
  'Careful preparation and clean finishing',
  'Suitable for flats, houses and staged refurbishments',
  'Public liability insurance in place',
  'Multi-trade support for complete projects',
  'London-based team with a professional approach',
]

/* ─── Ordered service list (for schema) ───────────────────────────── */
const SERVICE_PAGE_URLS = {
  'property-refurbishment': 'https://www.ictinuscontractors.co.uk/services/property-refurbishment-extensions',
  'bathroom-fitting': 'https://www.ictinuscontractors.co.uk/services/bathroom-fitting',
  'painting-decorating': 'https://www.ictinuscontractors.co.uk/services/painting-and-decorating',
  plastering: 'https://www.ictinuscontractors.co.uk/services/plastering',
  'hard-flooring': 'https://www.ictinuscontractors.co.uk/services/hard-flooring',
  'finishing-carpentry': 'https://www.ictinuscontractors.co.uk/services/finishing-carpentry',
  'electrical-works': 'https://www.ictinuscontractors.co.uk/services/electrical-works',
  plumbing: 'https://www.ictinuscontractors.co.uk/services/plumbing',
}

/* ─── FAQ data ─────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'What refurbishment services do you offer in London?',
    a: `Ictinus Contractors provides property refurbishment, bathroom renovation, painting and decorating, plastering, flooring installation, finishing carpentry, and electrical and plumbing support across London. We can take on a single trade or coordinate several trades for a complete project.`,
  },
  {
    q: 'Do you handle full property refurbishments?',
    a: `Yes. Full property refurbishments are where we deliver most value — coordinating strip-out, plastering, decorating, flooring, bathrooms and finishing for landlords, developers and owner-occupiers, with a clear schedule agreed before work starts.`,
  },
  {
    q: 'Are Ictinus Contractors fully insured?',
    a: `Yes. Ictinus Contractors carries public liability insurance on every project. Confirmation of cover can be provided before any work begins.`,
  },
  {
    q: 'Which London boroughs do you cover?',
    a: `We operate across all London boroughs. Core coverage includes Hackney, Shoreditch, Bethnal Green, Islington, Tower Hamlets, Canary Wharf, Stratford, Camden, Kensington, Chelsea, Greenwich, Fulham, Southwark, Lewisham, Brixton, and Central London. If you are unsure whether we cover your area, contact us with your postcode.`,
  },
  {
    q: 'Do you provide free quotes for renovation and decorating work?',
    a: `Yes. We provide free, no-obligation, written quotes for all projects — from a single room to a full property refurbishment. Submit your details through our enquiry form or email info@ictinuscontractors.co.uk to arrange a site visit.`,
  },
]

/* ─── Schema injection ─────────────────────────────────────────────── */
function injectSchema() {
  const ordered = [
    ...MAIN_SERVICES.map((s) => ({ id: s.id, name: s.title })),
    ...SUPPORTING_TRADES.map((s) => ({ id: s.id, name: s.title })),
  ]

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
        name: 'Renovation, Refurbishment & Decorating Services in London',
        description:
          'Property refurbishment, bathroom renovation, painting and decorating, plastering, flooring, finishing carpentry, electrical and plumbing services across London by Ictinus Contractors.',
        url: 'https://www.ictinuscontractors.co.uk/services',
        numberOfItems: ordered.length,
        itemListElement: ordered.map(({ id, name }, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name,
          url: SERVICE_PAGE_URLS[id] || `https://www.ictinuscontractors.co.uk/services#${id}`,
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

/* ─── Icon wrapper ────────────────────────────────────────────────── */
function ServiceIcon({ paths, className = 'w-5 h-5 text-[#D4AF37]' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24" aria-hidden="true">
      {paths}
    </svg>
  )
}

function ArrowIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

/* ─── Main service card (large) ───────────────────────────────────── */
function MainServiceCard({ service }) {
  return (
    <article
      id={service.id}
      className="group service-hover-card relative scroll-mt-28 flex h-full flex-col rounded-2xl border border-[#D4AF37]/20 bg-white p-6 shadow-[0_4px_18px_rgba(28,23,20,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/38 hover:shadow-[0_16px_36px_rgba(28,23,20,0.09)] sm:p-8"
    >
      {/* Stretched link — covers whole card, sits behind content */}
      <Link
        to={service.href}
        onClick={() => trackServiceCtaClick({ cta_label: service.cta, target_path: service.href, service_name: service.title })}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        aria-label={`View ${service.title} service page`}
      />

      {/* Arrow top-right — appears on hover */}
      <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/0 bg-[#D4AF37]/0 opacity-0 transition-all duration-200 group-hover:border-[#D4AF37]/25 group-hover:bg-[#D4AF37]/10 group-hover:opacity-100">
        <svg className="h-3.5 w-3.5 -translate-y-px translate-x-px text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </div>

      <div className="relative z-10 mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/22 bg-[#D4AF37]/12">
          <ServiceIcon paths={service.icon} className="w-5 h-5 text-[#B08D2A]" />
        </div>
        <span className="font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#A88636]">
          {service.tag}
        </span>
      </div>

      <h3 className="relative z-10 mb-3 font-['Cormorant_Garamond'] text-2xl font-semibold leading-snug text-[#1C1714] sm:text-[1.7rem]">
        {service.title}
      </h3>

      <p className="relative z-10 mb-5 font-['Source_Serif_4'] text-[0.95rem] leading-relaxed text-[#5A5048]">
        {service.desc}
      </p>

      <ul className="relative z-10 mb-6 space-y-2.5">
        {service.points.map((point) => (
          <li key={point} className="flex items-start gap-2.5">
            <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-['Source_Serif_4'] text-[0.9rem] leading-snug text-[#3D342E]">{point}</span>
          </li>
        ))}
      </ul>

      <div className="relative z-10 mt-auto flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Gold button — decorative, click handled by stretched link above */}
        <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-6 py-3 font-['Source_Serif_4'] text-[0.88rem] font-semibold tracking-wide text-[#1C1714] shadow-[0_4px_14px_rgba(212,175,55,0.2)]">
          {service.cta}
          <ArrowIcon />
        </span>
        {/* Quote link — z-10 so it sits above the stretched link */}
        <Link
          to="/contact#quote"
          onClick={(e) => { e.stopPropagation(); trackServiceCtaClick({ cta_label: 'Request a quote', target_path: '/contact#quote', service_name: service.title }) }}
          className="relative z-10 inline-flex items-center gap-1.5 font-['Source_Serif_4'] text-[0.85rem] font-semibold text-[#B08D2A] underline decoration-[#D4AF37]/35 underline-offset-4 transition-colors hover:text-[#8B6C2C]"
        >
          Request a quote
        </Link>
      </div>
    </article>
  )
}

/* ─── Supporting trade card (compact) ─────────────────────────────── */
function SupportingTradeCard({ service }) {
  return (
    <article id={service.id} className="scroll-mt-28 h-full">
      <Link
        to={service.href}
        onClick={() => trackServiceCtaClick({ cta_label: service.cta, target_path: service.href, service_name: service.title })}
        className="group service-hover-card relative flex h-full flex-col rounded-xl border border-[#D4AF37]/16 bg-[#FDFCF9] p-5 shadow-[0_2px_12px_rgba(28,23,20,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/34 hover:shadow-[0_12px_26px_rgba(28,23,20,0.07)] sm:p-6"
      >
        {/* Arrow top-right — appears on hover */}
        <div className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-[#D4AF37]/0 bg-[#D4AF37]/0 opacity-0 transition-all duration-200 group-hover:border-[#D4AF37]/25 group-hover:bg-[#D4AF37]/10 group-hover:opacity-100">
          <svg className="h-3.5 w-3.5 -translate-y-px translate-x-px text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </div>

        <div className="relative z-10 mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/22 bg-[#D4AF37]/10">
          <ServiceIcon paths={service.icon} className="w-5 h-5 text-[#B08D2A]" />
        </div>

        <h3 className="relative z-10 mb-2 font-['Cormorant_Garamond'] text-[1.3rem] font-semibold leading-snug text-[#1C1714] transition-colors duration-200 group-hover:text-[#8B6C2C]">
          {service.title}
        </h3>

        <p className="relative z-10 mb-5 font-['Source_Serif_4'] text-[0.88rem] leading-relaxed text-[#5A5048]">
          {service.desc}
        </p>

        <span className="relative z-10 mt-auto inline-flex items-center gap-2 font-['Source_Serif_4'] text-[0.85rem] font-semibold text-[#B08D2A] transition-colors duration-200 group-hover:text-[#8B6C2C]">
          {service.cta}
          <ArrowIcon className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </Link>
    </article>
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
    <section className="border-t border-[#D4AF37]/15 bg-[#EEE8DC] px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="ict-section-label">Coverage</p>
        <h2 className="mb-3 font-['Cormorant_Garamond'] text-2xl font-semibold text-[#1C1714] sm:text-[1.75rem]">
          Refurbishment Services Across London
        </h2>
        <p className="mx-auto mb-8 max-w-2xl font-['Source_Serif_4'] text-[0.93rem] leading-relaxed text-[#5A5048]">
          Based in East London, Ictinus Contractors delivers property refurbishment, bathroom renovation,
          painting and decorating, plastering, flooring and finishing work to clients across all London boroughs including:
        </p>
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {AREAS.map((a) => (
            <span
              key={a}
              className="rounded-full border border-[#D4AF37]/28 bg-white px-4 py-1.5 font-['Source_Serif_4'] text-[0.82rem] font-medium text-[#1C1714] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D4AF37]/45 hover:text-[#B08D2A] hover:shadow-[0_8px_18px_rgba(28,23,20,0.06)]"
            >
              {a}
            </span>
          ))}
        </div>
        <p className="font-['Source_Serif_4'] text-[0.88rem] text-[#5A5048]">
          Not sure if we cover your postcode?{' '}
          <a
            href="mailto:info@ictinuscontractors.co.uk"
            data-link-location="services coverage email"
            className="font-semibold text-[#B08D2A] underline underline-offset-2 transition-colors hover:text-[#8b6c2c]"
          >
            Drop us an email
          </a>{' '}
          and we&rsquo;ll confirm availability.
        </p>
      </div>
    </section>
  )
}

/* ─── Why choose us (trust block) ─────────────────────────────────── */
function WhyChooseSection() {
  return (
    <section className="bg-[#F5F0E6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <p className="ict-section-label text-left">Why Ictinus</p>
          <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold leading-tight text-[#1C1714] sm:text-[2.4rem]">
            Why Clients Choose Ictinus Contractors
          </h2>
          <p className="mt-4 font-['Source_Serif_4'] text-[0.95rem] leading-relaxed text-[#5A5048]">
            A calm, reliable approach to renovation and refurbishment work, with clear communication and
            careful finishing from the first quote to handover.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_POINTS.map((point) => (
            <article
              key={point}
              className="service-hover-card flex items-start gap-3 rounded-xl border border-[#D4AF37]/18 bg-[#FFFEFB] p-5 shadow-[0_10px_26px_rgba(28,23,20,0.04)] hover:border-[#D4AF37]/36 hover:shadow-[0_14px_30px_rgba(28,23,20,0.075)]"
            >
              <div className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/24 bg-[#D4AF37]/10">
                <svg className="h-4 w-4 text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="relative z-10 font-['Source_Serif_4'] text-[0.95rem] font-medium leading-snug text-[#1C1714]">
                {point}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ section ──────────────────────────────────────────────────── */
function FAQSection() {
  return (
    <section className="bg-[#FAF9F6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="ict-section-label">FAQ</p>
        <h2 className="mb-12 text-center font-['Cormorant_Garamond'] text-2xl font-semibold leading-snug text-[#1C1714] sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {FAQS.map(({ q, a }) => (
            <div
              key={q}
              className="group service-hover-card rounded-xl border border-[#D4AF37]/15 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-[#D4AF37]/32 hover:shadow-[0_12px_26px_rgba(28,23,20,0.07)]"
            >
              <h3 className="relative z-10 mb-3 font-['Cormorant_Garamond'] text-[1rem] font-semibold leading-snug text-[#1C1714] transition-colors duration-300 group-hover:text-[#B08D2A]">
                {q}
              </h3>
              <p className="relative z-10 font-['Source_Serif_4'] text-[0.88rem] leading-relaxed text-[#5A5048]">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Final CTA ────────────────────────────────────────────────────── */
function PageCTA() {
  return (
    <section className="relative overflow-hidden bg-[#1C1714] px-4 py-20 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#A88636]">
          Get Started
        </p>
        <h2 className="mb-5 font-['Cormorant_Garamond'] text-3xl font-semibold leading-tight text-white md:text-4xl">
          Ready to Discuss Your London Renovation Project?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl font-['Source_Serif_4'] text-[0.95rem] leading-relaxed text-[#C4BAB0]">
          Tell us what you are planning, share a few details about the property and we&rsquo;ll guide you on the
          next step — whether it&rsquo;s a full refurbishment, bathroom renovation, decorating work or a
          combination of trades.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/contact#quote"
            onClick={() => trackServiceCtaClick({ cta_label: 'Request a Quote', target_path: '/contact#quote' })}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-8 py-3.5 font-['Source_Serif_4'] text-[0.9rem] font-semibold tracking-wide text-[#1C1714] shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
          >
            Request a Quote
            <ArrowIcon />
          </Link>
          <a
            href="mailto:info@ictinuscontractors.co.uk?subject=Project%20Details%20Enquiry"
            data-link-location="services final CTA email"
            className="inline-flex items-center justify-center rounded-lg border border-[#D4AF37]/40 px-8 py-3.5 text-center font-['Source_Serif_4'] text-[0.9rem] font-semibold tracking-wide text-[#D4AF37] transition-colors duration-300 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10"
          >
            Email Us Your Project Details
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Main page ────────────────────────────────────────────────────── */
export default function ServicesPage() {
  useSEO({
    title: 'Renovation, Refurbishment & Decorating Services in London | Ictinus Contractors',
    description:
      'Property refurbishment, bathroom renovation, painting and decorating, plastering, flooring, finishing carpentry, electrical and plumbing across London. 9.97/10 Checkatrade. Fully insured. Free quotes.',
    canonical: 'https://www.ictinuscontractors.co.uk/services',
    ogTitle: 'Renovation, Refurbishment & Decorating Services in London | Ictinus Contractors',
    ogDescription:
      'Refurbishment, bathroom renovation, decorating and supporting trades across London. 9.97/10 Checkatrade. Free quotes.',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    return injectSchema()
  }, [])

  const scrollToMain = (e) => {
    e.preventDefault()
    document.getElementById('main-services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav />

      {/* ── Page Hero ── */}
      <header className="relative overflow-hidden bg-[#1C1714] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?auto=format&fit=crop&w=1400&q=60')] bg-cover bg-center opacity-10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />

        <div className="relative mx-auto max-w-4xl text-center">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-center gap-2">
            <a href="/" className="font-['Plus_Jakarta_Sans'] text-[0.7rem] uppercase tracking-wider text-[#C9B09A] transition-colors hover:text-[#D4AF37]">
              Home
            </a>
            <svg className="h-3 w-3 text-[#D4AF37]/40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] uppercase tracking-wider text-[#D4AF37]">Services</span>
          </nav>

          <p className="mb-4 font-['Plus_Jakarta_Sans'] text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#A88636]">
            FULLY INSURED · LONDON BASED · 12+ YEARS EXPERIENCE
          </p>

          <h1 className="mb-5 font-['Cormorant_Garamond'] text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            Renovation, Refurbishment &amp; Decorating Services in London
          </h1>

          <p className="mx-auto mb-8 max-w-2xl font-['Source_Serif_4'] text-[1rem] leading-relaxed text-[#C4BAB0] sm:text-[1.05rem]">
            From full property refurbishments to bathrooms, decorating and finishing trades, Ictinus
            Contractors helps London homeowners complete projects with careful planning, reliable workmanship and a
            clean professional finish.
          </p>

          <div className="mb-8 flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              '9.97/10 Checkatrade',
              '33 Checkatrade Reviews',
              'Find us on MyBuilder',
              'Free Written Quotes',
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5 font-['Source_Serif_4'] text-[0.8rem] text-[#D4AF37]/80">
                <svg className="h-3.5 w-3.5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/contact#quote"
              onClick={() => trackServiceCtaClick({ cta_label: 'Request a Quote', target_path: '/contact#quote' })}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-8 py-3.5 font-['Source_Serif_4'] text-[0.9rem] font-semibold tracking-wide text-[#1C1714] shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
            >
              Request a Quote
              <ArrowIcon />
            </Link>
            <a
              href="#main-services"
              onClick={scrollToMain}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/40 px-8 py-3.5 font-['Source_Serif_4'] text-[0.9rem] font-semibold tracking-wide text-[#D4AF37] transition-colors duration-300 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10"
            >
              View Our Main Services
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* ── Intro context ── */}
      <section className="border-b border-[#D4AF37]/15 bg-[#EEE8DC] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-['Source_Serif_4'] text-[0.95rem] leading-relaxed text-[#3D342E]">
            Ictinus Contractors is a professional London contractor specialising in property refurbishment,
            bathroom renovation, decorating and finishing. We serve homeowners, landlords and commercial
            clients from our East London base — rated{' '}
            <strong className="text-[#B08D2A]">9.97/10 on Checkatrade</strong> across{' '}
            <strong className="text-[#B08D2A]">33 customer reviews</strong>, with a MyBuilder profile available as an
            additional enquiry route. Every project is fully insured and backed by 12+ years of experience across London.
          </p>
        </div>
      </section>

      <main id="main-content">
        {/* ── Main Services ── */}
        <section id="main-services" className="scroll-mt-24 bg-[#FAF9F6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-3xl">
              <p className="ict-section-label text-left">Main Services</p>
              <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold leading-tight text-[#1C1714] sm:text-[2.45rem]">
                Main Services for London Homes &amp; Flats
              </h2>
              <p className="mt-4 font-['Source_Serif_4'] text-[0.95rem] leading-relaxed text-[#5A5048]">
                The services most London homeowners enquire about — refurbishment, bathrooms, decorating and
                plastering — handled with careful planning and a clean, professional finish.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {MAIN_SERVICES.map((service) => (
                <MainServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Supporting Trades ── */}
        <section id="supporting-trades" className="scroll-mt-24 bg-[#F5F0E6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-3xl">
              <p className="ict-section-label text-left">Supporting Trades</p>
              <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold leading-tight text-[#1C1714] sm:text-[2.45rem]">
                Supporting Trades for Complete Projects
              </h2>
              <p className="mt-4 font-['Source_Serif_4'] text-[0.95rem] leading-relaxed text-[#5A5048]">
                The finishing and technical trades that complete a refurbishment, bathroom or property
                improvement — coordinated within the wider project so everything is finished cleanly.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SUPPORTING_TRADES.map((service) => (
                <SupportingTradeCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Areas ── */}
        <AreasSection />

        {/* ── Why choose us ── */}
        <WhyChooseSection />

        {/* ── FAQ ── */}
        <FAQSection />

        {/* ── Final CTA ── */}
        <PageCTA />
      </main>

      <Footer />
    </div>
  )
}
