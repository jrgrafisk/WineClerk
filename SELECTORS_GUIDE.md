# CSS Selectors Guide

This guide explains how to find and update CSS selectors for each wine retailer.

## File Structure

- `backend/config/selectors.js` - Selector configuration for search page and product page
- `backend/scrapers/genericScraper.js` - Generic scraper supporting both modes
- `backend/scrapers/testSelectors.js` - Testing utility for validating selectors

## Two Scraping Modes

### Search Page Mode (Current Implementation)
- Scrapes search results listing page
- Extracts: name, price, discount price, product URL
- Used for quick price comparison

### Product Page Mode (Future Enhancement)
- Scrapes individual product detail page
- Extracts: name, price, discount, description, vintage, country, etc.
- Useful for detailed information and product pages

## How to Find Selectors

### 1. Open the Website

Visit the retailer's search page and search for a wine. For example:
```
https://www.supervin.dk/search?q=Châteauneuf-du-Pape
```

### 2. Open Developer Tools

Press `F12` or right-click → "Inspect Element" to open the browser's developer tools.

### 3. Find the Product Container

Look for the HTML element that wraps a single product. Common patterns:
```html
<div class="product-item">
  <h3 class="product-title">Wine Name</h3>
  <span class="product-price">199,95 DKK</span>
  <span class="discount-price">149,95 DKK</span>
  <a href="/product/123">View</a>
</div>
```

Inspect the container element and note its CSS selector. Update in `selectors.js`:
```javascript
container: '.product-item'  // or '#products .item' or 'article.wine' etc.
```

### 4. Find Each Selector

Use the Inspector tab to hover over and find:

**Name Selector** - The product title/name
```
name: '.product-title'
name: 'h2'
name: '[data-product-name]'
```

**Price Selector** - The current price
```
price: '.product-price'
price: '.price'
price: '[data-price]'
price: '.original-price'
```

**Discount Price Selector** - The sale/discounted price (if any)
```
discountPrice: '.sale-price'
discountPrice: '.discount-price'
discountPrice: '.special-price'
```

**URL Selector** - Link to product page
```
url: 'a'              // Link within container
url: '.product-link'  // Link with class
url: '[href]'         // Any element with href attribute
```

## Updating Selectors

Edit `backend/config/selectors.js`:

```javascript
supervin: {
  searchUrl: 'https://www.supervin.dk/search?q=',
  selectors: {
    container: '.product',           // ← Update these
    name: '.product-name',
    price: '.current-price',
    discountPrice: '.sale-price',
    url: 'a.product-link'
  }
},
```

## Testing Selectors

### Search Page Testing

**Method 1: Manual Testing in Browser Console**

Open the retailer's search page and test your selectors:

```javascript
// Test container selector
document.querySelectorAll('.product').length  // Should return number > 0

// Test name selector in first product
document.querySelector('.product .product-name').textContent

// Test price selector
document.querySelector('.product .current-price').textContent
```

**Method 2: Automated Testing Tool**

Test search page selectors:
```bash
cd /var/www/wineclerk

# Test single retailer
node backend/scrapers/testSelectors.js search supervin "Rioja"

# Test all retailers
node backend/scrapers/testSelectors.js search
```

### Product Page Testing

**Method 1: Update selectors.js**

Add selectors for product page:
```javascript
productPage: {
  url: 'window.location.href',
  name: 'h1.product-name',
  price: '.product-price',
  discountPrice: '.sale-price',
  description: '.description',
  vintage: '.vintage',
  country: '.country'
}
```

**Method 2: Test with Real Product URL**

```bash
node backend/scrapers/testSelectors.js product supervin "https://www.supervin.dk/product/example"
```

### 3. Test Through API

Run the wine search through your API:
```bash
curl "http://localhost:3002/wine/api/wine/search?q=Rioja"
```

Check the results and look for the wine names, prices, and URLs.

## Common Issues

### No Results
- ❌ Container selector is wrong
- ✅ Solution: Check the exact class/id of the product wrapper

### Names are empty
- ❌ Name selector doesn't match the HTML
- ✅ Solution: Inspect the actual element containing the wine name

### Prices are null
- ❌ Price format not recognized by `parsePrice()`
- ✅ Solution: Check price format (DKK, kr, space, comma vs period)
- ✅ Update `parsePrice()` in `genericScraper.js` if needed

### URLs are broken
- ❌ Relative URLs not converted to absolute
- ✅ Solution: Check the URL format in the HTML and update `makeAbsoluteUrl()`

## Adding a New Retailer

1. **Add to selectors.js:**
```javascript
newretailer: {
  searchUrl: 'https://www.newretailer.dk/search?q=',
  selectors: {
    container: '.wine-product',
    name: '.wine-title',
    price: '.wine-price',
    discountPrice: '.wine-sale-price',
    url: 'a.wine-link'
  },
  retailer: 'NewRetailer'
},
```

2. **Update the search route (backend/routes/wineSearch.js):**

Replace all the individual scraper imports with:
```javascript
const selectorsConfig = require('../config/selectors');
const { scrapeRetailer } = require('../scrapers/genericScraper');

// In the search route:
const [result1, result2, result3, result4] = await Promise.all([
  scrapeRetailer('Supervin', selectorsConfig.supervin),
  scrapeRetailer('Andrupvin', selectorsConfig.andrupvin),
  scrapeRetailer('Laudrupvin', selectorsConfig.laudrupvin),
  scrapeRetailer('Justvin', selectorsConfig.justvin)
]);
```

## Notes

- Selectors can change when websites update their HTML
- Test selectors regularly to ensure they still work
- Some sites may block scraping—check their `robots.txt` and terms of service
- Consider using headless browsers (Puppeteer) for sites with JavaScript-heavy content
