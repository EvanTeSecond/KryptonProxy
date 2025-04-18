import { Router } from 'itty-router';
import { createBareClient } from '@tomphttp/bare-client';

// Create a new router
const router = Router();

// Set up your actual Bare server URL
const BARE_SERVER_URL = 'https://testingkryptonproxy.pages.dev/bare/';

router.all('/service/*', async request => {
  const url = new URL(request.url);
  const path = url.pathname.replace('/service/', '');
  
  // This should be decoded by UV's service worker
  const decodedUrl = Ultraviolet.codec.xor.decode(path);
  
  console.log(`[UV Worker] Proxying request to: ${decodedUrl}`);
  
  try {
    // Use your bare client to make the request
    const bareClient = createBareClient({
      remote: BARE_SERVER_URL
    });
    
    return await bareClient.fetch(decodedUrl, {
      headers: request.headers,
      method: request.method,
      body: ['GET', 'HEAD'].includes(request.method) ? null : await request.blob(),
    });
  } catch (err) {
    console.error('Error in service route:', err);
    return new Response(`Service worker proxy error: ${err.toString()}`, { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
});


// Handle UV service worker requests
router.get('/service/*', async request => {
  // This should be handled by the service worker if properly registered
  // If this route is hit, service worker registration failed
  return new Response('Service worker not registered properly. Please reload the page.', { 
    status: 500,
    headers: { 'Content-Type': 'text/plain' }
  });
});

// Serve the UV client files
router.get('/uv/uv.sw.js', async () => {
  // Serve the UV service worker file
  return new Response(UV_SW_JS, {
    headers: { 'Content-Type': 'application/javascript' }
  });
});

router.get('/uv/uv.handler.js', async () => {
  return new Response(UV_HANDLER_JS, {
    headers: { 'Content-Type': 'application/javascript' }
  });
});

router.get('/uv/uv.bundle.js', async () => {
  return new Response(UV_BUNDLE_JS, {
    headers: { 'Content-Type': 'application/javascript' }
  });
});

router.get('/uv/uv.config.js', async () => {
  return new Response(UV_CONFIG, {
    headers: { 'Content-Type': 'application/javascript' }
  });
});

// Serve the main application
router.get('/', async () => {
  return new Response(INDEX_HTML, {
    headers: { 'Content-Type': 'text/html' }
  });
});

// Serve the error page
router.get('/error', async () => {
  return new Response(ERROR_HTML, {
    headers: { 'Content-Type': 'text/html' }
  });
});

// Register-SW script
router.get('/register-sw.js', async () => {
  return new Response(REGISTER_SW_JS, {
    headers: { 'Content-Type': 'application/javascript' }
  });
});

// Serve style.css
router.get('/style.css', async () => {
  return new Response(STYLE_CSS, {
    headers: { 'Content-Type': 'text/css' }
  });
});

// Fallback route
router.all('*', async () => {
  return new Response('Not Found', { status: 404 });
});

// Define your main constants here with the file contents
// You'll need to include UV_BUNDLE_JS, UV_HANDLER_JS, etc.

// Listen for fetch events
addEventListener('fetch', event => {
  event.respondWith(router.handle(event.request));
});
