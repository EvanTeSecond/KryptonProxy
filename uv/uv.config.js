self.__uv$config = {
  prefix: '/krypton/',  // Web service endpoint
  bare: '/bare/',       // Bare server endpoint
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: '/public/uv/uv.handler.js',
  bundle: '/public/uv/uv.bundle.js',
  config: '/public/uv/uv.config.js',
  sw: '/public/uv/uv.sw.js',
};

// public/sw.js
importScripts('/public/uv/uv.bundle.js');
importScripts('/public/uv/uv.config.js');
importScripts('/public/uv/uv.sw.js');


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

// public/register-sw.js
async function registerSW() {
  try {
    await navigator.serviceWorker.register('/sw.js', {
      scope: __uv$config.prefix,
    });
  } catch (err) {
    console.error('Failed to register service worker:', err);
  }
}

registerSW();

// public/index.js
window.addEventListener('load', () => {
  const form = document.querySelector('form');
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const url = document.querySelector('input').value;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    const encodedUrl = __uv$config.encodeUrl(url);
    const fullUrl = __uv$config.prefix + encodedUrl;
    
    location.href = fullUrl;
  });
});
