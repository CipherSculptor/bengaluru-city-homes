// This file is used by Vercel for serverless functions
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const serverless = require('serverless-http');

// Enable CORS for all routes
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Export the serverless function
module.exports = serverless(app);
