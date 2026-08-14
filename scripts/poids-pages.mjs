// Poids réellement téléchargé par page, selon la largeur d'écran et un DPR de 1,5
import { readFileSync, existsSync, statSync } from 'node:fs';

const val = (v, vw) => {
  v = v.trim();
  if (v.endsWith('vw')) return (vw * parseFloat(v)) / 100;
  if (v.endsWith('rem')) return parseFloat(v) * 16;
  if (v.endsWith('px')) return parseFloat(v);
  return vw;
};

function poids(page, vw, dpr = 1.5) {
  const h = readFileSync(page, 'utf8');
  let total = 0, n = 0, max = 0;
  for (const [balise] of h.matchAll(/<img[^>]+>/g)) {
    const ss = balise.match(/srcset="([^"]+)"/);
    if (!ss) continue;
    const cands = ss[1]
      .split(',')
      .map((s) => { const p = s.trim().split(' '); return { u: p[0], w: parseInt(p[1]) }; })
      .filter((c) => c.w)
      .sort((a, b) => a.w - b.w);
    if (!cands.length) continue;

    const sz = balise.match(/sizes="([^"]+)"/);
    let cible = vw;
    if (sz) {
      for (const p of sz[1].split(',').map((s) => s.trim())) {
        const mm = p.match(/\(max-width:\s*([\d.]+)(px|rem)\)\s*(.+)/);
        if (mm) {
          const lim = mm[2] === 'rem' ? parseFloat(mm[1]) * 16 : parseFloat(mm[1]);
          if (vw <= lim) { cible = val(mm[3], vw); break; }
        } else { cible = val(p, vw); break; }
      }
    }
    const c = cands.find((x) => x.w >= cible * dpr) ?? cands[cands.length - 1];
    const f = 'dist' + c.u;
    if (!existsSync(f)) continue;
    const s = statSync(f).size;
    total += s; max = Math.max(max, s); n++;
  }
  return { images: n, mo: +(total / 1048576).toFixed(2), moyKo: Math.round(total / n / 1024), maxKo: Math.round(max / 1024) };
}

const pages = [
  ['Accueil', 'dist/index.html'],
  ['Portrait (31)', 'dist/portrait/index.html'],
  ['Mariage (19)', 'dist/mariage/index.html'],
  ['Paris (19)', 'dist/photographe-mariage-paris/index.html'],
];
for (const [nom, p] of pages) {
  console.log(nom.padEnd(15) + ' | desktop 1280 ' + JSON.stringify(poids(p, 1280)) + ' | mobile 375 ' + JSON.stringify(poids(p, 375)));
}
