import { Router } from 'itty-router';
import { createBareClient } from '@tomphttp/bare-client';
import { UVClient } from 'ultraviolet';

// Create a new router
const router = Router();

// Handle requests to the bare server
router.all('/bare/*', async request => {
  const bareClient = createBareClient({
    remote: 'https://your-bare-server-url.com/bare/'
  });
  
  return await bareClient.fetch(request);
});

// Serve the UV client files
router.get('/uv/*', async request => {
  const path = new URL(request.url).pathname.replace('/uv/', '');
  // You'd need to handle serving the UV client files here
  // This would typically be done by serving from Cloudflare Pages or KV
});

// Serve the main application
router.get('/', async () => {
  return new Response(INDEX_HTML, {
    headers: { 'Content-Type': 'text/html' }
  });
});

// Fallback route
router.all('*', async () => {
  return new Response('Not Found', { status: 404 });
});

// Define your main HTML
const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UV Proxy</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: #121212;
            color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            background: #1e1e1e;
            border-radius: 12px;
            padding: 2rem;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        h1 {
            margin-bottom: 1.5rem;
            font-weight: 300;
            text-align: center;
            background: linear-gradient(45deg, #9c27b0, #673ab7);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        form {
            display: flex;
            gap: 0.5rem;
        }

        input {
            flex: 1;
            padding: 0.8rem 1rem;
            border: none;
            border-radius: 6px;
            background: #2d2d2d;
            color: #fff;
            font-size: 1rem;
            outline: none;
            transition: all 0.3s;
        }

        input:focus {
            box-shadow: 0 0 0 2px rgba(123, 31, 162, 0.5);
        }

        button {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 6px;
            background: #9c27b0;
            color: white;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s;
        }

        button:hover {
            background: #7b1fa2;
        }
    </style>
    <script src="/uv/uv.bundle.js" defer></script>
    <script src="/uv/uv.config.js" defer></script>
</head>
<body>
    <div class="container">
        <h1>Ultraviolet Proxy</h1>
        <form id="uv-form">
            <input id="uv-search-engine" value="https://www.google.com/search?q=%s" type="hidden">
            <input id="uv-address" type="text" placeholder="Search the web freely or enter URL" autocomplete="off">
            <button type="submit">Go</button>
        </form>
    </div>

    <script>
        document.getElementById('uv-form').addEventListener('submit', function(event) {
            event.preventDefault();
            
            const address = document.getElementById('uv-address').value;
            const searchEngine = document.getElementById('uv-search-engine').value;
            
            let url;
            if (!/^https?:\/\//.test(address)) {
                url = searchEngine.replace('%s', encodeURIComponent(address));
            } else {
                url = address;
            }
            
            window.location.href = __uv$config.prefix + __uv$config.encodeUrl(url);
        });
    </script>
</body>
</html>`;
