// Reproduit exactement ce que le navigateur affiche : fond flouté en cover, puis
// l'image entière posée par-dessus. Sert à juger le rendu à l'œil.
import { readdirSync } from 'node:fs';
import sharp from 'sharp';
sharp.cache(false);
const L = 1425, H = 652, ECHELLE = 0.55;
const l = Math.round(L * ECHELLE), h = Math.round(H * ECHELLE);

const choix = process.argv.slice(3);
const vues = [];
for (const [i, chemin] of choix.entries()) {
  const src = `src/assets/photos/${chemin}`;
  const { width, height } = await sharp(src).metadata();
  // fond : cover, agrandi 1.15, flouté, assombri
  const fond = await sharp(src)
    .resize(Math.round(l * 1.15), Math.round(h * 1.15), { fit: 'cover' })
    .blur(42 * ECHELLE)
    .modulate({ brightness: 0.5, saturation: 0.75 })
    .extract({ left: Math.round(l * 0.075), top: Math.round(h * 0.075), width: l, height: h })
    .toBuffer();
  // image entière : contain
  const e = Math.min(l / width, h / height);
  const net = await sharp(src).resize(Math.round(width * e), Math.round(height * e)).toBuffer();
  const compose = await sharp(fond).composite([{ input: net, gravity: 'center' }]).toBuffer();
  vues.push({ input: compose, top: i * h, left: 0 });
}
await sharp({ create: { width: l, height: h * choix.length, channels: 3, background: '#141311' } })
  .composite(vues).jpeg({ quality: 82 }).toFile(process.argv[2]);
console.log(choix.length + ' aperçus');
