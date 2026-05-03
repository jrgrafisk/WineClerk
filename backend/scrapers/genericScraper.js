const cheerio = require('cheerio');

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'da-DK,da;q=0.9,en-US;q=0.8,en;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'max-age=0',
  'Upgrade-Insecure-Requests': '1'
};

async function fetchHtml(url, timeoutMs = 10000) {
  const res = await fetch(url, {
    headers: BROWSER_HEADERS,
    signal: AbortSignal.timeout(timeoutMs)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function scrapeSearchPage(wineName, config, retailerKey) {
  try {
    const searchUrl = config.url + encodeURIComponent(wineName);
    const html = await fetchHtml(searchUrl, config.timeout || 10000);
    const $ = cheerio.load(html);
    const results = [];
    const selectors = config.selectors;

    const containerSelector = getFirstWorkingSelector($, selectors.container);
    if (!containerSelector) {
      console.warn(`No container selector worked for ${retailerKey}`);
      return results;
    }

    $(containerSelector).each((index, element) => {
      try {
        const $el = $(element);

        const name = trySelectors($el, selectors.wineName);
        const priceText = trySelectors($el, selectors.price);
        const url = tryGetAttribute($el, selectors.productLink, 'href');

        if (name && priceText) {
          const price = parsePrice(priceText);
          const discountPriceText = trySelectors($el, selectors.discountPrice);
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

function trySelectors($element, selectorString) {
  if (!selectorString) return null;
  for (const selector of selectorString.split(',').map(s => s.trim())) {
    const text = $element.find(selector).text().trim();
    if (text) return text;
  }
  return null;
}

function tryGetAttribute($element, selectorString, attr) {
  if (!selectorString) return null;
  for (const selector of selectorString.split(',').map(s => s.trim())) {
    const value = $element.find(selector).attr(attr);
    if (value) return value;
  }
  return null;
}

function getFirstWorkingSelector($, selectorString) {
  for (const selector of selectorString.split(',').map(s => s.trim())) {
    if ($(selector).length > 0) return selector;
  }
  return null;
}

function parsePrice(priceStr) {
  // Handle European format: "1.299,95" → 1299.95
  let cleaned = priceStr.replace(/[^0-9.,]/g, '');
  if (/,\d{2}(?:\s|$|[^0-9])/.test(cleaned) || cleaned.endsWith(',00') || /,\d{2}$/.test(cleaned)) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    cleaned = cleaned.replace(/,/g, '');
  }
  const price = parseFloat(cleaned);
  return isNaN(price) || price <= 0 ? null : price;
}

function makeAbsoluteUrl(url, origin) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return origin + url;
  return origin + '/' + url;
}

async function scrapeRetailer(wineName, config, retailerKey) {
  return scrapeSearchPage(wineName, config, retailerKey);
}

module.exports = {
  scrapeRetailer,
  scrapeSearchPage,
  parsePrice,
  trySelectors,
  getFirstWorkingSelector
};
