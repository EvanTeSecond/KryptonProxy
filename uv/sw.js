// Add error handling for imports
try {
  importScripts("/uv/uv.bundle.js");
  importScripts("/uv/uv.config.js");
  importScripts("/uv/uv.sw.js");
  
  // Check if globals exist
  if (typeof UVServiceWorker === 'undefined') {
    throw new Error('UVServiceWorker is undefined');
  }
  
  const uv = new UVServiceWorker();
  
  async function handleRequest(event) {
    if (uv.route(event)) {
      return await uv.fetch(event);
    }
    return await fetch(event.request);
  }
  
  self.addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event));
  });
} catch (err) {
  console.error('Service worker initialization error:', err);
  // Rethrow to make the error visible
  throw err;
}
