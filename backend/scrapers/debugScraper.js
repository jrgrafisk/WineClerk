const axios = require('axios');
const cheerio = require('cheerio');

async function debugScrape(url) {
  try {
    console.log(`Fetching: ${url}\n`);

    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    console.log('=== PAGE STRUCTURE DEBUG ===\n');

    // Look for common product containers
    const containers = [
      { selector: 'li.product-item', name: 'li.product-item' },
      { selector: 'li.item', name: 'li.item' },
      { selector: 'div.product-item', name: 'div.product-item' },
      { selector: 'div.product', name: 'div.product' },
      { selector: '[data-product-id]', name: '[data-product-id]' },
      { selector: 'article', name: 'article' },
      { selector: 'li', name: 'li (all)' }
    ];

    containers.forEach(({ selector, name }) => {
      const count = $(selector).length;
      console.log(`${name}: ${count} elements`);
    });

    console.log('\n=== FIRST PRODUCT CONTAINER ===\n');

    // Find and show first product-like element
    const firstLi = $('li').first();
    if (firstLi.length) {
      console.log(firstLi.html().substring(0, 500));
      console.log('\n...\n');
    } else {
      console.log('No <li> elements found');
    }

    console.log('\n=== LOOKING FOR TEXT CONTENT ===\n');

    // Look for wine-like text
    const allText = $('body').text();
    const riojaMention = allText.includes('Rioja') || allText.includes('rioja');
    console.log(`Page mentions "Rioja": ${riojaMention}`);
    console.log(`Total text length: ${allText.length} characters`);

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

// Run with URL
const url = process.argv[2] || 'https://havnens-vin.dk/catalogsearch/result/?q=Rioja';
debugScrape(url);
