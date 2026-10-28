# Plan du projet — fonctionnement exact

## Architecture
```text
service-e-commerce/
├── index.html                 Structure et éléments de la page
├── style.css                  Design responsive et couleurs
├── app.js                     Recherche, filtres, panier et interactions
├── products.json              Données du catalogue
├── manifest.webmanifest       Métadonnées d'installation PWA
├── sw.js                      Cache des ressources pour un usage hors ligne limité
├── images/                    Illustrations locales des produits
├── icons/                     Logo, icône et image de remplacement
├── docs/PLAN.md               Ce plan
└── src/
    ├── app.ts                 Exemple TypeScript de typage des produits
    └── styles.scss            Exemple Sass de variables et styles
```

## Parcours d'une page
1. Le navigateur lit `index.html`.
2. `style.css` met en forme les sections et adapte la grille à la largeur de l'écran.
3. `app.js` demande `products.json`, puis affiche les cartes produit. Si le catalogue ne peut pas être lu (par exemple lors d'une ouverture directe en fichier), le script utilise un catalogue de secours intégré.
4. Les boutons « + » ajoutent des quantités au panier.
5. Le panier est enregistré dans `localStorage`, qui reste propre au navigateur et à l'appareil.
6. « Préparer le récapitulatif » compose un texte copiable. Il n'envoie pas la commande à une entreprise.
7. Si le site est publié sur HTTPS, `sw.js` peut mettre en cache les fichiers listés pour un usage hors connexion de base.

## Les technologies et leur rôle
- HTML : structure et contenu de la page.
- CSS : présentation, responsive design, animations légères.
- JavaScript : comportement interactif dans le navigateur.
- JSON : format de données simple pour le catalogue.
- SVG : images vectorielles légères pour le logo et les illustrations.
- Web App Manifest : nom, couleurs et mode d'affichage de l'application web.
- Service Worker : cache contrôlé; il ne remplace pas un serveur ni une base de données.
- TypeScript (`src/app.ts`) : exemple de types pour les produits. Il faut le compiler avant de l'utiliser directement dans un navigateur.
- Sass (`src/styles.scss`) : exemple de variables Sass. Il faut le compiler en CSS avant que le navigateur puisse l'utiliser.
- Markdown : documentation du projet.

## À quoi sert le dossier src ?
`src/app.ts` et `src/styles.scss` sont des exemples de sources avancées. La boutique publiée utilise directement `app.js` et `style.css`, déjà prêts. Modifier les fichiers TypeScript/Sass n'actualise pas automatiquement les fichiers de production sans étape de compilation.

## Sécurité et commerce réel
Ce projet est une vitrine statique. Il ne doit pas être présenté comme un système de paiement ou de commande sécurisé. Pour accepter de vrais paiements, authentifier des clients ou partager les stocks, il faut un prestataire ou un backend adapté.
