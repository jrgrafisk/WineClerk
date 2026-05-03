const axios = require('axios');
const cheerio = require('cheerio');
const selectorsConfig = require('../config/selectors');

async function testRetailerSelectors(retailerKey, wineName = 'Rioja') {
  const config = selectorsConfig[retailerKey];
  if (!config) {
    console.error(`Retailer "${retailerKey}" not found in config`);
    return;
  }

  console.log(`\n🍷 Testing ${retailerKey.toUpperCase()}`);
  console.log('='.repeat(60));

  try {
    const searchUrl = config.searchUrl + encodeURIComponent(wineName);
    console.log(`URL: ${searchUrl}\n`);

    const response = await axios.get(searchUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Test container selector
    const containers = $(config.selectors.container);
    console.log(`✓ Container selector: "${config.selectors.container}"`);
    console.log(`  Found ${containers.length} products\n`);

    if (containers.length === 0) {
      console.warn(
        '⚠️  WARNING: No products found! Selector might be wrong.\n' +
        'Hint: Right-click on a product → Inspect → Check the outer div class/id'
      );
      return;
    }

    // Test first 3 products
    containers.slice(0, 3).forEach((element, index) => {
      const $element = $(element);

      const name = $element.find(config.selectors.name).text().trim();
      const priceText = $element.find(config.selectors.price).text().trim();
      const discountPriceText = $element.find(config.selectors.discountPrice).text().trim();
      const url = $element.find(config.selectors.url).attr('href');

      console.log(`Product ${index + 1}:`);
      console.log(`  Name: ${name || '❌ EMPTY'}`);
      console.log(`  Price: ${priceText || '❌ EMPTY'}`);
      console.log(`  Discount: ${discountPriceText || '(none)'}`);
      console.log(`  URL: ${url || '❌ EMPTY'}`);
      console.log('');
    });

    console.log('✅ Test complete!\n');
  } catch (error) {
    console.error(`❌ Error: ${error.message}\n`);
  }
}

// Run tests for all retailers
async function testAllRetailers(wineName = 'Rioja') {
  console.log('\n\n🍷 TESTING ALL RETAILERS');
  console.log('='.repeat(60));

  for (const retailerKey of Object.keys(selectorsConfig)) {
    await testRetailerSelectors(retailerKey, wineName);
  }
}

// Export for use as module
module.exports = { testRetailerSelectors, testAllRetailers };

// Allow running directly: node backend/scrapers/testSelectors.js [retailer] [wine]
if (require.main === module) {
  const args = process.argv.slice(2);
  const retailer = args[0];
  const wine = args[1] || 'Rioja';

  if (retailer) {
    testRetailerSelectors(retailer, wine);
  } else {
    testAllRetailers(wine);
  }
}
