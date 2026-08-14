// Mesure luminance moyenne, saturation et orientation de chaque photo :
// de quoi composer une galerie qui alterne réellement clair/sombre et couleur/N&B.
import { readdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const A = 'src/assets/photos';
const dossiers = process.argv.slice(2);
const sortie = {};

for (const d of dossiers) {
  for (const f of readdirSync(`${A}/${d}`).sort()) {
    if (!f.endsWith('.jpg')) continue;
    const image = sharp(`${A}/${d}/${f}`);
    const { width, height } = await image.metadata();
    const { channels } = await image.stats();
    const [r, v, b] = channels.map((c) => c.mean);
    // Luminance perçue, puis écart maximal entre canaux : au-delà de ~6, il y a de la couleur.
    const luminance = 0.2126 * r + 0.7152 * v + 0.0722 * b;
    const ecart = Math.max(r, v, b) - Math.min(r, v, b);
    sortie[f.replace(/-nathanael-charpentier\.jpg$/, '').replace(/\.jpg$/, '')] = {
      dossier: d,
      luminance: Math.round(luminance),
      couleur: ecart > 6,
      format: width > height * 1.1 ? 'paysage' : height > width * 1.1 ? 'portrait' : 'carre',
    };
  }
}

writeFileSync('scripts/photos-mesures.json', JSON.stringify(sortie, null, 1), 'utf8');
const n = Object.keys(sortie).length;
const sombres = Object.values(sortie).filter((p) => p.luminance < 85).length;
const nb = Object.values(sortie).filter((p) => !p.couleur).length;
console.log(`${n} photos mesurées · ${sombres} sombres · ${nb} en noir et blanc`);
