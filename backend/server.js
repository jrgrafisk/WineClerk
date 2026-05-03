const express = require('express');
const cors = require('cors');
require('dotenv').config();

const wineSearchRouter = require('./routes/wineSearch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files for web app
app.use(express.static('web'));

// Routes
app.use('/api/wine', wineSearchRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Wine Clerk server running on port ${PORT}`);
});
