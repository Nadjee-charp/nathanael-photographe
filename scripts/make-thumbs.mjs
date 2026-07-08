// Genere des vignettes 1000px pour le scoring visuel + un index JSON (dimensions, orientation)
import sharp from 'sharp';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const SRC = 'D:/CLAUDE CODE/nathanael-site/assets/_source';
const OUT = 'D:/CLAUDE CODE/nathanael-site/assets/_thumbs';
const index = [];

for (const category of await readdir(SRC)) {
  if (category === 'test') continue;
  const srcDir = join(SRC, category);
  const outDir = join(OUT, category);
  await mkdir(outDir, { recursive: true });
  const files = (await readdir(srcDir)).filter(f => ['.jpg', '.jpeg', '.png'].includes(extname(f).toLowerCase()));
  for (const f of files) {
    try {
      const inPath = join(srcDir, f);
      const outPath = join(outDir, f.replace(/\.(jpe?g|png)$/i, '.jpg'));
      const meta = await sharp(inPath).metadata();
      await sharp(inPath)
        .resize({ width: 1000, height: 1000, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(outPath);
      index.push({
        category,
        file: f,
        width: meta.width,
        height: meta.height,
        orientation: meta.width > meta.height ? 'paysage' : (meta.width < meta.height ? 'portrait' : 'carre'),
      });
    } catch (e) {
      console.error(`ECHEC ${category}/${f}: ${e.message}`);
    }
  }
  console.log(`${category}: ${files.length} traitees`);
}

await writeFile(join(OUT, 'index.json'), JSON.stringify(index, null, 1));
console.log(`Index: ${index.length} images`);
