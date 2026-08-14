// Images heritees encore utilisees (portrait de l'auteur, volute, ecriture) — meme pipeline [I-01]
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = 'D:/CLAUDE CODE/nathanael-site/assets/_source';
const DEST = 'D:/CLAUDE CODE/nathanael-site/src/assets/photos';
const COPYRIGHT = 'Nathanael Charpentier';

const lot = [
  ['identite', 'NathSam-portraits-web-14.jpg', 'apropos', 'nathanael-charpentier-photographe-portraitiste-gien.jpg'],
  ['details', 'Nath-détails site-web-13.jpg', 'apropos', 'volute-contrebasse-nathanael-charpentier.jpg'],
  ['details', 'Nath-détails site-73.jpg', 'contact', 'ecriture-rai-lumiere-nathanael-charpentier.jpg'],
];

const reel = new Map();
for (const [dossier] of lot) {
  if (reel.has(dossier)) continue;
  const noms = await readdir(join(SRC, dossier));
  reel.set(dossier, new Map(noms.map((n) => [n.normalize('NFC'), n])));
}

for (const [dossier, fichier, destDir, destNom] of lot) {
  const vrai = reel.get(dossier).get(fichier.normalize('NFC')) ?? fichier;
  await mkdir(join(DEST, destDir), { recursive: true });
  await sharp(join(SRC, dossier, vrai))
    .rotate()
    .resize({ width: 3840, height: 3840, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .withExif({ IFD0: { Copyright: COPYRIGHT, Artist: COPYRIGHT } })
    .toFile(join(DEST, destDir, destNom));
  console.log(`${destDir}/${destNom}`);
}
