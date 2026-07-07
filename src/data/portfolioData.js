export const portfolioItems = [
  {
    id: 1,
    title: 'Brand Identity — Apex Studio',
    category: 'Branding',
    tags: ['Logo', 'Typography', 'Style Guide'],
    description:
      'Full visual identity system including logo suite, colour palette, type scale, and brand guidelines for a creative studio launch.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    year: '2025',
    featured: true,
  },
  {
    id: 2,
    title: 'E-Commerce Redesign — Ember & Oak',
    category: 'Web Design',
    tags: ['UX/UI', 'Shopify', 'Responsive'],
    description:
      'End-to-end UX audit and redesign of a lifestyle e-commerce store, improving conversion rate by 34% in A/B testing.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    year: '2025',
    featured: true,
  },
  {
    id: 3,
    title: 'Social Campaign — Neon Pulse',
    category: 'Social Media',
    tags: ['Motion', 'Instagram', 'Content'],
    description:
      'Six-week social media campaign with motion graphics, Reels templates, and content calendar for a music event brand.',
    image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80',
    year: '2024',
    featured: false,
  },
  {
    id: 4,
    title: 'Mobile App UI — TrackFuel',
    category: 'App Design',
    tags: ['Figma', 'iOS', 'Design System'],
    description:
      'Complete Figma design system and high-fidelity prototype for a fitness tracking iOS application.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    year: '2024',
    featured: true,
  },
  {
    id: 5,
    title: 'Event Branding — Solstice Fest',
    category: 'Branding',
    tags: ['Print', 'Signage', 'Poster'],
    description:
      'Environmental and print collateral for a 3-day outdoor festival — posters, signage, wristbands, and stage backdrops.',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    year: '2024',
    featured: false,
  },
  {
    id: 6,
    title: 'Photography — Urban Frames',
    category: 'Photography',
    tags: ['Street', 'Editorial', 'Print'],
    description:
      'Editorial photography series documenting urban architecture and street life, featured in two print magazines.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    year: '2023',
    featured: false,
  },
];

export const categories = ['All', ...new Set(portfolioItems.map((p) => p.category))];
