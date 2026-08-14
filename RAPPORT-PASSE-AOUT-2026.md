# Rapport de fin — passe de corrections d'août 2026

Exécuté d'après `INSTRUCTIONS_CLAUDE_CODE.md` (Sam, 13/08/2026) et la note
`credibilite-presse-nadjee.md`. Démo à jour : <https://nadjee-charp.github.io/nathanael-photographe/>

---

## 1. Appliqué

### §2 — Corrections factuelles globales
| Réf. | État | Détail |
|---|---|---|
| M-G1 | ✅ | Contrebassiste corrigé partout : À propos, Journal (article + liste), page Mariage, version EN. Nathanaël est saxophoniste, guitariste, auteur-compositeur ; le contrebassiste est le rôle admiré. Citation « Y être suffisamment pour qu'on m'oublie » et photo de volute conservées. |
| M-G2 | ✅ | « bientôt vingt ans » / « près de vingt ans » / *nearly twenty years*. `anneesMetier: 20`. |
| M-G3 | ✅ | « Portraitiste de France 2021 » et libellé FPJA complet, y compris dans le JSON-LD `award`. |
| M-G4 | ✅ | Passage au « je » (« dites-moi où »). |
| M-G5 | ✅ | 1 200 € / 1 950 € / 2 800 € / 1 200-2 200 €, uniquement en FAQ repliées. Aucune tarification à la durée sur Portrait. |

### §3 — Textes
M-01 à M-27 appliqués. Points notables : accroche « Elles se reçoivent », citation
centrale identique sur Accueil et À propos, suppression des labels « Une porte / Une
autre », refonte complète du corps de la page Mariage, déroulé de séance [M-11ter] en
récit, FAQ tarifaire [M-11bis] (7 questions), manifeste enrichi (confidences, fin
réécrite), liste « Montré, pas revendiqué » complète + **ligne presse/institutions**
(Philharmonie de Paris, Saint-Pétersbourg, Théâtre des Champs-Élysées, Salle Gaveau).
Version EN répercutée intégralement, `One house:` corrigé, locale `en_GB`.

### §4 — Technique
| Réf. | État | Détail |
|---|---|---|
| T-01 | ✅ | `og:image` sur **les 23 pages** (13 visuels 1200×630 générés), + `width`, `height`, `alt`, `twitter:card=summary_large_image`. |
| T-02 | ✅ | `award`, `memberOf` (Carmin avec rôle, Fearless, FPJA), `knowsAbout`, `areaServed` étendu. |
| T-03 | ✅ | `BlogPosting` + `og:type=article` sur les 3 récits du Journal. |
| T-04 | ✅ | `noindex, nofollow` + `robots.txt` bloquant sur la démo, et **canonical auto-référent** sur github.io (plus aucun signal envoyé vers le domaine mort). |
| T-05 | ⚠️ partiel | Endpoint rendu configurable (`FORMULAIRE.endpoint` dans `src/lib/site.ts`). Tant qu'il est vide, la démo affiche un avertissement et renvoie vers l'e-mail. **Le service tiers reste à choisir avec Sam.** |
| T-06 | ⚠️ partiel | `.htaccess` en place (≈40 301 + 410 sur les ~90 pages démo du thème). **La liste Search Console n'a pas été fournie** : à recouper avant mise en ligne. |
| T-07 | ✅ | Rien dégradé : `@graph`, `FAQPage`, `hreflang`, FAQ « réponse d'abord » intacts. |
| T-08 | ✅ | H1 avec mot-clé sur les 4 pages territoire. |

### §5 — Images
- **525,6 Mo → 40,6 Mo** en sources (102 fichiers, 2800 px max, JPEG q82, EXIF nettoyé
  sauf copyright `Nathanael Charpentier`).
- Variantes réellement servies : 469 fichiers, **88 Ko en moyenne**, 40 Mo au total.
  9 variantes dépassent 400 Ko : ce sont les rendus 1920 px, servis uniquement aux
  écrans larges à haute densité. Sur mobile, une image de galerie pèse ~40 Ko.
- [I-02] noms conservés à l'identique. [I-05] dossier `_doublons-retires-de-portrait/`
  non intégré.

### §6 — Nouvelles pages (vague 1)
- `/photographe-mariage-paris/` — 19 images, 3 FAQ
- `/photographe-mariage-normandie/` — 16 images, 3 FAQ
- `/en/pre-wedding-paris-loire-valley/` — 12 images, 4 FAQ, hors navigation, liée
  depuis le footer EN, `/en/weddings/` et la page Loire Valley
- Maillage : footer FR à 5 liens territoires, liens croisés pages ↔ Journal

### Mobile (demande de Nadjee)
Galeries **pleine largeur d'écran et jamais recadrées** (`object-fit: contain`,
sortie de gouttière) ; hero à 88/66 svh avec dégradé renforcé ; navigation compacte
sur une ligne ; zones tactiles ≥ 44 px ; corps à 17 px ; **zéro débordement
horizontal** (vérifié à 375 px).

---

## 2. Non appliqué

| Réf. | Raison |
|---|---|
| **[I-03] alt officiels** | ⛔ L'annexe `Renommage_Photos_Site_Nathanael.md` **n'était pas dans le dossier reçu**. Les 105 alt ont été rédigés d'après les noms de fichiers et le contenu visuel, dans l'esprit demandé. **À remplacer par la table officielle dès réception** — tout est centralisé dans `src/lib/photos.ts`, un seul fichier à modifier. |
| [N-04] Corse, [N-05] Destination | ⛔ Bloqués par le brief lui-même : 1 et 3 images disponibles. Non créées. |
| [N-02b] Châteaux région parisienne | Vague 2 assumée (D-7). Les 12 images sont prêtes. |
| [M-20] Bloc « Deux pratiques » | Aucune action, conformément à D-5. |

## 3. Décisions prises par défaut
1. **Symbole ®** retiré partout (§7.7 le classe en « non encore vrai » et le bloquant 12 exige l'accord INPI). Le texte « approche déposée » est conservé.
2. **[I-06] Personnes nommées** : les 7 personnalités apparaissent dans les noms de
   fichiers (donc les URL) mais **aucun nom n'est publié dans un alt** — option
   « formulation neutre » prévue par le brief, en attendant les accords.
3. **Deux images douteuses** repérées : `baiser-reverbere-pont-alexandre-iii-paris` et
   `couple-banc-jardin-paris` montrent des scènes à la tour Eiffel / au parc qui ne
   correspondent pas à leur nom. Alt rédigés d'après **l'image réelle**, pas le nom.
   À vérifier (à rapprocher de [I-07]).

## 4. Reste bloquant avant mise en ligne
1. Table des alt officiels (Sam)
2. Relecture anglophone native de toute la version EN (Sam)
3. Backend de formulaire : choisir le service et renseigner `FORMULAIRE.endpoint` (Sam)
4. Anciennes URL Search Console pour compléter les 301 (Sam + Nadjee)
5. Validation du texte « Le contrebassiste » vs conférence réelle (Nathanaël)
6. Accords droit à l'image des 7 personnalités (Nathanaël)
7. Validation des tarifs 1 200 / 1 950 / 1 200-2 200 € (Sam) et **retrait d'Art & Âme
   de studio-nathsam.com** (sinon même produit à deux prix)
8. Images Corse (4-6) et Destination (1 par pays) (Nathanaël)
9. Enregistrement INPI accordé avant tout usage du ® (Sam)
10. SIRET et hébergeur dans les mentions légales

## 5. Recette
23/23 pages en HTTP 200 · og:image et twitter:card sur 23/23 · 0 image sans alt ·
0 lien interne cassé (21 testés) · 0 mot interdit · JSON-LD valide partout ·
`noindex` + `robots.txt` actifs sur la démo · aucun débordement horizontal à 375 px.
