const express = require('express');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');
const { createBareServer } = require('@tomphttp/bare-server-node');
const http = require('http');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Create bare server
const bareServer = createBareServer('/bare/');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

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
  console.log(`Server running on port ${PORT}`);
});
