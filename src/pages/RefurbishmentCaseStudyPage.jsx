import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Reveal from '../components/Reveal'
import PortfolioGalleryModal from '../components/PortfolioGalleryModal'
import { PORTFOLIO_FEATURED_PROJECT, PORTFOLIO_GALLERIES } from '../components/portfolioData'
import useScrollReveal from '../hooks/useScrollReveal'
import { useSEO } from '../hooks/useSEO'

const heroBadges = ['8 Finished Spaces', 'Premium Paint Finishes', 'Period Detail Work']

const scopeItems = [
  {
    title: 'Interior painting & decorating',
    text: 'Walls and ceilings were prepared and finished across the main living areas, bedrooms, hallway, staircase, kitchen and bathroom areas.',
  },
  {
    title: 'Woodwork finishing',
    text: 'Doors, frames, skirting boards and architraves were finished carefully to create crisp lines and a more refined final look.',
  },
  {
    title: 'Feature colours & decorative details',
    text: 'Selected areas used more characterful colour choices and decorative finishes, helping certain rooms feel individual while keeping the overall home cohesive.',
  },
  {
    title: 'Hallway and staircase work',
    text: 'The hallway, landing and staircase areas were treated as important connecting spaces, with careful attention to walls, trims, balustrades and visible transitions.',
  },
  {
    title: 'Final detailing',
    text: 'The project was completed with focus on clean edges, durable finishes and consistency across all finished spaces.',
  },
]

const finishCards = [
  ['Selected feature colours', 'Farrow & Ball used where a more characterful colour finish was required.'],
  ['Walls & ceilings', 'Dulux Heritage used across selected wall and ceiling areas for a refined interior finish.'],
  ['Woodwork', 'Skirting boards, architraves and doors finished with durable eggshell or satin paint systems.'],
  ['Surface-specific finish', 'Water-based eggshell and solvent-based satin finishes selected depending on the surface and use.'],
]

const resultHighlights = [
  '8 finished spaces',
  'Premium paint systems',
  'Detailed woodwork finishing',
  'Cleaner room-to-room flow',
  'Calm, cohesive interior feel',
]

function MetaLine({ inverse = false }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${inverse ? 'text-[#D4AF37]' : 'text-[#A88636]'}`}>
        Property Refurbishment
      </span>
      <span className="text-[0.55rem] text-[#D4AF37]/40">&#9679;</span>
      <span className={`font-['Source_Serif_4'] text-[0.78rem] ${inverse ? 'text-[#D8CEC3]' : 'text-[#82776E]'}`}>East London</span>
    </div>
  )
}

function ImagePanel({ src, alt, caption, className = '' }) {
  return (
    <figure className={`overflow-hidden rounded-[14px] border border-[rgba(212,175,55,0.18)] bg-[#FDFCF9] shadow-sm ${className}`}>
      <div className="aspect-[4/3] overflow-hidden">
        <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" decoding="async" />
      </div>
      <figcaption className="px-5 py-4 font-['Source_Serif_4'] text-[0.86rem] leading-relaxed text-[#6B625A]">
        {caption}
      </figcaption>
    </figure>
  )
}

function SectionHeading({ eyebrow, title, children, inverse = false }) {
  return (
    <div className="max-w-3xl">
      <p className={`mb-3 font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.15em] ${inverse ? 'text-[#D4AF37]/80' : 'text-[#A88636]'}`}>
        {eyebrow}
      </p>
      <h2 className={`font-['Cormorant_Garamond'] text-[2rem] font-semibold leading-[1.06] tracking-normal sm:text-[2.55rem] ${inverse ? 'text-white' : 'text-[#1C1714]'}`}>
        {title}
      </h2>
      {children && !inverse && (
        <div className="mt-5 font-['Source_Serif_4'] text-[1rem] leading-[1.85] text-[#5A5048] sm:text-[1.05rem]">
          {children}
        </div>
      )}
      {children && inverse && (
        <div className="mt-5 font-['Source_Serif_4'] text-[1rem] leading-[1.85] text-[#D8CEC3] sm:text-[1.05rem]">
          {children}
        </div>
      )}
    </div>
  )
}

export default function RefurbishmentCaseStudyPage() {
  useScrollReveal()
  const [galleryOpen, setGalleryOpen] = useState(false)

  useSEO({
    title: 'Complete East London Home Refurbishment & Interior Finishing | Ictinus Contractors',
    description:
      'A full-home interior refurbishment and redecoration case study in East London, focused on preparation, premium paint finishes, woodwork and consistent room-to-room detailing.',
    canonical: 'https://www.ictinuscontractors.co.uk/portfolio/complete-east-london-home-refurbishment',
    ogTitle: 'Complete East London Home Refurbishment & Interior Finishing',
    ogDescription:
      'Explore an East London home refurbishment focused on premium interior finishing, woodwork, preparation and a calm, cohesive result.',
  })

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      <Nav />

      <main id="main-content">
        <section className="relative overflow-hidden bg-[#1C1714] px-4 pb-14 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(212,175,55,0.14),transparent_34%),linear-gradient(135deg,rgba(39,32,27,0.96),rgba(17,14,12,1))]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <Reveal>
              <div className="relative z-10">
                <Link
                  to="/portfolio"
                  className="mb-8 inline-flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-[#D4AF37] transition-colors hover:text-white"
                >
                  <span aria-hidden="true">&larr;</span>
                  Portfolio
                </Link>

                <MetaLine inverse />
                <p className="mt-3 font-['Source_Serif_4'] text-[0.9rem] text-[#D8CEC3]">
                  Interior Redecoration, Woodwork, Flooring & Finishing
                </p>

                <h1 className="mt-5 font-['Cormorant_Garamond'] text-[2.7rem] font-semibold leading-[0.96] tracking-normal text-white sm:text-[4.15rem]">
                  {PORTFOLIO_FEATURED_PROJECT.title}
                </h1>

                <p className="mt-7 max-w-2xl font-['Source_Serif_4'] text-[1.06rem] leading-[1.85] text-[#D8CEC3] sm:text-[1.16rem]">
                  {PORTFOLIO_FEATURED_PROJECT.longDescription}
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {heroBadges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full border border-[#D4AF37]/20 bg-white/5 px-4 py-2 font-['Plus_Jakarta_Sans'] text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#D4AF37]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/contact#quote"
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-gold px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-[#1C1714] shadow-lg shadow-[#D4AF37]/15 transition-transform hover:scale-[1.02]"
                  >
                    Request a Similar Quote
                  </Link>
                  <button
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    className="inline-flex items-center justify-center rounded-lg border border-[#D4AF37]/45 px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-white transition-colors hover:border-[#D4AF37] hover:bg-white/10"
                  >
                    View Gallery
                  </button>
                </div>
              </div>
            </Reveal>

            <Reveal direction="scale" delay={0.08}>
              <figure className="relative z-10 overflow-hidden rounded-[18px] border border-[rgba(212,175,55,0.18)] bg-[#FDFCF9] shadow-[0_24px_70px_rgba(0,0,0,0.38)]">
                <div className="aspect-[4/3] overflow-hidden lg:aspect-[5/4]">
                  <img
                    src="/Portfolio/full-property-refurbishment-london-reception-room.webp"
                    alt="Finished East London living room with period fireplace and neutral decoration"
                    className="h-full w-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <figcaption className="px-5 py-4 font-['Source_Serif_4'] text-[0.9rem] leading-relaxed text-[#6B625A]">
                  Main living room finished in a calm neutral palette, with clean walls, crisp woodwork and preserved period character.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <Reveal>
              <SectionHeading eyebrow="Project Overview" title="A full-home refresh with a consistent finish from room to room.">
                <p>
                  This East London home required a full interior refresh across several rooms and connecting spaces. The brief was to create a cleaner, brighter and more cohesive home while respecting the property&apos;s period character.
                </p>
                <p className="mt-4">
                  Ictinus Contractors carried out preparation, painting and decorating, woodwork finishing and selected interior detail work across the property. Each space had its own finish requirements, from soft neutral walls to detailed trims, feature colours and durable finishes for doors, skirting boards and architraves.
                </p>
              </SectionHeading>
            </Reveal>
            <Reveal delay={0.08}>
              <ImagePanel
                src="/Portfolio/full-property-refurbishment-london-galley-kitchen.webp"
                alt="Finished kitchen and dining area in East London refurbishment"
                caption="Kitchen and connecting dining area refreshed with a clean, durable finish suitable for everyday use."
              />
            </Reveal>
          </div>
        </section>

        <section className="bg-[#F3EEE6] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <Reveal>
              <ImagePanel
                src="/Portfolio/full-property-refurbishment-london-bedroom.webp"
                alt="Finished bedroom with calm wall tones and crisp woodwork"
                caption="Bedroom decoration completed with soft wall tones, crisp white woodwork and careful detailing around doors and trims."
              />
            </Reveal>
            <Reveal delay={0.08}>
              <SectionHeading eyebrow="The Brief" title="Calm, refined and connected as one complete home.">
                <p>
                  The client wanted the home to feel calm, refined and consistent from room to room. The property included several different spaces, each with its own character, but the final result needed to feel connected as one complete home.
                </p>
                <p className="mt-4">
                  The work required careful preparation, clean decorating, attention to period details and the right paint systems for different surfaces, including walls, ceilings, doors, skirting boards, architraves and decorative features.
                </p>
              </SectionHeading>
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="What We Completed" title="Preparation, decorating and finishing details across the home." />
            </Reveal>
            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {scopeItems.map((item) => (
                <Reveal key={item.title}>
                  <article className="h-full rounded-[12px] border border-[rgba(212,175,55,0.18)] bg-[#FDFCF9] p-5 shadow-sm">
                    <h3 className="font-['Cormorant_Garamond'] text-[1.35rem] font-semibold leading-tight text-[#1C1714]">
                      {item.title}
                    </h3>
                    <p className="mt-3 font-['Source_Serif_4'] text-[0.88rem] leading-[1.75] text-[#625951]">
                      {item.text}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1C1714] px-4 py-16 text-white sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
            <Reveal>
              <SectionHeading eyebrow="The Challenge" title="The difficult part was making every space feel consistent." inverse>
                <p>
                  With living spaces, bedrooms, kitchen areas, bathroom areas, hallway, staircase and detailed woodwork all included, the project had to be planned carefully so the finish looked clean from one room to the next.
                </p>
                <p className="mt-4">
                  Period details such as cornices, doors, trims, skirting boards, architraves and staircase elements needed extra care. These are the areas where rushed decorating usually shows.
                </p>
              </SectionHeading>
            </Reveal>
            <Reveal delay={0.08}>
              <ImagePanel
                src="/Portfolio/full-property-refurbishment-london-staircase.webp"
                alt="Finished staircase and landing with detailed woodwork"
                caption="Staircase and landing areas required careful preparation and consistent finishing across walls, trims and detailed woodwork."
              />
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="Materials & Finishes" title="Premium and durable finishes selected for the surface.">
                <p>
                  To achieve the right finish across different rooms and surfaces, the project used a mix of premium and durable paint systems, including Farrow & Ball for selected feature colours and Dulux Heritage for walls, ceilings and interior woodwork.
                </p>
                <p className="mt-4">
                  Skirting boards, architraves and doors were finished using appropriate eggshell or satin finishes depending on the surface and durability required.
                </p>
              </SectionHeading>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <Reveal>
                <ImagePanel
                  src="/Portfolio/full-property-refurbishment-navy-radiator-cover-hallway-detail.webp"
                  alt="Finished hallway woodwork and radiator cover detail"
                  caption="Doors, architraves, skirting and fitted details finished with durable paints selected for each surface."
                />
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2">
                {finishCards.map(([title, text]) => (
                  <Reveal key={title}>
                    <article className="rounded-[12px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] p-5 shadow-sm">
                      <h3 className="font-['Plus_Jakarta_Sans'] text-[0.76rem] font-semibold uppercase tracking-[0.13em] text-[#A88636]">
                        {title}
                      </h3>
                      <p className="mt-3 font-['Source_Serif_4'] text-[0.92rem] leading-[1.75] text-[#5A5048]">
                        {text}
                      </p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F3EEE6] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="Feature Finishes" title="Individual room character without losing cohesion." />
            </Reveal>
            <div className="mt-9 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <ImagePanel
                  src="/Portfolio/full-property-refurbishment-wallpaper-panelling-hallway-detail.webp"
                  alt="Finished hallway with decorative wallcovering and painted woodwork"
                  caption="Feature hallway completed with decorative wallcovering, painted woodwork and carefully matched tones for a refined finish."
                />
              </Reveal>
              <Reveal delay={0.08}>
                <ImagePanel
                  src="/Portfolio/full-property-refurbishment-sage-panelling-child-room-detail.webp"
                  alt="Finished room with sage panelling and warm neutral tones"
                  caption="A softer room scheme using painted panelling and warm neutral tones to give the space character without losing cohesion."
                />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <Reveal>
              <SectionHeading eyebrow="The Result" title="A brighter, calmer and more cohesive home.">
                <p>
                  The completed home now feels brighter, calmer and more cohesive. The neutral palette, clean woodwork, detailed trims and selected feature finishes work together to give the property a more refined interior feel.
                </p>
                <p className="mt-4">
                  Each room has its own character, but the overall finish remains connected throughout the home. The result is a full-home refresh that feels practical, elegant and ready to live in.
                </p>
              </SectionHeading>
              <div className="mt-8 flex flex-wrap gap-3">
                {resultHighlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-[#FAF7F0] px-4 py-2 font-['Plus_Jakarta_Sans'] text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#A88636]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <ImagePanel
                src="/Portfolio/full-property-refurbishment-london-white-bathroom.webp"
                alt="Finished bright bathroom area with clean interior detailing"
                caption="Bathroom area finished with a bright, minimal look and clean detailing around walls, trims and visible surfaces."
              />
            </Reveal>
          </div>
        </section>

        <section className="bg-[#1C1714] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#D4AF37]/80">
                Careful preparation. Premium finishes. Clean results.
              </p>
              <h2 className="font-['Cormorant_Garamond'] text-[2.15rem] font-semibold leading-tight text-white sm:text-[2.9rem]">
                Planning a similar home refurbishment?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl font-['Source_Serif_4'] text-[1rem] leading-[1.8] text-[#D8CEC3]">
                Ictinus Contractors can help with full-home interior refurbishments, painting and decorating, woodwork finishing, flooring and detail-focused preparation across London.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  to="/contact#quote"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-gold px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-[#1C1714] shadow-lg shadow-[#D4AF37]/20 transition-transform hover:scale-[1.02]"
                >
                  Request a Quote
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center rounded-lg border border-[#D4AF37]/35 px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-white transition-colors hover:bg-[#D4AF37]/10"
                >
                  View Our Services
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />

      <AnimatePresence>
        {galleryOpen && (
          <PortfolioGalleryModal
            images={PORTFOLIO_GALLERIES.refurb}
            title={PORTFOLIO_FEATURED_PROJECT.title}
            onClose={() => setGalleryOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
