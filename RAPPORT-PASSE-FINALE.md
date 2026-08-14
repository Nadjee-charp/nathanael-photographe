# Rapport de fin — passe du 14 août 2026

Site : `nathanael-photographe` (Astro) · 27 pages · démo GitHub Pages
Référence : `INSTRUCTIONS_CLAUDE_CODE.md` du zip `studionathsam__brief_FINAL`,
complété par `faq-budget-mariage` et `faq-styles-photo`.

---

## 1. Les cinq corrections demandées

| # | Demande | Fait |
|---|---|---|
| 1 | Plus de vidéo, un diaporama photo en boucle par catégorie | ✅ Portrait : 8 images, 5 s · Mariage : 12 images, 4 s, dans l'ordre des dossiers ANIMATION |
| 1 | Pas de contour gris autour des images | ✅ passage de `contain` à `cover` : l'image remplit le bandeau au pixel près |
| 2 | Un bandeau, pas tout l'écran | ✅ hauteur bornée (`clamp(26rem, 74svh, 46rem)`) ; la section suivante est visible sans défiler |
| 2 | Ne pas couper les visages | ✅ ancrage par image sur les trois cadrages serrés (chapeau melon, fou rire, visage de près) |
| 3 | Contact : remettre la main qui écrit | ✅ `ecriture-rai-lumiere` |
| 4 | À propos : tout remettre en forme | ✅ voir §2 |
| 5 | Barre de navigation toujours gris foncé | ✅ barre pleine `--fusain` sur les 27 pages, section ivoire dessous |

### Détail du cadrage

Le bandeau mesure 2327 × 736 px sur un écran large, et l'image rendue fait
exactement 2327 × 736 : aucun liseré possible. Sur mobile (375 px), 375 × 471,
même résultat, sans débordement horizontal.

Les cadrages ont été simulés hors navigateur (`scripts/verif-cadrage.mjs`) et
vérifiés à l'œil sur les 20 images des deux bandeaux : aucun visage coupé.

---

## 2. Page À propos

- **Manifeste** : une seule image paysage (`NathanaelCharpentier-8`) à gauche, en
  position collante. Mesuré en direct : texte 719 px / image 449 px, soit **1,6 ×**
  (la demande était ≥ 1,5 ×).
- **« Montré, pas revendiqué »** : chaque distinction tient sur **deux lignes**,
  l'intitulé en petites capitales bronze puis ce qu'il recouvre en romain.
  Huit entrées, séparées par un filet.
- **`Nath--1`** à droite de la liste, en format original, collante et alignée sur
  le haut de la liste, avec une légende.
- Les trois autres portraits (`Nath--14`, `Nath--9`, `NathanaelCharpentier-15`)
  forment un **triptyque** en pied de page au lieu d'être dispersés.

---

## 3. Réorganisation des photos

### Portrait

Les 43 images sont ordonnées à la main, pas alphabétiquement :

- **Jamais deux images de la même personne côte à côte.** Les séries identifiées
  sur planche contact (Kaptan Emrah, Ludmila Berlinskaya, Justine Bourrelier,
  Maëlle Menotti, les séances Art & Âme) sont écartées de 5 à 15 positions.
- **Alternance couleur / noir et blanc** et **sombre / clair** à chaque rang.
  Luminance et saturation mesurées par `scripts/analyser-photos.mjs` : sur les
  266 photos analysées, 100 sont sombres et 119 en noir et blanc.

### Mariage

Chaque lieu du fonds apparaît au moins une fois dans les 26 images :
Val de Loire (Grand Courtoiseau, Pont-Chevron, la Bourdaisière), Val-d'Oise
(Champlâtreux, Saint-Martin-du-Tertre), Eure-et-Loir (Baronville), Yonne
(Vallery), Paris (Palais-Royal, Bir-Hakeim, péniche), Normandie (Coppélia,
Trouville, Deauville), La Palmyre, Corse (Santa Giulia, Murtoli), Marrakech,
île Maurice, Andalousie, Bruxelles, Seychelles.

---

## 4. Images intégrées

**155 nouvelles images**, 116,2 Mo → 78,7 Mo après compression, EXIF nettoyé
sauf le copyright.

| Dossier | Nb | Destination |
|---|---|---|
| `paris/` | 25 | mariage sur péniche → page Paris |
| `normandie/` | 21 | Trouville + Coppélia → page Normandie |
| `corse/` | 26 | Santa Giulia (23) + Murtoli (3) → page Corse |
| `destination/` | 79 | Marrakech 35, Maurice 17, Andalousie 11, Bruxelles 9, Seychelles 7 |
| `mariage/` | +4 | château de Vallery → galerie générale |

Plus trois images nommées à la main faute de nom SEO fourni :
`mariee-couloir-applique-manoir` (Vickie & Ludvig),
`portrait-art-ame-tenue-blanche-fond-clair` (PortraitArt&Ame-Mélo-41),
`portrait-penombre-manifeste` (NathanaelCharpentier-8).

**[I-03] levé** : la table officielle de Sam est arrivée. 235 textes alternatifs
sont désormais repris **littéralement**. Régénérable par `node scripts/generer-alts.mjs`.

---

## 5. Nouvelles pages

| URL | Images | Statut brief |
|---|---|---|
| `/photographe-mariage-corse/` | 27 | [N-04] vague 1 |
| `/en/corsica-wedding-photographer/` | 12 | [N-04], Murtoli en tête |
| `/mariage-destination/` | 42 | [N-05] vague 2 |
| `/en/destination-weddings/` | 30 | [N-05], Andalousie en tête |

Paris passe de 15 à 31 images, Normandie de 15 à 32.
Maillage : pied de page, `TITRES` du rideau de transition, `areaServed` du JSON-LD.

---

## 6. Tarifs

Arbitrage retenu : la grille du document **budget mariage**, plus récente et plus
détaillée que le zip.

| Formule | Montant |
|---|---|
| L'Expérience — six heures | 2 700 € |
| La Signature — dix heures | 3 300 € |
| L'Héritage — quatorze heures | 4 800 € |

Le plancher passe de 2 800 € à **2 700 €** sur les six pages concernées, FR et EN.
Deux réponses de FAQ ajoutées sur la page Mariage : « pourquoi ce prix » et
« les styles de photographie ».

⛔ **À valider par Sam** : ces montants contredisent le [M-G5] du zip (2 800 €).

---

## 7. Ce qui reste bloquant avant mise en ligne

| # | Bloquant | Responsable |
|---|---|---|
| 1 | Validation de la grille mariage 2 700 / 3 300 / 4 800 € contre le 2 800 € du zip | Sam |
| 2 | Validation de la grille portrait (1 200 / 1 950 €) et **retrait d'Art & Âme de studio-nathsam.com** | Sam + Nathanaël |
| 3 | Validation des tarifs pre-wedding EN (1 200 / 2 200 €) | Sam |
| 4 | Accords droit à l'image des 7 personnalités nommées — les alts restent neutres en attendant | Nathanaël |
| 5 | Validation du texte « Le contrebassiste » contre la conférence réelle | Nathanaël |
| 6 | Relecture anglophone native de toute la version EN | Sam |
| 7 | Backend du formulaire de contact (GitHub Pages n'exécute pas de PHP) | Nadjee + Sam |
| 8 | Redirections 301 depuis l'ancien nathanaelcharpentier.com | Nadjee + Sam |
| 9 | Enregistrement INPI accordé avant tout usage du ® | Sam |

### Points à confirmer, sans blocage

- **`Portrait: Art & Âme`** s'écrit sans espace avant les deux-points, comme la
  marque déposée l'orthographie dans le brief. La typographie française voudrait
  « Portrait : Art & Âme ». Huit occurrences, une ligne à changer si vous préférez.
- **`Nath--1`** a été placé à côté de « Montré, pas revendiqué » comme demandé.
  Sur cette image le photographe est au travail en salle de concert, tête baissée ;
  celui qui sourit franchement est `Nath--14`, aujourd'hui dans le triptyque.
  L'échange se fait en une ligne.
- Les 🔶 du brief restent ouverts : identité du musicien à l'archet, localisation
  du banc parisien, orthographe « Villette », nom de la passerelle sur la Seine,
  province andalouse, montagne mauricienne, réception aux Jardins de Coppélia.

---

## 8. Poids

| | Avant | Après |
|---|---|---|
| Sources versionnées | 111 Mo | **191 Mo** (320 images) |
| Build `dist/` | ~250 Mo | **432 Mo** (1 154 variantes WebP) |

Le site reste sous la limite de 1 Go de GitHub Pages, mais le déploiement s'allonge.
Le brief visait 30 Mo : cet objectif supposait une centaine d'images sans jeu
responsive. Avec 320 images et quatre à cinq variantes chacune, il n'est pas
atteignable sans baisser la qualité — ce qui avait déjà été refusé une fois.
Les variantes inutiles ont été supprimées (une image de duo ne dépasse jamais
36 rem à l'écran : au-delà de 1 400 px, plus rien n'est généré).

**Piste si le poids devient gênant** : passer les masters des lots 1 et 2 de
3 840 à 2 560 px, comme le 3ᵉ lot. Gain estimé : 40 %, sans effet visible à
l'écran. À décider ensemble.

---

## 9. Fichiers touchés

**Composants** : `HeroDiaporama` (réécrit), `Header`, `Hero`, `Galerie`, `Footer`
**Layout** : `Base` (prop `entete` retirée)
**Bibliothèque** : `photos.ts` (4 nouveaux dossiers, 283 alts), `site.ts` (TITRES, zone)
**Pages** : 20 pages modifiées, 4 créées
**Scripts** : `importer-lot3`, `importer-nommees`, `generer-alts`, `analyser-photos`,
`planche`, `verif-cadrage`

**Supprimé** : `public/video/` — les trois fichiers de la vidéo Art & Âme (12 Mo).
