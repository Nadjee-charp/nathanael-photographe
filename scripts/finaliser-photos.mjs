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

// ————— 3. bandeaux au format unique —————
// Les dossiers d'animation mélangent 3:2, 16:9 et 4:3. Plutôt que de compléter les
// images d'un fond (les bandes finissaient par se voir sous le texte), on recadre
// légèrement chacune au même format 2:1 : aucune bordure, toutes exactement à la
// même taille, et un bandeau deux fois moins haut qu'un 3:2 sur un écran large.
const CADRE_L = 2560;
const RATIO = 2;
const CADRE_H = Math.round(CADRE_L / RATIO);

// Hauteur conservée, exprimée en fraction de la marge disponible : 0 garde le haut,
// 1 garde le bas. Par défaut on privilégie le tiers supérieur, là où sont les visages.
const ANCRAGES = {
  // cadrages déjà serrés à l'origine : sans cela, le haut du crâne saute
  'hero-portrait/03': 0, // visage cadré très près : on garde le tout premier pixel
  'hero-portrait/05': 0,
  'hero-portrait/08': 0.22, // le haut du chapeau melon
  'hero-accueil/04': 0.22,
  'hero-accueil/06': 0,
};

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

    const { width, height } = await sharp(join(src, f)).metadata();

    // On garde toute la largeur et on rogne en hauteur, autour du point d'ancrage.
    const garde = Math.min(height, Math.round(width / RATIO));
    const marge = height - garde;
    const ancrage = ANCRAGES[`${dest}/${rang}`] ?? 0.35;

    await sharp(join(src, f))
      .extract({ left: 0, top: Math.round(marge * ancrage), width, height: garde })
      .resize(CADRE_L, CADRE_H, { fit: 'cover' })
      .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .withExif({ IFD0: { Copyright: 'Nathanaël Charpentier' } })
      .toFile(join(cible, `${rang}-${cle}-nathanael-charpentier.jpg`));
    cadres++;
  }
  console.log(`${dest} : ${fichiers.length} images`);
}
console.log(`${cadres} bandeaux fabriqués au format ${CADRE_L}×${CADRE_H}`);
