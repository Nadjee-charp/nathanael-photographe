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
// Les dossiers d'animation mélangent 3:2, 16:9 et 4:3. Pour que toutes les images
// s'affichent en entier et à la même taille, chacune est posée dans un cadre 3:2 ;
// le fond du cadre est l'image elle-même, agrandie, floutée et assombrie, ce qui rend
// le raccord invisible là où l'image ne remplit pas tout le cadre.
const CADRE_L = 2560;
const CADRE_H = Math.round(CADRE_L / 1.5); // 3:2, le format de la grande majorite des images

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

    const image = sharp(join(src, f));
    const { width, height } = await image.metadata();
    const buf = await image.toBuffer();

    // Fond : l'image étirée au format du cadre puis très floutée. L'étirement garantit
    // que la couleur du fond, juste au-dessus et au-dessous de l'image, prolonge celle
    // de ses propres bords : le raccord n'a plus de ligne visible.
    const fond = await sharp(buf)
      .resize(CADRE_L, CADRE_H, { fit: 'fill' })
      .blur(110)
      .modulate({ brightness: 0.82, saturation: 0.85 })
      .toBuffer();

    // l'image entière, posée au centre du cadre : `inside` sur les deux dimensions,
    // sinon un 3:2 parfait déborde d'un pixel après arrondi
    const dessus = await sharp(buf)
      .resize({ width: CADRE_L, height: CADRE_H, fit: 'inside' })
      .toBuffer();

    await sharp(fond)
      .composite([{ input: dessus, gravity: 'center' }])
      .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .withExif({ IFD0: { Copyright: 'Nathanaël Charpentier' } })
      .toFile(join(cible, `${rang}-${cle}-nathanael-charpentier.jpg`));
    cadres++;
  }
  console.log(`${dest} : ${fichiers.length} images`);
}
console.log(`${cadres} bandeaux fabriqués au format ${CADRE_L}×${CADRE_H}`);
