/* Cache hors connexion de base. Modifier CACHE_NAME après chaque mise à jour importante. */
const CACHE_NAME = "ma-boutique-v1";
const CORE_FILES = [
  "./", "./index.html", "./style.css", "./app.js", "./products.json",
  "./manifest.webmanifest", "./icons/logo.svg", "./icons/app-icon.svg",
  "./icons/product-placeholder.svg", "./images/sac.svg", "./images/lampe.svg",
  "./images/ecouteurs.svg", "./images/gourde.svg", "./images/carnet.svg",
  "./images/plante.svg", "./images/montre.svg", "./images/support.svg"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response && response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)); }
    return response;
  }).catch(() => caches.match("./index.html"))));
});
