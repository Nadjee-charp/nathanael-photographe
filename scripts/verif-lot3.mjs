import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const DL = 'D:/Téléchargements';
const OUT = 'D:/CLAUDE CODE/nathanael-site/assets/_planches-aout/lot3.jpg';
const cibles = [
  'Nath-bestofwedding-web-55.jpg', 'Nath-bestofwedding-web-63.jpg',
  'Nath-bestofwedding-web-66.jpg', 'Nath-bestofwedding-web-70.jpg',
  'Nath--1.jpg', 'Nath--9.jpg', 'Nath--14.jpg', 'NathanaelCharpentier-15.jpg',
  'NathSam-portraits-web-18.jpg', 'NathSam-portraits-web-19.jpg',
];
const reels = new Map((await readdir(DL)).map((n) => [n.normalize('NFC'), n]));

const T = 460, L = 40, C = 5;
const comp = [];
for (let i = 0; i < cibles.length; i++) {
  const vrai = reels.get(cibles[i].normalize('NFC'));
  if (!vrai) { console.error('ABSENT ' + cibles[i]); continue; }
  const x = (i % C) * (T + 4), y = Math.floor(i / C) * (T + L + 4);
  comp.push({ input: await sharp(join(DL, vrai)).resize(T, T, { fit: 'contain', background: { r: 22, g: 22, b: 22 } }).toBuffer(), left: x, top: y });
  comp.push({ input: Buffer.from(`<svg width="${T}" height="${L}"><rect width="100%" height="100%" fill="#181818"/><text x="8" y="27" font-family="Arial" font-size="19" fill="#fff">${cibles[i].replace('.jpg','')}</text></svg>`), left: x, top: y + T });
}
await sharp({ create: { width: C * (T + 4), height: Math.ceil(cibles.length / C) * (T + L + 4), channels: 3, background: { r: 22, g: 22, b: 22 } } })
  .composite(comp).jpeg({ quality: 84 }).toFile(OUT);
console.log(OUT);
