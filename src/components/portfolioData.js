export const PORTFOLIO_GALLERIES = {
  refurb: [
    { src: '/Portfolio/refurb_after_reception.webp', alt: 'Full Property Refurbishment - reception room after', label: 'After' },
    { src: '/Portfolio/refurb_after_bedroom.webp', alt: 'Full Property Refurbishment - bedroom after', label: 'After' },
    { src: '/Portfolio/refurb_after_reception2.webp', alt: 'Full Property Refurbishment - reception corner after', label: 'After' },
    { src: '/Portfolio/refurb_after_landing.webp', alt: 'Full Property Refurbishment - landing after', label: 'After' },
    { src: '/Portfolio/refurb_after_hallway.webp', alt: 'Full Property Refurbishment - hallway after', label: 'After' },
    { src: '/Portfolio/refurb_after_staircase.webp', alt: 'Full Property Refurbishment - staircase after', label: 'After' },
    { src: '/Portfolio/refurb_before_reception.webp', alt: 'Full Property Refurbishment - reception room before', label: 'Before' },
    { src: '/Portfolio/refurb_before_reception2.webp', alt: 'Full Property Refurbishment - reception corner before', label: 'Before' },
    { src: '/Portfolio/refurb_before_landing.webp', alt: 'Full Property Refurbishment - landing before', label: 'Before' },
    { src: '/Portfolio/refurb_before_landing2.webp', alt: 'Full Property Refurbishment - alternate landing before', label: 'Before' },
    { src: '/Portfolio/refurb_before_hallway.webp', alt: 'Full Property Refurbishment - hallway before', label: 'Before' },
    { src: '/Portfolio/refurb_before_bedroom.webp', alt: 'Full Property Refurbishment - bedroom before', label: 'Before' },
  ],
  bath: [
    { src: '/Portfolio/bathroom_renovation_collage_1.jpeg', alt: 'Bathroom Renovation - collage image 1', label: 'Collage' },
    { src: '/Portfolio/bathroom_renovation_collage_2.jpeg', alt: 'Bathroom Renovation - collage image 2', label: 'Collage' },
    { src: '/Portfolio/bathroom_renovation_collage_3.jpeg', alt: 'Bathroom Renovation - collage image 3', label: 'Collage' },
    { src: '/Portfolio/bathroom_renovation_collage_4.jpeg', alt: 'Bathroom Renovation - collage image 4', label: 'Collage' },
  ],
  painting: [
    { src: '/Portfolio/painting_finishing_collage_1.jpeg', alt: 'Painting and Finishing - collage image 1', label: 'Collage' },
    { src: '/Portfolio/painting_finishing_collage_2.jpeg', alt: 'Painting and Finishing - collage image 2', label: 'Collage' },
    { src: '/Portfolio/painting_finishing_collage_3.jpeg', alt: 'Painting and Finishing - collage image 3', label: 'Collage' },
    { src: '/Portfolio/painting_finishing_collage_4.jpeg', alt: 'Painting and Finishing - collage image 4', label: 'Collage' },
    { src: '/Portfolio/painting_finishing_collage_5.jpeg', alt: 'Painting and Finishing - collage image 5', label: 'Collage' },
    { src: '/Portfolio/painting_finishing_collage_6.jpeg', alt: 'Painting and Finishing - collage image 6', label: 'Collage' },
    { src: '/Portfolio/painting_finishing_collage_7.jpeg', alt: 'Painting and Finishing - collage image 7', label: 'Collage' },
    { src: '/Portfolio/painting_finishing_collage_8.jpeg', alt: 'Painting and Finishing - collage image 8', label: 'Collage' },
  ],
  plastering: [
    { src: '/Portfolio/plastering_collage_1.png', alt: 'Plastering and Surface Preparation - collage image 1', label: 'Collage' },
  ],
  flooring: [
    { src: '/Portfolio/flooring_collage_1.png', alt: 'Hard Flooring Installation - collage image 1', label: 'Collage' },
  ],
}

export const PORTFOLIO_FEATURED_PROJECT = {
  key: 'refurb',
  title: 'Full Property Refurbishment',
  category: 'Property Refurbishment',
  location: 'East London',
  tags: 'Refurbishment, Decorating, Flooring',
  description:
    'Complete interior upgrade with modern finishes, careful preparation, and a clean, consistent standard throughout the property.',
  longDescription:
    'A full-house refurbishment delivered across key living spaces, circulation areas, and bedrooms. The scope included preparation, decoration, flooring, and finishing work designed to create a brighter, more cohesive home from top to bottom.',
  image: '/Portfolio/refurb_after_reception.webp',
  hoverImage: '/Portfolio/refurb_before_reception.webp',
  hasGallery: true,
  galleryPreview: ['Reception room', 'Landing and hallway', 'Bedroom and staircase'],
}

export const PORTFOLIO_CARD_PROJECTS = [
  {
    key: 'bath',
    title: 'Bathroom Renovation',
    category: 'Bathroom Fitting',
    location: 'London',
    tags: 'Bathroom Fitting, Plumbing',
    description:
      'Full bathroom installation with tiling, sanitaryware, and high-quality finishing details.',
    image: '/Portfolio/bathroom_renovation_hero.png',
    hoverImage: '/Portfolio/bathroom_renovation_hero_before.png',
    hasGallery: true,
  },
  {
    key: 'painting',
    title: 'Painting and Finishing',
    category: 'Interior Decoration',
    location: 'London',
    tags: 'Painting, Finishing Carpentry',
    description:
      'Careful decorating and finishing details delivered for a polished final result.',
    image: '/Portfolio/painting_finishing_hero.png',
    hoverImage: '/Portfolio/painting_finishing_hero_before.png',
    hasGallery: true,
  },
  {
    key: 'flooring',
    title: 'Hard Flooring Installation',
    category: 'Hard Flooring',
    location: 'London',
    tags: 'Flooring, Finishing',
    description:
      'Precise installation of hard flooring with a clean fit and durable final finish.',
    image: '/Portfolio/flooring_hero.png',
    hoverImage: '/Portfolio/flooring_hero_before.png',
    hasGallery: true,
  },
  {
    key: 'plastering',
    title: 'Plastering and Surface Preparation',
    category: 'Surface Preparation',
    location: 'London',
    tags: 'Plastering, Decorating Prep',
    description:
      'Smooth wall preparation and plastering works completed to a paint-ready standard.',
    image: '/Portfolio/plastering_hero.png',
    hoverImage: '/Portfolio/plastering_hero_before.png',
    hasGallery: true,
  },
]

export const PORTFOLIO_PAGE_PROJECTS = [
  PORTFOLIO_FEATURED_PROJECT,
  ...PORTFOLIO_CARD_PROJECTS,
]
