// Genere le logo vectorise (paths) : lockup principal, variante ivoire, monogramme/favicon
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import opentype from 'opentype.js';

const ENCRE = '#141311';
const IVOIRE = '#F4F1EB';
const BRONZE = '#9C7A50';

async function loadFont(p) {
  const buf = await readFile(p);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}
const corm = await loadFont('assets/_fonts/CormorantGaramond.ttf');
const jost = await loadFont('assets/_fonts/Jost.ttf');

function textPath(font, text, size, tracking, x0 = 0, y0 = 0) {
  let x = x0;
  let d = '';
  for (const ch of text) {
    d += font.getPath(ch, x, y0, size).toPathData(2);
    x += font.getAdvanceWidth(ch, size) + tracking * size;
  }
  return { d, width: x - x0 - tracking * size };
}

// --- Lockup principal ---
const SIZE_NOM = 100;
const SIZE_SOUS = 26;
const nom = textPath(corm, 'NATHANAËL', SIZE_NOM, 0.13);
const sous = textPath(jost, 'CHARPENTIER', SIZE_SOUS, 0.44);

const W = Math.ceil(nom.width) + 8;
const yNom = 92; // ligne de base du nom
const ySous = yNom + 52;
const sousX = (W - sous.width) / 2;
const nomPath = textPath(corm, 'NATHANAËL', SIZE_NOM, 0.13, 4, yNom).d;
const sousPath = textPath(jost, 'CHARPENTIER', SIZE_SOUS, 0.44, sousX, ySous).d;
const hairY = ySous - SIZE_SOUS * 0.32;
const gap = 26;

function lockup(fg, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${ySous + 18}" role="img" aria-label="Nathanaël Charpentier">
  <path fill="${fg}" d="${nomPath}"/>
  <path fill="${accent}" d="${sousPath}"/>
  <rect x="4" y="${hairY}" width="${sousX - gap - 4}" height="1.2" fill="${accent}"/>
  <rect x="${sousX + sous.width + gap}" y="${hairY}" width="${W - sousX - sous.width - gap - 4}" height="1.2" fill="${accent}"/>
</svg>`;
}

// --- Monogramme ---
const mSize = 120;
const n = textPath(corm, 'N', mSize, 0);
const cAdv = corm.getAdvanceWidth('C', mSize);
const overlap = mSize * 0.1;
const mW = n.width + cAdv - overlap + 16;
const mH = 128;
const nP = textPath(corm, 'N', mSize, 0, 8, 100).d;
const cP = textPath(corm, 'C', mSize, 0, 8 + n.width - overlap, 100).d;

function monogram(fg, accent, bg = null) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.ceil(mW)} ${mH}" role="img" aria-label="NC">
  ${bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ''}
  <path fill="${accent}" d="${cP}" opacity="0.85"/>
  <path fill="${fg}" d="${nP}"/>
</svg>`;
}

await mkdir('public/marque', { recursive: true });
await writeFile('public/marque/logo-nathanael-charpentier.svg', lockup(ENCRE, BRONZE));
await writeFile('public/marque/logo-nathanael-charpentier-ivoire.svg', lockup(IVOIRE, BRONZE));
await writeFile('public/marque/monogramme.svg', monogram(ENCRE, BRONZE));
await writeFile('public/favicon.svg', monogram(IVOIRE, BRONZE, ENCRE));
console.log(`Lockup ${W}x${ySous + 18} — monogramme ${Math.ceil(mW)}x${mH} — 4 SVG ecrits`);
