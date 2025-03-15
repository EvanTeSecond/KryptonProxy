const fs = require('fs');
const path = require('path');
const { uvPath } = require('@titaniumnetwork-dev/ultraviolet');

// Ensure directories exist
if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist');
}

if (!fs.existsSync('./dist/uv')) {
  fs.mkdirSync('./dist/uv');
}

// Copy Ultraviolet files
const uvFiles = fs.readdirSync(uvPath);
for (const file of uvFiles) {
  fs.copyFileSync(path.join(uvPath, file), path.join('./dist/uv', file));
}

// Copy public files
const publicFiles = fs.readdirSync('./public');
for (const file of publicFiles) {
  if (file === 'uv') continue; // Skip UV directory as we handled it separately
  
  const src = path.join('./public', file);
  const dest = path.join('./dist', file);
  
  if (fs.lstatSync(src).isDirectory()) {
    fs.cpSync(src, dest, { recursive: true });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Build completed successfully!');
