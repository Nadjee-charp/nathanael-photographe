// Planches-contact des 102 photos definitives, pour la selection editoriale
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SRC = 'D:/CLAUDE CODE/nathanael-site/src/assets/photos';
const OUT = 'D:/CLAUDE CODE/nathanael-site/assets/_planches-aout';
const COLS = 4, ROWS = 3, TILE = 460, LABEL = 40;
const CELL_H = TILE + LABEL;
await mkdir(OUT, { recursive: true });
const legende = {};

for (const cat of ['mariage', 'portrait']) {
  const dir = join(SRC, cat);
  const files = (await readdir(dir)).filter((f) => f.endsWith('.jpg')).sort();
  let n = 0;
  for (let i = 0; i < files.length; i += COLS * ROWS) {
    n++;
    const lot = files.slice(i, i + COLS * ROWS);
    const comp = [];
    const cle = `${cat}-${String(n).padStart(2, '0')}`;
    legende[cle] = {};
    for (let j = 0; j < lot.length; j++) {
      const x = (j % COLS) * TILE;
      const y = Math.floor(j / COLS) * CELL_H;
      legende[cle][j + 1] = lot[j];
      const img = await sharp(join(dir, lot[j]))
        .resize(TILE, TILE, { fit: 'contain', background: { r: 22, g: 22, b: 22 } })
        .toBuffer();
      comp.push({ input: img, left: x, top: y });
      const court = lot[j].replace('-nathanael-charpentier.jpg', '').slice(0, 46);
      const svg = `<svg width="${TILE}" height="${LABEL}"><rect width="100%" height="100%" fill="#161616"/><text x="8" y="27" font-family="Arial" font-size="21" fill="#fff" font-weight="bold">#${j + 1}</text><text x="52" y="27" font-family="Arial" font-size="13" fill="#bbb">${court}</text></svg>`;
      comp.push({ input: Buffer.from(svg), left: x, top: y + TILE });
    }
    await sharp({ create: { width: COLS * TILE, height: ROWS * CELL_H, channels: 3, background: { r: 22, g: 22, b: 22 } } })
      .composite(comp)
      .jpeg({ quality: 80 })
      .toFile(join(OUT, `${cle}.jpg`));
  }
  console.log(`${cat}: ${n} planches`);
}
await writeFile(join(OUT, 'legende.json'), JSON.stringify(legende, null, 1));
