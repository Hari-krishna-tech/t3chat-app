const CACHE = 't3chat-v1'

const PRECACHE = [
  '/',
  '/manifest.json',
  '/icon.svg',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (request.method !== 'GET') return
  if (!url.protocol.startsWith('http')) return

  // API / auth / next internals — network only
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/') ||
    url.pathname.startsWith('/__nextjs_')
  ) {
    return
  }

  // Static Next.js assets — cache-first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetchAndCache(request)
      })
    )
    return
  }

  // Navigations — network-first, fall back to cache, then offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone()
          caches.open(CACHE).then((cache) => cache.put(request, clone))
          return response
        })
        .catch(() =>
          caches.match(request).then(
            (cached) => cached || caches.match('/')
          )
        )
    )
    return
  }

  // Everything else — network-first
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone()
        caches.open(CACHE).then((cache) => cache.put(request, clone))
        return response
      })
      .catch(() => caches.match(request))
  )
})

function fetchAndCache(request) {
  return fetch(request).then((response) => {
    const clone = response.clone()
    caches.open(CACHE).then((cache) => cache.put(request, clone))
    return response
  })
}
