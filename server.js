// Load environment variables from .env file
const dotenv = require('dotenv');
const fs = require('fs');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.error('Error: .env file not found!');
  console.log('Creating a sample .env file...');
  fs.writeFileSync('.env', 'GCP_MAPS_API=your_google_maps_api_key_here\nPORT=3000');
  console.log('.env file created. Please edit it to add your Google Maps API key.');
}

// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
}

const http = require('http');
const path = require('path');

// Get API key from environment variable
const apiKey = process.env.GCP_MAPS_API || '';

// Define content types for different file extensions
const contentTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css'
};

// Create HTTP server
const server = http.createServer((req, res) => {
  // Get the file path
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  // Get file extension
  const extname = path.extname(filePath);
  const contentType = contentTypes[extname] || 'text/plain';

  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404);
        res.end('File not found');
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
      return;
    }

    // Success - return the file
    res.writeHead(200, { 'Content-Type': contentType });
    
    // If it's HTML, inject the API key
    if (extname === '.html') {
      const htmlContent = content.toString();
      const injectedContent = htmlContent.replace(
        'window.GCP_MAPS_API || \'\'',
        `'${apiKey}' || ''`
      );
      res.end(injectedContent);
    } else {
      res.end(content);
    }
  });
});

// Set port (default to 3000)
const PORT = process.env.PORT || 3000;

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  
  if (!apiKey || apiKey === 'your_google_maps_api_key_here') {
    console.log('\x1b[31mGoogle Maps API Key: NOT CONFIGURED\x1b[0m');
    console.log('\x1b[33mPlease edit the .env file and set your Google Maps API key:\x1b[0m');
    console.log('\x1b[33m1. Open .env file in a text editor\x1b[0m');
    console.log('\x1b[33m2. Replace "your_google_maps_api_key_here" with your actual API key\x1b[0m');
    console.log('\x1b[33m3. Save the file and restart the server\x1b[0m');
  } else {
    console.log('\x1b[32mGoogle Maps API Key: Configured ✓\x1b[0m');
  }
});
