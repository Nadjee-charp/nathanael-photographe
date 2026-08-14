// Détecte les doublons visuels (empreinte dHash sur niveaux de gris) :
// repère aussi bien les fichiers identiques que le même cliché en couleur et en noir et blanc.
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const RACINE = 'D:/CLAUDE CODE/nathanael-site/src/assets/photos';
const L = 9, H = 8; // dHash 8x8 = 64 bits

async function empreinte(chemin) {
  const px = await sharp(chemin).greyscale().resize(L, H, { fit: 'fill' }).raw().toBuffer();
  let bits = 0n;
  for (let y = 0; y < H; y++)
    for (let x = 0; x < L - 1; x++)
      bits = (bits << 1n) | (px[y * L + x] < px[y * L + x + 1] ? 1n : 0n);
  return bits;
}

const distance = (a, b) => {
  let x = a ^ b, n = 0;
  while (x) { n += Number(x & 1n); x >>= 1n; }
  return n;
};

const images = [];
for (const dossier of await readdir(RACINE)) {
  let fichiers;
  try { fichiers = (await readdir(join(RACINE, dossier))).filter((f) => f.endsWith('.jpg')); }
  catch { continue; }
  for (const f of fichiers) {
    images.push({ cle: `${dossier}/${f}`, h: await empreinte(join(RACINE, dossier, f)) });
  }
}

const paires = [];
for (let i = 0; i < images.length; i++)
  for (let j = i + 1; j < images.length; j++) {
    const d = distance(images[i].h, images[j].h);
    if (d <= 12) paires.push({ d, a: images[i].cle, b: images[j].cle });
  }

paires.sort((x, y) => x.d - y.d);
console.log(`${images.length} images analysées — ${paires.length} paires proches (distance ≤ 12)\n`);
for (const p of paires) {
  const verdict = p.d <= 5 ? 'IDENTIQUE ' : p.d <= 9 ? 'TRES PROCHE' : 'proche    ';
  console.log(`${verdict} d=${String(p.d).padStart(2)}  ${p.a}\n            ${p.b}`);
}
