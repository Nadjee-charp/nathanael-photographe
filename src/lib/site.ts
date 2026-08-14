// Constantes de marque et d'entité — source unique pour pages et JSON-LD
export const SITE = {
  url: 'https://nathanaelcharpentier.com',
  nom: 'Nathanaël Charpentier',
  metier: 'Photographe portraitiste',
  // [M-G5 / 7.7] Pas de symbole ® tant que l'enregistrement INPI n'est pas confirmé accordé
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
  // [T-02] areaServed — étendu au fil des pages territoire
  zone: [
    'Loiret',
    'Val de Loire',
    'Sologne',
    'Orléans',
    'Paris',
    "Val-d'Oise",
    'Normandie',
    'Corse',
    'France',
  ],
  // [M-G2] Bientôt vingt ans de métier · [M-G3] libellés exacts des distinctions
  preuves: {
    anneesMetier: 20,
    anciennete: 'bientôt vingt ans de métier',
    ancienneteEn: 'nearly twenty years',
    distinction: 'Portraitiste de France 2021',
    fpja: 'Family Photojournalist Association — Top 10 mondial 2020 · 3ᵉ européen · 1ᵉʳ français',
    conference: 'La Pudeur de l’Intrus',
    inpi: 'INPI n° 5110026',
    pays: 7,
  },
  // [M-G3 / T-02] award + memberOf du JSON-LD Person
  distinctions: [
    'Portraitiste de France 2021',
    'Family Photojournalist Association — Top 10 mondial 2020, 3e européen, 1er français',
  ],
  affiliations: [
    { nom: 'Collectif Carmin', role: 'Co-fondateur et président' },
    { nom: 'Fearless Photographers' },
    { nom: 'Family Photojournalist Association' },
  ],
  savoirFaire: [
    "portrait d'art",
    'reportage de mariage',
    "photographie d'accouchement",
  ],
} as const;

/**
 * [T-05] Backend du formulaire de contact.
 * GitHub Pages n'exécute pas de PHP : renseigner ici l'endpoint d'un service
 * compatible statique (Formspree, Web3Forms, Netlify Forms…) une fois choisi
 * avec Sam. Tant que `endpoint` vaut null, le formulaire poste vers contact.php
 * (qui fonctionnera sur l'hébergement final) et la démo affiche un avertissement.
 */
export const FORMULAIRE = {
  endpoint: null as string | null,
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
