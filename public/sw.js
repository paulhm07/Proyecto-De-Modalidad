/**
 * Service Worker de Mundilex — Cristal del Saber
 * ------------------------------------------------------------------
 * Estrategias:
 *  - App Shell (HTML/JS/CSS/Next chunks):     stale-while-revalidate
 *  - Assets estáticos (img/font/svg):         cache-first con fallback
 *  - API backend (NestJS puerto 3001 vía Caddy): network-first, cache corto
 *  - Navegación (HTML):                        network-first → offline fallback
 *
 * El SW se registra en src/components/PWARegister.tsx
 * Versión: bump para forzar actualización de cachés.
 */
const SW_VERSION = "mundilex-sw-v1";
const APP_SHELL = `${SW_VERSION}-shell`;
const RUNTIME = `${SW_VERSION}-runtime`;
const API_CACHE = `${SW_VERSION}-api`;

// Recursos del app shell que se guardan al instalar (offline first-render).
const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/icon-512-maskable.png",
  "/pwa/apple-touch-icon.png",
  "/favicon-32.png",
  "/logo.svg",
];

// Patrones para clasificar peticiones.
const isHTML = (req) => req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
const isStatic = (url) => /\.(?:png|jpe?g|gif|webp|svg|ico|woff2?|ttf|eot|css|js|wasm)(\?|$)/i.test(url);
const isNextChunk = (url) => url.includes("/_next/static/");
const isAPI = (url) => url.includes("/api/");
const sameOrigin = (url) => url.startsWith(self.location.origin);

// ---------- Install: precachear app shell ----------
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_SHELL);
      // addAll falla entero si una falla; hacemos add individual para ser tolerantes.
      await Promise.all(
        PRECACHE_URLS.map(async (u) => {
          try {
            await cache.add(new Request(u, { cache: "reload" }));
          } catch (e) {
            // Recursos pueden no existir aún en dev; ignoramos.
          }
        })
      );
      // Activar inmediatamente sin esperar cierre de pestañas viejas.
      await self.skipWaiting();
    })()
  );
});

// ---------- Activate: limpiar caches viejos ----------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.startsWith(SW_VERSION))
          .map((k) => caches.delete(k))
      );
      // Tomar control de todos los clientes inmediatamente.
      await self.clients.claim();
      console.log("[SW] Activado", SW_VERSION);
    })()
  );
});

// ---------- Fetch: router de estrategias ----------
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return; // solo GET cacheable

  const url = new URL(request.url);

  // Solo gestionar mismo origen (el gateway Caddy atiende /api/* y /).
  if (!sameOrigin(url.origin)) return;

  // 1) Navegación HTML → network-first con fallback offline.
  if (isHTML(request)) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // 2) API → network-first, cache corto (30s) para sobrevivir micro-cortes.
  if (isAPI(url.pathname)) {
    event.respondWith(networkFirstAPI(request));
    return;
  }

  // 3) Next.js chunks estáticos → stale-while-revalidate (inmortales).
  if (isNextChunk(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, APP_SHELL));
    return;
  }

  // 4) Otros estáticos (img, font, svg) → cache-first.
  if (isStatic(url.pathname)) {
    event.respondWith(cacheFirst(request, RUNTIME));
    return;
  }

  // 5) Default → intentar red, fallback a cache.
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(RUNTIME).then((c) => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});

// ---------- Estrategias ----------

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res && res.status === 200) {
      cache.put(request, res.clone());
    }
    return res;
  } catch (e) {
    // Si es imagen y no hay cache, devolver SVG placeholder simple.
    if (request.destination === "image") {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="#1e1b4b"/><text x="32" y="36" font-size="28" text-anchor="middle" fill="#fbbf24">?</text></svg>',
        { headers: { "Content-Type": "image/svg+xml" } }
      );
    }
    return Response.error();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const fetchPromise = fetch(request)
    .then((res) => {
      if (res && res.status === 200) {
        cache.put(request, res.clone());
      }
      return res;
    })
    .catch(() => cached);
  return cached || fetchPromise;
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(RUNTIME);
  try {
    const res = await fetch(request);
    if (res && res.status === 200) {
      cache.put(request, res.clone());
    }
    return res;
  } catch (e) {
    const cached = await cache.match(request);
    if (cached) return cached;
    // Fallback al app shell precacheado ("/").
    const shell = await caches.match("/");
    if (shell) return shell;
    // Último recurso: página offline mínima.
    return new Response(OFFLINE_PAGE, {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }
}

async function networkFirstAPI(request) {
  const cache = await caches.open(API_CACHE);
  try {
    const res = await fetch(request);
    if (res && res.status === 200) {
      // Clonar y guardar con timestamp para expirar a los 30s.
      const clone = res.clone();
      const body = await clone.blob();
      const cached = new Response(body, {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });
      cache.put(
        request,
        new Response(body, {
          status: res.status,
          statusText: res.statusText,
          headers: {
            ...Object.fromEntries(res.headers.entries()),
            "x-sw-cached-at": String(Date.now()),
          },
        })
      );
    }
    return res;
  } catch (e) {
    const cached = await cache.match(request);
    if (cached) {
      // Expirar a los 30s para no servir datos muy viejos.
      const ts = Number(cached.headers.get("x-sw-cached-at") || 0);
      if (Date.now() - ts < 30_000) return cached;
    }
    return cached || Response.error();
  }
}

// ---------- Mensajería: forzar activación / skipWaiting ----------
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

// ---------- Página offline mínima (mismo idioma y tema) ----------
const OFFLINE_PAGE = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Mundilex — Sin conexión</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: grid; place-items: center;
    font-family: 'Fredoka', system-ui, sans-serif;
    background: radial-gradient(ellipse at center, #1e1b4b 0%, #0b0a2a 50%, #07061f 100%);
    color: #fef3c7; text-align: center; padding: 2rem;
  }
  .card {
    max-width: 28rem; padding: 2.5rem 2rem; border-radius: 1.5rem;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(251,191,36,0.2);
    backdrop-filter: blur(12px);
  }
  .moon { font-size: 4rem; margin-bottom: 0.5rem; }
  h1 { margin: 0 0 0.5rem; font-size: 1.5rem; color: #fbbf24; }
  p { margin: 0 0 1.25rem; color: #cbd5e1; line-height: 1.5; font-size: 0.95rem; }
  button {
    font: inherit; font-weight: 600; cursor: pointer;
    padding: 0.7rem 1.5rem; border-radius: 9999px; border: none;
    background: linear-gradient(135deg, #ff6b6b, #ff8c42, #fbbf24);
    color: #2d1437;
  }
  button:active { transform: translateY(1px); }
  .hint { margin-top: 1rem; font-size: 0.75rem; color: #94a3b8; }
</style>
</head>
<body>
  <div class="card">
    <div class="moon">🌙</div>
    <h1>El Cristal del Saber descansó</h1>
    <p>No hay conexión a internet. Mundilex está en modo offline: puedes seguir jugando los desafíos que ya cargaron. Vuelve a conectarte para sincronizar tu progreso.</p>
    <button onclick="location.reload()">Reintentar conexión</button>
    <p class="hint">Mundilex · Aprende jugando</p>
  </div>
</body>
</html>`;
