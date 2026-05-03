const axios = require('axios');
const cheerio = require('cheerio');

async function searchAndrupvin(wineName) {
  try {
    const searchUrl = `https://www.andrupvin.dk/search?q=${encodeURIComponent(wineName)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    // Parse product listings - adjust selectors based on actual HTML structure
    $('.product-item').each((index, element) => {
      const name = $(element).find('.product-name').text().trim();
      const price = $(element).find('.product-price').text().trim();
      const url = $(element).find('a').attr('href');

      if (name && price) {
        results.push({
          name,
          price: parsePrice(price),
          url,
          retailer: 'Andrupvin'
        });
      }
    });

    return results;
  } catch (error) {
    console.error('Andrupvin scraper error:', error.message);
    return [];
  }
}

function parsePrice(priceStr) {
  const match = priceStr.match(/(\d+[.,]\d{2})/);
  return match ? parseFloat(match[1].replace(',', '.')) : null;
}

module.exports = { searchAndrupvin };
