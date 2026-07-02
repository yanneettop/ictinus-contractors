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

const heroBadges = ['Interior decorating', 'Flooring finish', 'Bathroom finishing', 'Woodwork & details', 'East London']

const heroTitle = 'East London Home Refurbishment & Finishing'

const scopeItems = [
  {
    title: 'Surface preparation',
    text: 'Walls and existing finishes were prepared before decorating, helping the final result look cleaner and more consistent.',
  },
  {
    title: 'Interior decorating',
    text: 'Rooms were decorated with a calm, neutral finish to make the property feel brighter and easier to live in.',
  },
  {
    title: 'Woodwork details',
    text: 'Skirtings, doors, frames and visible edges were treated as part of the overall finish, not as afterthoughts.',
  },
  {
    title: 'Flooring presentation',
    text: 'Flooring areas and room edges were finished carefully so the spaces felt more complete and connected.',
  },
  {
    title: 'Bathroom finishing',
    text: 'The bathroom was brought into the same overall standard with clean, practical finishing details.',
  },
]

const finishCards = [
  ['Practical materials', 'Finishes were selected to suit everyday living, not just the final photographs.'],
  ['Consistent standard', 'Visible details were brought to the same level across rooms, hallways and bathroom areas.'],
  ['Easy to maintain', 'The final look was kept clean and simple, making the home easier to live with day to day.'],
  ['Character retained', 'Original features were respected where they added warmth and character to the property.'],
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
    text: 'The living room was refreshed with cleaner wall finishes, improved flooring presentation and a calmer final look while keeping the original fireplace and room character.',
    before: {
      src: '/Portfolio/ictinus-property-refurbishment-london-before-living-room-fireplace.webp',
      alt: 'East London living room before refurbishment and decorating work',
      caption: 'Before: the living room needed preparation, surface repairs and a cleaner finish.',
    },
    after: {
      src: '/Portfolio/ictinus-property-refurbishment-london-finished-living-room-street-view.webp',
      alt: 'East London living room after interior decorating and finishing work',
      caption: 'After: a brighter living room with fresh decoration, improved flooring presentation and retained period character.',
    },
  },
  {
    title: 'Room preparation and finish',
    text: 'Good decorating depends on what happens before the final coat. Surfaces were repaired, prepared and finished carefully so the rooms could feel clean, even and ready to use.',
    before: {
      src: '/Portfolio/ictinus-property-refurbishment-london-before-bedroom-preparation.webp',
      alt: 'Room preparation before painting and finishing work in East London property',
      caption: 'Before: walls and skirtings required preparation before the final decorating work.',
    },
    after: {
      src: '/Portfolio/ictinus-property-refurbishment-london-finished-bedroom-doorway.webp',
      alt: 'Finished bedroom after interior decorating and refurbishment work',
      caption: 'After: repaired surfaces, fresh decoration and a cleaner finish across the room.',
    },
  },
]

function InlineServiceLink({ to, children }) {
  return (
    <Link to={to} className="font-semibold text-[#E4C76A] underline decoration-[#D4AF37]/35 underline-offset-4 transition-colors hover:text-white">
      {children}
    </Link>
  )
}

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
    title: 'East London Home Refurbishment, Decorating & Finishing | Ictinus Contractors',
    description:
      'See an East London home refurbishment by Ictinus Contractors, including interior decorating, flooring details, bathroom finishing and careful preparation across the property.',
    canonical: 'https://www.ictinuscontractors.co.uk/portfolio/complete-east-london-home-refurbishment',
    ogTitle: 'East London Home Refurbishment, Decorating & Finishing',
    ogDescription:
      'See an East London home refurbishment by Ictinus Contractors, including interior decorating, flooring details, bathroom finishing and careful preparation across the property.',
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
                  {heroTitle}
                </h1>

                <div className="mt-7 max-w-2xl space-y-4 font-['Source_Serif_4'] text-[1.06rem] leading-[1.85] text-[#D8CEC3] sm:text-[1.16rem]">
                  <p>
                    A full <InlineServiceLink to="/services/property-refurbishment-extensions">interior refresh</InlineServiceLink> for an East London property, bringing together room preparation, <InlineServiceLink to="/services/painting-and-decorating">decorating</InlineServiceLink>, <InlineServiceLink to="/services/hard-flooring">flooring details</InlineServiceLink>, <InlineServiceLink to="/services/bathroom-fitting">bathroom finishing</InlineServiceLink> and final touches across the home.
                  </p>
                  <p>
                    The aim was to create a cleaner, brighter and more consistent finish while keeping the character of the property intact.
                  </p>
                </div>

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
                      alt="Completed East London home refurbishment with clean interior finish"
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
              <SectionHeading eyebrow="Project Overview" title="A full interior refresh with a consistent finish from room to room">
                <p>
                  This project focused on improving the property as a whole rather than treating each room separately. The work included preparation, decorating, flooring and finishing details across several areas of the home.
                </p>
                <p className="mt-4">
                  Our priority was to create a clean, calm and consistent result, with each room feeling connected while still keeping its own character.
                </p>
              </SectionHeading>
              <aside className="mt-7 max-w-3xl rounded-lg border border-[#D4AF37]/18 bg-[#FDFCF9] p-5 shadow-[0_10px_26px_rgba(28,23,20,0.045)]">
                <p className="font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[#A88636]">
                  Project focus
                </p>
                <p className="mt-3 font-['Source_Serif_4'] text-[0.96rem] leading-[1.75] text-[#5A5048]">
                  This was not about making every room look identical. The focus was on preparation, clean decorating, practical finishing details and improving the overall feel of the property from one space to the next.
                </p>
              </aside>
            </Reveal>
            <Reveal delay={0.08}>
              <ImagePanel
                src="/Portfolio/full-property-refurbishment-london-galley-kitchen.webp"
                alt="Finished kitchen and dining area after East London home refurbishment"
                caption="Kitchen and connecting dining area refreshed with a clean, durable finish suitable for everyday use."
              />
            </Reveal>
          </div>
        </section>

        <section className="bg-[#F3EEE6] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="Before & After" title="Before and after views showing the difference preparation makes">
                <p>
                  The biggest change across the property came from careful preparation, cleaner surfaces and a more consistent finish between rooms.
                </p>
                <p className="mt-4">
                  These before and after views show how the same spaces became brighter, calmer and more usable once the decorating, flooring and finishing details were completed.
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
                alt="Finished bedroom after interior decorating and refurbishment work"
                caption="Bedroom decoration completed with soft wall tones, crisp white woodwork and careful detailing around doors and trims."
              />
            </Reveal>
            <Reveal delay={0.08}>
              <SectionHeading eyebrow="The Brief" title="A calmer, cleaner finish across the whole property">
                <p>
                  Rather than treating each space as a separate job, the aim was to bring the rooms together with consistent preparation, decorating and finishing details.
                </p>
                <p className="mt-4">
                  Walls, woodwork, flooring edges and room transitions were handled carefully so the property felt cleaner, brighter and more ready to live in.
                </p>
                <p className="mt-4">
                  The result is a practical interior refresh that improves the feel of the home without removing its original character.
                </p>
              </SectionHeading>
            </Reveal>
          </div>
        </section>

        <section className="bg-[#F3EEE6] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="What We Completed" title="What the work included">
                <p>
                  The project brought together several practical finishing tasks across the property, with attention given to the areas that make the biggest difference to how a home feels day to day.
                </p>
              </SectionHeading>
            </Reveal>
            <StaggerContainer className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-5" stagger={0.07}>
              {scopeItems.map((item) => (
                <StaggerItem key={item.title}>
                  <motion.article
                    className="h-full rounded-[12px] border border-[rgba(212,175,55,0.18)] bg-[#FDFCF9] p-5 shadow-sm sm:p-6"
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
                    <p className="mt-3 font-['Source_Serif_4'] text-[0.9rem] leading-[1.8] text-[#625951]">
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
              <SectionHeading eyebrow="The Challenge" title="The challenge was making every space feel consistent" inverse>
                <p>
                  The property included different rooms, finishes and existing details, so the work had to feel connected without making everything look the same.
                </p>
                <p className="mt-4">
                  That meant paying attention to the areas between rooms: wall finishes, woodwork, flooring edges, corners, door frames and how each space flowed into the next.
                </p>
                <p className="mt-4">
                  A consistent home comes from careful preparation, small finishing decisions and keeping the same standard across every area.
                </p>
              </SectionHeading>
            </Reveal>
            <Reveal delay={0.08}>
              <ImagePanel
                src="/Portfolio/full-property-refurbishment-london-staircase.webp"
                alt="Hallway and staircase finishing as part of East London home refurbishment"
                caption="Hallway and staircase finishing helped connect the rooms together."
              />
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="Materials & Finishes" title="Durable finishes for everyday use">
                <p>
                  The finishes were chosen and applied with everyday use in mind, from decorated walls and woodwork to flooring edges and bathroom details.
                </p>
                <p className="mt-4">
                  Each area was approached with the same standard of preparation and finish, so the property felt complete without looking overdone.
                </p>
              </SectionHeading>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <Reveal>
                <ImagePanel
                  src="/Portfolio/full-property-refurbishment-navy-radiator-cover-hallway-detail.webp"
                  alt="Woodwork and painted surface finishing detail by Ictinus Contractors"
                  caption="Finishing details around woodwork and painted surfaces helped give the property a cleaner, more complete look."
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
              <SectionHeading eyebrow="Feature Finishes" title="Each room kept its own character while feeling part of the same home" />
            </Reveal>
            <div className="mt-9 grid gap-6 lg:grid-cols-2">
              <Reveal>
                <ImagePanel
                  src="/Portfolio/full-property-refurbishment-wallpaper-panelling-hallway-detail.webp"
                  alt="Hallway decorative finish and painted woodwork in East London refurbishment"
                  caption="Feature hallway completed with decorative wallcovering, painted woodwork and carefully matched tones for a refined finish."
                />
              </Reveal>
              <Reveal delay={0.08}>
                <ImagePanel
                  src="/Portfolio/full-property-refurbishment-sage-panelling-child-room-detail.webp"
                  alt="Finished room with painted panelling after decorating and finishing work"
                  caption="A softer room scheme using painted panelling and warm neutral tones to give the space character without losing cohesion."
                />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <Reveal>
              <SectionHeading eyebrow="The Result" title="The result: a cleaner, brighter home ready for everyday use">
                <p>
                  The finished property now feels more consistent from room to room, with cleaner decorated surfaces, improved finishing details and a calmer overall look.
                </p>
                <p className="mt-4">
                  By focusing on preparation, practical materials and careful finishing, the home was brought up to a better everyday standard without losing its original character.
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
                alt="Bathroom finishing detail in East London refurbished property"
                caption="Final finishing helped the property feel cleaner, brighter and more complete."
              />
            </Reveal>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-6xl rounded-[12px] border border-[rgba(212,175,55,0.18)] bg-[#FDFCF9] p-6 shadow-sm sm:p-7">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[#A88636]">
                    Why homeowners choose Ictinus Contractors
                  </p>
                  <p className="font-['Source_Serif_4'] text-[1rem] leading-[1.75] text-[#5A5048]">
                    Clear quotes, tidy working, careful preparation and a finish that is ready for everyday use.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    'Clear communication from start to finish',
                    'Tidy working and respectful property care',
                    'Careful preparation before the final finish',
                  ].map((point) => (
                    <div key={point} className="rounded-lg border border-[#D4AF37]/16 bg-[#FAF7F0] px-4 py-3">
                      <p className="font-['Source_Serif_4'] text-[0.9rem] leading-[1.55] text-[#4E453E]">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="bg-[#1C1714] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#D4AF37]/80">
                Clear communication, tidy working and careful finishing from start to handover.
              </p>
              <h2 className="font-['Cormorant_Garamond'] text-[2.15rem] font-semibold leading-tight text-white sm:text-[2.9rem]">
                Planning a refurbishment in East London?
              </h2>
              <div className="mx-auto mt-5 max-w-2xl space-y-4 font-['Source_Serif_4'] text-[1rem] leading-[1.8] text-[#D8CEC3]">
                <p>
                  If your property needs decorating, flooring, bathroom finishing or a more complete interior refresh, we can help you understand the best next step.
                </p>
                <p>
                  Tell us what you would like to improve and we&apos;ll come back with clear, practical guidance.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact#quote"
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-gold px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-[#1C1714] shadow-lg shadow-[#D4AF37]/20"
                  >
                    Request a Refurbishment Quote
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/portfolio"
                    className="inline-flex items-center justify-center rounded-lg border border-[#D4AF37]/35 px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-white transition-colors hover:bg-[#D4AF37]/10"
                  >
                    View More Projects
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
