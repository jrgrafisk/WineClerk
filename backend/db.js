const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'web', 'data');
const dbPath = path.join(dataDir, 'prices.db');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database at', dbPath);
    initializeDatabase();
  }
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function initializeDatabase() {
  db.serialize(() => {
    // Track what users search for
    db.run(`
      CREATE TABLE IF NOT EXISTS wine_searches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wine_name TEXT NOT NULL COLLATE NOCASE,
        search_count INTEGER DEFAULT 1,
        last_searched DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_crawled DATETIME,
        UNIQUE(wine_name)
      )
    `);

    // Price snapshots per retailer
    db.run(`
      CREATE TABLE IF NOT EXISTS price_snapshots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wine_name TEXT NOT NULL COLLATE NOCASE,
        retailer TEXT NOT NULL,
        price REAL NOT NULL,
        url TEXT,
        crawled_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`CREATE INDEX IF NOT EXISTS idx_snapshots_wine ON price_snapshots(wine_name)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_snapshots_crawled ON price_snapshots(crawled_at)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_searches_count ON wine_searches(search_count DESC)`);
  });
}

// Log a search and return whether we have fresh cached results
async function logSearch(wineName) {
  await run(`
    INSERT INTO wine_searches (wine_name, search_count, last_searched)
    VALUES (?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(wine_name) DO UPDATE SET
      search_count = search_count + 1,
      last_searched = CURRENT_TIMESTAMP
  `, [wineName]);
}

// Get cached prices for a wine (returns null if stale or missing)
async function getCachedPrices(wineName, maxAgeHours = 24) {
  const rows = await all(`
    SELECT wine_name, retailer, price, url, crawled_at
    FROM price_snapshots
    WHERE LOWER(wine_name) = LOWER(?)
      AND crawled_at > datetime('now', '-' || ? || ' hours')
    ORDER BY price ASC
  `, [wineName, maxAgeHours]);

  return rows.length > 0 ? rows : null;
}

// Save price snapshots from a scrape
async function savePrices(results) {
  if (!results || results.length === 0) return;

  for (const r of results) {
    if (r.price === null || r.price === undefined) continue;
    await run(`
      INSERT INTO price_snapshots (wine_name, retailer, price, url)
      VALUES (?, ?, ?, ?)
    `, [r.name, r.retailer, r.price, r.url || null]);
  }
}

// Get wines to crawl (most searched, not crawled recently)
async function getWinesToCrawl(limit = 100) {
  return all(`
    SELECT wine_name, search_count, last_crawled
    FROM wine_searches
    WHERE last_crawled IS NULL
       OR last_crawled < datetime('now', '-23 hours')
    ORDER BY search_count DESC, last_searched DESC
    LIMIT ?
  `, [limit]);
}

// Mark a wine as crawled
async function markCrawled(wineName) {
  return run(`
    UPDATE wine_searches SET last_crawled = CURRENT_TIMESTAMP
    WHERE LOWER(wine_name) = LOWER(?)
  `, [wineName]);
}

module.exports = {
  db,
  logSearch,
  getCachedPrices,
  savePrices,
  getWinesToCrawl,
  markCrawled
};
