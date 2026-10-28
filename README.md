# Ma Boutique — projet statique complet

Ce projet est un exemple de boutique web en français, conçu pour fonctionner sans serveur personnel ni base de données. Il peut être publié gratuitement sur GitHub Pages.

## Fonctions incluses
- Mise en page responsive pour téléphone, tablette et ordinateur.
- Catalogue chargé depuis `products.json`.
- Recherche, filtre par catégorie et tri.
- Panier avec quantités et total estimé.
- Sauvegarde locale du panier via `localStorage` sur le même navigateur/appareil.
- Récapitulatif de commande copiable.
- Manifest PWA et service worker pour cache/hors connexion de base sur une origine HTTPS.
- Illustrations SVG locales, pas besoin de télécharger des photos externes.

## Tester sur Android
1. Décompressez le ZIP.
2. Ouvrez `index.html` dans un éditeur de code pour modifier le projet.
3. Pour voir les fonctions de catalogue et de panier de manière fiable, publiez sur GitHub Pages ou utilisez un serveur local de développement. Certains navigateurs limitent `fetch()` et les service workers quand un fichier est ouvert directement en `file://`.
4. Le site est en mode démonstration : il n'envoie pas réellement les commandes et ne prend pas de paiements.

## Personnaliser le catalogue
Ouvrez `products.json`. Pour chaque produit, modifiez `id`, `name`, `category`, `price`, `description`, `image` et `featured`. Placez l'image dans `images/` et utilisez un chemin relatif comme `images/mon-produit.svg`. Gardez un `id` unique pour chaque produit.

Les prix sont des exemples en TND. Vérifiez vos prix et conditions avant publication.

## Déploiement GitHub Pages
1. Créez ou ouvrez votre dépôt GitHub.
2. Téléversez le contenu de ce dossier à la racine du dépôt (le fichier `index.html` doit être à la racine).
3. Dans GitHub : **Settings → Pages**.
4. Choisissez **Deploy from a branch**, branche `main`, dossier `/ (root)`, puis **Save**.
5. Attendez la publication et ouvrez l'adresse fournie par GitHub Pages.

Les fichiers doivent rester ensemble avec les mêmes noms. Les chemins utilisent des lettres minuscules pour éviter les erreurs de casse.

## Limites importantes
- `localStorage` est local au navigateur : le panier n'est pas synchronisé entre appareils.
- Aucun compte client sécurisé, aucune base de données, aucun inventaire partagé et aucun paiement réel.
- Ne placez jamais de mot de passe, clé secrète ou jeton privé dans le code du site.
- Le service worker nécessite HTTPS (GitHub Pages fournit HTTPS) ou localhost. Après changement des fichiers, le cache peut nécessiter un rechargement forcé ou une mise à jour du nom du cache dans `sw.js`.
- Les polices Google sont optionnelles; elles nécessitent une connexion. Le site utilise des polices de secours si elles ne chargent pas.
