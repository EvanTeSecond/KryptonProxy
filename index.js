import express from 'express';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { createBareServer } from '@tomphttp/bare-server-node';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = dirname(filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Create bare server
const bareServer = createBareServer('/bare/');

// Serve static files
app.use(express.static(path.join(dirname, 'public')));

// Serve Ultraviolet files
app.use('/uv/', express.static(uvPath));

// Create HTTP server
const server = http.createServer();

// Handle requests
server.on('request', (req, res) => {
  if (bareServer.shouldRoute(req)) {
    // Handle bare requests
    bareServer.routeRequest(req, res);
  } else {
    // Handle HTTP requests
    app.handle(req, res);
  }
});

// Handle upgrades
server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
