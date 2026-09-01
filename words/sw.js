const CACHE_NAME = 'vocabmaster-v1';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Prompt:wght@400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests, skip loremflickr for caching since it's dynamic
  if (event.request.method !== 'GET' || event.request.url.includes('loremflickr')) return;
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then(fetchRes => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request.url, fetchRes.clone());
          return fetchRes;
        });
      });
    }).catch(() => caches.match('./index.html'))
  );
});
