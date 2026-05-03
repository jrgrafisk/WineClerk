const loadingDiv = document.getElementById('loading');
const resultsDiv = document.getElementById('results');
const errorDiv = document.getElementById('error');
const infoDiv = document.getElementById('info');

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const currentTab = tabs[0];
  const url = new URL(currentTab.url);

  // Check if we're on a wine retailer page
  const retailerDomains = ['supervin.dk', 'andrupvin.dk', 'laudrupvin.dk', 'justvin.dk'];
  const isRetailerPage = retailerDomains.some(domain => url.hostname.includes(domain));

  if (!isRetailerPage) {
    infoDiv.style.display = 'block';
    return;
  }

  // Try to extract wine name from page content
  chrome.tabs.sendMessage(currentTab.id, { action: 'getWineName' }, (response) => {
    if (response && response.wineName) {
      searchWine(response.wineName);
    } else {
      infoDiv.textContent = 'Could not detect wine name on this page';
      infoDiv.style.display = 'block';
    }
  });
});

async function searchWine(wineName) {
  infoDiv.style.display = 'none';
  loadingDiv.style.display = 'block';
  resultsDiv.innerHTML = '';
  errorDiv.style.display = 'none';

  try {
    // Use localhost for development, or your production server
    const apiUrl = 'http://localhost:3000/api/wine/search?q=' + encodeURIComponent(wineName);
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const results = await response.json();

    if (results.length === 0) {
      showError('No prices found for this wine');
      return;
    }

    displayResults(results);
  } catch (error) {
    showError('Error: ' + error.message);
  } finally {
    loadingDiv.style.display = 'none';
  }
}

function displayResults(wines) {
  resultsDiv.innerHTML = '';

  wines.slice(0, 5).forEach(wine => {
    const validPrices = wine.prices.filter(p => p.price !== null && p.price !== undefined);

    if (validPrices.length === 0) return;

    const card = document.createElement('div');
    card.className = 'price-comparison';

    const sorted = validPrices.sort((a, b) => a.price - b.price);

    const html = sorted
      .map(
        p => `
      <div class="retailer-row">
        <span class="retailer-name">${p.retailer}</span>
        <div style="display: flex; align-items: center;">
          <span class="price">${p.price.toFixed(2)} DKK</span>
          ${p.url ? `<a href="${p.url}" target="_blank" class="visit-link">↗</a>` : ''}
        </div>
      </div>
    `
      )
      .join('');

    card.innerHTML = html;
    resultsDiv.appendChild(card);
  });
}

function showError(message) {
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}
