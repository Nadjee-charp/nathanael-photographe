// Reconstruit la table des textes alternatifs : officiels de Sam en priorité,
// sauf pour les personnes nommées (accords droit à l'image non confirmés, [I-06]).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
const A = 'src/assets/photos';
const officiels = JSON.parse(readFileSync('scripts/alts-officiels.json', 'utf8'));
const site = readFileSync('src/lib/photos.ts', 'utf8');

const actuels = {};
for (const m of site.matchAll(/^ {2}'([a-z0-9-]+)': '(.*)',$/gm)) actuels[m[1]] = m[2];

// [I-06] noms de personnes : formulation neutre tant que Nathanaël n'a pas confirmé les accords.
const NOMMES =
  /^(ludmila-berlinskaya|portrait-ludmila-berlinskaya|musicien-archet|portrait-nicolas-vicquenault|portrait-nikita|portrait-maelle-menotti|portrait-justine-bourrelier|portrait-armonie-noury|kaptan-emrah)/;

const cle = (f) => f.replace(/-nathanael-charpentier\.jpg$/, '').replace(/\.jpg$/, '');
const dossiers = readdirSync(A, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const groupes = [];
let manquants = 0;
let repris = 0;
for (const d of dossiers) {
  const lignes = [];
  for (const f of readdirSync(`${A}/${d}`).sort()) {
    if (!f.endsWith('.jpg')) continue;
    const k = cle(f.normalize('NFC'));
    let texte = actuels[k];
    if (!NOMMES.test(k) && officiels[k]) {
      texte = officiels[k];
      repris++;
    }
    if (!texte) {
      manquants++;
      console.log('  ⚠ alt manquant : ' + d + '/' + f);
      texte = '';
    }
    lignes.push(`  '${k}': '${texte.replace(/'/g, '’')}',`);
  }
  groupes.push(`  // ————— ${d} —————\n${lignes.join('\n')}`);
}

const bloc = `export const ALT: Record<string, string> = {\n${groupes.join('\n\n')}\n};`;
writeFileSync(
  'src/lib/photos.ts',
  site.replace(/export const ALT: Record<string, string> = \{[\s\S]*?\n\};/, bloc),
  'utf8'
);
console.log(`${repris} alts officiels repris · ${manquants} manquant(s)`);
