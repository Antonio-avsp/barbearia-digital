const CACHE_NAME = 'barbearia-cache-v1';
const APP_FILES = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/clientes.js',
  './js/servicos.js',
  './js/barbeiros.js',
  './js/agendamentos.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
