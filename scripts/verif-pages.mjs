// Contrôle par page : doublons d'images, paires couleur/N&B du même cliché, alt manquants
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'D:/CLAUDE CODE/nathanael-site/dist';

// paires identifiées par empreinte visuelle (distance ≤ 5) : à ne jamais afficher ensemble
const PAIRES = [
  ['baiser-balustrade-noir-et-blanc-palais-royal-paris', 'baiser-balustrade-palais-royal-paris'],
  ['mariee-chapeau-cape-balustrade-palais-royal-paris', 'mariee-chapeau-noir-et-blanc-palais-royal-paris'],
  ['fou-rire-noir-et-blanc-jardins-coppelia-honfleur', 'rires-maries-jardins-coppelia-honfleur'],
  ['mariee-colonnade-lanternes-palais-royal-paris', 'mariee-profil-galerie-palais-royal-paris'],
  ['baiser-balustrade-palais-royal-paris', 'couple-arcades-louvre-paris'],
  ['baiser-balustrade-noir-et-blanc-palais-royal-paris', 'couple-arcades-louvre-paris'],
];

function pages(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...pages(p));
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

let soucis = 0;
for (const f of pages(DIST)) {
  const html = readFileSync(f, 'utf8');
  const nom = f.replace(DIST, '').replace(/\\/g, '/').replace('/index.html', '') || '/';

  // nom de base de chaque image (avant l'empreinte de build)
  const bases = [...html.matchAll(/\/_astro\/([a-z0-9-]+?)\.[A-Za-z0-9_-]{8}[^"']*\.webp/g)].map((m) => m[1]);
  const uniques = new Set(bases);

  const compte = {};
  bases.forEach((b) => (compte[b] = (compte[b] || 0) + 1));

  const dupPaires = PAIRES.filter(([a, b]) => uniques.has(a) && uniques.has(b));
  // Une image décorative porte un alt vide et `aria-hidden` : c'est la bonne pratique,
  // pas un oubli. Astro écrit d'ailleurs l'attribut vide sous la forme courte `alt`.
  const sansAlt = (html.match(/<img[^>]*>/g) || []).filter(
    (balise) => !/\salt(=|[\s>])/.test(balise) && !/aria-hidden="true"/.test(balise)
  ).length;

  if (dupPaires.length || sansAlt) {
    soucis++;
    console.log(`\n${nom}`);
    dupPaires.forEach(([a, b]) => console.log(`   DOUBLON couleur/N&B : ${a}  +  ${b}`));
    if (sansAlt) console.log(`   ${sansAlt} image(s) sans alt`);
  }
}

console.log(soucis ? `\n${soucis} page(s) à corriger` : '\nAucun doublon, aucun alt manquant.');
