// Audit typographique du HTML construit : mots collés autour des liens + densité de tirets longs
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'D:/CLAUDE CODE/nathanael-site/dist';

function pages(dir) {
  const out = [];
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...pages(p));
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

let collés = 0;
let totalTirets = 0;
const parPage = [];

for (const f of pages(DIST)) {
  const html = readFileSync(f, 'utf8');
  const corps = html.slice(html.indexOf('<body'));

  // mot immédiatement collé à un lien, avant ou après
  const avant = [...corps.matchAll(/(\S{2,20})<a\s/g)].filter(
    (m) => !/[>\s;»«(\[]$/.test(m[1])
  );
  const apres = [...corps.matchAll(/<\/a>([A-Za-zÀ-ÿ0-9]{2,20})/g)];

  // tirets longs dans le texte visible
  const texte = corps.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  const tirets = (texte.match(/—/g) || []).length;
  const mots = texte.split(/\s+/).filter(Boolean).length;

  totalTirets += tirets;
  collés += avant.length + apres.length;

  const nom = f.replace(DIST, '').replace(/\\/g, '/').replace('/index.html', '') || '/';
  parPage.push({ nom, tirets, mots, pour1000: mots ? +(tirets / mots * 1000).toFixed(1) : 0, colles: avant.length + apres.length, exemples: [...avant.map(m => m[0]), ...apres.map(m => m[0])].slice(0, 3) });
}

parPage.sort((a, b) => b.pour1000 - a.pour1000);
console.log('page'.padEnd(42) + 'tirets  mots  /1000 mots  collés');
for (const p of parPage) {
  console.log(p.nom.padEnd(42) + String(p.tirets).padStart(4) + String(p.mots).padStart(7) + String(p.pour1000).padStart(9) + String(p.colles).padStart(8) + (p.exemples.length ? '  ' + p.exemples.join(' | ') : ''));
}
console.log(`\nTOTAL : ${totalTirets} tirets longs, ${collés} collages détectés`);
