// Lot 3 : photos du diaporama mariage, portraits de Nathanaël, correction des noms
// de diaporama 4 et 5 (contenus inversés lors du premier passage).
import sharp from 'sharp';
import { readdir, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const DEST = 'D:/CLAUDE CODE/nathanael-site/src/assets/photos';
const DL = 'D:/Téléchargements';
const SRC = 'D:/CLAUDE CODE/nathanael-site/assets/_source';
const COPYRIGHT = 'Nathanael Charpentier';

const lot = [
  // ——— diaporama d'ouverture de la page Mariage ———
  [DL, 'Nath-bestofwedding-web-70.jpg', 'diaporama-mariage', 'mariage-3-premiere-danse-salon-nathanael-charpentier.jpg'],
  [DL, 'Nath-bestofwedding-web-55.jpg', 'diaporama-mariage', 'mariage-6-portee-devant-chateau-nathanael-charpentier.jpg'],
  [DL, 'Nath-bestofwedding-web-63.jpg', 'diaporama-mariage', 'mariage-7-lancer-bouquet-fontaine-nathanael-charpentier.jpg'],
  [DL, 'Nath-bestofwedding-web-66.jpg', 'diaporama-mariage', 'mariage-8-couchant-voile-parc-nathanael-charpentier.jpg'],

  // ——— portraits de Nathanaël ———
  [SRC + '/identite', 'Nath--14.jpg', 'apropos', 'nathanael-charpentier-scene-piano-nathanael-charpentier.jpg'],
  [SRC + '/identite', 'Nath--1.jpg', 'apropos', 'nathanael-charpentier-salle-concert-nathanael-charpentier.jpg'],
  [SRC + '/identite', 'NathanaelCharpentier-15.jpg', 'apropos', 'nathanael-charpentier-fleur-nathanael-charpentier.jpg'],
  [DL, 'Nath--9.jpg', 'apropos', 'nathanael-charpentier-appareil-sourire-nathanael-charpentier.jpg'],
  [DL, 'NathSam-portraits-web-19.jpg', 'contact', 'nathanael-charpentier-atelier-nathanael-charpentier.jpg'],
];

for (const [dossier, fichier, destDir, destNom] of lot) {
  const dir = await readdir(dossier);
  const vrai = dir.find((n) => n.normalize('NFC') === fichier.normalize('NFC'));
  if (!vrai) { console.error('ABSENT : ' + fichier); continue; }
  await mkdir(join(DEST, destDir), { recursive: true });
  await sharp(join(dossier, vrai))
    .rotate()
    .resize({ width: 3840, height: 3840, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .withExif({ IFD0: { Copyright: COPYRIGHT, Artist: COPYRIGHT } })
    .toFile(join(DEST, destDir, destNom));
  console.log(`${destDir}/${destNom}`);
}

// ——— diaporama Portrait : noms 4 et 5 remis en accord avec le contenu ———
const D = join(DEST, 'diaporama');
const renommages = [
  ['diaporama-4-fond-ocre-nathanael-charpentier.jpg', 'diaporama-4-oeuvre-dessinee-fusain-nathanael-charpentier.jpg'],
  ['diaporama-5-oeuvre-dessinee-fusain-nathanael-charpentier.jpg', 'diaporama-5-fond-ocre-nathanael-charpentier.jpg'],
];
const presents = await readdir(D);
for (const [avant, apres] of renommages) {
  if (!presents.includes(avant)) { console.log(`(deja renomme) ${apres}`); continue; }
  // passage par un nom temporaire : les deux fichiers s'echangent
  await sharp(join(D, avant)).toFile(join(D, 'tmp-' + apres));
}
for (const [avant, apres] of renommages) {
  if (!presents.includes(avant)) continue;
  await rm(join(D, avant));
}
for (const [, apres] of renommages) {
  const tmp = join(D, 'tmp-' + apres);
  try { await sharp(tmp).toFile(join(D, apres)); await rm(tmp); console.log('renomme -> ' + apres); } catch {}
}
