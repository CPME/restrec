const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
  console.log('Created build directory');
}

// Read the index.html file
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace the API key placeholder
const apiKey = process.env.GCP_MAPS_API || '';
if (apiKey) {
  indexHtml = indexHtml.replace(
    'window.GCP_MAPS_API || \'\'',
    `'${apiKey}'`
  );
  console.log('Injected Google Maps API key');
} else {
  console.warn('Warning: GCP_MAPS_API environment variable not set');
}

// Write to the build directory
fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);
console.log('Processed and copied index.html to build directory');

// Files to copy directly
const filesToCopy = [
  'app.js',
  'map.js',
  'styles.css'
];

// Copy each file to build directory
filesToCopy.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(buildDir, file);
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`Copied ${file} to build directory`);
    } else {
      console.warn(`Warning: ${file} not found`);
    }
  } catch (err) {
    console.error(`Error copying ${file}: ${err.message}`);
  }
});

console.log('Build completed successfully!');
