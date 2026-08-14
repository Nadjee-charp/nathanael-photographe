// Importe les images fournies sans nom SEO : on les nomme ici, une fois pour toutes.
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const A = 'D:/CLAUDE CODE/nathanael-site/src/assets/photos';
const trouve = (dir, nom) => join(dir, readdirSync(dir).find((e) => e.normalize('NFC') === nom.normalize('NFC')));

const lot = [
  [trouve('D:/Téléchargements/MARIAGE ANIMATION', 'Nathanael-Vickie&Ludvig-siteweb-1.jpg'),
   `${A}/mariage/mariee-couloir-applique-manoir-nathanael-charpentier.jpg`],
  [trouve('D:/Téléchargements/PORTRAIT ANIMATION', 'Nath-PortraitArt&Ame-Mélo-best-41.jpg'),
   `${A}/portrait/portrait-art-ame-tenue-blanche-fond-clair-nathanael-charpentier.jpg`],
  ['D:/Téléchargements/NathanaelCharpentier-8.jpg',
   `${A}/apropos/portrait-penombre-manifeste-nathanael-charpentier.jpg`],
];

for (const [src, dest] of lot) {
  await sharp(src)
    .resize({ width: 3840, height: 3840, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .withExif({ IFD0: { Copyright: 'Nathanaël Charpentier' } })
    .toFile(dest);
  console.log('→ ' + dest.split('/').slice(-2).join('/'));
}
