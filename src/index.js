const express = require('express');
const { createBareServer } = require('@tomphttp/bare-server-node');
const { uvPath } = require('ultraviolet');
const path = require('path');
const http = require('http');
const fs = require('fs');

// Create Express application
const app = express();
const port = process.env.PORT || 8080;

// Create HTTP server
const server = http.createServer();

// Create Bare server
const bareServer = createBareServer('/bare/');

// Configure server request handler
server.on('request', (req, res) => {
    // Handle Bare requests
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
        return;
    }

    // Handle Express app for everything else
    app(req, res);
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve Ultraviolet static files
app.use('/uv/', express.static(uvPath));

// Handle requests to root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Copy UV files to public directory on startup
const setupUltraviolet = async () => {
    const uvPublicPath = path.join(__dirname, '../public/uv/');
    
    // Create UV directory if it doesn't exist
    if (!fs.existsSync(uvPublicPath)) {
        fs.mkdirSync(uvPublicPath, { recursive: true });
    }
    
    // Copy UV client files from node_modules
    const uvClientFiles = [
        { from: require.resolve('ultraviolet/dist/uv.bundle.js'), to: path.join(uvPublicPath, 'uv.bundle.js') },
        { from: require.resolve('ultraviolet/dist/uv.handler.js'), to: path.join(uvPublicPath, 'uv.handler.js') },
        { from: require.resolve('ultraviolet/dist/uv.sw.js'), to: path.join(uvPublicPath, 'uv.sw.js') }
    ];
    
    for (const file of uvClientFiles) {
        fs.copyFileSync(file.from, file.to);
    }
    
    // Create UV config file
    const configContent = `
    self.__uv$config = {
        prefix: '/service/',
        bare: '/bare/',
        encodeUrl: Ultraviolet.codec.xor.encode,
        decodeUrl: Ultraviolet.codec.xor.decode,
        handler: '/uv/uv.handler.js',
        bundle: '/uv/uv.bundle.js',
        config: '/uv/uv.config.js',
        sw: '/uv/uv.sw.js',
    };
    `;
    
    fs.writeFileSync(path.join(uvPublicPath, 'uv.config.js'), configContent);
};

// Start the server
const startServer = async () => {
    try {
        await setupUltraviolet();
        server.listen(port, () => {
            console.log(`Ultraviolet proxy running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

startServer();
