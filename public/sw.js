const STATIC_CACHE = 'site-static-v4'
const DYNAMIC_CACHE = 'site-dynamic-v3'
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/img/icons-192x192.png',
  '/img/icons-512x512.png',
  // Fallback page for offline warning:
  '/pages/fallback.html'
]

// Cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size))
      }
    })
  })
}


// Install Service Worker
self.addEventListener('install', evt => (
  // Cache static assets
  evt.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('Caching assets...');
      cache.addAll(ASSETS);
    })
  )
))

// Activate Service Worker
self.addEventListener('activate', evt => (
  // Delete older/other caches
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map(key => caches.delete(key))
      )
    })
  )
))

// Fetch Event
self.addEventListener('fetch', evt => (
  // Access cached requests if possible
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        // Cache dynamically accessed resources
        return caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          limitCacheSize(DYNAMIC_CACHE, 15);
          return fetchRes
        })
      })
    }).catch(() => {
      // If cannot access resource (while offline and not cached)
      if (evt.request.url.indexOf('.html') > -1) {
        return caches.match('/pages/fallback.html');
      }
      // Add logic for other resource types as needed...
    })
  )
))
