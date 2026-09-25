# Mettre le nouveau site en ligne sur OVH

*Procédure vérifiée le 25 septembre 2026.*

## Ce qui est en place aujourd'hui

- `nathanaelcharpentier.com` est un **WordPress** sur un hébergement mutualisé **OVH**
  (Apache, PHP 7.4, serveurs DNS `ns18.ovh.net` / `dns18.ovh.net`).
- Les **mails du domaine sont déjà chez OVH** (MX `mx1/2/3.mail.ovh.net`) et le **SPF** est
  en place (`v=spf1 include:mx.ovh.com ~all`). Pas encore de DMARC.
- L'ancien site affiche l'adresse Gmail de Nathanaël comme contact.

Le domaine est connu de Google depuis 2019 : on garde son ancienneté. Chaque ancienne
adresse est redirigée en 301 vers sa page équivalente par `public/.htaccess` ; les pages de
démonstration du thème répondent 410 pour que Google les oublie. Compter 2 à 6 semaines
de flottement dans les résultats, le temps que Google repasse partout.

## 1. Préparer le dossier à envoyer

```bash
npm run ovh
```

Construit la version de production et la copie dans `livraison-ovh/` après avoir vérifié
qu'aucune page ne porte le `noindex` de la démo ni son adresse GitHub. Si quelque chose
cloche, la commande refuse et dit pourquoi.

## 2. Dans l'espace client OVH (www.ovh.com/manager, rubrique Web Cloud)

1. **Hébergements** > l'hébergement du domaine > onglet **Multisite** : noter le
   *dossier racine* de `nathanaelcharpentier.com` (en général `www`).
2. Onglet **FTP - SSH** : noter le *serveur FTP* (`ftp.clusterXXX.hosting.ovh.net`) et
   l'*identifiant*. Mot de passe oublié : « Modifier le mot de passe » sur la même page.
3. Onglet **Bases de données** : sur la base du WordPress, « Créer une sauvegarde ».
4. Onglet **Emails** (ou « Scripts ») : vérifier que l'envoi d'e-mails par les scripts est
   **actif**. C'est ce qui permet au formulaire d'envoyer.
5. **Emails** > `nathanaelcharpentier.com` :
   - créer `contact@nathanaelcharpentier.com`, soit en **redirection** vers la boîte Gmail
     de Nathanaël (le plus simple : tout arrive là où il lit déjà ses mails), soit en vraie
     **boîte e-mail** s'il veut aussi répondre depuis cette adresse ;
   - créer `site@nathanaelcharpentier.com` en **redirection** vers la même boîte. C'est
     l'expéditeur des notifications du formulaire ; les éventuels retours y arriveront.
6. **Noms de domaine** > `nathanaelcharpentier.com` > **Zone DNS** > « Ajouter une
   entrée » > **TXT** : sous-domaine `_dmarc`, valeur `v=DMARC1; p=none`. Le SPF existe déjà.

## 3. Remplacer l'ancien site (FileZilla)

1. FileZilla > Gestionnaire de sites > Nouveau site : protocole **FTP**, hôte = serveur
   FTP noté plus haut, chiffrement « FTP explicite sur TLS si disponible », identifiant et
   mot de passe OVH.
2. Menu **Serveur > Forcer l'affichage des fichiers cachés** : sans cela, `.htaccess`
   n'apparaît pas et n'est pas envoyé.
3. À côté de `www`, créer un dossier `www-nouveau`.
4. Ouvrir `livraison-ovh/` à gauche, **tout sélectionner à l'intérieur** (y compris
   `.htaccess`) et le glisser dans `www-nouveau`. Environ 1 700 fichiers, 455 Mo.
   Pendant l'envoi, l'ancien site reste en ligne. À la fin, l'onglet « Transferts
   échoués » doit être vide.
5. **L'échange, sans rien supprimer** : renommer `www` en `ancien-site-wordpress`, puis
   `www-nouveau` en `www` (le nom du dossier racine noté à l'étape 2.1). Le site bascule en
   quelques secondes. L'ancien WordPress sort du web mais reste intact sur le serveur :
   retour arrière en renommant à l'envers.

## 4. Vérifier en ligne

- `https://nathanaelcharpentier.com` affiche le nouveau site (fenêtre de navigation privée).
- `http://www.nathanaelcharpentier.com` arrive sur `https://nathanaelcharpentier.com`.
- Anciennes adresses : chacune doit mener à la bonne page.

```bash
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://nathanaelcharpentier.com/about/
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://nathanaelcharpentier.com/contact-2/
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" https://nathanaelcharpentier.com/portfolio/mariage-a-deauville-de-marine-hugo/
```

- **Formulaire** : envoyer une vraie demande depuis `/contact/` puis depuis `/en/contact/`.
  La notification doit arriver à `contact@`, et l'accusé de réception dans la boîte de
  l'expéditeur (regarder aussi les indésirables la première fois).

## 5. Après la bascule

- **Google Search Console** : ajouter la propriété de domaine `nathanaelcharpentier.com`
  (vérification par un enregistrement TXT dans la zone DNS OVH), puis envoyer le sitemap
  `https://nathanaelcharpentier.com/sitemap-index.xml`.
- Surveiller le rapport « Pages » pendant un mois : une 404 qui remonte signale une
  ancienne adresse oubliée, à ajouter dans `public/.htaccess`.
- Garder `ancien-site-wordpress` et la sauvegarde de la base quelques mois, puis supprimer.
- Recommandé : passer la version PHP de l'hébergement de 7.4 à 8.x (onglet
  « Informations générales »). `contact.php` fonctionne avec les deux.

## Mettre à jour le site ensuite

Modifier, puis `npm run ovh`, puis renvoyer le contenu de `livraison-ovh/` dans `www`
(FileZilla propose d'écraser : « Écraser si la source est plus récente »).

## Protection anti-spam du formulaire (`contact.php`)

Sans captcha, invisible pour les visiteurs :

- champ piège caché, que seuls les robots remplissent ;
- formulaire rempli en moins de 3 secondes, mesuré par le navigateur : écarté ;
- envoi depuis un autre site que le nôtre : écarté ;
- une seule demande par minute et par adresse IP ;
- un lien dans le nom, ou plus de deux liens dans le message : écarté ;
- retours à la ligne neutralisés dans tout ce qui part en en-tête de mail ;
- l'adresse e-mail n'apparaît jamais en clair dans les pages.

Un robot écarté voit la page de remerciement : il ne sait pas qu'il a été filtré.

## Ce qui reste à valider côté contenu

1. La grille tarifaire mariage (2 700 / 3 300 / 4 800 €) et le retrait de
   Portrait: Art & Âme de studio-nathsam.com, où l'offre est affichée à 550 €.
2. Les accords de droit à l'image des personnes nommées dans les fichiers.
3. Une relecture de la version anglaise par un anglophone natif.
4. Un message de courtoisie aux clients cités (Justine, Camille, Adarsh, Melissa, les parents).
