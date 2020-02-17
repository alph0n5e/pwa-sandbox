if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log("ServiceWorker registered!"))
    .catch(() => console.warn("ServiceWorker not registered..."))
}
