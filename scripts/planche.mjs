// Planche contact numérotée d'un dossier, pour juger les images à l'œil.
import { readdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const dossier = process.argv[2];
const sortie = process.argv[3];
const COL = 6;
const CASE = 300;
const A = `src/assets/photos/${dossier}`;

const fichiers = readdirSync(A).filter((f) => f.endsWith('.jpg')).sort();
const lignes = Math.ceil(fichiers.length / COL);

const vignettes = [];
for (const [i, f] of fichiers.entries()) {
  const buf = await sharp(`${A}/${f}`)
    .resize(CASE, CASE, { fit: 'contain', background: '#111' })
    .composite([
      {
        input: Buffer.from(
          `<svg width="${CASE}" height="34"><rect width="${CASE}" height="34" fill="#000" opacity="0.72"/>` +
            `<text x="8" y="24" font-family="monospace" font-size="22" fill="#fff">${i + 1}</text></svg>`
        ),
        top: CASE - 34,
        left: 0,
      },
    ])
    .toBuffer();
  vignettes.push({
    input: buf,
    top: Math.floor(i / COL) * CASE,
    left: (i % COL) * CASE,
  });
}

await sharp({
  create: { width: COL * CASE, height: lignes * CASE, channels: 3, background: '#111' },
})
  .composite(vignettes)
  .jpeg({ quality: 78 })
  .toFile(sortie);

writeFileSync(
  sortie.replace(/\.jpg$/, '.txt'),
  fichiers.map((f, i) => `${i + 1}\t${f}`).join('\n'),
  'utf8'
);
console.log(`${fichiers.length} vignettes → ${sortie}`);
