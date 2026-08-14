import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = 'D:/Téléchargements/VIDEO MARIAGE';
const OUT = 'D:/CLAUDE CODE/nathanael-site/assets/_planches-aout/nouvelles.jpg';
const cibles = (await readdir(SRC)).filter((f) => /web-(33|53|58|68)\.jpg$/i.test(f)).sort();

const T = 640, L = 44;
const comp = [];
for (let i = 0; i < cibles.length; i++) {
  const x = (i % 2) * (T + 4);
  const y = Math.floor(i / 2) * (T + L + 4);
  comp.push({ input: await sharp(join(SRC, cibles[i])).resize(T, T, { fit: 'contain', background: { r: 22, g: 22, b: 22 } }).toBuffer(), left: x, top: y });
  comp.push({ input: Buffer.from(`<svg width="${T}" height="${L}"><rect width="100%" height="100%" fill="#181818"/><text x="10" y="30" font-family="Arial" font-size="24" fill="#fff">${cibles[i]}</text></svg>`), left: x, top: y + T });
}
await sharp({ create: { width: 2 * (T + 4), height: Math.ceil(cibles.length / 2) * (T + L + 4), channels: 3, background: { r: 22, g: 22, b: 22 } } })
  .composite(comp).jpeg({ quality: 86 }).toFile(OUT);
console.log(cibles.join('\n'));
