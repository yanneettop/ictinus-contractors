import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Reveal, { StaggerContainer, StaggerItem } from '../components/Reveal'
import PortfolioGalleryModal from '../components/PortfolioGalleryModal'
import { BATHROOM_CASE_STUDY_IMAGES } from '../components/bathroomCaseStudyImages'
import useScrollReveal from '../hooks/useScrollReveal'
import { useSEO } from '../hooks/useSEO'

const heroBadges = ['Bathroom renovation', 'Walk-in shower', 'Waterproofing', 'Wall & floor tiling', 'Lighting & finishing']

const priorities = [
  'Strip-out and prep',
  'Waterproofing',
  'Walk-in shower layout',
  'Wall and floor tiling',
  'Lighting and storage',
  'Easy maintenance',
]

const scopeItems = [
  {
    title: 'Bathroom strip-out and preparation',
    text: 'The old bathroom finishes were removed so the room could be properly prepared for the new layout and installation.',
  },
  {
    title: 'Wall and shower waterproofing',
    text: 'Wet areas were prepared with waterproofing in mind before tiling and final shower installation.',
  },
  {
    title: 'Tiling and wall panelling',
    text: 'Wall and floor finishes were installed carefully to create a cleaner, more modern bathroom surface.',
  },
  {
    title: 'Vanity and sanitaryware',
    text: 'The vanity, basin, toilet and shower fittings were positioned to make the bathroom practical for daily use.',
  },
  {
    title: 'Lighting and final details',
    text: 'Lighting, mirror, storage and finishing details were completed to make the space feel calm and usable.',
  },
]

const finishCards = [
  ['Large-format wall and floor tiles', 'Fewer grout lines helped create a cleaner look and made the bathroom easier to maintain.'],
  ['Walk-in shower layout', 'The shower area was designed to feel open while keeping the room practical for everyday use.'],
  ['Wall-mounted fittings', 'Wall-mounted taps and fittings helped keep the vanity area clean and uncluttered.'],
  ['LED mirror lighting', 'Integrated mirror lighting added a softer, more practical light for daily use.'],
  ['Floating vanity and storage', 'The vanity provided useful storage while keeping the bathroom feeling lighter and more open.'],
]

const resultHighlights = [
  'Walk-in shower',
  'Built-in storage',
  'Modern vanity unit',
  'Clean tiled finish',
  'Soft integrated lighting',
  'Practical everyday layout',
]

function imageByKey(key) {
  return BATHROOM_CASE_STUDY_IMAGES.find((image) => image.key === key)
}

function responsiveSrc(src, width = 800) {
  const name = src.split('/').pop().replace('.webp', '')
  return `/Portfolio/responsive/${name}-${width}.webp`
}

function responsiveSrcSet(src) {
  return [480, 800, 1200].map((width) => `${responsiveSrc(src, width)} ${width}w`).join(', ')
}

function MetaLine({ inverse = false }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${inverse ? 'text-[#D4AF37]' : 'text-[#A88636]'}`}>
        Bathroom Renovation
      </span>
      <span className="text-[0.55rem] text-[#D4AF37]/40">&#9679;</span>
      <span className={`font-['Source_Serif_4'] text-[0.78rem] ${inverse ? 'text-[#D8CEC3]' : 'text-[#82776E]'}`}>East London</span>
    </div>
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
      {children && (
        <div className={`mt-5 font-['Source_Serif_4'] text-[1rem] leading-[1.85] sm:text-[1.05rem] ${inverse ? 'text-[#D8CEC3]' : 'text-[#5A5048]'}`}>
          {children}
        </div>
      )}
    </div>
  )
}

function InlineServiceLink({ to, children, inverse = false }) {
  return (
    <Link
      to={to}
      className={`underline decoration-[#C9A227]/55 underline-offset-4 transition-colors ${
        inverse ? 'text-white hover:text-[#D4AF37]' : 'text-[#3F352D] hover:text-[#A88636]'
      }`}
    >
      {children}
    </Link>
  )
}

function ImagePanel({ image, className = '', eager = false, caption }) {
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
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={responsiveSrc(image.src, 1200)}
          srcSet={responsiveSrcSet(image.src)}
          sizes="(min-width: 1024px) 560px, 100vw"
          alt={image.alt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.055]"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
        />
      </div>
      <figcaption className="px-5 py-4 font-['Source_Serif_4'] text-[0.86rem] leading-relaxed text-[#6B625A]">
        {caption || image.caption}
      </figcaption>
    </motion.figure>
  )
}

export default function BathroomCaseStudyPage() {
  useScrollReveal()
  const [galleryOpen, setGalleryOpen] = useState(false)
  const finalWide = imageByKey('final-wide-shot')
  const before = imageByKey('before')
  const stripped = imageByKey('stripped-prep')
  const waterproofing = imageByKey('waterproofing-tile-prep')
  const niche = imageByKey('shower-niche-detail')
  const tileDrainDetail = imageByKey('tile-drain-detail')
  const vanity = imageByKey('floating-oak-vanity')
  const storageDetail = imageByKey('storage-toilet-detail')

  useSEO({
    title: 'Bathroom Renovation East London | Walk-In Shower & Tiling | Ictinus Contractors',
    description:
      'See an East London bathroom renovation by Ictinus Contractors, including strip-out, waterproofing, walk-in shower installation, tiling, lighting and final finishing.',
    canonical: 'https://www.ictinuscontractors.co.uk/portfolio/modern-walk-in-bathroom-renovation',
    ogTitle: 'Bathroom Renovation East London | Walk-In Shower & Tiling | Ictinus Contractors',
    ogDescription:
      'See an East London bathroom renovation by Ictinus Contractors, including strip-out, waterproofing, walk-in shower installation, tiling, lighting and final finishing.',
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
                  Walk-In Shower, Waterproofing, Tiling & Bathroom Finishing
                </p>

                <h1 className="mt-5 font-['Cormorant_Garamond'] text-[2.75rem] font-semibold leading-[0.96] tracking-normal text-white sm:text-[4.2rem]">
                  Walk-In Bathroom Renovation in East London
                </h1>

                <div className="mt-7 max-w-2xl font-['Source_Serif_4'] text-[1.06rem] leading-[1.85] text-[#D8CEC3] sm:text-[1.16rem]">
                  <p>
                    A <InlineServiceLink to="/services/bathroom-fitting" inverse>bathroom renovation</InlineServiceLink> in East London focused on creating a cleaner, more practical space with a walk-in shower, new tiling, improved lighting and carefully finished details.
                  </p>
                  <p className="mt-4">
                    The work included strip-out, preparation, waterproofing, installation and final finishing so the bathroom could feel modern, easy to maintain and ready for everyday use.
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
                <ImagePanel image={finalWide} eager className="rounded-[18px] shadow-[0_24px_70px_rgba(0,0,0,0.38)]" />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <Reveal>
              <SectionHeading eyebrow="Project Overview" title="A cleaner, calmer bathroom planned around daily use">
                <p>
                  This bathroom renovation focused on making the space feel cleaner, more open and easier to use every day.
                </p>
                <p className="mt-4">
                  The existing bathroom had a dated layout and finishes, so the work involved stripping the room back, preparing the surfaces properly and rebuilding the space with a walk-in shower, new tiling, improved lighting and practical storage details.
                </p>
                <p className="mt-4">
                  The result is a bathroom that feels brighter and more modern, while still being designed around comfort, cleaning and long-term use.
                </p>
              </SectionHeading>
            </Reveal>
            <Reveal delay={0.08}>
              <ImagePanel image={before} />
            </Reveal>
          </div>
        </section>

        <section className="bg-[#F3EEE6] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <Reveal>
              <ImagePanel image={stripped} />
            </Reveal>
            <Reveal delay={0.08}>
              <SectionHeading eyebrow="The Brief" title="From dated bathroom to a cleaner, easier-to-use layout">
                <p>
                  The existing bathroom needed more than a surface refresh. The room was stripped back so the new installation could be planned properly, with attention given to waterproofing, tiling, shower access and everyday usability.
                </p>
                <p className="mt-4">
                  The aim was to create a bathroom that looked modern without becoming difficult to maintain, using clean finishes, practical storage and simple details that would work well over time.
                </p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {priorities.map((priority) => (
                    <span key={priority} className="rounded-full bg-[#FDFCF9] px-4 py-2 font-['Source_Serif_4'] text-[0.9rem] text-[#5A5048] shadow-sm">
                      {priority}
                    </span>
                  ))}
                </div>
              </SectionHeading>
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="What We Completed" title="Strip-out, waterproofing, installation and final finishing" />
            </Reveal>
            <StaggerContainer className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-5" stagger={0.07}>
              {scopeItems.map((item) => (
                <StaggerItem key={item.title}>
                  <motion.article
                    className="h-full rounded-[12px] border border-[rgba(212,175,55,0.18)] bg-[#FDFCF9] p-7 shadow-sm"
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
                    <p className="mt-3 font-['Source_Serif_4'] text-[0.9rem] leading-[1.9] text-[#625951]">
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
              <SectionHeading eyebrow="The Challenge" title="The hidden work mattered as much as the final finish" inverse>
                <p>
                  A bathroom can look clean at the end, but the quality depends on what happens before the final fittings go in.
                </p>
                <p className="mt-4">
                  For this project, attention was given to the hidden stages: preparation, waterproofing, pipework coordination, tiling layout and making sure the shower area worked properly for daily use.
                </p>
                <p className="mt-4">
                  The aim was to create a finished bathroom that felt simple and calm, while making sure the practical work behind it was handled carefully.
                </p>
              </SectionHeading>
            </Reveal>
            <Reveal delay={0.08}>
              <ImagePanel image={waterproofing} />
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHeading eyebrow="Materials & Finishes" title="Durable bathroom-grade materials for daily use">
                <p>
                  The bathroom was finished with materials and fittings suited to a wet room environment, with a focus on durability, easy cleaning and a calm modern look.
                </p>
                <p className="mt-4">
                  Large-format tiles, practical sanitaryware, clean lighting and simple storage details helped create a bathroom that feels more open without becoming difficult to maintain.
                </p>
              </SectionHeading>
            </Reveal>

            <div className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <Reveal>
                <ImagePanel image={tileDrainDetail} />
              </Reveal>
              <StaggerContainer className="grid gap-4 sm:grid-cols-2" stagger={0.06}>
                {finishCards.map(([title, text]) => (
                  <StaggerItem key={title}>
                    <motion.article
                      className="rounded-[12px] border border-[rgba(212,175,55,0.2)] bg-[#FDFCF9] p-6 shadow-sm"
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
                      <p className="mt-3 font-['Source_Serif_4'] text-[0.94rem] leading-[1.85] text-[#5A5048]">
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
              <SectionHeading eyebrow="Finished Details" title="The details that make the bathroom feel properly finished" />
            </Reveal>
            <div className="mt-9 grid gap-6 lg:grid-cols-3">
              <Reveal>
                <ImagePanel
                  image={vanity}
                  caption="Clean mirror, lighting and vanity details helped the bathroom feel more complete."
                />
              </Reveal>
              <Reveal delay={0.08}>
                <ImagePanel
                  image={storageDetail}
                  caption="Built-in storage and wall-mounted fittings kept the bathroom practical and uncluttered."
                />
              </Reveal>
              <Reveal delay={0.16}>
                <ImagePanel
                  image={niche}
                  caption="Final tiling, lighting and shower details created a cleaner, more modern finish."
                />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <Reveal>
              <SectionHeading eyebrow="The Result" title="The result: a brighter bathroom that is easier to use and maintain">
                <p>
                  The finished bathroom now feels cleaner, brighter and more practical for everyday use.
                </p>
                <p className="mt-4">
                  By combining proper preparation, waterproofing, careful tiling and clean finishing details, the space was turned into a more comfortable bathroom without making it difficult to maintain.
                </p>
                <p className="mt-4">
                  The final result is modern, calm and practical, with a walk-in shower, useful storage and a finish designed for daily life.
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
                image={finalWide}
                caption="Finished walk-in bathroom with clean tiling, floating vanity, LED mirror and practical storage."
              />
            </Reveal>
          </div>
        </section>

        <section className="bg-[#1C1714] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#D4AF37]/80">
                Careful preparation. Clean installation. A bathroom built for everyday use.
              </p>
              <h2 className="font-['Cormorant_Garamond'] text-[2.15rem] font-semibold leading-tight text-white sm:text-[2.9rem]">
                Planning a bathroom renovation?
              </h2>
              <p className="mx-auto mt-5 max-w-2xl font-['Source_Serif_4'] text-[1rem] leading-[1.8] text-[#D8CEC3]">
                Whether you are updating a dated bathroom or planning a full renovation, we can help with clear advice, careful preparation and a clean final finish.
              </p>
              <p className="mx-auto mt-4 max-w-2xl font-['Source_Serif_4'] text-[1rem] leading-[1.8] text-[#D8CEC3]">
                Tell us what you would like to change and we&rsquo;ll guide you through the best next step.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact#quote"
                    className="inline-flex items-center justify-center rounded-lg bg-gradient-gold px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-[#1C1714] shadow-lg shadow-[#D4AF37]/20"
                  >
                    Request a Bathroom Quote
                  </Link>
                </motion.div>
                <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/services/bathroom-fitting"
                    className="inline-flex items-center justify-center rounded-lg border border-[#D4AF37]/35 px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-white transition-colors hover:bg-[#D4AF37]/10"
                  >
                    View Bathroom Services
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
            images={BATHROOM_CASE_STUDY_IMAGES}
            title="East London Walk-In Bathroom Renovation"
            onClose={() => setGalleryOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
