// Extrait les textes alternatifs officiels de la table de Sam
// (Renommage_Photos_Site_Nathanael.md, lots 1 à 4) vers scripts/alts-officiels.json.
//
// La table mélange deux formats de tableau (| ancien | nouveau | alt | et | nouveau | alt |)
// et contient aussi un tableau des doublons dont la deuxième colonne est une NOTE de
// travail (« Version lot 1 déplacée… »), pas une description. Ces notes sont écartées :
// elles ont déjà été publiées par erreur comme textes alternatifs une fois.
import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE = process.argv[2] ?? 'D:/_n2/_NOTE_N2_NADJEE/Renommage_Photos_Site_Nathanael.md';
const md = readFileSync(SOURCE, 'utf8');

const estUneNote = (t) => /^Version\b|déplacée|remplacée par/i.test(t);
const alts = new Map();

for (const ligne of md.split('\n')) {
  const c = ligne.split('|').map((s) => s.trim());
  if (c.length < 4) continue;
  // repère la cellule qui contient le nom de fichier, la description est juste après
  const i = c.findIndex((x) => /^`[a-z0-9-]+(?:-nathanael-charpentier)?(?:\.jpg)?`$/.test(x));
  if (i < 0 || !c[i + 1]) continue;
  const texte = c[i + 1];
  if (texte === 'Texte alt' || estUneNote(texte)) continue;
  const cle = c[i].replace(/`/g, '').replace(/\.jpg$/, '').replace(/-nathanael-charpentier$/, '').replace(/-$/, '');
  alts.set(cle, texte); // la dernière description réelle l'emporte : c'est la plus récente
}

writeFileSync('scripts/alts-officiels.json', JSON.stringify(Object.fromEntries([...alts].sort()), null, 2), 'utf8');
console.log(`${alts.size} textes alternatifs officiels, notes de travail écartées`);
