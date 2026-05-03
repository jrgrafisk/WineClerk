const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeSearchPage(retailerName, config, retailerKey) {
  try {
    const searchUrl = config.url + encodeURIComponent(retailerName);
    const selectors = config.selectors;

    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    // Get all product containers - try selectors in order
    const containerSelector = getFirstWorkingSelector($, selectors.container);
    if (!containerSelector) {
      console.warn(`No container selector worked for ${retailerKey}`);
      return results;
    }

    $(containerSelector).each((index, element) => {
      try {
        const $element = $(element);

        // Try each selector in fallback order
        const name = trySelectors($element, selectors.wineName);
        const priceText = trySelectors($element, selectors.price);
        const url = tryGetAttribute($element, selectors.productLink, 'href');

        if (name && priceText) {
          const price = parsePrice(priceText);
          const discountPriceText = trySelectors($element, selectors.discountPrice);
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

// Try multiple selectors separated by comma, return first match
function trySelectors($element, selectorString) {
  if (!selectorString) return null;

  const selectors = selectorString.split(',').map(s => s.trim());
  for (const selector of selectors) {
    const text = $element.find(selector).text().trim();
    if (text) return text;
  }
  return null;
}

// Try multiple selectors for attribute, return first match
function tryGetAttribute($element, selectorString, attr) {
  if (!selectorString) return null;

  const selectors = selectorString.split(',').map(s => s.trim());
  for (const selector of selectors) {
    const value = $element.find(selector).attr(attr);
    if (value) return value;
  }
  return null;
}

// Find first working container selector
function getFirstWorkingSelector($, selectorString) {
  const selectors = selectorString.split(',').map(s => s.trim());
  for (const selector of selectors) {
    if ($(selector).length > 0) {
      return selector;
    }
  }
  return null;
}

function parsePrice(priceStr) {
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

// Backward compatibility
async function scrapeRetailer(retailerName, config, retailerKey) {
  return scrapeSearchPage(retailerName, config, retailerKey);
}

module.exports = {
  scrapeRetailer,
  scrapeSearchPage,
  parsePrice,
  trySelectors,
  getFirstWorkingSelector
};
