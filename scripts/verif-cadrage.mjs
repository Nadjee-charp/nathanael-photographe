// Simule le rendu final d'un bandeau : le cadre 2:1 fabriqué, puis le recadrage
// que le plafond de hauteur applique sur un écran large. Sert à vérifier à l'œil
// qu'aucun visage n'est coupé une fois tout enchaîné.
import { readdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
sharp.cache(false);

const RATIO_AFFICHE = 1425 / 594; // portable 1440 × 900, plafond de 66 svh
const ANCRAGE = 0.3;
const L = 520;
const H = Math.round(L / RATIO_AFFICHE);
const COL = 3;

for (const dossier of ['hero-accueil', 'hero-mariage', 'hero-portrait']) {
  const A = `src/assets/photos/${dossier}`;
  const fichiers = readdirSync(A).filter((f) => f.endsWith('.jpg')).sort();
  const vignettes = [];
  for (const [i, f] of fichiers.entries()) {
    const { width, height } = await sharp(`${A}/${f}`).metadata();
    const garde = Math.round(width / RATIO_AFFICHE);
    const buf = await sharp(`${A}/${f}`)
      .extract({ left: 0, top: Math.round((height - garde) * ANCRAGE), width, height: garde })
      .resize(L, H, { fit: 'cover' })
      .composite([{
        input: Buffer.from(
          `<svg width="${L}" height="24"><rect width="${L}" height="24" fill="#000" opacity="0.7"/>` +
            `<text x="6" y="18" font-family="monospace" font-size="15" fill="#fff">${i + 1}</text></svg>`
        ),
        top: H - 24, left: 0,
      }])
      .toBuffer();
    vignettes.push({ input: buf, top: Math.floor(i / COL) * H, left: (i % COL) * L });
  }
  const sortie = `${process.argv[2]}/final-${dossier}.jpg`;
  await sharp({ create: { width: COL * L, height: Math.ceil(fichiers.length / COL) * H, channels: 3, background: '#111' } })
    .composite(vignettes).jpeg({ quality: 80 }).toFile(sortie);
  writeFileSync(sortie.replace(/\.jpg$/, '.txt'), fichiers.map((f, i) => `${i + 1}\t${f}`).join('\n'));
  console.log(`${dossier} → ${fichiers.length} vignettes`);
}
