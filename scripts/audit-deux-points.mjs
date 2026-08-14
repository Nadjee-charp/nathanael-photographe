// Cherche les deux-points sans espace après (et, en français, sans espace avant)
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

let total = 0;
for (const f of pages(DIST)) {
  const html = readFileSync(f, 'utf8');
  const corps = html.slice(html.indexOf('<body'));
  const texte = corps
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, '\u00a0');

  const nom = f.replace(/\\/g, '/').replace(DIST, '').replace('/index.html', '') || '/';
  const soucis = [];

  // deux-points collé au mot suivant (on ignore les URL http:// et les heures 12:30)
  for (const m of texte.matchAll(/[A-Za-zÀ-ÿ0-9»)][:]([A-Za-zÀ-ÿ«(])/g)) {
    const ctx = texte.slice(Math.max(0, m.index - 28), m.index + 24).replace(/\s+/g, ' ').trim();
    soucis.push('sans espace après → …' + ctx + '…');
  }
  // en français : espace obligatoire avant les deux-points
  if (!nom.startsWith('/en')) {
    for (const m of texte.matchAll(/[A-Za-zÀ-ÿ0-9][:]\s/g)) {
      const avant = texte[m.index];
      if (avant && !/\s|\u00a0/.test(texte[m.index] ?? '')) {
        const ctx = texte.slice(Math.max(0, m.index - 30), m.index + 12).replace(/\s+/g, ' ').trim();
        soucis.push('sans espace avant → …' + ctx + '…');
      }
    }
  }

  if (soucis.length) {
    total += soucis.length;
    console.log(`\n${nom}`);
    [...new Set(soucis)].forEach((s) => console.log('   ' + s));
  }
}
console.log(total ? `\n${total} occurrence(s)` : '\nPonctuation des deux-points : rien à signaler.');
