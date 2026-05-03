#!/usr/bin/env node
// Nightly price crawler — run via cron:
//   0 2 * * * cd /var/www/wineclerk && node backend/crawler.js >> web/logs/crawler.log 2>&1

const selectorsConfig = require('./config/selectors');
const { scrapeSearchPage } = require('./scrapers/genericScraper');
const { getWinesToCrawl, savePrices, markCrawled } = require('./db');

const LIMIT       = parseInt(process.env.CRAWL_LIMIT  || '100', 10);
const CONCURRENCY = parseInt(process.env.CRAWL_CONCUR || '2',   10);
const DELAY_MS    = parseInt(process.env.CRAWL_DELAY  || '3000', 10);

// All retailers available to the crawler (can be slower, more thorough)
const CRAWLER_RETAILERS = Object.keys(selectorsConfig).filter(k => k !== 'supervin');

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function crawlWine(wineName) {
  try {
    const searches = CRAWLER_RETAILERS.map(key =>
      scrapeSearchPage(wineName, selectorsConfig[key], key)
    );

    const results = (await Promise.all(searches)).flat();

    if (results.length > 0) {
      await savePrices(results);
    }

    await markCrawled(wineName);
    return results.length;
  } catch (e) {
    log(`ERROR ${wineName}: ${e.message}`);
    return 0;
  }
}

async function runBatch(wines) {
  let totalSnapshots = 0;

  for (let i = 0; i < wines.length; i += CONCURRENCY) {
    const batch = wines.slice(i, i + CONCURRENCY);
    const counts = await Promise.all(batch.map(w => crawlWine(w.wine_name)));
    totalSnapshots += counts.reduce((a, b) => a + b, 0);

    log(`Progress: ${Math.min(i + CONCURRENCY, wines.length)}/${wines.length} wines — ${totalSnapshots} snapshots saved`);

    if (i + CONCURRENCY < wines.length) await sleep(DELAY_MS);
  }

  return totalSnapshots;
}

async function main() {
  log('Wine Clerk crawler starting...');

  const wines = await getWinesToCrawl(LIMIT);

  if (wines.length === 0) {
    log('No wines to crawl. Waiting for user searches to populate the queue.');
    return;
  }

  log(`Crawling ${wines.length} wines (concurrency=${CONCURRENCY}, delay=${DELAY_MS}ms)`);

  const start = Date.now();
  const total = await runBatch(wines);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  log(`Done: ${total} price snapshots in ${elapsed}s`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
