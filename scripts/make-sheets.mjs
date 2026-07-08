// Genere des planches-contact 4x3 (tuiles 480px + numero) pour le triage visuel
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const THUMBS = 'D:/CLAUDE CODE/nathanael-site/assets/_thumbs';
const OUT = 'D:/CLAUDE CODE/nathanael-site/assets/_sheets';
const COLS = 4, ROWS = 3, TILE = 480, LABEL = 36;
const CELL_H = TILE + LABEL;
await mkdir(OUT, { recursive: true });
const legend = {};

for (const category of await readdir(THUMBS)) {
  if (category.endsWith('.json')) continue;
  const dir = join(THUMBS, category);
  const files = (await readdir(dir)).filter(f => f.endsWith('.jpg')).sort();
  let sheetNum = 0;
  for (let i = 0; i < files.length; i += COLS * ROWS) {
    sheetNum++;
    const batch = files.slice(i, i + COLS * ROWS);
    const composites = [];
    const sheetKey = `${category}-${String(sheetNum).padStart(2, '0')}`;
    legend[sheetKey] = {};
    for (let j = 0; j < batch.length; j++) {
      const col = j % COLS, row = Math.floor(j / COLS);
      const x = col * TILE, y = row * CELL_H;
      const tileNum = j + 1;
      legend[sheetKey][tileNum] = batch[j];
      const img = await sharp(join(dir, batch[j]))
        .resize(TILE, TILE, { fit: 'contain', background: { r: 24, g: 24, b: 24 } })
        .toBuffer();
      composites.push({ input: img, left: x, top: y });
      const label = Buffer.from(
        `<svg width="${TILE}" height="${LABEL}"><rect width="100%" height="100%" fill="#181818"/><text x="8" y="25" font-family="Arial" font-size="20" fill="#ffffff" font-weight="bold">#${tileNum}</text><text x="52" y="25" font-family="Arial" font-size="13" fill="#aaaaaa">${batch[j].replace(/&/g, '&amp;').slice(0, 52)}</text></svg>`
      );
      composites.push({ input: label, left: x, top: y + TILE });
    }
    await sharp({
      create: { width: COLS * TILE, height: ROWS * CELL_H, channels: 3, background: { r: 24, g: 24, b: 24 } },
    })
      .composite(composites)
      .jpeg({ quality: 82 })
      .toFile(join(OUT, `${sheetKey}.jpg`));
  }
  console.log(`${category}: ${sheetNum} planches`);
}
await writeFile(join(OUT, 'legend.json'), JSON.stringify(legend, null, 1));
console.log('Legende ecrite');
