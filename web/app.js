const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') performSearch();
});

async function performSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    showError('Please enter a wine name');
    return;
  }

  loadingDiv.style.display = 'block';
  resultsDiv.innerHTML = '';
  errorDiv.style.display = 'none';

  try {
    const response = await fetch(`/api/wine/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const results = await response.json();

    if (results.length === 0) {
      showError('No wines found. Try a different search term.');
      return;
    }

    displayResults(results);
  } catch (error) {
    showError('Error performing search: ' + error.message);
  } finally {
    loadingDiv.style.display = 'none';
  }
}

function displayResults(wines) {
  resultsDiv.innerHTML = wines
    .map(wine => createWineCard(wine))
    .join('');
}

function createWineCard(wine) {
  const validPrices = wine.prices.filter(p => p.price !== null && p.price !== undefined);

  if (validPrices.length === 0) {
    return '';
  }

  const minPrice = Math.min(...validPrices.map(p => p.price));
  const maxPrice = Math.max(...validPrices.map(p => p.price));
  const priceDiff = (maxPrice - minPrice).toFixed(2);

  const priceItemsHtml = validPrices
    .sort((a, b) => a.price - b.price)
    .map(
      p => `
      <div class="price-item">
        <span class="retailer-name">${p.retailer}</span>
        <div style="display: flex; align-items: center;">
          <span class="price">${p.price.toFixed(2)} DKK</span>
          ${p.url ? `<a href="${p.url}" target="_blank">→</a>` : ''}
        </div>
      </div>
    `
    )
    .join('');

  return `
    <div class="wine-card">
      <div class="wine-name">${escapeHtml(wine.name)}</div>
      <div class="price-list">
        ${priceItemsHtml}
      </div>
      ${validPrices.length > 1 ? `
        <div class="price-comparison">
          <span>Price range:</span>
          <span class="price-difference ${priceDiff > 50 ? 'high' : ''}">
            ${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)} DKK (Diff: ${priceDiff} DKK)
          </span>
        </div>
      ` : ''}
    </div>
  `;
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
