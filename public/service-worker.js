self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("farm-buddy-cache").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/dashboard.html",
        "/tasks.html",
        "/profile.html",
        "/style.css",
        "/app.js",
        "/dashboard.js",
        "/task.js",          
        "/profile.js",       
        "/firebase-config.js",
        "/manifest.json",
        "/icons/icon-192.png.jpg",
        "/icons/icon-512.png.jpg"
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});