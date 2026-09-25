// Prépare le dossier à déposer sur l'hébergement OVH : `livraison-ovh/`.
// À lancer après une construction de PRODUCTION (`npm run ovh` fait les deux).
//
// Refuse de préparer quoi que ce soit si la construction est celle de la démo :
// une page `noindex` envoyée sur le vrai domaine effacerait le site de Google.
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE = 'dist';
const CIBLE = 'livraison-ovh';
const SERVICE = /^(merci|en[\\/]thank-you)[\\/]index\.html$/; // pages volontairement hors Google

const html = [];
const parcourir = (d, rel = '') => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    const r = rel ? `${rel}/${f}` : f;
    if (statSync(p).isDirectory()) parcourir(p, r);
    else if (f.endsWith('.html')) html.push(r);
  }
};
parcourir(SOURCE);

const erreurs = [];
for (const r of html) {
  const t = readFileSync(join(SOURCE, r), 'utf8');
  if (t.includes('nathanael-photographe')) erreurs.push(`${r} : adresse de la démo GitHub`);
  if (/name="robots" content="noindex/.test(t) && !SERVICE.test(r) && r !== '404.html') {
    erreurs.push(`${r} : noindex`);
  }
}
for (const f of ['.htaccess', 'contact.php', 'robots.txt', 'sitemap-index.xml', '404.html']) {
  if (!existsSync(join(SOURCE, f))) erreurs.push(`${f} manquant`);
}
if (readFileSync(join(SOURCE, 'robots.txt'), 'utf8').includes('Disallow: /\n')) {
  erreurs.push('robots.txt bloque tout le site');
}

if (erreurs.length) {
  console.error('Livraison refusée :\n  ' + erreurs.join('\n  '));
  console.error('\nConstruire sans BASE_PATH : npm run ovh');
  process.exit(1);
}

rmSync(CIBLE, { recursive: true, force: true });
cpSync(SOURCE, CIBLE, { recursive: true });

let n = 0;
let octets = 0;
const compter = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) compter(p);
    else { n++; octets += statSync(p).size; }
  }
};
compter(CIBLE);
console.log(`${html.length} pages vérifiées : aucune trace de la démo, indexation ouverte.`);
console.log(`${CIBLE}/ prêt : ${n} fichiers, ${(octets / 1024 / 1024).toFixed(0)} Mo.`);
console.log('Déposer le CONTENU de ce dossier dans le dossier racine du site chez OVH (souvent www/).');
