const CACHE_NAME = 'aarvi-admin-v1';

// The core shell files to cache for offline routing
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './config.js',
  './pages/login.html',
  './pages/home.html',
  './pages/inventory.html',
  './pages/layout.html',
  './pages/agents.html',
  './pages/accounts.html',
  './images/icon.png'
];

// 1. Install Event: Cache Core Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching Admin Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Force the waiting service worker to become active immediately
  self.skipWaiting(); 
});

// 2. Activate Event: Cleanup Old Caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately without requiring a reload
  self.clients.claim(); 
});

// 3. Fetch Event: Network-First Strategy
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests (like Firestore writes) and external API calls
  if (event.request.method !== 'GET' || event.request.url.includes('firestore.googleapis.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If network fetch is successful, clone it and update the cache silently
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If network fails (Offline), serve the file from the cache
        console.warn('[Service Worker] Network failed, falling back to cache for:', event.request.url);
        return caches.match(event.request);
      })
  );
});
