/* eslint-disable no-undef */
// This service worker file is effectively a 'no-op' that will reset any
// previous service worker registered for the same host:port combination.
// In the production build, this file is replaced with an actual service worker
// file that will precache your site's local assets.
// See https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('fetch', function(event) {
  console.log('SW', event.request.url);
  if (/audio\//.test(event.request.url)) {
    console.log('SW', event.request.url);
    event.respondWith(
      caches.open('audio').then(function(cache) {
        console.log('matched!', event.request.url);
        return cache.match(event.request).then(function(response) {
          return (
            response ||
            fetch(event.request).then(function(response) {
              cache.put(event.request, response.clone());
              return response;
            })
          );
        });
      }),
    );
  }
});

self.addEventListener('activate', () => {
  self.clients.matchAll({ type: 'window' }).then(windowClients => {
    for (let windowClient of windowClients) {
      // Force open pages to refresh, so that they have a chance to load the
      // fresh navigation response from the local dev server.
      windowClient.navigate(windowClient.url);
    }
  });
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL('/index.html'), {
  // eslint-disable-next-line no-useless-escape
  blacklist: [/^\/_/, /\/[^\/?]+\.[^\/]+$/],
});
