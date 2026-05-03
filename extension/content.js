chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getWineName') {
    const wineName = extractWineName();
    sendResponse({ wineName: wineName });
  }
});

function extractWineName() {
  // Try to find wine name from various common page elements
  const selectors = [
    'h1.product-title',
    'h1.wine-name',
    'h1.product-name',
    '.product-header h1',
    '[data-product-name]',
    '.wine-title h1',
    'h1'
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent.trim();
      if (text.length > 0 && text.length < 200) {
        return text;
      }
    }
  }

  // Fallback: try to get from page title
  let title = document.title.trim();
  if (title && title.length < 200) {
    // Remove common suffixes
    title = title.replace(/\s*[-|]\s*.*$/, '').trim();
    return title;
  }

  return null;
}
