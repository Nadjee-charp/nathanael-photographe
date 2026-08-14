// Prepare les 5 photos du diaporama de la page Portrait + une planche de controle.
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const DL = 'D:/Téléchargements';
const DEST = 'D:/CLAUDE CODE/nathanael-site/src/assets/photos/diaporama';
const PLANCHE = 'D:/CLAUDE CODE/nathanael-site/assets/_planches-aout/diaporama.jpg';
const COPYRIGHT = 'Nathanael Charpentier';

// ordre d'affichage souhaite = ordre d'envoi
const lot = [
  ['maries-jeu-d-ombre-couloir-nathanael-charpentier.jpg', 'diaporama-1-profil-ombre-nathanael-charpentier.jpg'],
  ['Nathanael-StudioNathSam-48 2.jpg', 'diaporama-2-assise-blanc-nathanael-charpentier.jpg'],
  ['Nath-PortraitArt&Ame-Mélo-best-41.jpg', 'diaporama-3-visage-allonge-noir-et-blanc-nathanael-charpentier.jpg'],
  ['Nathanael-StudioNathSam-38.jpg', 'diaporama-4-fond-ocre-nathanael-charpentier.jpg'],
  ['NathanaelCharpentier.Jade-1.jpg', 'diaporama-5-oeuvre-dessinee-fusain-nathanael-charpentier.jpg'],
];

const reels = new Map((await readdir(DL)).map((n) => [n.normalize('NFC'), n]));
await mkdir(DEST, { recursive: true });

const vignettes = [];
for (const [src, dest] of lot) {
  const vrai = reels.get(src.normalize('NFC')) ?? src;
  const chemin = join(DL, vrai);
  const meta = await sharp(chemin).metadata();
  await sharp(chemin)
    .rotate()
    .resize({ width: 3840, height: 3840, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .withExif({ IFD0: { Copyright: COPYRIGHT, Artist: COPYRIGHT } })
    .toFile(join(DEST, dest));
  console.log(`${dest}  (${meta.width}x${meta.height})`);
  vignettes.push(await sharp(chemin).resize(600, 400, { fit: 'contain', background: { r: 22, g: 22, b: 22 } }).toBuffer());
}

// planche de controle 5 vignettes
const comp = vignettes.map((v, i) => ({ input: v, left: (i % 3) * 604, top: Math.floor(i / 3) * 440 }));
const etq = (i, t) =>
  Buffer.from(`<svg width="600" height="36"><rect width="100%" height="100%" fill="#181818"/><text x="8" y="26" font-family="Arial" font-size="22" fill="#fff">#${i} ${t}</text></svg>`);
lot.forEach(([, d], i) => comp.push({ input: etq(i + 1, d.slice(11, 46)), left: (i % 3) * 604, top: Math.floor(i / 3) * 440 + 400 }));

await sharp({ create: { width: 604 * 3, height: 440 * 2, channels: 3, background: { r: 22, g: 22, b: 22 } } })
  .composite(comp)
  .jpeg({ quality: 85 })
  .toFile(PLANCHE);
console.log('planche : ' + PLANCHE);
