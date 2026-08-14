// Importe le 3e lot (149 images) + les Seychelles dans src/assets/photos,
// réparti par territoire, et génère la table des textes alternatifs officiels.
import { readdirSync, statSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const BRIEF = 'D:/Téléchargements/studionathsam__brief_FINAL';
const ASSETS = 'D:/CLAUDE CODE/nathanael-site/src/assets/photos';

// Les noms de dossiers du zip arrivent en NFD depuis macOS : on résout par comparaison normalisée.
function resoudre(parent, nom) {
  const cible = nom.normalize('NFC');
  for (const e of readdirSync(parent)) if (e.normalize('NFC') === cible) return join(parent, e);
  throw new Error(`Dossier introuvable : ${parent} / ${nom}`);
}
function sousDossier(base, ...segments) {
  return segments.reduce((p, s) => resoudre(p, s), base);
}

const NOUVELLES = sousDossier(BRIEF, 'nouvelles à ajouter', 'mariage');
const HORS = resoudre(NOUVELLES, 'mariages hors France métropolitaine');

const LOTS = [
  { src: sousDossier(NOUVELLES, 'à ajouter pour Normandie', 'mariage Trouville', 'web'), dest: 'normandie' },
  { src: resoudre(NOUVELLES, 'à renomer a Paris'), dest: 'paris' },
  { src: resoudre(NOUVELLES, 'à renomer chateau de Valery (région parisienne)'), dest: 'mariage' },
  { src: resoudre(HORS, 'Corse'), dest: 'corse', recursif: true },
  { src: resoudre(HORS, 'Andalousie Espagne'), dest: 'destination' },
  { src: resoudre(HORS, 'bruxelles'), dest: 'destination' },
  { src: resoudre(HORS, 'Iles Maurice'), dest: 'destination' },
  { src: resoudre(HORS, 'marakech'), dest: 'destination' },
];

// Les Seychelles arrivent par un zip séparé, déjà décompressé à côté.
const SEYCHELLES = 'D:/Téléchargements/Seychelles-extrait/seychelles';
if (existsSync(SEYCHELLES)) LOTS.push({ src: SEYCHELLES, dest: 'destination' });

function fichiers(dir, recursif) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { if (recursif) out.push(...fichiers(p, true)); }
    else if (/\.jpe?g$/i.test(e)) out.push(p);
  }
  return out;
}

let total = 0, octetsAvant = 0, octetsApres = 0;
for (const { src, dest, recursif } of LOTS) {
  const cible = join(ASSETS, dest);
  mkdirSync(cible, { recursive: true });
  for (const f of fichiers(src, recursif)) {
    const nom = f.split(/[\\/]/).pop().normalize('NFC');
    const sortie = join(cible, nom);
    octetsAvant += statSync(f).size;
    await sharp(f)
      .resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .withExif({ IFD0: { Copyright: 'Nathanaël Charpentier' } })
      .toFile(sortie);
    octetsApres += statSync(sortie).size;
    total++;
  }
}

// ————— Textes alternatifs officiels, extraits de la table de Sam —————
const md = readFileSync(join(BRIEF, 'Renommage_Photos_Site_Nathanael.md'), 'utf8');
const alts = new Map();
for (const ligne of md.split('\n')) {
  const cols = ligne.split('|').map((c) => c.trim());
  if (cols.length < 3) continue;
  // Deux formes de table : | ancien | nouveau | alt |  et  | nouveau | alt |
  const [nouveau, texte] = cols.length >= 5 ? [cols[2], cols[3]] : [cols[1], cols[2]];
  const m = /^`?([a-z0-9-]+?)-?(?:nathanael-charpentier)?\.?(?:jpg)?`?$/.exec(nouveau ?? '');
  if (!m || !texte || texte === 'Texte alt') continue;
  alts.set(m[1].replace(/-$/, ''), texte);
}
writeFileSync(
  'D:/CLAUDE CODE/nathanael-site/scripts/alts-officiels.json',
  JSON.stringify(Object.fromEntries([...alts].sort()), null, 2),
  'utf8'
);

const mo = (o) => (o / 1024 / 1024).toFixed(1) + ' Mo';
console.log(`${total} images importées — ${mo(octetsAvant)} → ${mo(octetsApres)}`);
console.log(`${alts.size} textes alternatifs officiels extraits`);
