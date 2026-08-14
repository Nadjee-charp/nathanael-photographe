// Ajoute au projet les photos demandées, depuis les archives et le dossier « VIDEO MARIAGE ».
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const DEST = 'D:/CLAUDE CODE/nathanael-site/src/assets/photos';
const COPYRIGHT = 'Nathanael Charpentier';
const VM = 'D:/Téléchargements/VIDEO MARIAGE';
const R = 'D:/CLAUDE CODE/nathanael-site/';

const lot = [
  [R + 'assets/_source/mariage', 'Nath-bestofwedding-web-91.jpg', 'mariage', 'enfants-cedre-parc-mariage-nathanael-charpentier.jpg'],
  [R + 'assets/_source/mariage', 'Nath-bestofwedding-web-102.jpg', 'mariage', 'silhouette-mariee-fenetre-jaune-nathanael-charpentier.jpg'],
  [R + 'assets/_source/portrait-maeva', 'Nath-Maëva-HD-205.jpg', 'portrait', 'portrait-art-ame-lampe-suspendue-nathanael-charpentier.jpg'],
  [VM, 'Nath-bestofwedding-web-33.jpg', 'mariage', 'preparatifs-maquillage-levres-nathanael-charpentier.jpg'],
  [VM, 'Nath-bestofwedding-web-53.jpg', 'mariage', 'mariee-voile-portes-anciennes-nathanael-charpentier.jpg'],
  [VM, 'Nath-bestofwedding-web-58.jpg', 'mariage', 'mariee-escalier-fenetre-chateau-nathanael-charpentier.jpg'],
  [VM, 'Nath-bestofwedding-web-68.jpg', 'mariage', 'couple-maries-dentelle-voile-parc-nathanael-charpentier.jpg'],
];

for (const [dossier, fichier, destDir, destNom] of lot) {
  const dir = await readdir(dossier);
  const vrai = dir.find((n) => n.normalize('NFC') === fichier.normalize('NFC')) ?? fichier;
  await mkdir(join(DEST, destDir), { recursive: true });
  const meta = await sharp(join(dossier, vrai)).metadata();
  await sharp(join(dossier, vrai))
    .rotate()
    .resize({ width: 3840, height: 3840, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .withExif({ IFD0: { Copyright: COPYRIGHT, Artist: COPYRIGHT } })
    .toFile(join(DEST, destDir, destNom));
  console.log(`${destDir}/${destNom}  (source ${meta.width}x${meta.height})`);
}
