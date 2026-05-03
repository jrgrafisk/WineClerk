const express = require('express');
const router = express.Router();
const { searchSupervin } = require('../scrapers/supervinScraper');
const { searchAndrupvin } = require('../scrapers/andrupvinScraper');
const { searchLaudrupvin } = require('../scrapers/laudrupvinScraper');
const { searchJustvin } = require('../scrapers/justvinScraper');
const { scrapeWithPuppeteer } = require('../scrapers/puppeteerScraper');
const selectorsConfig = require('../config/selectors');
const { savePrices } = require('../db');

router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: 'Search query required' });
  }

  try {
    const searches = [
      searchSupervin(q),
      searchAndrupvin(q),
      searchLaudrupvin(q),
      searchJustvin(q)
    ];

    // Add Puppeteer-based scrapers
    if (selectorsConfig.havnensvin?.usePuppeteer) {
      const searchUrl = selectorsConfig.havnensvin.searchUrl + encodeURIComponent(q);
      searches.push(scrapeWithPuppeteer(searchUrl, selectorsConfig.havnensvin.searchPage, 'havnensvin'));
    }

    const results = await Promise.all(searches);
    const [supervinResults, andrupvinResults, laudrupvinResults, justvinResults, ...otherResults] = results;

    const allResults = [
      ...supervinResults,
      ...andrupvinResults,
      ...laudrupvinResults,
      ...justvinResults,
      ...otherResults.flat()
    ];

    // Save prices to database
    if (allResults.length > 0) {
      await savePrices(allResults);
    }

    // Group by wine name and aggregate prices
    const grouped = {};
    allResults.forEach(result => {
      const key = result.name.toLowerCase();
      if (!grouped[key]) {
        grouped[key] = {
          name: result.name,
          prices: []
        };
      }
      grouped[key].prices.push({
        retailer: result.retailer,
        price: result.price,
        url: result.url
      });
    });

    // Sort by lowest price
    const response = Object.values(grouped).sort((a, b) => {
      const aMin = Math.min(...a.prices.map(p => p.price || Infinity));
      const bMin = Math.min(...b.prices.map(p => p.price || Infinity));
      return aMin - bMin;
    });

    res.json(response);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
