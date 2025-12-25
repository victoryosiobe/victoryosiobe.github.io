const SW_VERSION = "v0" //+ Date.now(); // bump this to clear cache
const ASSET_CACHE = `asset-cache-${SW_VERSION}`;
const MAX_AGE = 48 * 60 * 60 * 1000; // 48h

// Helper to log to page console
function logToPage(...args) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => client.postMessage({
      type: 'SW_LOG',
      args: args,
    }));
  });
}

logToPage('Service Worker: Script loaded, version ' + SW_VERSION);

self.addEventListener("install", event => {
  logToPage('Service Worker: Install event fired');
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  logToPage('Service Worker: Activate event fired');
  
  event.waitUntil(
    caches.keys().then(keys => {
      const oldCaches = keys.filter(k => k.startsWith("asset-cache") &&
        k !== ASSET_CACHE);
      logToPage(
        `Service Worker: Deleting ${oldCaches.length} old caches`,
        oldCaches);
      
      return Promise.all(
        oldCaches.map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (!isMediaRequest(req)) return;
  
  logToPage('Service Worker: Intercepting asset request', req.url);
  
  event.respondWith(
    caches.open(ASSET_CACHE).then(async cache => {
      const cached = await cache.match(req);
      const metaKey = req.url + ':meta';
      
      if (cached) {
        // Check metadata stored separately
        const metaCache = await caches.open(ASSET_CACHE + '-meta');
        const metaResponse = await metaCache.match(metaKey);
        
        if (metaResponse) {
          const meta = await metaResponse.json();
          if (Date.now() - meta.cachedAt < MAX_AGE) {
            logToPage('Service Worker: Serving from cache', req.url);
            return cached;
          } else {
            logToPage('Service Worker: Cache expired', req.url);
          }
        }
      }
      
      logToPage('Service Worker: Fetching from network', req.url);
      const network = await fetch(req);
      
      if (network.status !== 200) {
        logToPage('Service Worker: Network fetch failed', { url: req
            .url, status: network.status });
        return network;
      }
      
      // Store the asset
      cache.put(req, network.clone());
      
      // Store metadata separately
      const metaCache = await caches.open(ASSET_CACHE + '-meta');
      const metaData = { cachedAt: Date.now() };
      metaCache.put(metaKey, new Response(JSON.stringify(metaData)));
      
      logToPage('Service Worker: Cached new asset', req.url);
      
      return network;
    }).catch(err => {
      logToPage('Service Worker: Fetch error', err.message);
      return fetch(req);
    })
  );
});


function isMediaRequest(req) {
  // 0. Explicit app-level intent (authoritative)
  if (req.headers.get("sw-type-classification") === "asset") {
    return true;
  }
  
  // 1. Native browser signal
  if (["image", "video", "audio", "font"].includes(req.destination)) {
    return true;
  }
  
  // 2. Accept header intent (JS fetch fallback)
  const accept = req.headers.get("accept") || "";
  
  if (
    accept.includes("image/") ||
    accept.includes("video/") ||
    accept.includes("audio/") ||
    accept.includes("font/") ||
    accept.includes("application/octet-stream")
  ) {
    return true;
  }
  
  // 3. URL-based heuristic (last resort)
  try {
    const { pathname } = new URL(req.url);
    return /\.(png|jpe?g|gif|webp|svg|mp4|webm|mp3|wav|ogg|woff2?|ttf|otf||css||js)$/i
      .test(pathname);
  } catch {
    return false;
  }
}