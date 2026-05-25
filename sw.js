// WordCraft · Service Worker
// 每次发布新版本时,只需修改 VERSION 即可触发用户端缓存更新
const VERSION = "wordcraft-v1.0.0";

// 需要离线可用的核心文件
const CORE_ASSETS = [
  "./",
  "./vocab.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-maskable.svg",
];

// 安装:预缓存核心资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// 激活:清理旧版本缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 取请求策略:
// - 导航请求(HTML):network-first,失败回退缓存(保证用户尽可能拿到最新)
// - 静态资源:cache-first,后台更新(秒开,且离线可用)
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // 仅处理同源请求(TTS 等跨域请求让浏览器自行处理)
  if (url.origin !== location.origin) return;

  // HTML 导航请求 → network-first
  if (req.mode === "navigate" || req.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("./vocab.html")))
    );
    return;
  }

  // 静态资源 → cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchAndUpdate = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchAndUpdate;
    })
  );
});
