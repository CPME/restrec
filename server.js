const http = require('http');
const fs = require('fs');
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
  console.log(`Google Maps API Key: ${apiKey ? 'Configured' : 'NOT CONFIGURED'}`);
  if (!apiKey) {
    console.log('Please set the GCP_MAPS_API environment variable to your Google Maps API key');
  }
});
