// public/sw.js
importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('/uv/uv.sw.js');
/*import { UVServiceWorker } from '/uv/uv.bundle.js';
import { UVServiceWorker } from '/uv/uv.config.js';
import { UVServiceWorker } from '/uv/uv.sw.js';*/

const uv = new UVServiceWorker();
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async function() {
      if (uv.route(event)) {
        return await uv.fetch(event);
      }
      return await fetch(event.request);
    })()
  );
});
