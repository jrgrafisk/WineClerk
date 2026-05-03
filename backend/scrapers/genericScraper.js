const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeRetailer(retailerName, config) {
  try {
    const searchUrl = config.searchUrl + encodeURIComponent(retailerName);

    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    // Get all product containers
    $(config.selectors.container).each((index, element) => {
      try {
        const $element = $(element);

        // Extract data using selectors
        const name = $element.find(config.selectors.name).text().trim();
        const priceText = $element.find(config.selectors.price).text().trim();
        const discountPriceText = $element.find(config.selectors.discountPrice).text().trim();
        const url = $element.find(config.selectors.url).attr('href');

        if (name && priceText) {
          const price = parsePrice(priceText);
          const discountPrice = discountPriceText ? parsePrice(discountPriceText) : null;

          results.push({
            name,
            price,
            discountPrice: discountPrice || price,
            originalPrice: discountPrice ? price : null,
            url: url ? makeAbsoluteUrl(url, new URL(searchUrl).origin) : null,
            retailer: config.retailer
          });
        }
      } catch (err) {
        console.error(`Error parsing element for ${config.retailer}:`, err.message);
      }
    });

    return results;
  } catch (error) {
    console.error(`Scraper error for ${config.retailer}:`, error.message);
    return [];
  }
}

function parsePrice(priceStr) {
  // Handle various Danish price formats: "99,95 DKK", "99,95kr", "99.95", etc.
  const match = priceStr.match(/(\d+[.,]\d{2})/);
  if (match) {
    return parseFloat(match[1].replace(',', '.'));
  }
  return null;
}

function makeAbsoluteUrl(url, origin) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return origin + url;
  return origin + '/' + url;
}

module.exports = { scrapeRetailer, parsePrice };
