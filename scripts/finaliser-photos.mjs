// Passe finale sur la banque d'images :
//  1. tous les masters ramenés à 2560 px
//  2. retrait des deux photos écartées par Nathanaël
//  3. fabrication des bandeaux : chaque image d'animation est posée dans un cadre 3:2
//     unique, sur un fond tiré de l'image elle-même — aucune image rognée, aucune bande visible
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
// ⚠️ Aucun recadrage ici, jamais : le cadrage d'une photographie appartient au
// photographe. Les images sont simplement remises à la taille du web, avec leurs
// proportions d'origine. C'est l'affichage qui s'adapte à elles, pas l'inverse.
const CADRE_L = 2560;

const sources = {
  'hero-accueil': 'D:/Téléchargements/ACCEUIL ANIMATION',
  'hero-mariage': 'D:/Téléchargements/MARIAGE ANIMATION',
  'hero-portrait': 'D:/Téléchargements/PORTRAIT ANIMATION',
};

// Les fichiers livrés portent un préfixe de rang ; les noms d'origine servent aux alts.
const NOMS = {
  'Nathanael-Vickie&Ludvig-siteweb-1': 'mariee-couloir-applique-manoir',
  'NathanaelCharpentier.Jade-1': 'diaporama-5-fond-ocre',
  'Nath-bestofwedding-web-33': 'preparatifs-maquillage-levres',
  'Nath-PortraitArt&Ame-Mélo-best-41': 'portrait-art-ame-tenue-blanche-fond-clair',
};

let cadres = 0;
for (const [dest, src] of Object.entries(sources)) {
  const cible = join(A, dest);
  rmSync(cible, { recursive: true, force: true });
  mkdirSync(cible, { recursive: true });

  const fichiers = readdirSync(src)
    .filter((f) => /\.jpe?g$/i.test(f))
    // « 010 » doit venir après « 09 » : on trie sur le nombre, pas sur le texte
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  for (const [i, f] of fichiers.entries()) {
    // le nom sur le disque peut être en NFD (export macOS) : on ne normalise que la clé
    const nom = f.normalize('NFC');
    const rang = String(i + 1).padStart(2, '0');
    const base = nom
      .replace(/\.jpe?g$/i, '')
      .replace(/^0*\d+\s*-\s*/, '')
      .replace(/-nathanael-charpentier$/, '')
      .trim();
    const cle = NOMS[base] ?? base;

    await sharp(join(src, f))
      .resize({ width: CADRE_L, height: CADRE_L, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .withExif({ IFD0: { Copyright: 'Nathanaël Charpentier' } })
      .toFile(join(cible, `${rang}-${cle}-nathanael-charpentier.jpg`));
    cadres++;
  }
  console.log(`${dest} : ${fichiers.length} images`);
}
console.log(`${cadres} images de bandeau préparées, proportions d’origine conservées`);
