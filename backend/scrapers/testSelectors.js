const axios = require('axios');
const cheerio = require('cheerio');
const selectorsConfig = require('../config/selectors');

async function testSearchPageSelectors(retailerKey, wineName = 'Rioja') {
  const config = selectorsConfig[retailerKey];
  if (!config) {
    console.error(`Retailer "${retailerKey}" not found in config`);
    return;
  }

  const selectors = config.searchPage;
  console.log(`\n📄 Testing SEARCH PAGE selectors for ${retailerKey.toUpperCase()}`);
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
    const containers = $(selectors.container);
    console.log(`✓ Container selector: "${selectors.container}"`);
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

      const name = $element.find(selectors.name).text().trim();
      const priceText = $element.find(selectors.price).text().trim();
      const discountPriceText = $element.find(selectors.discountPrice).text().trim();
      const url = $element.find(selectors.url).attr('href');

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

async function testProductPageSelectors(retailerKey, productUrl) {
  const config = selectorsConfig[retailerKey];
  if (!config) {
    console.error(`Retailer "${retailerKey}" not found in config`);
    return;
  }

  const selectors = config.productPage;
  console.log(`\n🔍 Testing PRODUCT PAGE selectors for ${retailerKey.toUpperCase()}`);
  console.log('='.repeat(60));
  console.log(`URL: ${productUrl}\n`);

  try {
    const response = await axios.get(productUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    const extract = (selector) => {
      if (selector === 'window.location.href') return productUrl;
      const text = $(selector).text().trim();
      return text || null;
    };

    console.log('Extracted data:');
    console.log(`  Name: ${extract(selectors.name) || '❌ EMPTY'}`);
    console.log(`  Price: ${extract(selectors.price) || '❌ EMPTY'}`);
    console.log(`  Discount: ${extract(selectors.discountPrice) || '(none)'}`);
    console.log(`  Description: ${(extract(selectors.description) || '').substring(0, 60)}...`);
    console.log(`  Vintage: ${extract(selectors.vintage) || '(none)'}`);
    console.log(`  Country: ${extract(selectors.country) || '(none)'}`);
    console.log('\n✅ Test complete!\n');
  } catch (error) {
    console.error(`❌ Error: ${error.message}\n`);
  }
}

// Backward compatibility
function testRetailerSelectors(retailerKey, wineName = 'Rioja') {
  return testSearchPageSelectors(retailerKey, wineName);
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
module.exports = {
  testRetailerSelectors,
  testSearchPageSelectors,
  testProductPageSelectors,
  testAllRetailers
};

// Allow running directly:
// node backend/scrapers/testSelectors.js search supervin "Rioja"
// node backend/scrapers/testSelectors.js product supervin "https://..."
// node backend/scrapers/testSelectors.js search (test all)
if (require.main === module) {
  const args = process.argv.slice(2);
  const mode = args[0];
  const retailer = args[1];
  const param = args[2] || 'Rioja';

  if (mode === 'search') {
    if (retailer && retailer !== 'all') {
      testSearchPageSelectors(retailer, param);
    } else {
      testAllRetailers(param);
    }
  } else if (mode === 'product') {
    if (!retailer || !param) {
      console.log('Usage: node backend/scrapers/testSelectors.js product <retailer> <url>');
      console.log('Example: node backend/scrapers/testSelectors.js product supervin "https://..."');
      process.exit(1);
    }
    testProductPageSelectors(retailer, param);
  } else {
    console.log('Wine Selector Testing Tool');
    console.log('');
    console.log('Usage:');
    console.log('  Search page:  node backend/scrapers/testSelectors.js search [retailer] [wine]');
    console.log('  Product page: node backend/scrapers/testSelectors.js product <retailer> <url>');
    console.log('');
    console.log('Examples:');
    console.log('  node backend/scrapers/testSelectors.js search supervin "Rioja"');
    console.log('  node backend/scrapers/testSelectors.js search (test all)');
    console.log('  node backend/scrapers/testSelectors.js product supervin "https://www.supervin.dk/product/123"');
  }
}
