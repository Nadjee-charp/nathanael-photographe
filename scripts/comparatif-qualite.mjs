// Comparaison a 100 % : ancien reglage (master 2800 q82 -> webp q76)
// contre nouveau (master 3840 q92 -> webp q88), sur un detail de visage.
import sharp from 'sharp';

const ORIGINAL =
  'assets/_livraison-aout/Photos site/Portrait/portrait-justine-bourrelier-mains-visage-studio-gien-nathanael-charpentier.jpg';
const SORTIE = 'assets/_planches-aout/comparatif-qualite.jpg';
const LARGEUR_RENDU = 1500; // largeur a laquelle l'image est affichee
const CROP = 620; // taille du detail extrait, en pixels 1:1

async function chaine(maxMaster, qMaster, qWeb) {
  const master = await sharp(ORIGINAL)
    .resize({ width: maxMaster, height: maxMaster, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: qMaster, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toBuffer();
  const web = await sharp(master).resize({ width: LARGEUR_RENDU }).webp({ quality: qWeb }).toBuffer();
  return { buf: await sharp(web).png().toBuffer(), ko: Math.round(web.length / 1024) };
}

const avant = await chaine(2800, 82, 76);
const apres = await chaine(3840, 92, 88);

const meta = await sharp(avant.buf).metadata();
const left = Math.round(meta.width * 0.32);
const top = Math.round(meta.height * 0.14);
const zone = { left, top, width: Math.min(CROP, meta.width - left), height: Math.min(CROP, meta.height - top) };

const a = await sharp(avant.buf).extract(zone).toBuffer();
const b = await sharp(apres.buf).extract(zone).toBuffer();

const L = zone.width;
const H = zone.height;
const bandeau = 54;

const etiquette = (txt, ko) =>
  Buffer.from(
    `<svg width="${L}" height="${bandeau}"><rect width="100%" height="100%" fill="#141311"/><text x="14" y="35" font-family="Arial" font-size="26" fill="#F4F1EB">${txt}</text><text x="${L - 14}" y="35" text-anchor="end" font-family="Arial" font-size="22" fill="#9C7A50">${ko} Ko</text></svg>`
  );

await sharp({ create: { width: L * 2 + 8, height: H + bandeau, channels: 3, background: { r: 20, g: 19, b: 17 } } })
  .composite([
    { input: etiquette('AVANT — master 2800 q82, WebP q76', avant.ko), left: 0, top: 0 },
    { input: a, left: 0, top: bandeau },
    { input: etiquette('APRES — master 3840 q92, WebP q88', apres.ko), left: L + 8, top: 0 },
    { input: b, left: L + 8, top: bandeau },
  ])
  .jpeg({ quality: 96, chromaSubsampling: '4:4:4' })
  .toFile(SORTIE);

console.log(`Detail 1:1 ${L}x${H} — avant ${avant.ko} Ko / apres ${apres.ko} Ko`);
console.log(SORTIE);
