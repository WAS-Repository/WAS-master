import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and destination paths
const cesiumSource = path.join(__dirname, '../node_modules/cesium/Build/Cesium');
const cesiumDest = path.join(__dirname, '../public/cesium');

// Create destination directory if it doesn't exist
if (!fs.existsSync(cesiumDest)) {
  fs.mkdirSync(cesiumDest, { recursive: true });
}

// Copy Cesium assets
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy only the necessary directories
const directories = ['Assets', 'ThirdParty', 'Workers', 'Widgets'];

directories.forEach(dir => {
  const srcPath = path.join(cesiumSource, dir);
  const destPath = path.join(cesiumDest, dir);
  
  if (fs.existsSync(srcPath)) {
    console.log(`Copying ${dir}...`);
    copyDir(srcPath, destPath);
  }
});

// Copy main Cesium files
const files = ['Cesium.js', 'Cesium.js.map'];
files.forEach(file => {
  const srcPath = path.join(cesiumSource, file);
  const destPath = path.join(cesiumDest, file);
  
  if (fs.existsSync(srcPath)) {
    console.log(`Copying ${file}...`);
    fs.copyFileSync(srcPath, destPath);
  }
});

console.log('Cesium assets copied successfully!');