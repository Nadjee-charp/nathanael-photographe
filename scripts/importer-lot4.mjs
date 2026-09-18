// Note N°2 (18/09/2026) : 4e lot d'images, remasters, et ménage.
// On garde les masters 2560 px déjà en place : le zip est en 2400 px, écraser
// ferait perdre de la définition sur des clichés identiques.
import { readdirSync, statSync, existsSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import sharp from 'sharp';
sharp.cache(false);

const ZIP = 'D:/_n2';
const A = 'src/assets/photos';
const N = (s) => s.normalize('NFC');

function scan(d, out = []) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!e.name.startsWith('_')) scan(join(d, e.name), out); }
    else if (e.name.toLowerCase().endsWith('.jpg')) out.push(join(d, e.name));
  }
  return out;
}

const zip = new Map();
for (const p of scan(ZIP)) if (!zip.has(N(basename(p)))) zip.set(N(basename(p)), p);

const site = new Map();
for (const p of scan(A)) if (!basename(p).startsWith('0')) site.set(N(basename(p)), p);

// Où ranger une nouvelle image, d'après son nom.
const RANGEMENT = [
  [/portrait|detail-main|detail-mains|robe-blanche|kaptan|ludmila|musicien/, 'portrait'],
  [/corse|santa-giulia|porto-vecchio|murtoli/, 'corse'],
  [/marrakech|ile-maurice|andalousie|bruxelles|seychelles/, 'destination'],
  [/trouville|coppelia|honfleur|deauville|normand/, 'normandie'],
  [/peniche|tour-eiffel|palais-royal|louvre|bir-hakeim|alexandre-iii|orsay|quais-de-seine|guimard|parisien/, 'paris'],
];
const dossier = (nom) => (RANGEMENT.find(([r]) => r.test(nom)) ?? [, 'mariage'])[1];

// N2-20 point 3 : six fichiers existent en meilleure version, on écrase.
const REMASTERS = [
  'details-papeterie-mariage-chateau-champlatreux',
  'mariee-fenetre-traine-chateau-champlatreux',
  'portrait-mariee-lumiere-doree-chateau-champlatreux',
  'robe-mouvement-escalier-chateau-champlatreux',
  'marie-porte-fete-jardins-coppelia-honfleur',
  'seance-jour-d-apres-vagues-deauville',
];

// N2-20 point 4 : doublon exact de `rires-maries-jardins-coppelia-honfleur`.
// Plus les restes des anciens diaporamas, remplacés par le 4e lot.
const A_RETIRER = [
  'fou-rire-noir-et-blanc-jardins-coppelia-honfleur',
  'couple-maries-dentelle-voile-parc',
  'diaporama-2-visage-allonge-noir-et-blanc',
  'diaporama-3-assise-blanc',
  'diaporama-4-oeuvre-dessinee-fusain',
  'enfants-cedre-parc-mariage',
  'mariage-3-premiere-danse-salon',
  'mariage-6-portee-devant-chateau',
  'mariage-7-lancer-bouquet-fontaine',
  'mariage-8-couchant-voile-parc',
  'mariee-escalier-fenetre-chateau',
  'mariee-voile-portes-anciennes',
  'silhouette-mariee-fenetre-jaune',
];

const MAX = 2560;
async function poser(source, destination) {
  const { width, height } = await sharp(source).metadata();
  const buf = await sharp(source)
    .resize({ width: MAX, height: MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .withExif({ IFD0: { Copyright: 'Nathanaël Charpentier' } })
    .toFile(destination);
  return `${width}×${height}`;
}

let neuves = 0, remplacees = 0, retirees = 0;
const parDossier = {};

for (const [nom, source] of zip) {
  const cle = nom.replace(/-nathanael-charpentier\.jpg$/, '').replace(/\.jpg$/, '');
  if (site.has(nom)) {
    if (!REMASTERS.includes(cle)) continue;
    await poser(source, site.get(nom));
    remplacees++;
    continue;
  }
  const d = dossier(cle);
  await poser(source, join(A, d, nom));
  parDossier[d] = (parDossier[d] || 0) + 1;
  neuves++;
}

for (const cle of A_RETIRER) {
  const p = site.get(`${cle}-nathanael-charpentier.jpg`);
  if (p && existsSync(p)) { rmSync(p); retirees++; }
}

console.log(`${neuves} images ajoutées : ${JSON.stringify(parDossier)}`);
console.log(`${remplacees} remasters écrasés · ${retirees} images retirées`);
