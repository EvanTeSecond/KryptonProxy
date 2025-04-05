const fs = require('fs');
const path = require('path');
const { uvPath } = require('ultraviolet');

// Create dist directory
const distDir = path.join(__dirname, 'dist');
const uvDir = path.join(distDir, 'uv');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

if (!fs.existsSync(uvDir)) {
  fs.mkdirSync(uvDir, { recursive: true });
}

// Copy UV files
const uvFiles = [
  { from: path.join(uvPath, 'uv.bundle.js'), to: path.join(uvDir, 'uv.bundle.js') },
  { from: path.join(uvPath, 'uv.handler.js'), to: path.join(uvDir, 'uv.handler.js') },
  { from: path.join(uvPath, 'uv.sw.js'), to: path.join(uvDir, 'uv.sw.js') }
];

uvFiles.forEach(file => {
  fs.copyFileSync(file.from, file.to);
});

// Create UV config file
fs.writeFileSync(path.join(uvDir, 'uv.config.js'), UV_CONFIG);

console.log('Build completed successfully!');
`;
