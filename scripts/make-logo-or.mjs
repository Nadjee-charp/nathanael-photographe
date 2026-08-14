// Variante noir & dore du logo + exports PNG haute resolution
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import opentype from 'opentype.js';
import sharp from 'sharp';

const NOIR = '#141311';
const OR = '#C6A45C'; // or champagne — luxe, pas criard
const OUT = 'D:/CLAUDE CODE/SITE NATHANAEL CHARPENTIER/LOGO';

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

const SIZE_NOM = 100;
const SIZE_SOUS = 26;
const nom = textPath(corm, 'NATHANAËL', SIZE_NOM, 0.13);
const sous = textPath(jost, 'CHARPENTIER', SIZE_SOUS, 0.44);
const W = Math.ceil(nom.width) + 8;
const H = 162;
const yNom = 92;
const ySous = yNom + 52;
const sousX = (W - sous.width) / 2;
const nomPath = textPath(corm, 'NATHANAËL', SIZE_NOM, 0.13, 4, yNom).d;
const sousPath = textPath(jost, 'CHARPENTIER', SIZE_SOUS, 0.44, sousX, ySous).d;
const hairY = ySous - SIZE_SOUS * 0.32;
const gap = 26;

// marge autour du logo dans les exports
const M = 60;
function lockup(fgNom, fgSous, fond = null) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-M} ${-M} ${W + 2 * M} ${H + 2 * M}">
  ${fond ? `<rect x="${-M}" y="${-M}" width="100%" height="100%" fill="${fond}"/>` : ''}
  <path fill="${fgNom}" d="${nomPath}"/>
  <path fill="${fgSous}" d="${sousPath}"/>
  <rect x="4" y="${hairY}" width="${sousX - gap - 4}" height="1.2" fill="${fgSous}"/>
  <rect x="${sousX + sous.width + gap}" y="${hairY}" width="${W - sousX - sous.width - gap - 4}" height="1.2" fill="${fgSous}"/>
</svg>`;
}

await mkdir(OUT, { recursive: true });

const variantes = [
  ['logo-noir-or-fond-transparent', lockup(NOIR, OR, null)],
  ['logo-noir-or-fond-blanc', lockup(NOIR, OR, '#FFFFFF')],
  ['logo-or-fond-noir', lockup(OR, OR, NOIR)],
];

for (const [nomFichier, svg] of variantes) {
  await writeFile(`${OUT}/${nomFichier}.svg`, svg);
  await sharp(Buffer.from(svg), { density: 300 })
    .resize({ width: 3000 })
    .png()
    .toFile(`${OUT}/${nomFichier}.png`);
  console.log(`${nomFichier}.png + .svg`);
}
console.log('Termine ->', OUT);
