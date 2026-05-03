import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Reveal, { StaggerContainer, StaggerItem } from '../components/Reveal'
import { useSEO } from '../hooks/useSEO'
import {
  PORTFOLIO_CARD_PROJECTS,
  PORTFOLIO_FEATURED_PROJECT,
} from '../components/portfolioData'

const servicePages = {
  paintingAndDecorating: {
    seo: {
      title: 'Painting & Decorating London | Ictinus Contractors',
      description:
        'Professional painting and decorating services across London for homeowners, landlords and businesses. Clean preparation, reliable communication and high-quality finishing.',
      canonical: 'https://ictinuscontractors.co.uk/services/painting-and-decorating',
    },
    breadcrumb: 'Painting & Decorating',
    hero: {
      heading: 'Painting & Decorating Services Across London',
      subheading:
        'Clean, organised interior and exterior painting and decorating work for homes, flats, rental properties and commercial spaces.',
      trustLine:
        '9.97/10 Checkatrade · 33 verified reviews · Fully insured · Free estimates',
    },
    intro: {
      heading: 'Reliable decorating work with proper preparation',
      body:
        'A good finish starts before the first coat of paint. Ictinus Contractors focuses on preparation, clean workmanship and clear communication, helping London homeowners, landlords and businesses refresh their properties with confidence.',
    },
    helpItems: [
      'Interior painting',
      'Exterior painting',
      'Walls and ceilings',
      'Woodwork, doors and trims',
      'Surface preparation',
      'Filling, sanding and minor repairs',
      'Rental property refreshes',
      'Commercial decorating',
    ],
    process: [
      {
        title: 'Discuss the work',
        text: 'We review your project details, photos and requirements.',
      },
      {
        title: 'Prepare properly',
        text: 'Surfaces are checked, filled, sanded and protected before decorating starts.',
      },
      {
        title: 'Complete the finish',
        text: 'Painting and decorating work is completed carefully with attention to detail.',
      },
      {
        title: 'Leave the space tidy',
        text: 'We aim to keep the work organised and leave the property clean.',
      },
    ],
    reasons: [
      'Verified Checkatrade reviews',
      'Clear communication',
      'Clean, organised work',
      'Careful preparation',
    ],
    relatedProjectKeys: ['painting', 'refurb', 'plastering'],
    relatedServices: [
      { label: 'Plastering', href: '/services/plastering' },
      { label: 'Property Refurbishment & Extensions', href: '/services/property-refurbishment-extensions' },
      { label: 'Finishing Carpentry', href: '/services/finishing-carpentry' },
      { label: 'Hard Flooring', href: '/services/hard-flooring' },
    ],
    review: {
      quote:
        'Konstantinos is a true professional. He kept communication open, gave honest and reliable quotes, and the finish was exceptional.',
      label: 'Verified Checkatrade review',
    },
    finalCta: {
      heading: 'Need painting or decorating work in London?',
      text:
        'Send us a few details about your property and the work you need. Photos help us understand the project faster.',
    },
  },
  propertyRefurbishmentExtensions: {
    seo: {
      title: 'Property Refurbishment & Extensions London | Ictinus Contractors',
      description:
        'Property refurbishment and extension improvement work across London for homeowners, landlords and businesses. Clean workmanship, clear communication and reliable finishing.',
      canonical: 'https://ictinuscontractors.co.uk/services/property-refurbishment-extensions',
    },
    breadcrumb: 'Property Refurbishment & Extensions',
    hero: {
      heading: 'Property Refurbishment & Extensions Across London',
      subheading:
        'Organised refurbishment and property improvement work for homes, flats, rental properties and commercial spaces, completed with care from preparation to final finish.',
      trustLine:
        '9.97/10 Checkatrade · 33 verified reviews · Fully insured · Free estimates',
    },
    intro: {
      heading: 'Reliable refurbishment work with clear communication',
      body:
        'Refurbishment projects need more than good workmanship. They need planning, coordination and clear communication from start to finish. Ictinus Contractors helps London homeowners, landlords and businesses improve their properties with organised work, careful preparation and reliable finishing.',
    },
    helpItems: [
      'Full property refreshes',
      'Room refurbishments',
      'Layout improvement support',
      'Extension finishing work',
      'Painting and decorating',
      'Plastering and surface preparation',
      'Flooring and finishing details',
      'Bathroom and kitchen improvement support',
      'Rental property upgrades',
      'Commercial property improvements',
    ],
    process: [
      {
        title: 'Understand the project',
        text: 'We discuss the work, review photos or site details and clarify what needs to be improved.',
      },
      {
        title: 'Plan the work clearly',
        text: 'We outline the key stages so the project feels organised before work begins.',
      },
      {
        title: 'Complete the refurbishment',
        text: 'Work is carried out with care, preparation and attention to the finishing details.',
      },
      {
        title: 'Final checks and tidy finish',
        text: 'We review the completed work and aim to leave the space clean, practical and ready to use.',
      },
    ],
    reasons: [
      'Verified Checkatrade reviews',
      'Organised project approach',
      'Clear communication',
      'Careful finishing work',
    ],
    relatedProjectKeys: ['refurb', 'painting', 'bath'],
    relatedServices: [
      { label: 'Painting & Decorating', href: '/services/painting-and-decorating' },
      { label: 'Bathroom Fitting', href: '/services/bathroom-fitting' },
      { label: 'Hard Flooring', href: '/services/hard-flooring' },
      { label: 'Plastering', href: '/services/plastering' },
    ],
    review: {
      quote:
        'He repainted my entire flat, walls and ceilings to a high standard. The finish is clean, fresh, and completely transformed the space.',
      label: 'Verified Checkatrade review',
    },
    finalCta: {
      heading: 'Planning refurbishment work in London?',
      text:
        'Send us a few details about the property and the work you need. Photos help us understand the project faster and guide you through the next step.',
    },
  },
  bathroomFitting: {
    seo: {
      title: 'Bathroom Fitting London | Ictinus Contractors',
      description:
        'Bathroom fitting and bathroom improvement services across London for homeowners, landlords and businesses. Clean workmanship, careful preparation and reliable finishing.',
      canonical: 'https://ictinuscontractors.co.uk/services/bathroom-fitting',
    },
    breadcrumb: 'Bathroom Fitting',
    hero: {
      heading: 'Bathroom Fitting Services Across London',
      subheading:
        'Clean, organised bathroom fitting and improvement work for homes, flats, rental properties and commercial spaces, completed with care and attention to detail.',
      trustLine:
        '9.97/10 Checkatrade · 33 verified reviews · Fully insured · Free estimates',
    },
    intro: {
      heading: 'Bathroom work completed with care and clear communication',
      body:
        'Bathroom projects need careful preparation, clean finishing and clear coordination. Ictinus Contractors helps London homeowners, landlords and businesses improve bathrooms with organised workmanship, reliable communication and attention to the final details.',
    },
    helpItems: [
      'Bathroom fitting',
      'Bathroom upgrades',
      'Shower and bath installation support',
      'Tiling preparation and finishing',
      'Vanity and basin installation support',
      'Flooring preparation and fitting',
      'Plumbing support',
      'Painting and decorating',
      'Finishing details and repairs',
      'Rental bathroom refreshes',
    ],
    process: [
      {
        title: 'Review your bathroom',
        text: 'We discuss the work, review photos or visit the property where needed, and understand what needs to be improved.',
      },
      {
        title: 'Prepare the space',
        text: 'Surfaces, fittings and surrounding areas are prepared carefully before installation or finishing work begins.',
      },
      {
        title: 'Complete the fitting work',
        text: 'Bathroom fitting and improvement work is completed with care, clean workmanship and attention to detail.',
      },
      {
        title: 'Final finish and tidy handover',
        text: 'We check the finished work and aim to leave the bathroom clean, practical and ready to use.',
      },
    ],
    reasons: [
      'Verified Checkatrade reviews',
      'Clean workmanship',
      'Clear communication',
      'Careful finishing details',
    ],
    relatedProjectKeys: ['bath', 'refurb', 'painting'],
    relatedServices: [
      { label: 'Plumbing', href: '/services/plumbing' },
      { label: 'Electrical Works', href: '/services/electrical-works' },
      { label: 'Hard Flooring', href: '/services/hard-flooring' },
      { label: 'Property Refurbishment & Extensions', href: '/services/property-refurbishment-extensions' },
    ],
    review: {
      quote:
        'Super professional, easy to communicate with, and the results are beautiful. I would definitely recommend Ictinus.',
      label: 'Verified Checkatrade review',
    },
    finalCta: {
      heading: 'Planning bathroom work in London?',
      text:
        'Send us a few details about your bathroom and the work you need. Photos help us understand the project faster and guide you through the next step.',
    },
  },
  hardFlooring: {
    seo: {
      title: 'Hard Flooring London | Ictinus Contractors',
      description:
        'Hard flooring installation and preparation services across London for homes, flats, rental properties and commercial spaces. Clean workmanship and reliable finishing.',
      canonical: 'https://ictinuscontractors.co.uk/services/hard-flooring',
    },
    breadcrumb: 'Hard Flooring',
    hero: {
      heading: 'Hard Flooring Services Across London',
      subheading:
        'Reliable hard flooring installation and preparation work for homes, flats, rental properties and commercial spaces, completed with clean workmanship and attention to detail.',
      trustLine:
        '9.97/10 Checkatrade · 33 verified reviews · Fully insured · Free estimates',
    },
    intro: {
      heading: 'Flooring work that starts with proper preparation',
      body:
        'A good floor depends on what happens before the final finish is laid. Ictinus Contractors helps London homeowners, landlords and businesses with organised hard flooring work, careful surface preparation and clean finishing details.',
    },
    helpItems: [
      'Hard flooring installation',
      'Laminate flooring',
      'Engineered wood flooring',
      'Vinyl and LVT support where suitable',
      'Floor preparation',
      'Subfloor checks and minor repairs',
      'Skirting and finishing trims',
      'Flooring for rental properties',
      'Flooring as part of refurbishment work',
      'Commercial flooring improvements',
    ],
    process: [
      {
        title: 'Review the space',
        text: 'We discuss the room, flooring type, existing condition and any preparation needed before work begins.',
      },
      {
        title: 'Prepare the floor',
        text: 'The existing surface is checked, prepared and made ready for a cleaner, longer-lasting result.',
      },
      {
        title: 'Install and finish',
        text: 'Flooring is fitted carefully with attention to alignment, edges, trims and finishing details.',
      },
      {
        title: 'Clean handover',
        text: 'We check the finished work and aim to leave the space tidy, practical and ready to use.',
      },
    ],
    reasons: [
      'Verified Checkatrade reviews',
      'Proper floor preparation',
      'Clean, organised work',
      'Reliable finishing details',
    ],
    relatedProjectKeys: ['flooring', 'refurb', 'painting'],
    relatedServices: [
      { label: 'Finishing Carpentry', href: '/services/finishing-carpentry' },
      { label: 'Painting & Decorating', href: '/services/painting-and-decorating' },
      { label: 'Property Refurbishment & Extensions', href: '/services/property-refurbishment-extensions' },
      { label: 'Plastering', href: '/services/plastering' },
    ],
    review: {
      quote:
        'Reliable, punctual and easy to work with. The work was completed with care and attention to detail.',
      label: 'Verified Checkatrade review',
    },
    finalCta: {
      heading: 'Planning hard flooring work in London?',
      text:
        'Send us a few details about your space and the flooring work you need. Photos help us understand the current condition and guide you through the next step.',
    },
  },
  plastering: {
    seo: {
      title: 'Plastering London | Ictinus Contractors',
      description:
        'Plastering and surface preparation services across London for homes, flats, rental properties and refurbishment projects. Smooth finishes, clean work and reliable communication.',
      canonical: 'https://ictinuscontractors.co.uk/services/plastering',
    },
    breadcrumb: 'Plastering',
    hero: {
      heading: 'Plastering Services Across London',
      subheading:
        'Smooth plastering and surface preparation work for homes, flats, rental properties and refurbishment projects, completed with care and clean workmanship.',
      trustLine:
        '9.97/10 Checkatrade · 33 verified reviews · Fully insured · Free estimates',
    },
    intro: {
      heading: 'Smooth surfaces for a cleaner final finish',
      body:
        'Good plastering creates the foundation for better decorating, cleaner walls and longer-lasting results. Ictinus Contractors helps London homeowners, landlords and businesses prepare and improve interior surfaces with organised plastering work and clear communication.',
    },
    helpItems: [
      'Wall plastering',
      'Ceiling plastering',
      'Skimming',
      'Surface preparation',
      'Patch repairs',
      'Crack repairs',
      'Making good after repairs or installations',
      'Plastering before decorating',
      'Refurbishment plastering support',
      'Rental property surface repairs',
    ],
    process: [
      {
        title: 'Review the surfaces',
        text: 'We check the condition of the walls or ceilings and understand what preparation is needed.',
      },
      {
        title: 'Prepare the area',
        text: 'The space is protected and surfaces are prepared before plastering or repair work begins.',
      },
      {
        title: 'Complete the plastering',
        text: 'Plastering, skimming or repair work is completed carefully to create a smoother finish.',
      },
      {
        title: 'Ready for decorating',
        text: 'We aim to leave the surface clean, practical and ready for the next stage of work.',
      },
    ],
    reasons: [
      'Verified Checkatrade reviews',
      'Careful surface preparation',
      'Clean, organised work',
      'Reliable finishing support',
    ],
    relatedProjectKeys: ['plastering', 'painting', 'refurb'],
    relatedServices: [
      { label: 'Painting & Decorating', href: '/services/painting-and-decorating' },
      { label: 'Property Refurbishment & Extensions', href: '/services/property-refurbishment-extensions' },
      { label: 'Bathroom Fitting', href: '/services/bathroom-fitting' },
      { label: 'Finishing Carpentry', href: '/services/finishing-carpentry' },
    ],
    review: {
      quote:
        'Very professional from start to finish. Clear communication, tidy work and a high-quality finish.',
      label: 'Verified Checkatrade review',
    },
    finalCta: {
      heading: 'Need plastering work in London?',
      text:
        'Send us a few details about the surfaces that need attention. Photos help us understand the condition and guide you through the next step.',
    },
  },
  finishingCarpentry: {
    seo: {
      title: 'Finishing Carpentry London | Ictinus Contractors',
      description:
        'Finishing carpentry services across London for homes, flats, rental properties and refurbishment projects. Skirting, architraves, doors and clean finishing details.',
      canonical: 'https://ictinuscontractors.co.uk/services/finishing-carpentry',
    },
    breadcrumb: 'Finishing Carpentry',
    hero: {
      heading: 'Finishing Carpentry Services Across London',
      subheading:
        'Skirting, architraves, doors and detailed finishing carpentry for homes, flats, rental properties and refurbishment projects.',
      trustLine:
        '9.97/10 Checkatrade · 33 verified reviews · Fully insured · Free estimates',
    },
    intro: {
      heading: 'The finishing details that complete a space',
      body:
        'Good finishing carpentry helps a room feel complete, clean and properly put together. Ictinus Contractors supports London homeowners, landlords and businesses with practical carpentry details as part of refurbishment, decorating and property improvement work.',
    },
    helpItems: [
      'Skirting board fitting',
      'Architrave fitting',
      'Internal doors',
      'Door frames and trims',
      'Finishing trims',
      'Minor carpentry repairs',
      'Carpentry before decorating',
      'Carpentry as part of refurbishment work',
      'Rental property finishing repairs',
      'Commercial space finishing details',
    ],
    process: [
      {
        title: 'Review the details',
        text: 'We discuss the carpentry work needed and check how it fits into the wider project.',
      },
      {
        title: 'Prepare and measure',
        text: 'Areas are measured, checked and prepared so the finishing details can be fitted cleanly.',
      },
      {
        title: 'Fit the carpentry',
        text: 'Skirting, architraves, doors or trims are fitted carefully with attention to alignment and finish.',
      },
      {
        title: 'Ready for final finish',
        text: 'We aim to leave the work clean, tidy and ready for painting, decorating or handover.',
      },
    ],
    reasons: [
      'Verified Checkatrade reviews',
      'Careful finishing details',
      'Clean, organised work',
      'Refurbishment support',
    ],
    relatedProjectKeys: ['painting', 'refurb', 'flooring'],
    relatedServices: [
      { label: 'Property Refurbishment & Extensions', href: '/services/property-refurbishment-extensions' },
      { label: 'Painting & Decorating', href: '/services/painting-and-decorating' },
      { label: 'Hard Flooring', href: '/services/hard-flooring' },
      { label: 'Plastering', href: '/services/plastering' },
    ],
    review: {
      quote:
        'Reliable, punctual and easy to work with. The work was completed with care and attention to detail.',
      label: 'Verified Checkatrade review',
    },
    finalCta: {
      heading: 'Need finishing carpentry work in London?',
      text:
        'Send us a few details about the carpentry or finishing work you need. Photos help us understand the space and guide you through the next step.',
    },
  },
  electricalWorks: {
    seo: {
      title: 'Electrical Works London | Ictinus Contractors',
      description:
        'Electrical improvement support across London as part of refurbishment, decorating and property improvement projects. Clear communication, tidy work and reliable coordination.',
      canonical: 'https://ictinuscontractors.co.uk/services/electrical-works',
    },
    breadcrumb: 'Electrical Works',
    hero: {
      heading: 'Electrical Works & Improvement Support Across London',
      subheading:
        'Practical electrical improvement support for homes, flats, rental properties and commercial spaces as part of wider refurbishment and property projects.',
      trustLine:
        '9.97/10 Checkatrade · 33 verified reviews · Fully insured · Free estimates',
    },
    intro: {
      heading: 'Electrical support handled with care and coordination',
      body:
        'Many refurbishment and property improvement projects involve electrical details, from lighting changes to sockets, switches and finishing upgrades. Ictinus Contractors helps coordinate practical electrical improvement support as part of wider works, with clear communication and a tidy approach.',
      note:
        'Regulated electrical work should always be completed by a suitably qualified professional where required.',
    },
    helpItems: [
      'Lighting improvement support',
      'Socket and switch upgrade support',
      'Electrical finishing details',
      'Coordination during refurbishments',
      'Electrical work as part of bathroom or property improvements',
      'Commercial space improvement support',
      'Making good after electrical changes',
      'Decorating and finishing around electrical work',
      'Rental property improvement support',
    ],
    process: [
      {
        title: 'Understand the project',
        text: 'We discuss the property improvement work and identify where electrical support may be needed.',
      },
      {
        title: 'Review the requirements',
        text: 'We check what can be handled as part of the wider project and what may require qualified electrical input.',
      },
      {
        title: 'Coordinate the work',
        text: 'Electrical-related improvements are coordinated carefully with the refurbishment or finishing schedule.',
      },
      {
        title: 'Finish cleanly',
        text: 'We aim to leave surrounding surfaces, decorating and finishing details clean and properly completed.',
      },
    ],
    reasons: [
      'Verified Checkatrade reviews',
      'Careful coordination',
      'Clear communication',
      'Tidy finishing work',
    ],
    relatedProjectKeys: ['refurb', 'painting', 'bath'],
    relatedServices: [
      { label: 'Property Refurbishment & Extensions', href: '/services/property-refurbishment-extensions' },
      { label: 'Bathroom Fitting', href: '/services/bathroom-fitting' },
      { label: 'Painting & Decorating', href: '/services/painting-and-decorating' },
      { label: 'Plumbing', href: '/services/plumbing' },
    ],
    review: {
      quote:
        'Very professional from start to finish. Clear communication, tidy work and a high-quality finish.',
      label: 'Verified Checkatrade review',
    },
    finalCta: {
      heading: 'Need electrical improvement support in London?',
      text:
        'Send us a few details about the property and the work you need. We’ll help you understand the next step and where specialist electrical input may be required.',
    },
  },
  plumbing: {
    seo: {
      title: 'Plumbing Support London | Ictinus Contractors',
      description:
        'Plumbing support across London as part of bathroom fitting, refurbishment and property improvement projects. Clean workmanship, clear communication and reliable coordination.',
      canonical: 'https://ictinuscontractors.co.uk/services/plumbing',
    },
    breadcrumb: 'Plumbing',
    hero: {
      heading: 'Plumbing Support Across London',
      subheading:
        'Practical plumbing support for bathrooms, refurbishments, rental properties and wider property improvement projects.',
      trustLine:
        '9.97/10 Checkatrade · 33 verified reviews · Fully insured · Free estimates',
    },
    intro: {
      heading: 'Plumbing support for smoother property projects',
      body:
        'Bathroom, refurbishment and property improvement projects often involve plumbing details that need to be handled carefully and coordinated properly. Ictinus Contractors provides practical plumbing support as part of wider works, helping projects move smoothly from preparation to final finish.',
      note:
        'Specialist or regulated plumbing work should always be completed by a suitably qualified professional where required.',
    },
    helpItems: [
      'Plumbing support for bathroom fitting',
      'Sink and basin installation support',
      'Tap and fixture replacement support',
      'Shower and bath installation support',
      'Pipework coordination during refurbishments',
      'Making good around plumbing changes',
      'Rental property plumbing improvements',
      'Plumbing support as part of property upgrades',
      'Finishing and decorating around plumbing work',
    ],
    process: [
      {
        title: 'Review the work',
        text: 'We discuss the property improvement project and understand where plumbing support may be needed.',
      },
      {
        title: 'Check requirements',
        text: 'We review what can be handled as part of the wider work and what may require specialist input.',
      },
      {
        title: 'Coordinate the plumbing support',
        text: 'Plumbing-related work is coordinated with bathroom fitting, decorating, flooring or refurbishment stages.',
      },
      {
        title: 'Finish cleanly',
        text: 'We aim to leave surrounding surfaces, fittings and finishing details clean, tidy and ready to use.',
      },
    ],
    reasons: [
      'Verified Checkatrade reviews',
      'Bathroom project support',
      'Clear communication',
      'Tidy finishing work',
    ],
    relatedProjectKeys: ['bath', 'refurb', 'painting'],
    relatedServices: [
      { label: 'Bathroom Fitting', href: '/services/bathroom-fitting' },
      { label: 'Property Refurbishment & Extensions', href: '/services/property-refurbishment-extensions' },
      { label: 'Painting & Decorating', href: '/services/painting-and-decorating' },
      { label: 'Electrical Works', href: '/services/electrical-works' },
    ],
    review: {
      quote:
        'Super professional, easy to communicate with, and the results are beautiful. I would definitely recommend Ictinus.',
      label: 'Verified Checkatrade review',
    },
    finalCta: {
      heading: 'Need plumbing support for a project in London?',
      text:
        'Send us a few details about the property and the work you need. Photos help us understand the current condition and guide you through the next step.',
    },
  },
}

function injectServiceSchema(page) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.hero.heading,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Ictinus Contractors',
      url: 'https://ictinuscontractors.co.uk',
      telephone: '+447586480417',
      areaServed: 'London',
    },
    areaServed: 'London',
    description: page.seo.description,
    url: page.seo.canonical,
  }

  const existing = document.querySelector('#service-page-schema')
  if (existing) existing.remove()
  const el = document.createElement('script')
  el.id = 'service-page-schema'
  el.type = 'application/ld+json'
  el.textContent = JSON.stringify(schema)
  document.head.appendChild(el)
  return () => el.remove()
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#B08D2A]" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

function ServiceHero({ page }) {
  return (
    <header className="relative overflow-hidden bg-[#1C1714] px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-36 lg:px-8">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1800&q=70')] bg-cover bg-center opacity-[0.12]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1C1714]/30 via-[#1C1714]/76 to-[#1C1714]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

      <div className="relative mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2">
          <Link to="/" className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#C9B09A] transition-colors hover:text-[#D4AF37]">
            Home
          </Link>
          <span className="text-[#D4AF37]/45">/</span>
          <Link to="/services" className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#C9B09A] transition-colors hover:text-[#D4AF37]">
            Services
          </Link>
          <span className="text-[#D4AF37]/45">/</span>
          <span className="font-['Plus_Jakarta_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
            {page.breadcrumb}
          </span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div>
            <p className="mb-4 font-['Plus_Jakarta_Sans'] text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#A88636]">
              London decorating contractor
            </p>
            <h1 className="max-w-3xl font-['Cormorant_Garamond'] text-[2.45rem] font-semibold leading-[1.04] text-white sm:text-[3.25rem] lg:text-[4.05rem]">
              {page.hero.heading}
            </h1>
            <p className="mt-5 max-w-2xl font-['Source_Serif_4'] text-[1rem] leading-[1.75] text-[#C4BAB0] sm:text-[1.08rem]">
              {page.hero.subheading}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/contact#quote"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold tracking-wide text-[#1C1714] shadow-[0_6px_18px_rgba(212,175,55,0.24)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                Request a Quote
                <ArrowIcon />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#D4AF37]/40 px-7 py-3.5 font-['Source_Serif_4'] text-[0.95rem] font-semibold tracking-wide text-[#D4AF37] transition-colors duration-200 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10"
              >
                View Recent Work
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-[#D4AF37]/20 bg-[#FAF9F6]/[0.06] p-5 shadow-[0_14px_34px_rgba(0,0,0,0.16)] backdrop-blur-sm">
            <p className="font-['Source_Serif_4'] text-[0.95rem] leading-relaxed text-[#E8DFC9]">
              {page.hero.trustLine}
            </p>
          </aside>
        </div>
      </div>
    </header>
  )
}

function RelatedProjects({ page }) {
  const projects = [PORTFOLIO_FEATURED_PROJECT, ...PORTFOLIO_CARD_PROJECTS].filter((project) =>
    page.relatedProjectKeys.includes(project.key)
  )

  return (
    <section className="bg-[#FAF9F6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="mb-9 max-w-3xl">
            <p className="ict-section-label text-left">Related Work</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold leading-tight text-[#1C1714] sm:text-[2.45rem]">
              Recent decorating and refurbishment examples
            </h2>
          </div>
        </Reveal>

        <StaggerContainer className="grid gap-5 md:grid-cols-3" stagger={0.08}>
          {projects.map((project) => (
            <StaggerItem key={project.key}>
              <Link
                to="/portfolio"
                className="group block h-full overflow-hidden rounded-lg border border-[#D4AF37]/18 bg-[#FDFCF9] shadow-[0_10px_28px_rgba(28,23,20,0.045)] transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/34 hover:shadow-[0_14px_34px_rgba(28,23,20,0.075)]"
              >
                <div className="aspect-[16/11] overflow-hidden bg-[#EEE8DC]">
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-5">
                  <p className="font-['Plus_Jakarta_Sans'] text-[0.66rem] font-semibold uppercase tracking-[0.13em] text-[#A88636]">
                    {project.category}
                  </p>
                  <h3 className="mt-2 font-['Cormorant_Garamond'] text-[1.28rem] font-semibold leading-tight text-[#1C1714] transition-colors duration-200 group-hover:text-[#B08D2A]">
                    {project.title}
                  </h3>
                  <p className="mt-3 font-['Source_Serif_4'] text-[0.9rem] leading-[1.65] text-[#5A5048]">
                    {project.description}
                  </p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

function RelatedServices({ services }) {
  if (!services?.length) return null

  return (
    <section className="bg-[#F5F0E6] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="rounded-lg border border-[#D4AF37]/18 bg-[#FFFEFB] p-5 shadow-[0_10px_26px_rgba(28,23,20,0.04)] sm:p-6">
            <h2 className="font-['Cormorant_Garamond'] text-[1.45rem] font-semibold leading-tight text-[#1C1714]">
              Related services
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {services.map((service) => (
                <Link
                  key={service.href}
                  to={service.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#D4AF37]/24 bg-[#FAF7F0] px-4 py-2 font-['Source_Serif_4'] text-[0.9rem] font-semibold text-[#3D342E] transition-colors duration-200 hover:border-[#D4AF37]/45 hover:text-[#B08D2A]"
                >
                  {service.label}
                  <ArrowIcon />
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ServicePage({ page }) {
  useSEO({
    title: page.seo.title,
    description: page.seo.description,
    canonical: page.seo.canonical,
    ogTitle: page.seo.title,
    ogDescription: page.seo.description,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    return injectServiceSchema(page)
  }, [page])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAF9F6]">
      <Nav />
      <main id="main-content">
        <ServiceHero page={page} />

        <section className="bg-[#EEE8DC] px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <p className="ict-section-label">Service Overview</p>
              <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold leading-tight text-[#1C1714] sm:text-[2.45rem]">
                {page.intro.heading}
              </h2>
              <p className="mt-5 font-['Source_Serif_4'] text-[1rem] leading-[1.75] text-[#4C423A]">
                {page.intro.body}
              </p>
              {page.intro.note && (
                <p className="mx-auto mt-5 max-w-2xl rounded-lg border border-[#D4AF37]/22 bg-[#FFFEFB] px-5 py-4 font-['Source_Serif_4'] text-[0.92rem] leading-relaxed text-[#5A5048] shadow-[0_8px_22px_rgba(28,23,20,0.035)]">
                  {page.intro.note}
                </p>
              )}
            </div>
          </Reveal>
        </section>

        <section className="bg-[#FAF9F6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mb-9 max-w-3xl">
                <p className="ict-section-label text-left">Scope</p>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold leading-tight text-[#1C1714] sm:text-[2.45rem]">
                  What we can help with
                </h2>
              </div>
            </Reveal>
            <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
              {page.helpItems.map((item) => (
                <StaggerItem key={item}>
                  <div className="flex h-full items-start gap-3 rounded-lg border border-[#D4AF37]/18 bg-[#FDFCF9] p-4 shadow-[0_8px_22px_rgba(28,23,20,0.035)]">
                    <CheckIcon />
                    <p className="font-['Source_Serif_4'] text-[0.95rem] leading-snug text-[#3D342E]">{item}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        <section className="bg-[#1C1714] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mb-10 max-w-3xl">
                <p className="font-['Plus_Jakarta_Sans'] text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#A88636]">
                  Method
                </p>
                <h2 className="mt-3 font-['Cormorant_Garamond'] text-3xl font-semibold leading-tight text-white sm:text-[2.45rem]">
                  Our process
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-4 md:grid-cols-4">
              {page.process.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.06}>
                  <article className="h-full rounded-lg border border-[#D4AF37]/18 bg-[#252019] p-5">
                    <div className="mb-5 font-['Cormorant_Garamond'] text-[2.2rem] font-light leading-none text-[#D4AF37]/45">
                      {index + 1}
                    </div>
                    <h3 className="font-['Cormorant_Garamond'] text-[1.28rem] font-semibold leading-tight text-[#FAF9F6]">
                      {step.title}
                    </h3>
                    <p className="mt-3 font-['Source_Serif_4'] text-[0.92rem] leading-[1.65] text-[#B8AFA6]">
                      {step.text}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#F5F0E6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="mb-9 max-w-3xl">
                <p className="ict-section-label text-left">Proof</p>
                <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold leading-tight text-[#1C1714] sm:text-[2.45rem]">
                  Why choose Ictinus
                </h2>
              </div>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {page.reasons.map((reason) => (
                <Reveal key={reason}>
                  <article className="h-full rounded-lg border border-[#D4AF37]/18 bg-[#FFFEFB] p-5 shadow-[0_10px_26px_rgba(28,23,20,0.04)]">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/24 bg-[#D4AF37]/10">
                      <CheckIcon />
                    </div>
                    <h3 className="font-['Cormorant_Garamond'] text-[1.2rem] font-semibold leading-tight text-[#1C1714]">
                      {reason}
                    </h3>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <RelatedProjects page={page} />
        <RelatedServices services={page.relatedServices} />

        <section className="bg-[#EEE8DC] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <div className="rounded-lg border border-[#D4AF37]/20 bg-[#FDFCF9] p-6 shadow-[0_12px_30px_rgba(28,23,20,0.055)] sm:p-8">
                <div className="mb-4 flex justify-center gap-1 text-[#D4AF37]" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <svg key={star} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <h2 className="sr-only">Customer review</h2>
                <blockquote className="font-['Cormorant_Garamond'] text-[1.55rem] font-semibold leading-snug text-[#1C1714] sm:text-[1.9rem]">
                  &ldquo;{page.review.quote}&rdquo;
                </blockquote>
                <p className="mt-4 font-['Plus_Jakarta_Sans'] text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[#A88636]">
                  {page.review.label}
                </p>
                <a
                  href="https://www.checkatrade.com/trades/ictinuscontractors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 font-['Source_Serif_4'] text-[0.95rem] font-semibold text-[#B08D2A] underline decoration-[#D4AF37]/35 underline-offset-4 transition-colors hover:text-[#8B6C2C]"
                >
                  Read all reviews on Checkatrade
                  <ArrowIcon />
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#1C1714] px-4 py-20 sm:px-6 lg:px-8">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <Reveal>
              <h2 className="font-['Cormorant_Garamond'] text-3xl font-semibold leading-tight text-white md:text-4xl">
                {page.finalCta.heading}
              </h2>
              <p className="mx-auto mt-5 max-w-2xl font-['Source_Serif_4'] text-[0.95rem] leading-relaxed text-[#C4BAB0]">
                {page.finalCta.text}
              </p>
              <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/contact#quote"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-gold px-8 py-3.5 font-['Source_Serif_4'] text-[0.9rem] font-semibold tracking-wide text-[#1C1714] shadow-lg transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Request a Quote
                  <ArrowIcon />
                </Link>
                <a
                  href="tel:07586480417"
                  className="inline-flex items-center justify-center rounded-lg border border-[#D4AF37]/40 px-8 py-3.5 font-['Source_Serif_4'] text-[0.9rem] font-semibold tracking-wide text-[#D4AF37] transition-colors duration-200 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10"
                >
                  Call 07586 480417
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export function PaintingAndDecoratingPage() {
  return <ServicePage page={servicePages.paintingAndDecorating} />
}

export function PropertyRefurbishmentExtensionsPage() {
  return <ServicePage page={servicePages.propertyRefurbishmentExtensions} />
}

export function BathroomFittingPage() {
  return <ServicePage page={servicePages.bathroomFitting} />
}

export function HardFlooringPage() {
  return <ServicePage page={servicePages.hardFlooring} />
}

export function PlasteringPage() {
  return <ServicePage page={servicePages.plastering} />
}

export function FinishingCarpentryPage() {
  return <ServicePage page={servicePages.finishingCarpentry} />
}

export function ElectricalWorksPage() {
  return <ServicePage page={servicePages.electricalWorks} />
}

export function PlumbingPage() {
  return <ServicePage page={servicePages.plumbing} />
}
