// [I-01] Pipeline d'optimisation des photos sources avant commit.
// Sources : jusqu'a 8640x5760 / 21 Mo. Sortie : 2800 px cote long max, JPEG q82,
// EXIF nettoye sauf copyright. Astro <Image> genere ensuite les variantes responsives.
import sharp from 'sharp';
import { readdir, mkdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = 'D:/CLAUDE CODE/nathanael-site/assets/_livraison-aout/Photos site';
const DEST = 'D:/CLAUDE CODE/nathanael-site/src/assets/photos';
// Masters 4K, qualite quasi-transparente : Astro re-encode ensuite en WebP q88.
// Une seule etape de perte perceptible au lieu de deux.
const MAX = 3840;
const QUALITE = 92;
const COPYRIGHT = 'Nathanael Charpentier';

const dossiers = [
  ['Mariage', 'mariage'],
  ['Portrait', 'portrait'],
];

let nb = 0;
let poidsAvant = 0;
let poidsApres = 0;
let plusLourde = 0;

for (const [srcNom, destNom] of dossiers) {
  const srcDir = join(SRC, srcNom);
  const destDir = join(DEST, destNom);
  await mkdir(destDir, { recursive: true });

  const fichiers = (await readdir(srcDir)).filter((f) => /\.jpe?g$/i.test(f));
  for (const f of fichiers) {
    const from = join(srcDir, f);
    const to = join(destDir, f);
    poidsAvant += (await stat(from)).size;

    await sharp(from)
      .rotate() // applique l'orientation EXIF avant de la supprimer
      .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: QUALITE, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .withExif({ IFD0: { Copyright: COPYRIGHT, Artist: COPYRIGHT } })
      .toFile(to);

    const taille = (await stat(to)).size;
    poidsApres += taille;
    plusLourde = Math.max(plusLourde, taille);
    nb++;
  }
  console.log(`${destNom} : ${fichiers.length} images`);
}

const mo = (o) => (o / 1024 / 1024).toFixed(1);
console.log(`\n${nb} images | avant ${mo(poidsAvant)} Mo -> apres ${mo(poidsApres)} Mo`);
console.log(`Plus lourde : ${Math.round(plusLourde / 1024)} Ko (cible <= 400 Ko)`);
