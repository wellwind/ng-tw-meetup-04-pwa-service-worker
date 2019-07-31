const cacheUrls = [
  'https://fonts.googleapis.com/css?family=Roboto:300,400,500',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('pomodoro-cdn').then(function(cache) {
      return cache.addAll(cacheUrls);
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (cacheUrls.find(url => url === event.request.url)) {
    event.respondWith(caches.match(event.request));
  }
});
