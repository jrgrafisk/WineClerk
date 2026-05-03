const express = require('express');
const router = express.Router();
const selectorsConfig = require('../config/selectors');
const { scrapeSearchPage } = require('../scrapers/genericScraper');
const { logSearch, getCachedPrices, savePrices } = require('../db');

const CACHE_MAX_AGE_HOURS = 24;

// Retailers that work with live scraping (not bot-blocked)
const LIVE_SCRAPE_ENABLED = ['laudrupvin', 'skagenfood'];

router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: 'Search query required' });
  }

  const wineName = q.trim();

  try {
    // Always log the search (for crawler queue)
    await logSearch(wineName);

    // 1. Check DB for fresh cached prices
    const cached = await getCachedPrices(wineName, CACHE_MAX_AGE_HOURS);
    if (cached && cached.length > 0) {
      return res.json(formatResults(cached));
    }

    // 2. No fresh cache — try live scraping for enabled retailers
    const searches = Object.entries(selectorsConfig)
      .filter(([key]) => LIVE_SCRAPE_ENABLED.includes(key))
      .map(([key, config]) => scrapeSearchPage(wineName, config, key));

    const results = (await Promise.all(searches)).flat();

    // Save to DB for future cache hits
    if (results.length > 0) {
      await savePrices(results);
    }

    res.json(formatResults(results.map(r => ({
      wine_name: r.name,
      retailer: r.retailer,
      price: r.price,
      url: r.url
    }))));

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

function formatResults(rows) {
  const grouped = {};

  rows.forEach(row => {
    const key = (row.wine_name || row.name || '').toLowerCase();
    if (!key) return;

    if (!grouped[key]) {
      grouped[key] = {
        name: row.wine_name || row.name,
        prices: []
      };
    }

    if (row.price !== null && row.price !== undefined) {
      grouped[key].prices.push({
        retailer: row.retailer,
        price: row.price,
        url: row.url || null
      });
    }
  });

  return Object.values(grouped)
    .filter(w => w.prices.length > 0)
    .sort((a, b) => {
      const aMin = Math.min(...a.prices.map(p => p.price));
      const bMin = Math.min(...b.prices.map(p => p.price));
      return aMin - bMin;
    });
}

module.exports = router;
