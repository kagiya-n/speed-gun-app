const CACHE_NAME = "speed-gun-cache-v1";
const urlsToCache = [
  "/speed-gun-app/",
  "/speed-gun-app/index.html",
  "/speed-gun-app/index.tsx",
  "/speed-gun-app/metadata.json",
  "/speed-gun-app/App.tsx",
  "/speed-gun-app/constants.ts",
  "/speed-gun-app/components/FileUpload.tsx",
  "/speed-gun-app/components/VideoProcessor.tsx",
  "/speed-gun-app/components/ResultDisplay.tsx",
  "/speed-gun-app/components/icons.tsx",
  "/speed-gun-app/components/AppIcon.tsx",
  "/speed-gun-app/manifest.json",
  "https://cdn.tailwindcss.com",
  "https://aistudiocdn.com/react@^19.1.1",
  "https://aistudiocdn.com/react-dom@^19.1.1/client",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});
