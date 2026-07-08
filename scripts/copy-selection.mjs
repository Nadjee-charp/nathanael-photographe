// Copie la selection finale vers src/assets/photos avec noms SEO descriptifs
// (rapport SS8.2 : jamais IMG_0238.jpg — noms descriptifs + nom du photographe)
import { copyFile, mkdir, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

// Les ZIP Google Drive livrent des noms en NFD ; nos cles sont en NFC.
const realNames = new Map(); // "dossier/nomNFC" -> nom reel sur disque
async function resolve(srcDir, srcFile) {
  if (!realNames.has(srcDir)) {
    const entries = await readdir(join('D:/CLAUDE CODE/nathanael-site/assets/_source', srcDir));
    realNames.set(srcDir, new Map(entries.map(e => [e.normalize('NFC'), e])));
  }
  return realNames.get(srcDir).get(srcFile.normalize('NFC')) ?? srcFile;
}

const SRC = 'D:/CLAUDE CODE/nathanael-site/assets/_source';
const DEST = 'D:/CLAUDE CODE/nathanael-site/src/assets/photos';

// [dossier source, fichier source, dossier dest, nom dest sans ext, alt FR]
const SELECTION = [
  // ---- ACCUEIL ----
  ['bestof', 'Nathanael-Vickie&Ludvig-siteweb-1.jpg', 'accueil', 'photographe-mariage-nathanael-charpentier-mariee-chateau', 'Mariée seule dans un couloir de château baigné de lumière, robe blanche'],
  ['mariage', 'Nath-bestofwedding-web-66.jpg', 'accueil', 'mariage-couple-contre-jour-voile-nathanael-charpentier', 'Couple de mariés en contre-jour au couchant, voile déployé par le vent'],
  ['portrait', 'Nath-PortraitArt&Ame-Mélo-best-14.jpg', 'accueil', 'portrait-art-ame-lumiere-sculptee-nathanael-charpentier', 'Femme assise de profil, lumière sculptée sur fond peint, portrait d’atelier'],
  ['mariage', 'Nath-bestofwedding-web-295.jpg', 'accueil', 'mariage-baiser-voile-envole-nathanael-charpentier', 'Baiser des mariés en contre-jour, voile envolé'],
  ['portrait', 'Nathanael-StudioNathSam-12.jpg', 'accueil', 'portrait-regard-frontal-nathanael-charpentier', 'Portrait frontal, mains au visage, fond sombre'],
  ['mariage', 'Nath-bestofwedding-web-375.jpg', 'accueil', 'mariage-profil-soleil-couchant-nathanael-charpentier', 'Profil de la mariée embrasé par le soleil couchant'],
  ['portrait', 'NathanaelCharpentier-Gaelle-64.jpg', 'accueil', 'portrait-fine-art-dos-nathanael-charpentier', 'Dos nu émergeant du noir, collier, portrait fine art en noir et blanc'],

  // ---- MARIAGE (20, arc narratif) ----
  ['mariage', 'Nath-bestofwedding-web-81.jpg', 'mariage', 'preparatifs-mariage-larme-caftan-nathanael-charpentier', 'Larme essuyée pendant les préparatifs, reflet en caftan doré'],
  ['mariage', 'Nath-bestofwedding-web-25.jpg', 'mariage', 'preparatifs-mariee-voilee-clair-obscur-nathanael-charpentier', 'Mariée voilée en clair-obscur, noir et blanc'],
  ['mariage', 'Nath-bestofwedding-web-488.jpg', 'mariage', 'preparatifs-laque-contre-jour-nathanael-charpentier', 'Nuage de laque dans le contre-jour des préparatifs'],
  ['bestof', 'NathanaelCharpentier-34.jpg', 'mariage', 'mariage-rire-pere-mariee-nathanael-charpentier', 'Éclat de rire complice entre un père et sa fille le jour du mariage'],
  ['mariage', 'Nath-bestofwedding-web-557.jpg', 'mariage', 'ceremonie-enfant-rai-lumiere-nathanael-charpentier', 'Enfant traversant un rai de lumière pendant la cérémonie'],
  ['mariage', 'Nath-bestofwedding-web-456.jpg', 'mariage', 'ceremonie-baiser-voile-vitraux-nathanael-charpentier', 'Baiser sous le voile dans la lumière irisée des vitraux'],
  ['mariage', 'Nath-bestofwedding-web-408.jpg', 'mariage', 'mariage-baiser-grand-pere-nathanael-charpentier', 'Baiser du grand-père à la mariée sous le regard de la mère'],
  ['mariage', 'Nath-bestofwedding-web-427.jpg', 'mariage', 'mariage-chateau-grand-escalier-nathanael-charpentier', 'Descente du grand escalier du château vers les invités'],
  ['mariage', 'Nath-bestofwedding-web-115.jpg', 'mariage', 'mariage-chateau-double-escalier-nathanael-charpentier', 'Couple minuscule au pied du double escalier symétrique d’un château'],
  ['mariage', 'Nath-bestofwedding-web-69.jpg', 'mariage', 'mariee-pensive-lumiere-doree-nathanael-charpentier', 'Mariée pensive dans une lumière dorée'],
  ['mariage', 'Nath-bestofwedding-web-213.jpg', 'mariage', 'mariee-couloir-clair-obscur-nathanael-charpentier', 'Mariée éclairée dans un couloir en clair-obscur'],
  ['bestof', 'Nathanael-Vickie&Ludvig-siteweb-2.jpg', 'mariage', 'mariee-sourire-sous-voile-nathanael-charpentier', 'Sourire de la mariée sous le voile en mouvement, noir et blanc'],
  ['mariage', 'Nath-bestofwedding-web-29.jpg', 'mariage', 'couple-maries-vagues-ocean-nathanael-charpentier', 'Couple de mariés dans les vagues, jeux d’écume, noir et blanc'],
  ['mariage', 'Nath-bestofwedding-web-375.jpg', 'mariage', 'profil-mariee-couchant-nathanael-charpentier', 'Profil de la mariée embrasé par le soleil couchant'],
  ['mariage', 'Nath-bestofwedding-web-137.jpg', 'mariage', 'danse-couple-age-nathanael-charpentier', 'Danse tendre d’un couple âgé, noir et blanc'],
  ['mariage', 'Nath-bestofwedding-web-191.jpg', 'mariage', 'fete-rubans-soleil-couchant-nathanael-charpentier', 'Jeu de rubans au soleil couchant pendant la fête'],
  ['mariage', 'Nath-bestofwedding-web-496.jpg', 'mariage', 'enfant-saut-fete-mariage-nathanael-charpentier', 'Enfant en plein saut, bras en croix, noir et blanc'],
  ['mariage', 'Nath-bestofwedding-web-493.jpg', 'mariage', 'sortie-mariage-petales-chapeaux-nathanael-charpentier', 'Pétales et chapeaux complices à la sortie des mariés'],
  ['mariage', 'Nath-bestofwedding-web-544.jpg', 'mariage', 'fete-baiser-tourbillon-nathanael-charpentier', 'Baiser figé dans le tourbillon de la piste de danse'],
  ['mariage', 'Nath-bestofwedding-web-295.jpg', 'mariage', 'baiser-contre-jour-voile-nathanael-charpentier', 'Baiser en contre-jour, voile envolé'],

  // ---- PORTRAIT (18) ----
  ['portrait', 'Nath-PortraitArt&Ame-Mélo-best-14.jpg', 'portrait', 'portrait-art-ame-profil-pictural-nathanael-charpentier', 'Femme au chignon assise de profil, lumière sculptée, fond peint'],
  ['portrait', 'Nath-PortraitArt&Ame-Mélo-best-4.jpg', 'portrait', 'portrait-art-ame-larme-lumiere-nathanael-charpentier', 'Larme sur la joue, regard tourné vers la lumière, noir et blanc'],
  ['portrait', 'Nathanael-StudioNathSam-12.jpg', 'portrait', 'portrait-regard-mains-visage-nathanael-charpentier', 'Regard frontal, mains au visage, fond sombre'],
  ['portrait', 'Nathanael-StudioNathSam-14.jpg', 'portrait', 'portrait-mains-jointes-regard-nathanael-charpentier', 'Mains jointes devant les lèvres, regard frontal silencieux'],
  ['portrait', 'Nathanael-StudioNathSam-33.jpg', 'portrait', 'portrait-presence-fauteuil-nathanael-charpentier', 'Jeune femme assise, coude sur le fauteuil, regard frontal, noir et blanc'],
  ['portrait', 'NathanaelCharpentier-159.jpg', 'portrait', 'portrait-homme-clair-obscur-nathanael-charpentier', 'Portrait d’homme barbu, regard frontal en clair-obscur'],
  ['portrait', 'NathanaelCharpentier-Gaelle-64.jpg', 'portrait', 'portrait-fine-art-dos-collier-nathanael-charpentier', 'Dos nu sculpté émergeant du noir, collier inversé, noir et blanc'],
  ['portrait', 'Studio-NathSam-25.jpg', 'portrait', 'portrait-violoncelliste-rembrandt-nathanael-charpentier', 'Violoncelliste en robe blanche, clair-obscur à la Rembrandt'],
  ['portrait-maeva', 'Nath-Maëva-HD-136.jpg', 'portrait', 'portrait-silhouette-lisere-lumiere-nathanael-charpentier', 'Silhouette assise de profil détourée par un liseré de lumière'],
  ['portrait-maeva', 'Nath-Maëva-HD-205.jpg', 'portrait', 'portrait-lampe-ambree-nathanael-charpentier', 'Femme sous une lampe murale, flaque de lumière ambrée dans le noir'],
  ['portrait-maeva', 'Nath-Maëva-HD-234.jpg', 'portrait', 'portrait-violoncelle-contre-jour-nathanael-charpentier', 'Silhouette enlaçant un violoncelle en contre-jour ambré'],
  ['portrait-maeva', 'Nath-Maëva-HD-118.jpg', 'portrait', 'portrait-taches-rousseur-nathanael-charpentier', 'Très gros plan, taches de rousseur, main à la nuque, noir et blanc'],
  ['portrait', 'Nathanael-StudioNathSam-137.jpg', 'portrait', 'portrait-rire-larme-ampoule-nathanael-charpentier', 'Rire mêlé de larmes sous une ampoule nue, noir et blanc'],
  ['portrait', 'Nathanael-Maelle-190.jpg', 'portrait', 'portrait-regard-dense-nathanael-charpentier', 'Portrait frontal aux cheveux longs, regard dense, noir et blanc'],
  ['portrait', 'Nathanael-StudioNathSam-187.jpg', 'portrait', 'portrait-mains-agees-dentelle-nathanael-charpentier', 'Mains âgées posées sur une épaule en dentelle rouge'],
  ['portrait', 'NathShooting.Elise-54.jpg', 'portrait', 'portrait-robe-bordeaux-bibliotheque-nathanael-charpentier', 'Femme en robe bordeaux sur canapé rose devant une bibliothèque'],
  ['portrait', 'Nathanael.Charpentier-MaisonMerise-122.jpg', 'portrait', 'portrait-beret-chesterfield-nathanael-charpentier', 'Femme au béret sur un chesterfield, palette cuivre et vert'],
  ['portrait', 'Nathanael-Nikita-53.jpg', 'portrait', 'portrait-silhouette-orbe-nathanael-charpentier', 'Silhouette de profil contre un orbe lumineux'],

  // ---- A PROPOS ----
  ['identite', 'NathSam-portraits-web-14.jpg', 'apropos', 'nathanael-charpentier-photographe-portraitiste-gien', 'Nathanaël Charpentier, photographe portraitiste, assis près de colonnes, appareil posé'],
  ['details', 'Nath-détails site-web-13.jpg', 'apropos', 'volute-contrebasse-nathanael-charpentier', 'Volute de contrebasse sur fond noir'],
  ['details', 'Nath-détails site-93.jpg', 'apropos', 'micro-vintage-scene-nathanael-charpentier', 'Micro vintage dans la lumière chaude d’une lampe de scène'],

  // ---- CONTACT / RESPIRATIONS ----
  ['details', 'Nath-détails site-73.jpg', 'details', 'ecriture-rai-lumiere-nathanael-charpentier', 'Main écrivant dans un rai de lumière'],
  ['details', 'Nath-détails site-web-59.jpg', 'details', 'tables-reception-nuages-nathanael-charpentier', 'Nuages reflétés sur les tables rondes d’une réception'],
  ['details', 'Nath-détails site-web-18.jpg', 'details', 'cheville-violon-macro-nathanael-charpentier', 'Cheville de violon en macro, lumière dorée'],
];

const manifest = [];
const seen = new Set();
for (const [srcDir, srcFile, destDir, destName, alt] of SELECTION) {
  const from = join(SRC, srcDir, await resolve(srcDir, srcFile));
  const dir = join(DEST, destDir);
  await mkdir(dir, { recursive: true });
  const to = join(dir, destName + '.jpg');
  const key = destDir + '/' + destName;
  if (seen.has(key)) { console.error('DOUBLON dest:', key); continue; }
  seen.add(key);
  try {
    await copyFile(from, to);
    manifest.push({ dest: `${destDir}/${destName}.jpg`, alt, source: `${srcDir}/${srcFile}` });
  } catch (e) {
    console.error('ECHEC copie:', from, e.message);
  }
}
await writeFile(join(DEST, 'selection.json'), JSON.stringify(manifest, null, 1));
console.log(`Copiees: ${manifest.length}/${SELECTION.length}`);
