# Remplacer l'ancien site par le nouveau, sur OVH

*Dernière vérification du domaine : 18 septembre 2026.*

## Ce qui est en place aujourd'hui

`nathanaelcharpentier.com` répond, et **ce n'est pas un site abandonné** : c'est un
WordPress servi par Apache en PHP 7.4, dont la page d'accueil a été modifiée le matin
même de cette vérification. Son titre est « Nathanael Charpentier Photographe de Mariage
et Famille en région Centre Val de Loire ».

Son sitemap déclare **97 adresses**, mais la plupart sont des pages de démonstration
livrées avec le thème (`/masonry-6-columns/`, `/portfolio-slider/`, `/test-headings/`,
`/shop/`, `/cart/`, `/checkout/`…). Le contenu réel tient en une quinzaine d'adresses,
toutes redirigées par le fichier `public/.htaccess` de ce dépôt.

## Ce que le changement implique pour le référencement

Le domaine est connu de Google depuis 2019. **On garde son ancienneté et son autorité** :
il ne s'agit pas d'un nouveau site, mais du même domaine avec un contenu neuf. C'est le
scénario le plus favorable.

La condition est simple : **chaque ancienne adresse doit rediriger en 301** vers son
équivalent. Sans cela, les visiteurs venus d'un vieux résultat Google tombent sur une
404 et le référencement accumulé se perd. Avec, il se transfère.

Compter **2 à 6 semaines de flottement** après la bascule, le temps que Google recrawle
l'ensemble. Ensuite, le nouveau site part avec plusieurs avantages sur l'ancien : il est
statique donc rapide, pensé pour le téléphone, il porte des données structurées, des FAQ
extractibles par les moteurs de réponse, et surtout une dizaine de pages de contenu réel
là où l'ancien n'en avait presque aucune.

## La marche à suivre

### 1. Avant de toucher au domaine

- Déclarer `nathanaelcharpentier.com` dans **Google Search Console** et exporter la liste
  des pages qui reçoivent réellement des visites. Si une adresse populaire manque dans le
  `.htaccess`, l'ajouter.
- **Sauvegarder l'ancien WordPress** : fichiers et base. On ne supprime rien avant que les
  redirections soient vérifiées en ligne.

### 2. Construire le site

```bash
npm run build
```

Le dossier `dist/` contient alors tout le site : HTML, images, polices, plus
`.htaccess` et `contact.php` recopiés depuis `public/`.

⚠️ **Retirer le `noindex` de la démo** : il est conditionné par la variable
`BASE_PATH`. Une construction sans cette variable produit déjà les bonnes balises et les
bonnes URL canoniques ; vérifier avant d'envoyer qu'aucune page de `dist/` ne contient
`noindex`.

### 3. Envoyer sur OVH

Déposer **le contenu** de `dist/` à la racine de l'hébergement (souvent `www/`), pas le
dossier lui-même. En FTP, en SFTP ou par le gestionnaire de fichiers OVH.

Vérifier que `.htaccess` est bien monté : c'est un fichier caché, beaucoup de clients FTP
le masquent par défaut.

### 4. Vérifier les redirections

Une fois en ligne, tester quelques anciennes adresses. Chacune doit répondre `301` et
mener à la bonne page :

```bash
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://nathanaelcharpentier.com/about/
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://nathanaelcharpentier.com/contact-2/
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://nathanaelcharpentier.com/portfolio/mariage-a-deauville-de-marine-hugo/
```

### 5. Le formulaire de contact

`contact.php` fonctionne sur OVH, qui exécute le PHP. Il faut encore :

- créer l'adresse **`contact@nathanaelcharpentier.com`** si elle n'existe pas ;
- créer **`site@nathanaelcharpentier.com`**, l'expéditeur technique des notifications ;
- configurer **SPF, DKIM et DMARC** dans la zone DNS OVH. Sans cela les notifications
  partent en spam et le formulaire échoue en silence, ce qui est pire qu'un formulaire
  cassé : personne ne s'en aperçoit.

Tester en envoyant une vraie demande, et vérifier que l'accusé de réception arrive aussi.

### 6. Après la bascule

- Envoyer le sitemap `https://nathanaelcharpentier.com/sitemap-index.xml` à Search Console.
- Surveiller le rapport de couverture pendant un mois : les 404 qui remontent signalent
  une redirection oubliée.
- Garder l'ancien WordPress hors ligne mais sauvegardé quelques mois.

## Ce qui reste à valider avant la mise en ligne publique

1. **La grille tarifaire mariage** (2 700 / 3 300 / 4 800 €) et le **retrait de
   Portrait: Art & Âme de studio-nathsam.com**, où l'offre est encore affichée à 550 €.
   Tant que ce n'est pas fait, le même produit existe à deux prix sur deux sites du même
   photographe.
2. **Les accords de droit à l'image** des personnes nommées dans les fichiers. En
   attendant, aucun nom n'est publié dans les textes alternatifs.
3. **Une relecture de la version anglaise par un anglophone natif.**
4. **Un message de courtoisie** aux clients cités dans les sections « Leurs mots »
   (Justine, Camille, Adarsh, Melissa, les parents), recommandé par la note n°2.
