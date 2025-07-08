const CACHE_NAME = 'aspartame-cache-v1';
const urlsToCache = [
  '/',
  '/index',
  '/about',
  '/events',
  '/get-involved',
  '/privacy',
  '/support',
  '/service',
  '/list-risks',
  '/research',
  '/404',
  '/offline',
  '/faqs',
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
  '/js/dark-mode.js',
  '/js/search-box.js',
  "/blogs/adhd",
  "/blogs/alternatives",
  "/blogs/aspartame-side-effects",
  "/blogs/aspartame",
  "/blogs/ban",
  "/blogs/carcinogenic",
  "/blogs/detox",
  "/blogs/diabetes",
  "/blogs/e951",
  "/blogs/methanol",
  "/blogs/phenylalanine",
  "/blogs/understanding",
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
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match('/offline'))
      );
    })
  );
});
