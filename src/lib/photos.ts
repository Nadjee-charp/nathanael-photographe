import type { ImageMetadata } from 'astro';

/**
 * Registre central des photographies.
 *
 * [I-02] Les noms de fichiers sont ceux livrés par Sam — convention SEO définitive,
 * ne jamais les renommer.
 *
 * [I-03] ⚠️ La table officielle `Renommage_Photos_Site_Nathanael.md` (102 textes alt
 * à reprendre littéralement) N'A PAS été fournie dans le dossier reçu. Les alt
 * ci-dessous sont dérivés des noms de fichiers et du contenu visuel, dans l'esprit
 * demandé (descriptif, < 125 caractères, sans bourrage). À REMPLACER par la table
 * officielle dès réception.
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

const TOUT: Record<string, ImageMetadata> = { ...MARIAGE, ...PORTRAIT, ...APROPOS, ...CONTACT };

/** Textes alternatifs — clé = nom de fichier sans le suffixe `-nathanael-charpentier.jpg`. */
export const ALT: Record<string, string> = {
  // ————— Mariage —————
  'baiser-balustrade-noir-et-blanc-palais-royal-paris': 'Baiser des mariés contre une balustrade sous les arcades du Palais-Royal, noir et blanc',
  'baiser-balustrade-palais-royal-paris': 'Baiser des mariés sur une balustrade dorée sous les arcades du Palais-Royal',
  'baiser-mains-visage-jardins-coppelia-honfleur': 'Baiser des mariés, main posée sur le visage, dans les jardins de Coppélia à Honfleur',
  'baiser-pavillon-colbert-louvre-paris': 'Couple enlacé devant le pavillon Colbert du Louvre entre deux réverbères, noir et blanc',
  'baiser-reverbere-pont-alexandre-iii-paris': 'Mariée assise près d’une fenêtre ouverte sur la tour Eiffel, noir et blanc',
  'ceremonie-applaudissements-chateau-saint-martin-du-tertre': 'Applaudissements des invités pendant la cérémonie au château de Saint-Martin-du-Tertre',
  'ceremonie-houppa-parc-chateau-baronville-beville-le-comte': 'Cérémonie sous la houppa dans le parc du château de Baronville à Béville-le-Comte',
  'complicite-pere-mariee-jardins-coppelia-honfleur': 'Complicité entre un père et sa fille le jour du mariage, jardins de Coppélia à Honfleur',
  'couple-arcades-louvre-paris': 'Couple de mariés sous les arcades du Louvre à Paris',
  'couple-banc-jardin-paris': 'Couple assis sur un banc dans un jardin parisien, noir et blanc',
  'couple-pont-alexandre-iii-grand-palais-paris': 'Mariés sous les colonnes du pont de Bir-Hakeim face à la tour Eiffel, noir et blanc',
  'danse-tendre-chateau-pont-chevron-ouzouer-sur-trezee': 'Danse tendre d’un couple au château du Pont-Chevron à Ouzouer-sur-Trézée',
  'detail-main-epaule-jardins-coppelia-honfleur': 'Main de la mariée posée sur son épaule nue, détail en noir et blanc',
  'detail-mains-robe-jardins-coppelia-honfleur': 'Mains posées sur l’épaule de la mariée pendant une étreinte, noir et blanc',
  'details-papeterie-mariage-chateau-champlatreux': 'Papeterie de mariage posée sur un banc de velours vert, château de Champlâtreux',
  'etreinte-galerie-palais-royal-paris': 'Étreinte des mariés dans la galerie du Palais-Royal, noir et blanc',
  'etreinte-maries-noir-et-blanc': 'Étreinte des mariés dans un champ, yeux fermés, noir et blanc',
  'etreinte-voile-noir-et-blanc-jardins-coppelia-honfleur': 'Étreinte sous le voile pendant la cérémonie, jardins de Coppélia à Honfleur',
  'fou-rire-noir-et-blanc-jardins-coppelia-honfleur': 'Fou rire des mariés, jardins de Coppélia à Honfleur, noir et blanc',
  'grand-escalier-entree-maries-chateau-saint-martin-du-tertre': 'Entrée des mariés par le grand escalier du château de Saint-Martin-du-Tertre',
  'houppa-crepuscule-chateau-la-bourdaisiere-montlouis-sur-loire': 'Cérémonie sous la houppa au crépuscule, château de la Bourdaisière à Montlouis-sur-Loire',
  'invite-reflets-diner-chateau-saint-martin-du-tertre': 'Invité saisi dans les reflets du dîner, château de Saint-Martin-du-Tertre',
  'larmes-mariee-noir-et-blanc-jardins-coppelia-honfleur': 'Larmes de la mariée près d’une fenêtre, jardins de Coppélia à Honfleur, noir et blanc',
  'mariage-plage-la-palmyre-voile-couchant': 'Ronde des invités autour des mariés au soleil couchant, plage de La Palmyre',
  'marie-porte-fete-jardins-coppelia-honfleur': 'Marié porté par les invités sur la piste de danse, jardins de Coppélia à Honfleur',
  'mariee-baiser-mere-marrakech': 'Baiser de la mariée à sa mère, mariage à Marrakech, noir et blanc',
  'mariee-bassin-palmiers-marrakech': 'Mariée au bord d’un bassin bordé de palmiers, mariage à Marrakech',
  'mariee-chapeau-cape-balustrade-palais-royal-paris': 'Mariée au chapeau de paille et cape de soie accoudée à une balustrade du Palais-Royal',
  'mariee-chapeau-noir-et-blanc-palais-royal-paris': 'Mariée au chapeau accoudée à une balustrade du Palais-Royal, noir et blanc',
  'mariee-colonnade-lanternes-palais-royal-paris': 'Mariée seule sous la colonnade et les lanternes du Palais-Royal, noir et blanc',
  'mariee-dentelle-fenetre-lumiere-matin': 'Robe de dentelle près d’une fenêtre dans la lumière du matin',
  'mariee-fenetre-tour-eiffel-paris': 'Mariée à la fenêtre d’un appartement parisien face à la tour Eiffel, noir et blanc',
  'mariee-fenetre-traine-chateau-champlatreux': 'Mariée à la fenêtre, traîne déployée sur le parquet du château de Champlâtreux',
  'mariee-marche-parc-chateau-saint-martin-du-tertre': 'Mariée marchant dans le parc du château de Saint-Martin-du-Tertre, noir et blanc',
  'mariee-profil-galerie-palais-royal-paris': 'Mariée de profil dans la galerie du Palais-Royal à Paris',
  'mariee-sourire-voile-jardin-grand-courtoiseau-loiret': 'Sourire de la mariée sous son voile, jardin du Grand Courtoiseau dans le Loiret',
  'maries-colonnade-pont-bir-hakeim-paris': 'Mariés sous la colonnade du pont de Bir-Hakeim à Paris',
  'maries-fenetre-facade-chateau-saint-martin-du-tertre': 'Mariés encadrés par une fenêtre de la façade du château de Saint-Martin-du-Tertre',
  'maries-front-contre-front-chateau-saint-martin-du-tertre': 'Mariés front contre front au château de Saint-Martin-du-Tertre',
  'maries-jeu-d-ombre-couloir': 'Mariés saisis dans un jeu d’ombre et de lumière au bout d’un couloir',
  'maries-pont-bir-hakeim-tour-eiffel-paris': 'Mariés sur le pont de Bir-Hakeim face à la tour Eiffel, noir et blanc',
  'maries-promenade-pont-bir-hakeim-paris': 'Mariés en promenade sur le pont de Bir-Hakeim à Paris',
  'maries-rochers-mer-domaine-murtoli-corse': 'Mariés sur les rochers face à la mer, domaine de Murtoli en Corse',
  'maries-tour-eiffel-colonnade-bir-hakeim-paris': 'Mariés sous la colonnade de Bir-Hakeim, tour Eiffel en arrière-plan',
  'portrait-mariee-lumiere-doree-chateau-champlatreux': 'Portrait de la mariée dans une lumière dorée au château de Champlâtreux',
  'premiere-danse-chateau-la-bourdaisiere': 'Première danse des mariés au château de la Bourdaisière',
  'preparatifs-balcon-tour-eiffel-paris': 'Préparatifs sur un balcon parisien face à la tour Eiffel, noir et blanc',
  'preparatifs-chaussures-dior-chateau-champlatreux': 'Chaussures de mariée posées avant la cérémonie, château de Champlâtreux',
  'preparatifs-mariee-voile-clair-obscur-deauville': 'Mariée sous son voile en clair-obscur pendant les préparatifs à Deauville',
  'profil-halo-lumiere-jardins-coppelia-honfleur': 'Profil de la mariée détouré par un halo de soleil couchant, jardins de Coppélia à Honfleur',
  'rires-maries-jardins-coppelia-honfleur': 'Rires des mariés face à face, jardins de Coppélia à Honfleur, noir et blanc',
  'robe-mouvement-escalier-chateau-champlatreux': 'Robe en mouvement dans l’escalier du château de Champlâtreux',
  'seance-engagement-cafe-trouville': 'Séance d’engagement vue depuis la rue à travers la vitre d’un café de Trouville',
  'seance-jour-d-apres-vagues-deauville': 'Séance du jour d’après dans les vagues à Deauville, noir et blanc',
  'soiree-baiser-piste-chateau-saint-martin-du-tertre': 'Baiser sur la piste de danse en soirée, château de Saint-Martin-du-Tertre',
  'soiree-etreinte-piste-jardins-coppelia-honfleur': 'Étreinte sur la piste de danse en soirée, jardins de Coppélia à Honfleur',
  'sortie-eglise-petales-reportage-mariage': 'Sortie d’église sous les pétales, baisemain d’un invité aux mariés',
  'sortie-maries-voile-petales-jardins-coppelia-honfleur': 'Sortie des mariés sous les pétales, voile au vent, jardins de Coppélia à Honfleur',
  'tendresse-banc-jardin-paris': 'Couple enlacé sur la balustrade du pont Alexandre-III, réverbères parisiens, noir et blanc',
  'voile-parc-chateau-pont-chevron-noir-et-blanc': 'Voile déployé dans le parc du château du Pont-Chevron, noir et blanc',
  'voiture-ancienne-port-honfleur-mariage': 'Voiture ancienne des mariés sur le port de Honfleur',

  // ————— Portrait —————
  'detail-main-bracelets-portrait-art-ame': 'Détail d’une main et de ses bracelets pendant une séance Portrait: Art & Âme',
  'detail-main-penombre-portrait': 'Détail d’une main dans la pénombre pendant une séance portrait',
  'detail-mains-croisees-noir-et-blanc': 'Mains croisées, détail en noir et blanc',
  'kaptan-emrah-pochette-album-ozan-diggers': 'Portrait de musicien réalisé pour une pochette d’album',
  'kaptan-emrah-saz-album-ozan-diggers': 'Musicien et son saz, séance pour un album',
  'kaptan-emrah-silhouette-studio-album': 'Silhouette d’un musicien en studio, séance pour un album',
  'ludmila-berlinskaya-ordre-des-arts-et-des-lettres-paris': 'Pianiste photographiée lors d’une remise de décoration à Paris',
  'ludmila-berlinskaya-scene': 'Pianiste sur scène pendant un concert',
  'musicien-archet-cercle-lumiere': 'Musicien à l’archet dans un cercle de lumière',
  'portrait-adolescent-piano-noir-et-blanc': 'Portrait d’un adolescent au piano, noir et blanc',
  'portrait-armonie-noury-miss-loiret-noir-et-blanc': 'Portrait officiel en studio, noir et blanc',
  'portrait-art-ame-larme-essuyee': 'Larme essuyée pendant une séance Portrait: Art & Âme',
  'portrait-art-ame-lumiere-laterale-studio-gien': 'Portrait en lumière latérale au studio de Gien, noir et blanc',
  'portrait-art-ame-main-visage-noir-et-blanc': 'Portrait, main posée contre le visage, regard frontal, noir et blanc',
  'portrait-art-ame-miroir-rond': 'Reflet dans un miroir rond pendant une séance Portrait: Art & Âme',
  'portrait-art-ame-pensive-fond-peint': 'Portrait pensif assis devant un fond peint',
  'portrait-art-ame-regard-leve': 'Regard levé vers la lumière pendant une séance Portrait: Art & Âme',
  'portrait-art-ame-regard-leve-noir-et-blanc': 'Regard levé vers la lumière, portrait en noir et blanc',
  'portrait-art-ame-silhouette-fenetre-lampe': 'Silhouette assise devant une fenêtre, lampe allumée dans la pénombre',
  'portrait-art-ame-sourire-fond-peint': 'Sourire retenu, portrait assis devant un fond peint',
  'portrait-cheveux-regard-baisse-noir-et-blanc': 'Cheveux dans la lumière, regard baissé, portrait en noir et blanc',
  'portrait-homme-chapeau-melon-studio-gien': 'Portrait d’homme au chapeau melon et lunettes rondes, studio de Gien',
  'portrait-homme-exterieur-brique-portail': 'Portrait d’homme en extérieur devant un mur de brique et un portail vert',
  'portrait-homme-lin-drape-clair': 'Portrait d’homme en chemise de lin devant un drapé clair',
  'portrait-justine-bourrelier-costume-sombre-studio-gien': 'Portrait en costume sombre sur fauteuil de cuir, studio de Gien',
  'portrait-justine-bourrelier-drape-ivoire-studio-gien': 'Portrait devant un drapé ivoire, studio de Gien',
  'portrait-justine-bourrelier-mains-visage-studio-gien': 'Portrait, mains encadrant le visage, studio de Gien',
  'portrait-ludmila-berlinskaya-pianiste': 'Portrait d’une pianiste à son instrument',
  'portrait-maelle-menotti-art-ame-chesterfield': 'Portrait assis sur un canapé chesterfield, séance Portrait: Art & Âme',
  'portrait-maelle-menotti-noir-et-blanc-scene': 'Portrait en noir et blanc sur une scène',
  'portrait-maelle-menotti-sequins-lumiere-fenetre': 'Portrait en robe à sequins dans la lumière d’une fenêtre',
  'portrait-main-pudeur-noir-et-blanc': 'Main devant le visage, portrait en noir et blanc',
  'portrait-nicolas-vicquenault-pianiste-jazz': 'Portrait d’un pianiste de jazz à son instrument',
  'portrait-nikita-dj-voilage-fenetre': 'Portrait derrière un voilage de fenêtre',
  'portrait-noir-et-blanc-ombre-mur-studio-gien': 'Portrait et son ombre portée sur le mur du studio de Gien',
  'portrait-noir-et-blanc-regard-epaule-marseille': 'Regard par-dessus l’épaule, portrait en noir et blanc à Marseille',
  'portrait-profil-penombre': 'Profil sculpté par la pénombre',
  'portrait-rire-chesterfield-mur-vert': 'Rire franc sur un canapé chesterfield devant un mur vert',
  'portrait-robe-bleue-satin-studio-gien': 'Portrait en robe de satin bleu au studio de Gien',
  'portrait-robe-noire-salon-chateau-de-villette': 'Portrait en robe noire dans le salon du château de Villette',
  'portrait-tabouret-fond-clair-studio-gien': 'Portrait assis sur un tabouret devant un fond clair, studio de Gien',
  'robe-blanche-mouvement-escalier-noir-et-blanc': 'Robe blanche en mouvement dans un escalier, noir et blanc',

  // ————— À propos / Contact —————
  'nathanael-charpentier-photographe-portraitiste-gien': 'Nathanaël Charpentier, photographe portraitiste, assis près de colonnes, appareil posé',
  'volute-contrebasse': 'Volute de contrebasse sur fond noir',
  'ecriture-rai-lumiere': 'Main écrivant dans un rai de lumière',
};

const cle = (fichier: string) => fichier.replace(/-nathanael-charpentier\.jpg$/, '').replace(/\.jpg$/, '');

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
