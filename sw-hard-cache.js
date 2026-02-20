const SW_VERSION = "v0" // bump this to clear cache
const ASSET_CACHE = `asset-cache-${SW_VERSION}`;
const MAX_AGE = 48 * 60 * 60 * 1000; // 48h

// Helper to log to page console
function logToPage(...args) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) =>
      client.postMessage({
        type: "SW_LOG",
        args: args,
      }),
    );
  });
}

self.addEventListener("install", (event) => {
  logToPage("Service Worker: Install event fired");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  logToPage("Service Worker: Activate event fired");
  
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      const oldCaches = keys.filter((k) => k.startsWith("asset-cache") && k !== ASSET_CACHE);
      await Promise.all(oldCaches.map((k) => caches.delete(k)));
      logToPage("Service Worker: Deleted old caches", oldCaches);
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", async (event) => {
  let req;
  const req1 = event.request;
  const url = new URL(req1.url)
  const isAsset = isAssetRequest(req1);
  
  logToPage(`Fetch: ${url.href
  } | isAsset: ${isAsset}`);
  
  if (!isAsset) {
    logToPage("Service Worker: HOT resource: fetching from network", url.href);
    event.respondWith(fetch(req1)); // Explicitly fetch from network
    return;
  }
  
  try {
    if (req1.headers.has("range")) {
      const newHeaders = new Headers(); //has to be empty
      // newHeaders.delete("range"); // won't remove forbidden Range header, but okay for others
      for (let [key, value] of req1.headers) {
        if (key.toLowerCase() !== "range") {
          //skip range here
          newHeaders.set(key, value);
        }
      }
      req = new Request(req1.url, {
        method: req1.method,
        headers: newHeaders,
        body: req1.body,
        mode: req1.mode,
        credentials: req1.credentials,
        redirect: req1.redirect,
        referrer: req1.referrer,
      });
      
      // Bypass service worker for range requests by removing the range header.
    } else req = req1;
    
    logToPage("Service Worker: Intercepting asset request", req.url);
    
    event.respondWith(
      caches
      .open(ASSET_CACHE)
      .then(async (cache) => {
        const cached = await cache.match(req);
        const metaKey = req.url + ":meta";
        
        if (cached) {
          // Check metadata stored separately
          const metaCache = await caches.open(ASSET_CACHE +
            "-meta");
          const metaResponse = await metaCache.match(metaKey);
          
          if (metaResponse) {
            const meta = await metaResponse.json();
            if (Date.now() - meta.cachedAt < MAX_AGE) {
              logToPage("Service Worker: Serving from cache", req.url);
              return cached;
            } else {
              logToPage("Service Worker: Cache expired", req.url);
            }
          }
        }
        
        logToPage("Service Worker: Fetching from network", req.url);
        const network = await fetch(req);
        
        if (network.status !== 200) {
          logToPage("Service Worker: Network fetch failed",
            network, {
              url: req.url,
              status: network.status,
            });
          return network;
        }
        
        // Store the asset
        cache.put(req, network.clone());
        
        // Store metadata separately
        const metaCache = await caches.open(ASSET_CACHE + "-meta");
        const metaData = { cachedAt: Date.now() };
        metaCache.put(metaKey, new Response(JSON.stringify(
          metaData)));
        
        logToPage("Service Worker: Cached new asset", req.url);
        
        return network;
      })
      .catch((err) => {
        logToPage("Service Worker: Fetch error", err);
        return fetch(req); //return the direct request
      }),
    );
  } catch (err) {
    logToPage(err);
  }
});

function isAssetRequest(req) {
  // 0. Explicit app-level intent (authoritative)
  if (req.headers.get("sw-type-classification") === "asset") {
    return true;
  }
  
  // 1. Native browser signal (most reliable)
  if (["image", "video", "audio", "font"].includes(req.destination)) {
    return true;
  }
  
  // 2. For navigation/document requests, always return false
  if (req.mode === "navigate" || req.destination === "document") {
    return false;
  }
  
  // 3. Accept header intent (fetch fallback) 
  const accept = req.headers.get("accept") || "";
  
  // Only match if image/ is the PRIMARY accept type (starts with it)
  if (
    accept.startsWith("image/") ||
    accept.startsWith("video/") ||
    accept.startsWith("audio/") ||
    accept.startsWith("font/") ||
    accept.includes("application/octet-stream")
  ) {
    return true;
  }
  
  // 4. URL-based heuristic (last resort)
  try {
    const { pathname } = new URL(req.url);
    return /\.(png|jpe?g|gif|webp|svg|mp4|webm|mp3|wav|ogg|woff2?|ttf|otf)$/i
      .test(pathname);
  } catch {
    return false;
  }
}