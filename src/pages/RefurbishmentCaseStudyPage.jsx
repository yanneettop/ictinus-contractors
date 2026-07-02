import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Reveal, { StaggerContainer, StaggerItem } from '../components/Reveal'
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
  'Marble-effect tiling',
  'Walk-in shower area',
  'Freestanding bath',
  'Fitted vanity storage',
  'Soft wall lighting',
]

const beforeAfterStories = [
  {
    title: 'Living room transformation',
    text: 'The reception room moved from marked walls, exposed flooring and tired finishes to a calm, bright living space with clean decoration and preserved period character.',
    before: {
      src: '/Portfolio/ictinus-property-refurbishment-london-before-living-room-fireplace.webp',
      alt: 'Living room before property refurbishment with stripped floor, marked walls and period fireplace',
      caption: 'Before: worn wall finishes, exposed flooring and period details ready for careful preparation.',
    },
    after: {
      src: '/Portfolio/ictinus-property-refurbishment-london-finished-living-room-street-view.webp',
      alt: 'Living room after property refurbishment with neutral walls and period fireplace',
      caption: 'After: a cleaner, brighter room with neutral decoration, crisp woodwork and a refined finish.',
    },
  },
  {
    title: 'Room preparation and finish',
    text: 'This room shows the practical preparation behind the final result: wall repairs, surface preparation, skirting work and a clean decorative finish.',
    before: {
      src: '/Portfolio/ictinus-property-refurbishment-london-before-bedroom-preparation.webp',
      alt: 'Room before property refurbishment with marked walls and exposed subfloor',
      caption: 'Before: damaged wall surfaces, exposed floor and preparation work still required.',
    },
    after: {
      src: '/Portfolio/ictinus-property-refurbishment-london-finished-bedroom-doorway.webp',
      alt: 'Room after property refurbishment with clean walls, carpet and doorway',
      caption: 'After: repaired walls, clean paintwork, fitted carpet and crisp trims around the doorway.',
    },
  },
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

function ImagePanel({ src, alt, caption, className = '', imageClassName = 'aspect-[4/3]', captionClassName = '' }) {
  return (
    <motion.figure
      className={`group overflow-hidden rounded-[14px] border border-[rgba(212,175,55,0.18)] bg-[#FDFCF9] shadow-sm ${className}`}
      whileHover={{
        y: -5,
        boxShadow: '0 18px 42px rgba(28,23,20,0.1), 0 3px 10px rgba(212,175,55,0.1)',
        borderColor: 'rgba(212,175,55,0.36)',
      }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={`${imageClassName} overflow-hidden`}>
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
          loading="lazy"
          decoding="async"
        />
      </div>
      <figcaption className={`px-5 py-4 font-['Source_Serif_4'] text-[0.86rem] leading-relaxed text-[#6B625A] ${captionClassName}`}>
        {caption}
      </figcaption>
    </motion.figure>
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

function BeforeAfterStory({ story, reverse = false }) {
  const panelClass = 'rounded-[16px]'
  const imageClass = 'aspect-[4/3] sm:aspect-[16/11] lg:aspect-[16/10]'
  const captionClass = 'min-h-0 px-5 py-3.5 text-[0.82rem] leading-[1.55] sm:text-[0.86rem]'

  return (
    <article className="space-y-8">
      <Reveal>
        <div className="max-w-5xl">
          <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[#A88636]">
            Before / After
          </p>
          <h3 className="font-['Cormorant_Garamond'] text-[2rem] font-semibold leading-tight text-[#1C1714] sm:text-[2.35rem]">
            {story.title}
          </h3>
          <p className="mt-4 font-['Source_Serif_4'] text-[1rem] leading-[1.8] text-[#5A5048]">
            {story.text}
          </p>
        </div>
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2">
        <Reveal delay={0.06}>
          <ImagePanel
            {...story.before}
            className={panelClass}
            imageClassName={imageClass}
            captionClassName={captionClass}
          />
        </Reveal>
        <Reveal delay={0.12}>
          <ImagePanel
            {...story.after}
            className={panelClass}
            imageClassName={imageClass}
            captionClassName={captionClass}
          />
        </Reveal>
      </div>
    </article>
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
                    <motion.span
                      key={badge}
                      className="rounded-full border border-[#D4AF37]/20 bg-white/5 px-4 py-2 font-['Plus_Jakarta_Sans'] text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#D4AF37]"
                      whileHover={{ y: -2, backgroundColor: 'rgba(212,175,55,0.14)', color: '#FFFFFF' }}
                      transition={{ duration: 0.2 }}
                    >
                      {badge}
                    </motion.span>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      to="/contact#quote"
                      className="inline-flex items-center justify-center rounded-lg bg-gradient-gold px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-[#1C1714] shadow-lg shadow-[#D4AF37]/15"
                    >
                      Request a Similar Quote
                    </Link>
                  </motion.div>
                  <motion.button
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    className="inline-flex items-center justify-center rounded-lg border border-[#D4AF37]/45 px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-white transition-colors hover:border-[#D4AF37] hover:bg-white/10"
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Gallery
                  </motion.button>
                </div>
              </div>
            </Reveal>

            <Reveal direction="scale" delay={0.08}>
              <div className="relative z-10">
                <motion.figure
                  className="group overflow-hidden rounded-[18px] border border-[rgba(212,175,55,0.18)] bg-[#FDFCF9] shadow-[0_24px_70px_rgba(0,0,0,0.38)]"
                  whileHover={{
                    y: -6,
                    boxShadow: '0 30px 70px rgba(28,23,20,0.14), 0 5px 16px rgba(212,175,55,0.12)',
                    borderColor: 'rgba(212,175,55,0.4)',
                  }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="aspect-[4/3] overflow-hidden lg:aspect-[5/4]">
                    <img
                      src="/Portfolio/full-property-refurbishment-london-reception-room.webp"
                      alt="Finished furnished East London reception room with sofas, period fireplace and neutral decoration"
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <figcaption className="px-5 py-4 font-['Source_Serif_4'] text-[0.9rem] leading-relaxed text-[#6B625A]">
                    Finished reception room styled with soft furnishings, clean walls, crisp woodwork and preserved period character.
                  </figcaption>
                </motion.figure>
              </div>
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
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="Before & After" title="The transformation becomes clearer when each room is seen side by side.">
                <p>
                  Before the final decoration could begin, the rooms needed proper preparation. Walls showed old fixings, patch repairs and surface wear, while the floors and skirting areas exposed the amount of work required before the home could feel clean and cohesive again.
                </p>
                <p className="mt-4">
                  The living room and adjoining room below show the refurbishment story more clearly: repair first, then a clean decorative finish that makes the spaces feel brighter and ready to use.
                </p>
              </SectionHeading>
            </Reveal>

            <div className="mt-10 space-y-14">
              {beforeAfterStories.map((story, index) => (
                <BeforeAfterStory key={story.title} story={story} reverse={index % 2 === 1} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
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

        <section className="bg-[#F3EEE6] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="What We Completed" title="Preparation, decorating and finishing details across the home." />
            </Reveal>
            <StaggerContainer className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-5" stagger={0.07}>
              {scopeItems.map((item) => (
                <StaggerItem key={item.title}>
                  <motion.article
                    className="h-full rounded-[12px] border border-[rgba(212,175,55,0.18)] bg-[#FDFCF9] p-5 shadow-sm"
                    whileHover={{
                      y: -5,
                      backgroundColor: '#FFFEFB',
                      boxShadow: '0 16px 36px rgba(28,23,20,0.08), 0 2px 8px rgba(212,175,55,0.08)',
                      borderColor: 'rgba(212,175,55,0.36)',
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <h3 className="font-['Cormorant_Garamond'] text-[1.35rem] font-semibold leading-tight text-[#1C1714]">
                      {item.title}
                    </h3>
                    <p className="mt-3 font-['Source_Serif_4'] text-[0.88rem] leading-[1.75] text-[#625951]">
                      {item.text}
                    </p>
                  </motion.article>
                </StaggerItem>
              ))}
            </StaggerContainer>
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
              <StaggerContainer className="grid gap-4 sm:grid-cols-2" stagger={0.06}>
                {finishCards.map(([title, text]) => (
                  <StaggerItem key={title}>
                    <motion.article
                      className="rounded-[12px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] p-5 shadow-sm"
                      whileHover={{
                        y: -4,
                        boxShadow: '0 14px 32px rgba(28,23,20,0.08), 0 2px 8px rgba(212,175,55,0.08)',
                        borderColor: 'rgba(212,175,55,0.38)',
                      }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3 className="font-['Plus_Jakarta_Sans'] text-[0.76rem] font-semibold uppercase tracking-[0.13em] text-[#A88636]">
                        {title}
                      </h3>
                      <p className="mt-3 font-['Source_Serif_4'] text-[0.92rem] leading-[1.75] text-[#5A5048]">
                        {text}
                      </p>
                    </motion.article>
                  </StaggerItem>
                ))}
              </StaggerContainer>
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
              <SectionHeading eyebrow="The Result" title="A refined bathroom with a calm, premium finish.">
                <p>
                  The bathroom was completed with a bright marble-effect finish, a freestanding bath, fitted vanity storage and a walk-in shower area. The result feels calm, practical and more refined while still sitting comfortably within the wider refurbishment.
                </p>
                <p className="mt-4">
                  Wall lighting, glass shower screening, clean tiling lines and carefully finished trims give the space a more polished everyday feel, with the bathroom now working as one of the strongest finished rooms in the home.
                </p>
              </SectionHeading>
              <div className="mt-8 flex flex-wrap gap-3">
                {resultHighlights.map((item) => (
                  <motion.span
                    key={item}
                    className="rounded-full bg-[#FAF7F0] px-4 py-2 font-['Plus_Jakarta_Sans'] text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-[#A88636]"
                    whileHover={{ y: -2, backgroundColor: '#F3EEE6', color: '#1C1714' }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <ImagePanel
                src="/Portfolio/ictinus-property-refurbishment-london-marble-bathroom-suite.webp"
                alt="Finished marble bathroom suite with freestanding bath, vanity and walk-in shower"
                caption="Finished bathroom with marble-effect surfaces, freestanding bath, walk-in shower glass, vanity storage and soft wall lighting."
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
                <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact#quote"
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-gold px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-[#1C1714] shadow-lg shadow-[#D4AF37]/20"
                  >
                    Request a Quote
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center rounded-lg border border-[#D4AF37]/35 px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-white transition-colors hover:bg-[#D4AF37]/10"
                  >
                    View Our Services
                  </Link>
                </motion.div>
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
