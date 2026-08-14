// [T-01] Images de partage 1200x630 — recadrage soigne (attention: on garde le haut du cadre,
// la ou se trouvent les visages sur ces images).
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = 'D:/CLAUDE CODE/nathanael-site/src/assets/photos';
const OUT = 'D:/CLAUDE CODE/nathanael-site/public/partage';
await mkdir(OUT, { recursive: true });

// [source, sortie, position du recadrage]
const lot = [
  ['mariage/profil-halo-lumiere-jardins-coppelia-honfleur-nathanael-charpentier.jpg', 'accueil', 'centre'],
  ['portrait/portrait-art-ame-main-visage-noir-et-blanc-nathanael-charpentier.jpg', 'portrait', 'haut'],
  ['mariage/mariage-plage-la-palmyre-voile-couchant-nathanael-charpentier.jpg', 'mariage', 'centre'],
  ['apropos/nathanael-charpentier-photographe-portraitiste-gien.jpg', 'a-propos', 'haut'],
  ['contact/ecriture-rai-lumiere-nathanael-charpentier.jpg', 'contact', 'centre'],
  ['mariage/houppa-crepuscule-chateau-la-bourdaisiere-montlouis-sur-loire-nathanael-charpentier.jpg', 'val-de-loire', 'centre'],
  ['mariage/mariee-colonnade-lanternes-palais-royal-paris-nathanael-charpentier.jpg', 'paris', 'haut'],
  ['mariage/seance-jour-d-apres-vagues-deauville-nathanael-charpentier.jpg', 'normandie', 'centre'],
  ['portrait/portrait-art-ame-pensive-fond-peint-nathanael-charpentier.jpg', 'orleans', 'haut'],
  ['mariage/baiser-balustrade-palais-royal-paris-nathanael-charpentier.jpg', 'pre-wedding', 'centre'],
  ['apropos/volute-contrebasse-nathanael-charpentier.jpg', 'journal-contrebassiste', 'centre'],
  ['mariage/maries-rochers-mer-domaine-murtoli-corse-nathanael-charpentier.jpg', 'journal-murtoli', 'centre'],
  ['mariage/seance-jour-d-apres-vagues-deauville-nathanael-charpentier.jpg', 'journal-deauville', 'centre'],
];

for (const [src, nom, ancrage] of lot) {
  await sharp(join(SRC, src))
    .resize(1200, 630, {
      fit: 'cover',
      position: ancrage === 'haut' ? sharp.strategy.attention : 'centre' === ancrage ? 'center' : 'center',
    })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(join(OUT, `og-${nom}.jpg`));
  console.log(`og-${nom}.jpg`);
}
