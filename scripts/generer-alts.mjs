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

// 4e lot : Jade, Olivia et Freddy sont nommés dans les descriptions officielles. Même règle
// que ci-dessus, mais on garde la description de Sam en retirant seulement le prénom.
const PRENOMS = /^(portrait-jade|portrait-olivia|portrait-freddy)/;
const sansPrenom = (t) => {
  const r = t.replace(/^(Jade|Olivia|Freddy)(?:,\s*|\s+)/, '');
  return r.charAt(0).toUpperCase() + r.slice(1);
};

// Là où retirer le prénom laisse une phrase bancale, ou une personne encore reconnaissable.
const REFORMULES = {
  'portrait-jade-lecture-fenetre-rue-noir-et-blanc-studio-gien': 'Lecture à la fenêtre ouverte sur la rue, noir et blanc, studio à Gien',
  'portrait-olivia-robe-blanche-mouvement-colonnade-palais-royal-paris': 'Robe blanche envolée dans la colonnade du Palais-Royal, Paris',
  'portrait-olivia-robe-blanche-colonne-noir-et-blanc-palais-royal-paris': 'Robe blanche brodée contre une colonne, noir et blanc, Palais-Royal, Paris',
  'portrait-olivia-robe-blanche-colonnes-palais-royal-paris': 'Robe blanche brodée entre les colonnes, Palais-Royal, Paris',
  'portrait-olivia-robe-rouge-dentelle-grilles-palais-royal-paris': 'Robe rouge de dentelle devant les grilles dorées du Palais-Royal, Paris',
  'portrait-freddy-koh-lanta-arcades-palais-royal-paris': 'Portrait d’homme sous les arcades du Palais-Royal, Paris',
};

const cle = (f) => f.replace(/-nathanael-charpentier\.jpg$/, '').replace(/\.jpg$/, '');
const dossiers = readdirSync(A, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('hero-'))
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
    if (REFORMULES[k]) {
      texte = REFORMULES[k];
    } else if (PRENOMS.test(k) && officiels[k]) {
      texte = sansPrenom(officiels[k]);
      repris++;
    } else if (!NOMMES.test(k) && officiels[k]) {
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
