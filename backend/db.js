const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'web', 'data');
const dbPath = path.join(dataDir, 'prices.db');

// Ensure data directory exists
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

function initializeDatabase() {
  db.serialize(() => {
    // Create prices table
    db.run(`
      CREATE TABLE IF NOT EXISTS prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        wine_name TEXT NOT NULL,
        retailer TEXT NOT NULL,
        price REAL NOT NULL,
        url TEXT,
        searched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(wine_name, retailer)
      )
    `);

    // Create index for faster searches
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_wine_name ON prices(wine_name)
    `);

    db.run(`
      CREATE INDEX IF NOT EXISTS idx_searched_at ON prices(searched_at)
    `);
  });
}

function savePrices(results) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO prices (wine_name, retailer, price, url)
        VALUES (?, ?, ?, ?)
      `);

      results.forEach(result => {
        if (result.price !== null && result.price !== undefined) {
          stmt.run(
            result.name,
            result.retailer,
            result.price,
            result.url || null,
            (err) => {
              if (err && err.code !== 'SQLITE_CONSTRAINT') {
                console.error('Error saving price:', err);
              }
            }
          );
        }
      });

      stmt.finalize((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

function getPricesByWine(wineName) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT wine_name, retailer, price, url, searched_at
      FROM prices
      WHERE LOWER(wine_name) LIKE LOWER(?)
      ORDER BY searched_at DESC
      LIMIT 100
    `;

    db.all(query, [`%${wineName}%`], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

function getLatestPrices(wineName) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT wine_name, retailer, price, url, MAX(searched_at) as searched_at
      FROM prices
      WHERE LOWER(wine_name) = LOWER(?)
      GROUP BY retailer
      ORDER BY price ASC
    `;

    db.all(query, [wineName], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

module.exports = {
  db,
  savePrices,
  getPricesByWine,
  getLatestPrices
};
