export const portfolioItems = [
  {
    id: 1,
    title: 'The Okafor Wedding',
    category: 'Wedding',
    tags: ['Ceremony', 'Reception', 'Candid'],
    description:
      'A full-day wedding coverage at Château Belcourt — 14 hours of emotional, cinematic storytelling from sunrise prep to the last dance.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    year: '2026',
    featured: true,
  },
  {
    id: 2,
    title: 'Solène — Editorial Portrait',
    category: 'Portrait',
    tags: ['Editorial', 'Studio', 'Fashion'],
    description:
      'High-contrast editorial portrait series shot in a controlled studio environment, styled for a Paris-based fashion magazine.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
    year: '2026',
    featured: true,
  },
  {
    id: 3,
    title: 'Neon Pulse — Concert Series',
    category: 'Event',
    tags: ['Low-light', 'Live Music', 'Stage'],
    description:
      'Three-night live music coverage for a sold-out festival, capturing energy and raw emotion in challenging low-light conditions.',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
    year: '2025',
    featured: false,
  },
  {
    id: 4,
    title: 'Ember & Oak — Brand Shoot',
    category: 'Commercial',
    tags: ['Product', 'Lifestyle', 'Branding'],
    description:
      'Full commercial shoot for a lifestyle brand launch — product flats, lifestyle scenes, and environmental portraits for web and print.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    year: '2025',
    featured: true,
  },
  {
    id: 5,
    title: 'Urban Frames — Street Series',
    category: 'Fine Art',
    tags: ['Street', 'Documentary', 'B&W'],
    description:
      'A 30-image black-and-white documentary series exploring identity and space in three cities, exhibited at Gallery Nord.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    year: '2025',
    featured: false,
  },
  {
    id: 6,
    title: 'The Mensah Family',
    category: 'Portrait',
    tags: ['Family', 'Outdoor', 'Golden Hour'],
    description:
      'Golden-hour family portrait session at a private estate — natural, candid moments woven with beautifully lit posed frames.',
    image: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=800&q=80',
    year: '2025',
    featured: false,
  },
];

export const categories = ['All', ...new Set(portfolioItems.map((p) => p.category))];

