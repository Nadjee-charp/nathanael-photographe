# Direction artistique — nathanaelcharpentier.com

Document de référence interne. Conforme au rapport v3 (juillet 2026) : architecture iceberg, mots interdits, une seule invitation au contact, luxe silencieux.

## Concept

**« La bonne place »** — le site se comporte comme le photographe : présent, jamais démonstratif. On entre dans un espace, on regarde ; ensuite seulement, on lit. Chaque écran porte une idée. La lenteur des transitions est le luxe ; rien ne rebondit, rien ne clignote, rien ne vend.

## Palette

| Rôle | Couleur | Usage |
|---|---|---|
| Fond clair | `#F4F1EB` (ivoire) | pages, respiration |
| Encre | `#141311` (noir profond chaud) | textes, fonds sombres des galeries |
| Fusain | `#2A2724` | surfaces sombres secondaires |
| Accent | `#9C7A50` (bronze sépia) | filets, liens actifs, détails — jamais en aplat |
| Gris pierre | `#8B8680` | légendes, métadonnées |

Le bronze sépia renvoie aux tirages virés et au portrait fusain d'Art & Âme. Trois couleurs perçues maximum par écran. Les galeries mariage/portrait vivent sur fond `#141311` (les images flottent) ; les pages éditoriales sur ivoire.

## Typographie (2 familles, auto-hébergées)

- **Cormorant Garamond** (serif à fort contraste) — titres display en casse mixte, grands corps (clamp 2.5–6rem), italiques pour les phrases suspendues. Corps de texte éditorial en 19–21px, interligne 1.7.
- **Jost** (géométrique, filiation Futura) — navigation, labels, boutons : petites capitales, letter-spacing 0.14–0.22em, graisse 300–400. C'est le code Chanel/Céline transposé.

Hiérarchie par la taille et l'espace, jamais par la couleur.

## Logo (refonte)

Wordmark typographique pur — le luxe moderne n'orne pas :

```
N A T H A N A Ë L
———— CHARPENTIER ————
```

- « NATHANAËL » : Cormorant Garamond Light, capitales, tracking large.
- « CHARPENTIER » : Jost, capitales plus petites, tracking très large, encadré de filets fins (hairlines) bronze.
- Monogramme « N̄C » (N et C entrelacés par un filet) pour favicon, chargements, tampon d'images.
- Déclinaisons : encre sur ivoire / ivoire sur encre. L'ancien vert canard disparaît.
- Livrable : SVG vectorisé (paths), variantes horizontale, empilée, monogramme.

## Layout et rythme

- **Accueil** : image plein écran (fetchpriority=high), nom, puis l'accroche au scroll : « Certaines images ne se prennent pas. Elles se méritent. » → deux portes (Portrait / Mariage) → extrait du manifeste → sélection courte → invitation unique au contact.
- **Galeries** : 15–20 images, alternance de formats (pleine largeur / diptyque / colonne portrait), légendes discrètes (lieu, année). Pas de lightbox gadget : défilement éditorial.
- **Grille** : 12 colonnes, gouttières généreuses, largeur de lecture 65ch max, sections espacées de 20–30vh.
- **FAQ** : accordéons repliés en bas de Portrait et Mariage (schema FAQPage), typographie sobre.
- **Footer** : le sous-sol de l'iceberg — Journal, pages territoires, /en/, mentions, NAP canonique (1 bis rue Gambetta, 45500 Gien).

## Motion

Fondus 600–900 ms, translations ≤ 24px, scale 1.02–1.04 au survol des vignettes, parallaxe ≤ 6% sur les heros. Courbe unique `cubic-bezier(0.22, 1, 0.36, 1)`. `prefers-reduced-motion` : tout devient instantané. Aucun rebond — registre volontairement opposé au motion punchy : ici, la lenteur est le luxe.

## Interdits (rappel rapport)

Mots bannis : sensibilité, émotion, authenticité, bienveillance, unique, professionnel, passion. Pas de grille tarifaire visible (le « à partir de » vit dans les FAQ). Pas de boutons « réservez » répétés. Vouvoiement constant. « Portrait: Art & Âme® » mentionné UNE fois.

## Stack technique

Astro (statique, HTML crawlable par construction) + images `<picture>` AVIF/WebP/JPEG via sharp + i18n /en/ avec hreflang + JSON-LD (Person, LocalBusiness, FAQPage, ImageObject) + .htaccess (301 des ~50 vraies URLs, 410 des ~90 pages démo). Fonts en woff2 auto-hébergées, préchargées. Budget : LCP < 2,5s, INP < 200ms, CLS < 0,1.
