self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("farm-buddy-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/welcomepage.html",
        "/dashboard.html",
        "/tasks.html",
        "/profile.html",
        "/style.css",
        "/app.js.js",
        "/firebase-config.js",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});