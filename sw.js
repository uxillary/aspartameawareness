const CACHE_NAME = 'aspartame-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/events.html',
  '/get-involved.html',
  '/privacy.html',
  '/support.html',
  '/service.html',
  '/list-risks.html',
  '/research.html',
  '/404.html',
  '/FAQ\'s.html',
  '/css/main.css',
  '/js/main.js',
  '/js/jquery.min.js',
  '/js/browser.min.js',
  '/js/breakpoints.min.js',
  '/js/util.js',
  '/js/sidebar-list.js',
  '/js/mini-posts-home.js',
  '/js/list-posts.js',
  '/js/random-author.js',
  '/js/search-box.js',
  "/blogs/adhd.html",
  "/blogs/alternatives.html",
  "/blogs/aspartame-side-effects.html",
  "/blogs/aspartame.html",
  "/blogs/ban.html",
  "/blogs/carcinogenic.html",
  "/blogs/detox.html",
  "/blogs/diabetes.html",
  "/blogs/e951.html",
  "/blogs/methanol.html",
  "/blogs/phenylalanine.html",
  "/blogs/understanding.html",
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
    ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
