# Changes Log

## 2026-05-12 20:45 — Laudrupvin selectors confirmed via console script
- Updated `.product-item-link` for search page name selector
- Fixed price path to `.price-container.price-final_price .price`
- Simplified product page selectors: `.page-title` (name), `.price-including-tax .price` (price)
- Removed discount price handling (only using single bottle price, no tiers)

## 2026-05-12 20:30 — Native fetch + full browser headers
- Switched genericScraper.js from axios to native fetch
- Added complete browser header set (Accept, Accept-Language, Accept-Encoding, Cache-Control, Upgrade-Insecure-Requests)
- Improved European price format detection (1.299,95 → 1299.95)

## 2026-05-12 19:45 — Port fix and branch merge
- Fixed default port to 3002 (avoid Umami conflict on 3001)
- Merged main branch into dev branch (claude/wine-price-comparison-GRgIx)

## 2026-05-12 16:00 — Cloudflare bot protection discovered
- Laudrupvin, Andrupvin, Havnensvin all use Cloudflare IUAM
- Server-side scraping blocked; extension approach required for these sites
- Skagenfood loads but limited wine selection
