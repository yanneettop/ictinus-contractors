export const PORTFOLIO_GALLERIES = {
  refurb: [
    { src: '/Portfolio/full-property-refurbishment-before-reception-room.webp', alt: 'Full Property Refurbishment - reception room before refurbishment', label: 'Before' },
    { src: '/Portfolio/full-property-refurbishment-before-kitchen.webp', alt: 'Full Property Refurbishment - kitchen before refurbishment', label: 'Before' },
    { src: '/Portfolio/full-property-refurbishment-before-bedroom.webp', alt: 'Full Property Refurbishment - bedroom before refurbishment', label: 'Before' },
    { src: '/Portfolio/full-property-refurbishment-before-hallway-staircase.webp', alt: 'Full Property Refurbishment - hallway and staircase before refurbishment', label: 'Before' },
    { src: '/Portfolio/full-property-refurbishment-london-reception-room.webp', alt: 'Full Property Refurbishment - London reception room', label: 'After' },
    { src: '/Portfolio/full-property-refurbishment-london-galley-kitchen.webp', alt: 'Full Property Refurbishment - London galley kitchen', label: 'After' },
    { src: '/Portfolio/full-property-refurbishment-london-bedroom.webp', alt: 'Full Property Refurbishment - London bedroom', label: 'After' },
    { src: '/Portfolio/full-property-refurbishment-london-white-bathroom.webp', alt: 'Full Property Refurbishment - London white bathroom', label: 'After' },
    { src: '/Portfolio/full-property-refurbishment-london-staircase.webp', alt: 'Full Property Refurbishment - London staircase', label: 'After' },
    { src: '/Portfolio/full-property-refurbishment-wallpaper-panelling-hallway-detail.webp', alt: 'Full Property Refurbishment - wallpaper and panelling detail', label: 'Detail' },
    { src: '/Portfolio/full-property-refurbishment-navy-radiator-cover-hallway-detail.webp', alt: 'Full Property Refurbishment - bespoke radiator cover detail', label: 'Detail' },
    { src: '/Portfolio/full-property-refurbishment-sage-panelling-child-room-detail.webp', alt: 'Full Property Refurbishment - sage panelling detail', label: 'Detail' },
  ],
  bath: [
    { src: '/Portfolio/bathroom-renovation-london-walk-in-shower.webp', alt: 'Bathroom Renovation - London walk-in shower bathroom', label: 'After' },
    { src: '/Portfolio/bathroom-renovation-london-freestanding-bath.webp', alt: 'Bathroom Renovation - London bathroom with freestanding bath', label: 'After' },
    { src: '/Portfolio/bathroom-renovation-london-green-shower-room.webp', alt: 'Bathroom Renovation - London green tiled shower room', label: 'After' },
    { src: '/Portfolio/bathroom-renovation-london-microcement-wet-room.webp', alt: 'Bathroom Renovation - London microcement wet room', label: 'After' },
  ],
  painting: [
    { src: '/Portfolio/painting-finishing-london-living-room.webp', alt: 'Painting and Finishing - London living room decoration', label: 'After' },
    { src: '/Portfolio/painting-finishing-london-kitchen-dining.webp', alt: 'Painting and Finishing - London kitchen and dining decoration', label: 'After' },
    { src: '/Portfolio/painting-finishing-london-bedroom.webp', alt: 'Painting and Finishing - London bedroom decoration', label: 'After' },
    { src: '/Portfolio/painting-finishing-london-hallway-staircase.webp', alt: 'Painting and Finishing - London hallway and staircase decoration', label: 'After' },
  ],
  plastering: [
    { src: '/Portfolio/plastering-surface-preparation-london-garden-room-after.webp', alt: 'Plastering and Surface Preparation - finished garden room', label: 'After' },
    { src: '/Portfolio/plastering-surface-preparation-london-open-plan-room-after.webp', alt: 'Plastering and Surface Preparation - finished open-plan room', label: 'After' },
    { src: '/Portfolio/plastering-surface-preparation-london-extension-before-after.webp', alt: 'Plastering and Surface Preparation - extension room before and after', label: 'Before / After' },
    { src: '/Portfolio/plastering-surface-preparation-london-hallway-before-after.webp', alt: 'Plastering and Surface Preparation - hallway before and after', label: 'Before / After' },
    { src: '/Portfolio/plastering-surface-preparation-london-window-reveal-before-after.webp', alt: 'Plastering and Surface Preparation - window reveal before and after', label: 'Before / After' },
    { src: '/Portfolio/plastering-surface-preparation-london-ceiling-before-after.webp', alt: 'Plastering and Surface Preparation - ceiling before and after', label: 'Before / After' },
  ],
  flooring: [
    { src: '/Portfolio/hard-flooring-installation-london-open-plan-living-dining.webp', alt: 'Hard Flooring Installation - London open-plan living and dining room', label: 'After' },
    { src: '/Portfolio/hard-flooring-installation-london-herringbone-hallway-kitchen.webp', alt: 'Hard Flooring Installation - herringbone flooring through hallway and kitchen', label: 'After' },
    { src: '/Portfolio/hard-flooring-installation-london-skirting-threshold-detail.webp', alt: 'Hard Flooring Installation - skirting and threshold detail', label: 'Detail' },
    { src: '/Portfolio/hard-flooring-installation-london-dark-home-office.webp', alt: 'Hard Flooring Installation - dark wood floor in London home office', label: 'After' },
  ],
}

export const PORTFOLIO_FEATURED_PROJECT = {
  key: 'refurb',
  title: 'Complete East London Home Refurbishment & Interior Finishing',
  category: 'Property Refurbishment',
  location: 'East London',
  tags: 'Interior Redecoration, Woodwork, Flooring & Finishing',
  description:
    'A full interior refurbishment and redecoration project across living areas, bedrooms, kitchen, bathroom, hallway and staircase. The work focused on careful preparation, premium paint finishes, detailed woodwork and a calm, consistent look throughout the home.',
  longDescription:
    'A full interior refurbishment and redecoration project across living areas, bedrooms, kitchen, bathroom, hallway and staircase. The work focused on careful preparation, premium paint finishes, detailed woodwork and a calm, consistent look throughout the home.',
  image: '/Portfolio/full-property-refurbishment-london-reception-room.webp',
  hoverImage: '/Portfolio/full-property-refurbishment-london-galley-kitchen.webp',
  pillLabel: '8 finished spaces',
  hasGallery: true,
  caseStudyPath: '/portfolio/complete-east-london-home-refurbishment',
  galleryPreview: ['Reception room', 'Kitchen and bathroom', 'Bedroom and finishing details'],
}

export const PORTFOLIO_CARD_PROJECTS = [
  {
    key: 'bath',
    title: 'Bathroom Renovation',
    category: 'Bathroom Fitting',
    location: 'London',
    tags: 'Bathroom Fitting, Plumbing',
    description:
      'A dated bathroom transformed into a clean, practical space with neat tiling, plumbing and finishing details.',
    image: '/Portfolio/bathroom-renovation-london-walk-in-shower.webp',
    hoverImage: '/Portfolio/bathroom-renovation-london-freestanding-bath.webp',
    hasGallery: true,
  },
  {
    key: 'painting',
    title: 'Painting and Finishing',
    category: 'Interior Decoration',
    location: 'London',
    tags: 'Painting, Finishing Carpentry',
    description:
      'Careful preparation, decorating and finishing details produced a cleaner, more polished interior.',
    image: '/Portfolio/painting-finishing-london-living-room.webp',
    hoverImage: '/Portfolio/painting-finishing-london-hallway-staircase.webp',
    hasGallery: true,
  },
  {
    key: 'flooring',
    title: 'Hard Flooring Installation',
    category: 'Hard Flooring',
    location: 'London',
    tags: 'Flooring, Finishing',
    description:
      'Hard flooring installed with tidy edges, a clean fit and a durable finish for everyday use.',
    image: '/Portfolio/hard-flooring-installation-london-open-plan-living-dining.webp',
    hoverImage: '/Portfolio/hard-flooring-installation-london-herringbone-hallway-kitchen.webp',
    hasGallery: true,
  },
  {
    key: 'plastering',
    title: 'Plastering and Surface Preparation',
    category: 'Surface Preparation',
    location: 'London',
    tags: 'Plastering, Decorating Prep',
    description:
      'Walls prepared and plastered to a smooth, paint-ready finish before decoration.',
    image: '/Portfolio/plastering-surface-preparation-london-garden-room-after.webp',
    hoverImage: '/Portfolio/plastering-surface-preparation-london-open-plan-room-after.webp',
    hasGallery: true,
  },
]

export const PORTFOLIO_PAGE_PROJECTS = [
  PORTFOLIO_FEATURED_PROJECT,
  ...PORTFOLIO_CARD_PROJECTS,
]
