require('dotenv').config();
const fs = require('fs');

// Create build directory if it doesn't exist
if (!fs.existsSync('build')) {
  fs.mkdirSync('build');
}

// Read the index.html file
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Replace the API key placeholder
indexHtml = indexHtml.replace(
  'window.GCP_MAPS_API || \'\'',
  `'${process.env.GCP_MAPS_API}'`
);

// Write to the build directory
fs.writeFileSync('build/index.html', indexHtml);

// Copy other files
fs.copyFileSync('app.js', 'build/app.js');
fs.copyFileSync('map.js', 'build/map.js');
fs.copyFileSync('styles.css', 'build/styles.css');

console.log('Build completed successfully!');
