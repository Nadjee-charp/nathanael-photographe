// Planche de verification : retrouver dans l'archive les photos envoyees dans le chat
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = 'D:/CLAUDE CODE/nathanael-site/assets/_source/mariage';
const CUR = 'D:/CLAUDE CODE/nathanael-site/assets/_livraison-aout/Photos site/Mariage';
const MAEVA = 'D:/CLAUDE CODE/nathanael-site/assets/_source/portrait-maeva';
const OUT = 'D:/CLAUDE CODE/nathanael-site/assets/_planches-aout/verif-candidats.jpg';

const noms = await readdir(SRC);
const trouve = (motif) => noms.find((n) => n.includes(motif));

const lot = [
  [CUR, 'details-papeterie-mariage-chateau-champlatreux-nathanael-charpentier.jpg', 'papeterie velours vert'],
  [SRC, trouve('web-247'), 'web-247 maquillage ?'],
  [SRC, trouve('web-91.'), 'web-91 cedre ?'],
  [SRC, trouve('web-102'), 'web-102 fenetre jaune ?'],
  [SRC, trouve('web-316'), 'web-316 escalier dore ?'],
  [SRC, trouve('web-51.'), 'web-51 salon baroque ?'],
  [SRC, trouve('web-529'), 'web-529 dos miroir ?'],
  [CUR, 'preparatifs-chaussures-dior-chateau-champlatreux-nathanael-charpentier.jpg', 'chaussures Dior'],
  [MAEVA, 'Nath-Maëva-HD-205.jpg', 'Maeva 205 lampe'],
];

const T = 520, L = 44, C = 3;
const comp = [];
let i = 0;
for (const [dossier, fichier, etiquette] of lot) {
  if (!fichier) { i++; continue; }
  const dir = await readdir(dossier);
  const vrai = dir.find((n) => n.normalize('NFC') === fichier.normalize('NFC')) ?? fichier;
  const x = (i % C) * (T + 4);
  const y = Math.floor(i / C) * (T + L + 4);
  try {
    const v = await sharp(join(dossier, vrai)).resize(T, T, { fit: 'contain', background: { r: 22, g: 22, b: 22 } }).toBuffer();
    comp.push({ input: v, left: x, top: y });
    comp.push({
      input: Buffer.from(`<svg width="${T}" height="${L}"><rect width="100%" height="100%" fill="#181818"/><text x="8" y="29" font-family="Arial" font-size="21" fill="#fff">#${i + 1} ${etiquette}</text></svg>`),
      left: x, top: y + T,
    });
  } catch (e) { console.error('ECHEC', fichier, e.message); }
  i++;
}

await mkdir('D:/CLAUDE CODE/nathanael-site/assets/_planches-aout', { recursive: true });
await sharp({ create: { width: C * (T + 4), height: Math.ceil(lot.length / C) * (T + L + 4), channels: 3, background: { r: 22, g: 22, b: 22 } } })
  .composite(comp).jpeg({ quality: 84 }).toFile(OUT);
console.log(OUT);
