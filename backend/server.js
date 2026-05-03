const express = require('express');
const cors = require('cors');
require('dotenv').config();

const wineSearchRouter = require('./routes/wineSearch');

const app = express();
const PORT = process.env.PORT || 3002;
const BASE_PATH = '/wine';

app.use(cors());
app.use(express.json());

// Trust proxy (nginx in front)
app.set('trust proxy', 1);

// Serve static files for web app at /wine
app.use(BASE_PATH, express.static('web'));

// Routes
app.use(BASE_PATH + '/api/wine', wineSearchRouter);

// Health check
app.get(BASE_PATH + '/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Redirect /wine to /wine/ for proper static file serving
app.get(BASE_PATH, (req, res) => {
  res.redirect(BASE_PATH + '/');
});

app.listen(PORT, () => {
  console.log(`Wine Clerk server running on port ${PORT} at ${BASE_PATH}`);
});
