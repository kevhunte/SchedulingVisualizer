importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js');

const app_cacheName = 'app-cache' // worbox.core.cacheNames.runtime //
const img_cacheName = 'img-cache'
workbox.routing.registerRoute(
    ({request}) => request.destination == "image",
    new workbox.strategies.CacheFirst({
        cacheName: img_cacheName,
        plugins: [
          new workbox.expiration.ExpirationPlugin({
            maxAgeSeconds: 30 * 24 * 60 * 60,
          }),
        ]
    }) // month
);

workbox.routing.registerRoute(
    ({request}) => request.destination != "image",
    new workbox.strategies.CacheFirst({
        cacheName: app_cacheName,
        plugins: [
          new workbox.expiration.ExpirationPlugin({
            maxAgeSeconds: 7 * 24 * 60 * 60,
          }),
        ]
    }), // 7 days - 7 * 24 * 60 * 60
)