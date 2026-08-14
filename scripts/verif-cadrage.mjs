// Simule le recadrage du bandeau (object-fit: cover, object-position: center 35%)
// pour vérifier à l'œil qu'aucun visage n'est coupé.
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const RATIO = 2.14; // bandeau sur un écran 1440 × 900
const L = 560;
const H = Math.round(L / RATIO);
const COL = 3;
const ANCRAGES = { mariage: {2:0.12}, portrait: {2:0.22,3:0.12,5:0.05} };

const listes = {
  mariage: [
    'corse/baiser-renverse-sable-santa-giulia-corse',
    'mariage/details-papeterie-mariage-chateau-champlatreux',
    'mariage/fou-rire-noir-et-blanc-jardins-coppelia-honfleur',
    'mariage/mariee-bassin-palmiers-marrakech',
    'mariage/mariee-sourire-voile-jardin-grand-courtoiseau-loiret',
    'mariage/maries-jeu-d-ombre-couloir',
    'mariage/preparatifs-maquillage-levres',
    'mariage/mariee-couloir-applique-manoir',
    'mariage/portrait-mariee-lumiere-doree-chateau-champlatreux',
    'mariage/preparatifs-chaussures-dior-chateau-champlatreux',
    'mariage/profil-halo-lumiere-jardins-coppelia-honfleur',
    'mariage/voile-parc-chateau-pont-chevron-noir-et-blanc',
  ],
  portrait: [
    'portrait/ludmila-berlinskaya-ordre-des-arts-et-des-lettres-paris',
    'portrait/portrait-art-ame-tenue-blanche-fond-clair',
    'diaporama/diaporama-5-fond-ocre',
    'portrait/portrait-homme-chapeau-melon-studio-gien',
    'portrait/portrait-maelle-menotti-sequins-lumiere-fenetre',
    'portrait/portrait-nicolas-vicquenault-pianiste-jazz',
    'portrait/portrait-nikita-dj-voilage-fenetre',
    'portrait/portrait-profil-penombre',
  ],
};

for (const [nom, liste] of Object.entries(listes)) {
  const vignettes = [];
  for (const [i, chemin] of liste.entries()) {
    const src = `src/assets/photos/${chemin}-nathanael-charpentier.jpg`;
    const { width, height } = await sharp(src).metadata();
    // cover : on remplit la largeur, puis on découpe en hauteur autour de l'ancrage
    const hVisible = Math.round(width / RATIO);
    const dispo = Math.max(0, height - hVisible);
    const top = Math.round(dispo * (ANCRAGES[nom][i] ?? 0.35));
    const buf = await sharp(src)
      .extract({ left: 0, top, width, height: Math.min(hVisible, height) })
      .resize(L, H, { fit: 'cover' })
      .composite([
        {
          input: Buffer.from(
            `<svg width="${L}" height="26"><rect width="${L}" height="26" fill="#000" opacity="0.7"/>` +
              `<text x="6" y="19" font-family="monospace" font-size="16" fill="#fff">${i + 1}</text></svg>`
          ),
          top: H - 26,
          left: 0,
        },
      ])
      .toBuffer();
    vignettes.push({ input: buf, top: Math.floor(i / COL) * H, left: (i % COL) * L });
  }
  const lignes = Math.ceil(liste.length / COL);
  const sortie = `${process.argv[2]}/cadrage-${nom}.jpg`;
  await sharp({ create: { width: COL * L, height: lignes * H, channels: 3, background: '#111' } })
    .composite(vignettes)
    .jpeg({ quality: 80 })
    .toFile(sortie);
  writeFileSync(sortie.replace(/\.jpg$/, '.txt'), liste.map((f, i) => `${i + 1}\t${f}`).join('\n'));
  console.log(`${nom} → ${sortie}`);
}
