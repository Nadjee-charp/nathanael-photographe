import type { ImageMetadata } from 'astro';

/**
 * Registre central des photographies.
 *
 * [I-02] Les noms de fichiers sont ceux livrés par Sam — convention SEO définitive,
 * ne jamais les renommer.
 *
 * [I-03] ✅ Les textes alternatifs viennent de la table officielle de Sam
 * (`Renommage_Photos_Site_Nathanael.md`), reprise littéralement. Seules les images
 * absentes de la table (diaporamas, portraits de Nathanaël, Seychelles hors lot)
 * portent un alt rédigé ici. Régénérer avec `node scripts/generer-alts.mjs`.
 *
 * [I-06] ⛔ Droit à l'image : les alt des personnes nommées dans les fichiers
 * (pianistes, DJ, Miss, musicien) sont volontairement NEUTRES — aucun nom n'est
 * publié tant que les accords ne sont pas confirmés par Nathanaël.
 */

const glob = (m: Record<string, { default: ImageMetadata }>) =>
  Object.fromEntries(
    Object.entries(m).map(([chemin, mod]) => [chemin.split('/').pop()!, mod.default])
  ) as Record<string, ImageMetadata>;

export const MARIAGE = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/mariage/*.jpg', { eager: true })
);
export const PORTRAIT = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/portrait/*.jpg', { eager: true })
);
export const APROPOS = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/apropos/*.jpg', { eager: true })
);
export const CONTACT = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/contact/*.jpg', { eager: true })
);
/** Diaporama de la page Portrait — enchaîné après la vidéo. */
export const DIAPORAMA = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/diaporama/*.jpg', { eager: true })
);
/** Diaporama d'ouverture de la page Mariage. */
export const DIAPORAMA_MARIAGE = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/diaporama-mariage/*.jpg', { eager: true })
);

/* ————— 3ᵉ lot : un dossier par territoire, l'arborescence de Sam est conservée [I-02] ————— */
export const PARIS = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/paris/*.jpg', { eager: true })
);
export const NORMANDIE = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/normandie/*.jpg', { eager: true })
);
export const CORSE = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/corse/*.jpg', { eager: true })
);
export const DESTINATION = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/destination/*.jpg', { eager: true })
);

/* ————— Bandeaux d'ouverture —————
   Ces images sont préparées par `scripts/finaliser-photos.mjs` : chacune est posée
   dans un cadre 3:2 identique, sur un fond tiré d'elle-même. Toutes s'affichent donc
   en entier, à la même taille, sans le moindre rognage. Le préfixe numérique fixe
   l'ordre voulu par Nathanaël ; le reste du nom sert à retrouver le texte alternatif. */
export const HERO_ACCUEIL = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/hero-accueil/*.jpg', { eager: true })
);
export const HERO_MARIAGE = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/hero-mariage/*.jpg', { eager: true })
);
export const HERO_PORTRAIT = glob(
  import.meta.glob<{ default: ImageMetadata }>('../assets/photos/hero-portrait/*.jpg', { eager: true })
);

const TOUT: Record<string, ImageMetadata> = {
  ...MARIAGE, ...PORTRAIT, ...APROPOS, ...CONTACT, ...DIAPORAMA, ...DIAPORAMA_MARIAGE,
  ...PARIS, ...NORMANDIE, ...CORSE, ...DESTINATION,
  ...HERO_ACCUEIL, ...HERO_MARIAGE, ...HERO_PORTRAIT,
};

/** Un bandeau, dans l'ordre des fichiers : `01-…`, `02-…`, etc. */
export function bandeau(images: Record<string, ImageMetadata>) {
  return Object.keys(images)
    .sort()
    .map((f) => ({ img: images[f], alt: alt(f) }));
}

/** Textes alternatifs — clé = nom de fichier sans le suffixe `-nathanael-charpentier.jpg`. */
export const ALT: Record<string, string> = {
  // ————— apropos —————
  'nathanael-charpentier-appareil-sourire': 'Nathanaël Charpentier riant derrière son appareil pendant un mariage',
  'nathanael-charpentier-photographe-portraitiste-gien': 'Nathanaël Charpentier, photographe portraitiste, assis près de colonnes, appareil posé',
  'nathanael-charpentier-salle-concert': 'Nathanaël Charpentier au travail dans une salle de concert',
  'nathanael-charpentier-scene-piano': 'Nathanaël Charpentier photographiant un pianiste sur scène, noir et blanc',
  'portrait-penombre-manifeste': 'Portrait en pénombre, la main contre le menton, regard tourné vers la lumière',
  'volute-contrebasse': 'Volute de contrebasse sur fond noir',

  // ————— contact —————
  'ecriture-rai-lumiere': 'Main écrivant dans un rai de lumière',
  'nathanael-charpentier-atelier': 'Nathanaël Charpentier appuyé contre une porte de bois, appareil à la main',

  // ————— corse —————
  'baie-santa-giulia-pins-parasols-corse': 'La baie de Santa Giulia vue à travers les pins parasols',
  'baiser-lumiere-du-soir-plage-santa-giulia-corse': 'Baiser dans la lumière du soir, plage de Santa Giulia',
  'baiser-pins-parasols-plage-santa-giulia-corse': 'Baiser sous les pins parasols, plage de Santa Giulia',
  'baiser-renverse-plage-noir-et-blanc-santa-giulia-corse': 'Baiser renversé sur la plage, noir et blanc, Corse',
  'baiser-renverse-sable-santa-giulia-corse': 'Le marié renverse la mariée sur le sable, Santa Giulia',
  'ceremonie-plage-vue-invites-noir-et-blanc-santa-giulia-corse': 'La cérémonie sur la plage vue depuis les invités, noir et blanc',
  'detail-mains-robe-dos-nu-noir-et-blanc-santa-giulia-corse': 'Les mains du marié sur la robe dos nu, noir et blanc',
  'detail-table-marque-place-bois-santa-giulia-corse': 'Marque-place en bois gravé sur la table du dîner, Santa Giulia',
  'facades-vieille-ville-porto-vecchio-corse': 'Les façades de la vieille ville de Porto-Vecchio',
  'grande-tablee-paillote-face-mer-santa-giulia-corse': 'La grande tablée sous la paillote face à la mer, Santa Giulia',
  'jeu-de-rubans-invites-plage-santa-giulia-corse': 'Jeu de rubans avec les invités sur le sable, Santa Giulia',
  'marie-au-volant-mini-moke-noir-et-blanc-corse': 'Le marié au volant de la Mini Moke, noir et blanc, Corse',
  'marie-porte-mariee-plage-noir-et-blanc-santa-giulia-corse': 'Le marié porte la mariée sur la plage de Santa Giulia, noir et blanc, Porto-Vecchio, Corse',
  'mariee-sortie-eglise-porto-vecchio-corse': 'La mariée à la sortie de l’église, Porto-Vecchio',
  'maries-etreinte-crepuscule-plage-santa-giulia-corse': 'Étreinte des mariés au crépuscule, plage de Santa Giulia',
  'maries-face-a-face-plage-santa-giulia-corse': 'Les mariés face à face sur la plage, montagnes en fond',
  'maries-joue-contre-joue-noir-et-blanc-santa-giulia-corse': 'Joue contre joue, noir et blanc, plage de Santa Giulia',
  'maries-main-dans-la-main-plage-santa-giulia-corse': 'Les mariés main dans la main sur la plage de Santa Giulia',
  'maries-mains-jointes-noir-et-blanc-santa-giulia-corse': 'Les mains jointes des mariés, noir et blanc, Santa Giulia',
  'maries-maquis-noir-et-blanc-domaine-murtoli-corse': 'Les mariés dans le maquis, noir et blanc, domaine de Murtoli',
  'maries-marchent-plage-noir-et-blanc-santa-giulia-corse': 'Les mariés marchent sur la plage, noir et blanc, Corse',
  'maries-plage-baie-santa-giulia-corse': 'Les mariés seuls face à la baie de Santa Giulia',
  'maries-plage-nuit-tombante-domaine-murtoli-corse': 'Les mariés sur la plage à la nuit tombante, domaine de Murtoli',
  'maries-rochers-ciel-orageux-domaine-murtoli-corse': 'Les mariés sur les rochers sous un ciel orageux, domaine de Murtoli',
  'mini-moke-maries-devant-eglise-porto-vecchio-corse': 'Les mariés dans la Mini Moke devant l’église de Porto-Vecchio',
  'panneau-bienvenue-mariage-santa-giulia-corse': 'Le panneau de bienvenue à l’entrée du mariage, Santa Giulia',
  'plage-santa-giulia-crepuscule-paillote-corse': 'La plage de Santa Giulia au crépuscule, Corse',

  // ————— destination —————
  'applaudissements-invites-noir-et-blanc-marrakech': 'Les invités applaudissent, noir et blanc, Marrakech',
  'architecture-blanche-andalouse-noir-et-blanc': 'Architecture blanche andalouse et ses arcades, noir et blanc',
  'bain-nocturne-piscine-palmiers-marrakech': 'Bain nocturne dans la piscine éclairée, palmiers, Marrakech',
  'baiser-a-travers-le-voile-marrakech': 'Baiser à travers le voile, Marrakech',
  'baiser-maries-a-travers-la-vegetation-seychelles': 'Baiser des mariés aperçu à travers la végétation, Seychelles',
  'baiser-silhouette-barque-crepuscule-ile-maurice': 'Baiser en silhouette près d’une barque au crépuscule, île Maurice',
  'baiser-sous-le-voile-vitrail-bruxelles': 'Baiser sous le voile devant un vitrail, Bruxelles',
  'baiser-voile-envole-entree-marrakech': 'Baiser, le voile s’envole dans l’entrée du palais, Marrakech',
  'cocktail-invites-jardin-palmiers-andalousie': 'Cocktail des invités au jardin sous les palmiers, Andalousie',
  'danse-traditionnelle-sari-soiree-ile-maurice': 'Danse traditionnelle en sari pendant la soirée, île Maurice',
  'danseuse-en-mouvement-piste-nuit-ile-maurice': 'Une danseuse en mouvement sur la piste, île Maurice',
  'demoiselles-honneur-joie-marrakech': 'Les demoiselles d’honneur, éclat de joie, Marrakech',
  'detail-collier-tenue-brodee-noir-et-blanc-ile-maurice': 'Détail du collier sur la tenue brodée, noir et blanc, île Maurice',
  'detail-flou-bouquet-mariee-bruxelles': 'Le bouquet de la mariée en flou, Bruxelles',
  'detail-manche-robe-noir-et-blanc-marrakech': 'On ferme la manche de la robe, noir et blanc, Marrakech',
  'detail-perles-lumiere-bruxelles': 'Détail de perles dans la lumière, Bruxelles',
  'detail-pieds-nus-bijoux-sable-seychelles': 'Pieds nus et bijoux de cheville dans le sable, Seychelles',
  'detail-poignet-chemise-marie-marrakech': 'Détail du poignet de chemise du marié, Marrakech',
  'detail-sari-et-bijoux-ile-maurice': 'Détail du sari et des bijoux de la mariée, île Maurice',
  'diner-brasero-mariee-marrakech': 'La mariée près du brasero pendant le dîner, Marrakech',
  'diner-guirlandes-lumineuses-patio-andalousie': 'Le dîner sous les guirlandes lumineuses du patio, Andalousie',
  'enfant-danse-plongee-noir-et-blanc-ile-maurice': 'Un enfant danse, vue en plongée, noir et blanc, île Maurice',
  'haie-honneur-invites-palmiers-marrakech': 'Haie d’honneur des invités sous les palmiers, Marrakech',
  'maquillage-mariee-detail-oeil-seychelles': 'Détail du maquillage de la mariée, Seychelles',
  'maquillage-mariee-noir-et-blanc-ile-maurice': 'Le maquillage de la mariée, noir et blanc, île Maurice',
  'marie-attente-couloir-damier-bruxelles': 'Le marié seul dans le couloir à damier avant la cérémonie, Bruxelles',
  'marie-chambre-preparatifs-marrakech': 'Le marié dans sa chambre avant la cérémonie, Marrakech',
  'marie-dans-le-miroir-preparatifs-marrakech': 'Le marié dans le miroir pendant les préparatifs, Marrakech',
  'marie-monte-escalier-marrakech': 'Le marié monte l’escalier du palais, Marrakech',
  'mariee-allee-de-palmiers-bassin-marrakech': 'La mariée dans l’allée de palmiers bordant le bassin, Marrakech',
  'mariee-arche-fleurie-plage-seychelles': 'La mariée devant l’arche fleurie sur la plage, Seychelles',
  'mariee-au-piano-a-queue-marrakech': 'La mariée assise au piano à queue, Marrakech',
  'mariee-coiffure-reflet-miroir-rond-andalousie': 'La mariée coiffée, vue dans un miroir rond, Andalousie',
  'mariee-couloir-reflets-marrakech': 'La mariée dans le couloir et ses reflets, Marrakech',
  'mariee-escalier-colimacon-plongee-marrakech': 'La mariée dans l’escalier en colimaçon, vue en plongée, Marrakech',
  'mariee-et-son-pere-avant-la-ceremonie-andalousie': 'La mariée et son père avant la cérémonie, Andalousie',
  'mariee-etreinte-mere-noir-et-blanc-marrakech': 'La mariée dans les bras de sa mère, noir et blanc, Marrakech',
  'mariee-fenetre-bouquet-bruxelles': 'La mariée et son bouquet derrière la fenêtre, Bruxelles',
  'mariee-jeu-de-rubans-invitees-marrakech': 'La mariée au centre du jeu de rubans, Marrakech',
  'mariee-moucharabieh-bouquet-marrakech': 'La mariée derrière un moucharabieh, bouquet blanc, Marrakech',
  'mariee-reflet-cadre-mur-ocre-andalousie': 'La mariée reflétée dans un cadre sur le mur ocre, Andalousie',
  'mariee-robe-de-soiree-grand-salon-marrakech': 'La mariée en robe de soirée dans le grand salon, Marrakech',
  'mariee-robe-de-soiree-piscine-marrakech': 'La mariée en robe de soirée au bord de la piscine, Marrakech',
  'mariee-robe-manches-longues-marrakech': 'La mariée en robe à manches longues, Marrakech',
  'mariee-robe-pailletee-escalier-marrakech': 'La mariée en robe pailletée dans l’escalier, Marrakech',
  'mariee-sari-vert-porte-lumiere-ile-maurice': 'La mariée en sari vert dans l’encadrement de la porte, île Maurice',
  'maries-arcades-jardin-noir-et-blanc-marrakech': 'Les mariés sous les arcades du jardin, noir et blanc, Marrakech',
  'maries-banc-ruines-abbaye-bruxelles': 'Les mariés sur un banc devant les ruines de l’abbaye, Bruxelles',
  'maries-barque-plage-lagon-ile-maurice': 'Les mariés appuyés à une barque au bord du lagon, île Maurice',
  'maries-eglise-traine-bouquet-bruxelles': 'Les mariés assis dans l’église, traîne déployée, Bruxelles',
  'maries-escalier-lumiere-chaude-marrakech': 'Les mariés dans l’escalier, lumière chaude, Marrakech',
  'maries-etreinte-plage-rochers-granit-seychelles': 'Étreinte des mariés sur la plage bordée de rochers de granit, Seychelles',
  'maries-jardin-lampions-finca-andalousie': 'Les mariés dans le jardin sous les lampions, finca andalouse',
  'maries-joue-contre-joue-portrait-andalousie': 'Portrait des mariés joue contre joue, Andalousie',
  'maries-main-sur-la-joue-marrakech': 'La main de la mariée sur la joue du marié, Marrakech',
  'maries-mains-jointes-plage-lagon-ile-maurice': 'Les mariés mains jointes face au lagon, île Maurice',
  'maries-plage-ciel-crepuscule-ile-maurice': 'Les mariés sur la plage sous un ciel de crépuscule, île Maurice',
  'maries-plage-lagon-bateaux-ile-maurice': 'Les mariés sur la plage, bateaux au mouillage, île Maurice',
  'maries-plongee-hall-monumental-bruxelles': 'Les mariés vus en plongée dans un hall monumental, Bruxelles',
  'maries-route-champs-de-canne-a-sucre-ile-maurice': 'Les mariés sur la route entre les champs de canne à sucre, île Maurice',
  'maries-voiture-reflets-noir-et-blanc-marrakech': 'Les mariés dans la voiture, jeux de reflets, noir et blanc',
  'piscine-invites-finca-andalousie': 'Les invités dans la piscine de la finca, Andalousie',
  'portrait-marie-sherwani-penombre-ile-maurice': 'Portrait du marié en sherwani dans la pénombre, île Maurice',
  'portrait-mariee-yeux-fermes-ile-maurice': 'Portrait de la mariée, yeux fermés, île Maurice',
  'premiere-danse-piste-etoilee-andalousie': 'Première danse sur la piste étoilée, Andalousie',
  'preparatifs-mariee-noir-et-blanc-ile-maurice': 'Les préparatifs de la mariée, noir et blanc, île Maurice',
  'profil-mariee-bijou-de-tete-noir-et-blanc-marrakech': 'Profil de la mariée et son bijou de tête, noir et blanc, Marrakech',
  'profil-mariee-maquillage-marrakech': 'Profil de la mariée pendant le maquillage, Marrakech',
  'reflet-mariee-miroir-rouge-a-levres-andalousie': 'La mariée se maquille les lèvres, reflet dans le miroir, Andalousie',
  'robe-de-mariee-suspendue-voute-marrakech': 'La robe suspendue sous la voûte, matin du mariage, Marrakech',
  'robe-orange-ecume-tronc-plage-seychelles': 'Robe orange dans l’écume sous un tronc échoué, Seychelles',
  'ronde-invites-piste-de-danse-plongee-bruxelles': 'Ronde des invités sur la piste de danse, vue en plongée, Bruxelles',
  'silhouette-escalier-marrakech': 'Silhouette dans l’escalier du palais, Marrakech',
  'soiree-danse-lumieres-rouges-marrakech': 'Danse sous les lumières rouges, fin de soirée, Marrakech',
  'soiree-invites-nuit-ile-maurice': 'Les invités réunis pour la soirée, île Maurice',
  'soiree-lumieres-bleues-invites-marrakech': 'Les invités bras levés sous les lumières bleues, Marrakech',
  'sortie-arcades-roses-invites-marrakech': 'Sortie sous les arcades roses au milieu des invités, Marrakech',
  'vue-aerienne-maries-plage-rochers-granit-seychelles': 'Vue aérienne des mariés sur la plage entre les rochers de granit, Seychelles',
  'vue-palmeraie-atlas-depuis-terrasse-marrakech': 'La palmeraie et l’Atlas vus depuis la terrasse, Marrakech',

  // ————— diaporama —————
  'diaporama-5-fond-ocre': 'Portrait sur fond ocre, épaule dénudée, main contre le cou',

  // ————— diaporama-mariage —————


  // ————— mariage —————
  'baiser-balustrade-noir-et-blanc-palais-royal-paris': 'Baiser à la balustrade, noir et blanc, Palais-Royal, Paris',
  'baiser-balustrade-palais-royal-paris': 'Baiser à la balustrade des arcades, Palais-Royal, Paris',
  'baiser-cou-tatouage-noir-et-blanc-mariage-loiret': 'Baiser dans le cou, tatouage à l’épaule, noir et blanc, mariage dans le Loiret',
  'baiser-coucher-de-soleil-parc-chateau-champlatreux': 'Baiser au coucher du soleil dans le parc, voile étendu sur l’herbe, château de Champlâtreux',
  'baiser-mains-visage-jardins-coppelia-honfleur': 'Baiser, les mains sur le visage du marié, jardins de Coppélia',
  'baiser-pavillon-colbert-louvre-paris': 'Baiser devant le pavillon Colbert du Louvre, noir et blanc, Paris',
  'baiser-renverse-parc-lumiere-doree-chateau-champlatreux': 'Baiser renversé dans le parc au soleil couchant, château de Champlâtreux',
  'baiser-renverse-piste-verriere-chateau-pont-chevron': 'Baiser renversé sur la piste de danse sous la verrière, château de Pont-Chevron',
  'baiser-reverbere-pont-alexandre-iii-paris': 'Baiser au pied du réverbère, pont Alexandre III, Paris',
  'baiser-salon-boiseries-noir-et-blanc-chateau-champlatreux': 'Baiser des mariés dans le salon aux boiseries et portraits anciens, noir et blanc, château de Champlâtreux',
  'ceremonie-applaudissements-chateau-saint-martin-du-tertre': 'Applaudissements pendant la cérémonie, château de Saint-Martin-du-Tertre',
  'ceremonie-houppa-parc-chateau-baronville-beville-le-comte': 'Cérémonie sous la houppa dans le parc du château de Baronville, Béville-le-Comte, Eure-et-Loir',
  'cocktail-meule-de-fromage-reflet-chateau-champlatreux': 'Service dans la meule de grana padano pendant le cocktail, la façade du château de Champlâtreux reflétée dans le bol',
  'complicite-pere-mariee-jardins-coppelia-honfleur': 'Tope-là entre la mariée et son père, noir et blanc, jardins de Coppélia',
  'cortege-demoiselles-d-honneur-portes-anciennes-chateau-pont-chevron': 'Le cortège des demoiselles d’honneur et la mariée devant les portes anciennes, château de Pont-Chevron, Ouzouer-sur-Trézée',
  'couple-arcades-louvre-paris': 'Le couple sous les arcades du Louvre, lumière dorée, Paris',
  'couple-banc-jardin-paris': 'Le couple sur un banc de jardin parisien, noir et blanc',
  'couple-pont-alexandre-iii-grand-palais-paris': 'Baiser sur le pont Alexandre III, dôme du Grand Palais, Paris, noir et blanc',
  'danse-tendre-chateau-pont-chevron-ouzouer-sur-trezee': 'Danse tendre pendant la soirée, château de Pont-Chevron, Ouzouer-sur-Trézée',
  'demoiselles-d-honneur-vestibule-damier-chateau-champlatreux': 'Les demoiselles d’honneur en rose et les mariés dans le vestibule au sol en damier, château de Champlâtreux',
  'detail-bouquet-mains-maries-chateau-champlatreux': 'Détail du bouquet d’hortensias et des mains des mariés, château de Champlâtreux',
  'detail-main-epaule-jardins-coppelia-honfleur': 'La main posée sur l’épaule nue, jardins de Coppélia',
  'detail-mains-robe-jardins-coppelia-honfleur': 'Détail des mains sur la robe, noir et blanc, jardins de Coppélia',
  'details-papeterie-mariage-chateau-champlatreux': 'Version lot 1 déplacée, remplacée par le remaster (même nom)',
  'etreinte-galerie-palais-royal-paris': 'Étreinte dans la galerie claire du Palais-Royal, Paris',
  'etreinte-maries-noir-et-blanc': 'Étreinte des mariés, noir et blanc',
  'etreinte-reflet-miroir-ancien-chateau-champlatreux': 'Étreinte des mariés reflétée dans un miroir ancien, château de Champlâtreux',
  'etreinte-voile-noir-et-blanc-jardins-coppelia-honfleur': 'Étreinte des mariés, noir et blanc, jardins de Coppélia',
  'facade-chateau-champlatreux-maries-fenetre-et-perron': 'La façade du château de Champlâtreux, le marié sur le perron et la mariée à la fenêtre',
  'feu-d-artifice-maries-parc-chateau-champlatreux': 'Les mariés devant le feu d’artifice tiré sur le parc, château de Champlâtreux',
  'front-contre-front-lumiere-doree-chateau-champlatreux': 'Front contre front dans la lumière dorée du soir, château de Champlâtreux',
  'grand-escalier-entree-maries-chateau-saint-martin-du-tertre': 'Entrée des mariés par le double escalier, château de Saint-Martin-du-Tertre, à 30 minutes de Paris',
  'houppa-crepuscule-chateau-la-bourdaisiere-montlouis-sur-loire': 'La houppa au crépuscule, château de la Bourdaisière à Montlouis-sur-Loire',
  'invite-reflets-diner-chateau-saint-martin-du-tertre': 'Visage d’un invité à travers les reflets du dîner, château de Saint-Martin-du-Tertre',
  'lancer-de-bouquet-parc-fontaine-chateau-champlatreux': 'Le lancer de bouquet devant la fontaine du parc, château de Champlâtreux',
  'larme-mariee-mouchoir-salon-chateau-champlatreux': 'La mariée essuie une larme, salon aux rideaux rouges, château de Champlâtreux',
  'larmes-mariee-noir-et-blanc-jardins-coppelia-honfleur': 'Les larmes de la mariée, noir et blanc, jardins de Coppélia',
  'mains-bouquet-noir-et-blanc-high-key-royan': 'Les mains des mariés sur le bouquet, noir et blanc en high key, Royan',
  'marie-porte-fete-jardins-coppelia-honfleur': 'Version pleine résolution (5885 px) déplacée, remplacée par l’export web 2400 px du lot 4 (même image, même nom)',
  'marie-porte-mariee-voile-au-vent-allee-chateau-champlatreux': 'Le marié porte la mariée dans l’allée, voile emporté par le vent, château de Champlâtreux',
  'mariee-a-cheval-parc-fontaine-chateau-champlatreux': 'La mariée à cheval dans le parc, près de la fontaine, château de Champlâtreux',
  'mariee-baiser-mere-marrakech': 'La mariée embrasse sa mère, Marrakech',
  'mariee-bassin-palmiers-marrakech': 'La mariée près du grand bassin bordé de palmiers, Marrakech',
  'mariee-bouquet-profil-rideaux-chateau-champlatreux': 'La mariée de profil, bouquet en main, entre les rideaux du salon, château de Champlâtreux',
  'mariee-chapeau-cape-balustrade-palais-royal-paris': 'La mariée au chapeau, cape déployée sur la balustrade, Palais-Royal, Paris',
  'mariee-chapeau-noir-et-blanc-palais-royal-paris': 'La mariée au chapeau accoudée à la balustrade, noir et blanc, Palais-Royal, Paris',
  'mariee-chaussures-lumiere-rayee-noir-et-blanc-mariage-loiret': 'La mariée attache ses chaussures dans une lumière rayée, noir et blanc, mariage dans le Loiret',
  'mariee-chignon-profil-porte-chateau-champlatreux': 'La mariée de profil, chignon haut, dans l’encadrement d’une porte, château de Champlâtreux',
  'mariee-colonnade-lanternes-palais-royal-paris': 'La mariée sous la colonnade aux lanternes du Palais-Royal, noir et blanc, Paris',
  'mariee-couloir-applique-manoir': 'La mariée dans le couloir du manoir, sous une applique allumée',
  'mariee-dentelle-fenetre-lumiere-matin': 'La mariée en dentelle près de la fenêtre, lumière du matin',
  'mariee-dos-nu-fenetre-parc-chateau-champlatreux': 'La mariée de dos face à la fenêtre ouverte sur le parc, château de Champlâtreux',
  'mariee-dos-voile-grande-fenetre-parc-chateau-champlatreux': 'La mariée de dos sous son voile devant la grande fenêtre ouverte sur le parc, château de Champlâtreux',
  'mariee-escalier-chateau-de-vallery': 'La mariée dans l’escalier du château de Vallery, Yonne',
  'mariee-escalier-pierre-rampe-fer-forge-chateau-champlatreux': 'La mariée dans l’escalier de pierre à la rampe en fer forgé, château de Champlâtreux',
  'mariee-fenetre-tour-eiffel-paris': 'La mariée à la fenêtre face à la tour Eiffel, Paris',
  'mariee-fenetre-traine-chateau-champlatreux': 'Version lot 1 déplacée, remplacée par le remaster (même nom)',
  'mariee-marche-parc-chateau-saint-martin-du-tertre': 'La mariée traverse le parc, noir et blanc, château de Saint-Martin-du-Tertre',
  'mariee-marches-mouvement-chateau-saint-martin-du-tertre': 'La mariée gravit les marches, robe en mouvement, château de Saint-Martin-du-Tertre',
  'mariee-miroir-couloir-chateau-de-vallery': 'La mariée et son reflet dans le miroir du couloir, château de Vallery',
  'mariee-profil-galerie-palais-royal-paris': 'La mariée de profil dans la galerie du Palais-Royal, Paris',
  'mariee-pyramide-de-coupes-champagne-chateau-champlatreux': 'La mariée verse le champagne sur la pyramide de coupes, contre-plongée, château de Champlâtreux',
  'mariee-sourire-voile-jardin-grand-courtoiseau-loiret': 'Sourire de la mariée sous le voile, jardins du Grand Courtoiseau, Loiret',
  'mariee-sous-le-voile-dentelle-chateau-champlatreux': 'La mariée sous son voile de dentelle, la main à la bague, château de Champlâtreux',
  'mariee-traine-grand-salon-parquet-chateau-champlatreux': 'La mariée et sa traîne dans le grand salon, le marié à la fenêtre, château de Champlâtreux',
  'mariee-voile-dentelle-contre-jour-chateau-champlatreux': 'Portrait de la mariée en voile de dentelle, contre-jour à la fenêtre, château de Champlâtreux',
  'mariee-voile-fenetre-preparatifs-chateauneuf-sur-loire': 'La mariée sous son voile à la fenêtre pendant les préparatifs, Châteauneuf-sur-Loire',
  'mariee-voile-lumiere-chaude-chateau-de-vallery': 'La mariée sous son voile dans la lumière chaude, château de Vallery',
  'maries-baiser-devant-facade-chateau-champlatreux': 'Baiser des mariés devant la façade du château de Champlâtreux',
  'maries-caserne-sapeurs-pompiers-de-paris-camion-voile': 'Les mariés devant le camion de la caserne des sapeurs-pompiers de Paris, long voile déployé',
  'maries-colonnade-pont-bir-hakeim-paris': 'Les mariés au cœur de la colonnade du pont Bir-Hakeim, Paris',
  'maries-crepuscule-parc-voile-chateau-champlatreux': 'Les mariés s’éloignent au crépuscule dans le parc, voile déployé, château de Champlâtreux',
  'maries-embrasure-fenetre-sol-damier-chateau-champlatreux': 'Les mariés dans l’embrasure d’une fenêtre, sol en damier, château de Champlâtreux',
  'maries-fenetre-facade-chateau-saint-martin-du-tertre': 'Les mariés à la fenêtre de la façade, château de Saint-Martin-du-Tertre, Val-d’Oise',
  'maries-front-contre-front-bouquet-chateau-champlatreux': 'Les mariés front contre front, bouquet à l’épaule, château de Champlâtreux',
  'maries-front-contre-front-chateau-saint-martin-du-tertre': 'Front contre front, noir et blanc, château de Saint-Martin-du-Tertre',
  'maries-grand-escalier-chateau-de-la-fontaine-griselles': 'La mariée dans le grand escalier et le marié à la fenêtre, château de la Fontaine à Griselles, Loiret',
  'maries-jardin-a-la-francaise-noir-et-blanc-chateau-pont-chevron': 'Les mariés dans le jardin à la française, noir et blanc, château de Pont-Chevron',
  'maries-jeu-d-ombre-couloir': 'Les mariés dans un jeu d’ombre et de lumière',
  'maries-lumiere-de-lampe-robe-dentelle': 'Les mariés dans la lumière chaude d’une lampe, robe en dentelle à col montant',
  'maries-mains-liees-contre-plongee-escalier-chateau-champlatreux': 'Les mariés main dans la main vus en contre-plongée dans l’escalier, château de Champlâtreux',
  'maries-nef-eglise-sainte-jeanne-d-arc-gien-noir-et-blanc': 'Les mariés remontent la nef de l’église Sainte-Jeanne-d’Arc de Gien, traîne et voile déployés, noir et blanc',
  'maries-parc-bras-leve-joie-chateau-champlatreux': 'Les mariés traversent le parc, bras levé de joie, château de Champlâtreux',
  'maries-pont-bir-hakeim-tour-eiffel-paris': 'Les mariés sous le pont Bir-Hakeim face à la tour Eiffel, Paris',
  'maries-promenade-pont-bir-hakeim-paris': 'Les mariés s’éloignent sous le pont Bir-Hakeim, Paris',
  'maries-rochers-ciel-orage-plage-ramatuelle-saint-tropez': 'Les mariés sur les rochers face à la mer sous un ciel d’orage, plage de Ramatuelle près de Saint-Tropez',
  'maries-rochers-mer-domaine-murtoli-corse': 'Les mariés sur les rochers face à la mer, domaine de Murtoli, Corse',
  'maries-tour-eiffel-colonnade-bir-hakeim-paris': 'Les mariés face à la tour Eiffel entre les colonnes de Bir-Hakeim, Paris',
  'portrait-mariee-lumiere-doree-chateau-champlatreux': 'Version lot 1 déplacée, remplacée par le remaster (même nom) ; le remaster existe aussi en noir et blanc sous `portrait-mariee-dos-noir-et-blanc-chateau-champlatreux`',
  'premiere-danse-chateau-la-bourdaisiere': 'Première danse des mariés, château de la Bourdaisière',
  'preparatifs-balcon-tour-eiffel-paris': 'Sur le balcon face à la tour Eiffel avant la cérémonie, Paris, noir et blanc',
  'preparatifs-chaussures-dior-chateau-champlatreux': 'Escarpins Dior de la mariée pendant les préparatifs, château de Champlâtreux',
  'preparatifs-maquillage-levres-chateau-champlatreux': 'Préparatifs : le trait de crayon sur les lèvres de la mariée, château de Champlâtreux',
  'preparatifs-maquillage-levres': 'Crayon à lèvres posé sur la bouche pendant les préparatifs, profil en lumière douce',
  'preparatifs-maquillage-regard-chateau-champlatreux': 'Préparatifs : le maquillage des yeux, regard de la mariée en gros plan, château de Champlâtreux',
  'preparatifs-mariee-voile-clair-obscur-deauville': 'La mariée sous son voile pendant les préparatifs, clair-obscur, Deauville',
  'preparatifs-mere-ajuste-voile-chateau-pont-chevron-ouzouer-sur-trezee': 'La mère ajuste le voile de la mariée pendant les préparatifs, château de Pont-Chevron, Ouzouer-sur-Trézée',
  'profil-halo-lumiere-jardins-coppelia-honfleur': 'Profil dans un halo de lumière, jardins de Coppélia près de Honfleur',
  'regards-complices-maries-noir-et-blanc-chateau-champlatreux': 'Regards complices des mariés, noir et blanc, château de Champlâtreux',
  'rire-pere-mariee-bouquet-noir-et-blanc-chateau-pont-chevron': 'Le rire du père devant la mariée et son bouquet, noir et blanc, château de Pont-Chevron',
  'rires-maries-jardins-coppelia-honfleur': 'Fou rire des mariés, jardins de Coppélia près de Honfleur',
  'rires-maries-lumiere-doree-parc-chateau-champlatreux': 'Rires des mariés dans la lumière dorée du parc, château de Champlâtreux',
  'robe-mouvement-escalier-chateau-champlatreux': 'Version lot 1 déplacée, remplacée par le remaster (même nom)',
  'seance-engagement-cafe-trouville': 'Séance engagement : le couple attablé derrière la vitrine d’un café de Trouville',
  'seance-jour-d-apres-vagues-deauville': 'Version lot 1 déplacée, remplacée par l’export du lot 4 (même image, même nom)',
  'soiree-baiser-piste-chateau-saint-martin-du-tertre': 'Baiser sur la piste de danse, château de Saint-Martin-du-Tertre, Val-d’Oise',
  'soiree-danse-invites-chateau-de-vallery': 'La mariée portée par les invités pendant la soirée, château de Vallery',
  'soiree-etreinte-piste-jardins-coppelia-honfleur': 'Étreinte sur la piste de danse, jardins de Coppélia',
  'sortie-eglise-petales-reportage-mariage': 'Sortie d’église sous les pétales, noir et blanc',
  'sortie-maries-voile-petales-jardins-coppelia-honfleur': 'Sortie des mariés sous les pétales, long voile, jardins de Coppélia près de Honfleur',
  'tendresse-banc-jardin-paris': 'Tendresse sur le banc, jardin parisien, noir et blanc',
  'voile-parc-chateau-pont-chevron-noir-et-blanc': 'Le voile traverse le parc du château de Pont-Chevron, noir et blanc',
  'voiture-ancienne-port-honfleur-mariage': 'La voiture ancienne des mariés sur le port de Honfleur',

  // ————— normandie —————
  'baiser-mariee-portee-contre-jour-dore-jardins-coppelia-honfleur': 'Baiser, la mariée portée dans le contre-jour doré, jardins de Coppélia près de Honfleur',
  'chaussures-mariee-noir-et-blanc-trouville': 'Les chaussures de la mariée sous la table, noir et blanc',
  'chaussures-mariee-reflet-miroir-noir-et-blanc-trouville': 'Les chaussures de la mariée dans le reflet d’un miroir, noir et blanc',
  'couple-cafe-vitrine-trouville': 'Le couple attablé derrière la vitrine d’un café de Trouville',
  'echange-alliances-mains-noir-et-blanc-trouville': 'L’échange des alliances, mains serrées, noir et blanc',
  'escalier-colimacon-noir-et-blanc-trouville': 'Les mariés dans l’escalier en colimaçon, noir et blanc',
  'escalier-colimacon-plongee-maries-trouville': 'Les mariés vus en plongée dans la cage d’escalier',
  'mains-enlacees-robe-dentelle-noir-et-blanc-trouville': 'Les mains du marié sur la robe de dentelle, noir et blanc',
  'manoir-normand-jardins-coppelia-saint-gatien-des-bois': 'Le manoir normand des Jardins de Coppélia et son parc',
  'mariage-equestre-mariee-debout-sur-chevaux-manege-deauville': 'Mariage équestre : la mariée debout sur deux chevaux blancs dans le manège, Deauville',
  'marie-escalier-journal-preparatifs-trouville': 'Le marié descend l’escalier, journal à la main, pendant les préparatifs',
  'marie-porte-mariee-terrasse-coucher-de-soleil-jardins-coppelia-honfleur': 'Le marié porte la mariée sur la terrasse au coucher du soleil, jardins de Coppélia près de Honfleur',
  'mariee-attache-chaussures-lumiere-fenetre-trouville': 'La mariée attache ses chaussures dans la lumière de la fenêtre',
  'mariee-cadree-rampe-noir-et-blanc-trouville': 'La mariée cadrée entre les barreaux de la rampe, noir et blanc',
  'mariee-rue-street-art-trouville': 'La mariée remonte la rue devant une fresque murale, Trouville',
  'mariee-silhouette-porte-fenetre-hotel-normandy-deauville': 'La mariée en silhouette dans la porte-fenêtre ouverte sur le balcon, Hôtel Barrière Le Normandy, Deauville',
  'mariee-terrasse-haie-lumiere-du-soir-jardins-coppelia-honfleur': 'La mariée longe la haie sur la terrasse, lumière du soir, jardins de Coppélia près de Honfleur',
  'maries-etreinte-port-trouville': 'Étreinte des mariés sur le quai du port de Trouville',
  'maries-fenetre-bouquet-trouville': 'Les mariés face à face devant la fenêtre, bouquet à la main',
  'maries-mur-street-art-trouville': 'Les mariés enlacés devant une fresque murale, Trouville',
  'maries-ouverture-pierre-jardins-coppelia': 'Les mariés dans une ouverture de pierre, jardins de Coppélia',
  'maries-parc-manoir-jardins-coppelia': 'Les mariés traversent le parc du manoir, jardins de Coppélia',
  'maries-quai-bateau-peche-port-trouville': 'Les mariés et leurs invités sur le quai devant un bateau de pêche, Trouville',
  'maries-table-jardin-jardins-coppelia': 'Les mariés attablés au jardin, vus à travers la végétation',
  'portrait-mariee-voilage-preparatifs-trouville': 'Portrait de la mariée près du voilage pendant les préparatifs',
  'vue-port-trouville-depuis-balcon': 'Le port de Trouville vu depuis le balcon, matin du mariage',

  // ————— paris —————
  'couple-banc-devant-ebenisterie-paris': 'Le couple sur un banc devant une ébénisterie parisienne',
  'couple-bouche-de-metro-guimard-paris': 'Le couple devant une bouche de métro Guimard, Paris',
  'couple-colonnade-louvre-paris': 'Le couple face à face sous la colonnade du Louvre, Paris',
  'couple-escalier-colimacon-bleu-paris': 'Le couple dans l’escalier en colimaçon bleu, Paris',
  'couple-front-contre-front-banc-paris': 'Front contre front sur un banc parisien',
  'couple-pavillon-colbert-louvre-noir-et-blanc-paris': 'Le couple devant le pavillon Colbert du Louvre, noir et blanc',
  'couple-rue-deserte-louvre-paris': 'Le couple au milieu de la rue déserte devant le Louvre',
  'invites-pont-peniche-tour-eiffel-paris': 'Les invités sur le pont de la péniche, tour Eiffel en fond',
  'marie-pose-manteau-epaules-mariee-arcades-paris': 'Le marié pose un manteau sur les épaules de la mariée, sous les arcades',
  'mariee-devanture-atelier-photo-noir-et-blanc-paris': 'La mariée passe devant un atelier photo, noir et blanc, Paris',
  'musee-orsay-depuis-la-seine-paris': 'Le musée d’Orsay vu depuis la Seine',
  'musee-orsay-facade-seine-paris': 'La façade du musée d’Orsay depuis la Seine',
  'passage-sous-pont-contre-jour-peniche-paris': 'Passage sous un pont de Seine à contre-jour, depuis la péniche',
  'passerelle-seine-tour-eiffel-paris': 'Une passerelle sur la Seine et la tour Eiffel',
  'pied-tour-eiffel-carrousel-depuis-la-seine-paris': 'Le pied de la tour Eiffel et son carrousel, depuis la Seine',
  'piste-de-danse-peniche-nuit-paris': 'La piste de danse sur la péniche, fin de soirée',
  'pont-peniche-amenage-tour-eiffel-paris': 'Le pont de la péniche aménagé pour la réception, tour Eiffel en fond',
  'rue-parisienne-noir-et-blanc-mariage-paris': 'Rue parisienne en noir et blanc, jour de mariage',
  'tour-eiffel-depuis-la-peniche-paris': 'La tour Eiffel depuis le pont de la péniche',
  'tour-eiffel-depuis-la-seine-paris': 'La tour Eiffel vue depuis la Seine',
  'tour-eiffel-illuminee-nuit-paris': 'La tour Eiffel illuminée dans la nuit',
  'tour-eiffel-nuit-depuis-la-peniche-paris': 'La tour Eiffel de nuit depuis la péniche',
  'tour-eiffel-nuit-lumieres-violettes-seine-paris': 'La tour Eiffel de nuit et ses reflets violets sur la Seine',
  'violonistes-peniche-tour-eiffel-paris': 'Les violonistes jouent sur la péniche face à la tour Eiffel',

  // ————— portrait —————
  'detail-main-bracelets-portrait-art-ame': 'Détail de la main et des bracelets, séance Art & Âme',
  'detail-main-penombre-portrait': 'Détail de la main dans la pénombre, séance portrait',
  'detail-mains-croisees-noir-et-blanc': 'Mains croisées, noir et blanc, séance portrait',
  'kaptan-emrah-pochette-album-ozan-diggers': 'Portrait de musicien réalisé pour une pochette d’album',
  'kaptan-emrah-saz-album-ozan-diggers': 'Musicien et son saz, séance pour un album',
  'kaptan-emrah-silhouette-studio-album': 'Silhouette d’un musicien en studio, séance pour un album',
  'ludmila-berlinskaya-ordre-des-arts-et-des-lettres-paris': 'Pianiste photographiée lors d’une remise de décoration à Paris',
  'ludmila-berlinskaya-scene': 'Sur scène, micro à la main, devant un décor doré',
  'musicien-archet-cercle-lumiere': 'Musicien à l’archet dans un cercle de lumière',
  'portrait-adolescent-piano-noir-et-blanc': 'Portrait d’adolescent au piano, noir et blanc',
  'portrait-armonie-noury-miss-loiret-noir-et-blanc': 'Portrait officiel en studio, noir et blanc',
  'portrait-art-ame-lampe-suspendue': 'Femme assise sous une lampe suspendue, halo de lumière ambrée dans le noir',
  'portrait-art-ame-larme-essuyee': 'Larme essuyée pendant la séance Portrait Art & Âme',
  'portrait-art-ame-lumiere-laterale-studio-gien': 'Portrait Art & Âme : lumière latérale, studio à Gien',
  'portrait-art-ame-main-visage-noir-et-blanc': 'Portrait Art & Âme : main au visage, regard dense, noir et blanc',
  'portrait-art-ame-miroir-rond': 'Portrait au miroir rond, séance Art & Âme',
  'portrait-art-ame-pensive-fond-peint': 'Portrait pensif sur fond peint, séance Art & Âme',
  'portrait-art-ame-regard-leve-noir-et-blanc': 'Portrait Art & Âme : regard tourné vers la lumière, noir et blanc',
  'portrait-art-ame-silhouette-fenetre-lampe': 'Silhouette à la fenêtre près de la lampe, séance Art & Âme',
  'portrait-art-ame-sourire-fond-peint': 'Sourire sur fond peint, séance Portrait Art & Âme',
  'portrait-art-ame-tenue-blanche-fond-clair': 'Portrait en tenue claire assis au sol devant un fond blanc, séance Art & Âme',
  'portrait-cheveux-regard-baisse-noir-et-blanc': 'Regard baissé sous les cheveux, noir et blanc, studio',
  'portrait-freddy-koh-lanta-arcades-palais-royal-paris': 'Freddy, aventurier de Koh-Lanta, sous les arcades du Palais-Royal, Paris',
  'portrait-homme-chapeau-melon-studio-gien': 'Portrait d’homme au chapeau melon et lunettes rondes, studio à Gien',
  'portrait-homme-exterieur-brique-portail': 'Portrait en extérieur, brique et portail vert',
  'portrait-homme-lin-drape-clair': 'Portrait d’homme en lin devant le drapé clair',
  'portrait-jade-allongee-chesterfield-cocktail-studio-gien': 'Jade allongée sur le chesterfield, robe bordeaux et cocktail, studio à Gien',
  'portrait-jade-beret-chesterfield-studio-gien': 'Jade, béret et robe marine sur le chesterfield, studio à Gien',
  'portrait-jade-chesterfield-vinyles-ambiance-studio-gien': 'Jade sur le chesterfield, platine et vinyles, ambiance feutrée du studio à Gien',
  'portrait-jade-fauteuil-cuir-lampe-industrielle-studio-gien': 'Jade dans le fauteuil en cuir sous la lampe industrielle, studio à Gien',
  'portrait-jade-lecture-fenetre-rue-noir-et-blanc-studio-gien': 'Jade lit à la fenêtre ouverte sur la rue, noir et blanc, studio à Gien',
  'portrait-jade-profil-beret-mur-vert-studio-gien': 'Jade de profil, béret clair sur mur vert, studio à Gien',
  'portrait-jade-reflet-miroir-rond-beret-studio-gien': 'Jade, reflet dans le miroir rond, béret et lèvres rouges, studio à Gien',
  'portrait-justine-bourrelier-costume-sombre-studio-gien': 'Portrait en costume sombre sur fauteuil de cuir, studio de Gien',
  'portrait-justine-bourrelier-drape-ivoire-studio-gien': 'Portrait devant un drapé ivoire, studio de Gien',
  'portrait-justine-bourrelier-mains-visage-studio-gien': 'Portrait, mains encadrant le visage, studio de Gien',
  'portrait-justine-bourrelier-robe-studio-gien': 'Portrait en robe brodée à plume, studio de Gien',
  'portrait-ludmila-berlinskaya-pianiste': 'Portrait d’une pianiste à son instrument',
  'portrait-maelle-menotti-art-ame-chesterfield': 'Portrait assis sur un canapé chesterfield, séance Portrait: Art & Âme',
  'portrait-maelle-menotti-noir-et-blanc-scene': 'Portrait en noir et blanc sur une scène',
  'portrait-maelle-menotti-sequins-lumiere-fenetre': 'Portrait en robe à sequins dans la lumière d’une fenêtre',
  'portrait-main-pudeur-noir-et-blanc': 'La main qui se protège : la pudeur d’une séance portrait, noir et blanc',
  'portrait-mariee-dos-noir-et-blanc-chateau-champlatreux': 'Portrait de la mariée de dos sous la lanterne, noir et blanc, château de Champlâtreux',
  'portrait-mariee-lumiere-doree-jardins-coppelia-honfleur': 'Portrait de la mariée dans la lumière dorée, jardins de Coppélia près de Honfleur',
  'portrait-nicolas-vicquenault-pianiste-jazz': 'Portrait d’un pianiste de jazz à son instrument',
  'portrait-nikita-dj-voilage-fenetre': 'Portrait derrière un voilage de fenêtre',
  'portrait-noir-et-blanc-ombre-mur-studio-gien': 'Bras levé et ombre portée sur le mur, noir et blanc, studio à Gien',
  'portrait-noir-et-blanc-regard-epaule-marseille': 'Regard par-dessus l’épaule, noir et blanc, Marseille',
  'portrait-olivia-maquillage-levres-coulisses-noir-et-blanc': 'Olivia, le maquillage des lèvres en coulisses, noir et blanc',
  'portrait-olivia-profil-sourire-coulisses-paris': 'Olivia de profil, sourire en coulisses, Paris',
  'portrait-olivia-regard-clair-obscur-noir-et-blanc': 'Olivia, regard en clair-obscur, noir et blanc',
  'portrait-olivia-robe-blanche-colonne-noir-et-blanc-palais-royal-paris': 'Olivia en robe blanche brodée contre une colonne, noir et blanc, Palais-Royal, Paris',
  'portrait-olivia-robe-blanche-colonnes-palais-royal-paris': 'Olivia en robe blanche brodée entre les colonnes, Palais-Royal, Paris',
  'portrait-olivia-robe-blanche-mouvement-colonnade-palais-royal-paris': 'Olivia fait voler sa robe blanche dans la colonnade du Palais-Royal, Paris',
  'portrait-olivia-robe-rouge-dentelle-grilles-palais-royal-paris': 'Olivia en robe rouge de dentelle devant les grilles dorées du Palais-Royal, Paris',
  'portrait-olivia-robe-rouge-mouvement-galerie-palais-royal-paris': 'Olivia, robe rouge en mouvement dans la galerie du Palais-Royal, Paris',
  'portrait-profil-penombre': 'Profil renversé dans la pénombre',
  'portrait-rire-chesterfield-mur-vert': 'Rire sur le chesterfield, mur vert du studio',
  'portrait-robe-bleue-satin-studio-gien': 'Portrait en robe de satin bleue, studio à Gien',
  'portrait-robe-noire-salon-chateau-de-villette': 'Silhouette en robe noire dans un salon du château de Villette',
  'portrait-tabouret-fond-clair-studio-gien': 'Portrait sur tabouret, fond clair, studio à Gien',
  'robe-blanche-mouvement-escalier-noir-et-blanc': 'Robe blanche en mouvement dans l’escalier, noir et blanc',
};

const cle = (fichier: string) =>
  fichier
    .replace(/-nathanael-charpentier\.jpg$/, '')
    .replace(/\.jpg$/, '')
    // les bandeaux portent un préfixe de rang, qui ne fait pas partie de la clé
    .replace(/^\d+-/, '');

/** Métadonnées d'une image par son nom de fichier. */
export function img(fichier: string): ImageMetadata {
  const meta = TOUT[fichier];
  if (!meta) throw new Error(`Photo introuvable : ${fichier}`);
  return meta;
}

/** Texte alternatif d'une image par son nom de fichier. */
export function alt(fichier: string): string {
  const texte = ALT[cle(fichier)];
  if (!texte) throw new Error(`Texte alternatif manquant : ${fichier}`);
  return texte;
}

/** Raccourci galerie : [{ img, alt }] à partir d'une liste de noms de fichiers. */
export function galerie(fichiers: string[]) {
  return fichiers.map((f) => ({ img: img(f), alt: alt(f) }));
}
