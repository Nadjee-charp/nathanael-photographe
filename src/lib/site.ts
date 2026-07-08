// Constantes de marque et d'entité — source unique pour pages et JSON-LD
export const SITE = {
  url: 'https://nathanaelcharpentier.com',
  nom: 'Nathanaël Charpentier',
  metier: 'Photographe portraitiste',
  marqueDeposee: 'Portrait: Art & Âme',
  studio: 'Studio NathSam',
  studioUrl: 'https://studio-nathsam.com',
  adresse: {
    rue: '1 bis rue Gambetta',
    codePostal: '45500',
    ville: 'Gien',
    region: 'Centre-Val de Loire',
    pays: 'FR',
  },
  telephone: '+33 6 22 66 94 67',
  email: 'contact@nathanaelcharpentier.com',
  instagram: 'https://www.instagram.com/charpentier.nathanael/',
  zone: ['Loiret', 'Val de Loire', 'Sologne', 'Orléans', 'Paris', 'France'],
  // Chiffres citables (GEO) — variables [entre crochets] du rapport à confirmer
  preuves: {
    anneesMetier: 12,
    distinction: 'Portraitiste de France',
    conference: 'La Pudeur de l’Intrus',
    inpi: 'INPI n° 5110026',
  },
} as const;

export type Locale = 'fr' | 'en';

export const NAV = {
  fr: [
    { href: '/portrait/', label: 'Portrait' },
    { href: '/mariage/', label: 'Mariage' },
    { href: '/a-propos/', label: 'À propos' },
    { href: '/contact/', label: 'Contact' },
  ],
  en: [
    { href: '/en/portraits/', label: 'Portraits' },
    { href: '/en/weddings/', label: 'Weddings' },
    { href: '/en/about/', label: 'About' },
    { href: '/en/contact/', label: 'Contact' },
  ],
} as const;
