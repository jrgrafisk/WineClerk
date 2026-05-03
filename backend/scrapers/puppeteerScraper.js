const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function scrapeWithPuppeteer(searchUrl, selectors, retailerKey) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    // Wait for products to load
    await page.waitForSelector(selectors.container, { timeout: 10000 }).catch(() => {
      console.warn(`Warning: Container selector not found within timeout for ${retailerKey}`);
    });

    const html = await page.content();
    const $ = cheerio.load(html);
    const results = [];

    $(selectors.container).each((index, element) => {
      try {
        const $element = $(element);

        const name = $element.find(selectors.name).text().trim();
        const priceText = $element.find(selectors.price).text().trim();
        const url = $element.find(selectors.url).attr('href');

        if (name && priceText) {
          const price = parsePrice(priceText);

          results.push({
            name,
            price,
            discountPrice: price,
            originalPrice: null,
            url: url ? makeAbsoluteUrl(url, new URL(searchUrl).origin) : null,
            retailer: retailerKey
          });
        }
      } catch (err) {
        console.error(`Error parsing element for ${retailerKey}:`, err.message);
      }
    });

    await browser.close();
    return results;
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error(`Puppeteer scraper error for ${retailerKey}:`, error.message);
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

module.exports = { scrapeWithPuppeteer, parsePrice };
