// Keeps the app working without internet. Bump VERSION when files change.
const VERSION = 'piper-v3';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'fonts/fonts.css',
  'fonts/secular-one-hebrew-400-normal.woff2', 'fonts/secular-one-latin-400-normal.woff2',
  'fonts/varela-round-hebrew-400-normal.woff2', 'fonts/varela-round-latin-400-normal.woff2',
  'fonts/amatic-sc-hebrew-700-normal.woff2', 'fonts/amatic-sc-latin-700-normal.woff2',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))); self.clients.claim(); });
// Network first so updates arrive, cache as fallback when offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true })));
});
