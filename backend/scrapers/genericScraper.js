const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeSearchPage(retailerName, config, retailerKey) {
  try {
    const searchUrl = config.searchUrl + encodeURIComponent(retailerName);
    const selectors = config.searchPage;

    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    // Get all product containers
    $(selectors.container).each((index, element) => {
      try {
        const $element = $(element);

        // Extract data using selectors
        const name = $element.find(selectors.name).text().trim();
        const priceText = $element.find(selectors.price).text().trim();
        const discountPriceText = $element.find(selectors.discountPrice).text().trim();
        const url = $element.find(selectors.url).attr('href');

        if (name && priceText) {
          const price = parsePrice(priceText);
          const discountPrice = discountPriceText ? parsePrice(discountPriceText) : null;

          results.push({
            name,
            price,
            discountPrice: discountPrice || price,
            originalPrice: discountPrice ? price : null,
            url: url ? makeAbsoluteUrl(url, new URL(searchUrl).origin) : null,
            retailer: retailerKey
          });
        }
      } catch (err) {
        console.error(`Error parsing element for ${retailerKey}:`, err.message);
      }
    });

    return results;
  } catch (error) {
    console.error(`Scraper error for ${retailerKey}:`, error.message);
    return [];
  }
}

async function scrapeProductPage(productUrl, config) {
  try {
    const response = await axios.get(productUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const selectors = config.productPage;

    const extract = (selector) => {
      if (selector === 'window.location.href') return productUrl;
      return $(selector).text().trim() || null;
    };

    return {
      url: productUrl,
      name: extract(selectors.name),
      price: parsePrice(extract(selectors.price)),
      discountPrice: parsePrice(extract(selectors.discountPrice)),
      description: extract(selectors.description),
      vintage: extract(selectors.vintage),
      country: extract(selectors.country)
    };
  } catch (error) {
    console.error(`Product page scraper error for ${productUrl}:`, error.message);
    return null;
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

// Backward compatibility: scrapeRetailer uses searchPage mode
async function scrapeRetailer(retailerName, config, retailerKey) {
  return scrapeSearchPage(retailerName, config, retailerKey);
}

module.exports = {
  scrapeRetailer,
  scrapeSearchPage,
  scrapeProductPage,
  parsePrice
};
