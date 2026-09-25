// Passe finale sur la banque d'images :
//  1. tous les masters ramenés à 2560 px
//  2. retrait des deux photos écartées par Nathanaël
//  3. (bandeaux : voir src/lib/carrousels.ts, plus de copies)
import { readdirSync, statSync, mkdirSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
sharp.cache(false);

const A = 'src/assets/photos';
const MAX = 2560;

// ————— 1. masters à 2560 px —————
let ramenes = 0;
let avant = 0;
let apres = 0;
for (const d of readdirSync(A)) {
  if (!statSync(join(A, d)).isDirectory()) continue;
  for (const f of readdirSync(join(A, d))) {
    if (!f.endsWith('.jpg')) continue;
    const p = join(A, d, f);
    const { width, height } = await sharp(p).metadata();
    avant += statSync(p).size;
    if (Math.max(width, height) <= MAX) {
      apres += statSync(p).size;
      continue;
    }
    // sharp ne peut pas réécrire le fichier qu'il lit : on passe par un temporaire
    const buf = await sharp(p)
      .resize({ width: MAX, height: MAX, fit: 'inside' })
      .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .withExif({ IFD0: { Copyright: 'Nathanaël Charpentier' } })
      .toBuffer();
    writeFileSync(p, buf);
    apres += statSync(p).size;
    ramenes++;
  }
}
const mo = (o) => (o / 1024 / 1024).toFixed(1) + ' Mo';
console.log(`${ramenes} masters ramenés à ${MAX} px — ${mo(avant)} → ${mo(apres)}`);

// ————— 2. retraits —————
for (const chemin of [
  `${A}/paris/couple-quais-de-seine-noir-et-blanc-paris-nathanael-charpentier.jpg`,
  `${A}/mariage/mariage-plage-la-palmyre-voile-couchant-nathanael-charpentier.jpg`,
]) {
  if (existsSync(chemin)) {
    rmSync(chemin);
    console.log('retiré : ' + chemin.split('/').pop());
  }
}

// ————— 3. bandeaux —————
// Depuis la sélection finale de Sam (18 septembre 2026), les bandeaux d'ouverture ne sont
// plus des copies : ils puisent directement dans la banque d'images, dans l'ordre fixé
// par `src/lib/carrousels.ts`. Rien à fabriquer ici. Et toujours aucun recadrage : c'est
// l'affichage (HeroDiaporama, object-fit: contain) qui s'adapte aux photographies.
