# Wine Clerk 🍷

A Danish wine price comparison service that compares prices across multiple Danish wine retailers in real-time.

## Features

- **Web Application**: Search wines and compare prices across retailers
- **Browser Extension**: Compare prices while browsing wine retailer websites
- **Real-time Comparison**: Live price comparison across 4 Danish wine shops
- **Simple Search**: Search by wine name

## Supported Retailers

- [Supervin.dk](https://www.supervin.dk)
- [Andrupvin.dk](https://www.andrupvin.dk)
- [Laudrupvin.dk](https://www.laudrupvin.dk)
- [Justvin.dk](https://www.justvin.dk)

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Web Application

Once the backend is running, visit `http://localhost:3000` in your browser to use the web application.

### Browser Extension (Chrome)

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `extension/` folder from this project

The extension will now appear in your Chrome toolbar and will work on the supported wine retailer websites.

## How It Works

### Web App
1. Enter a wine name in the search box
2. The system queries all 4 retailers simultaneously
3. Results are displayed with prices sorted by lowest price
4. Click retailer links to visit their page

### Browser Extension
1. Visit a product page on any supported retailer
2. Click the Wine Clerk extension icon
3. The extension automatically detects the wine name
4. Prices from all retailers are displayed in a popup

## Project Structure

```
WineClerk/
├── backend/
│   ├── server.js           # Express server
│   ├── routes/
│   │   └── wineSearch.js   # Search API endpoint
│   └── scrapers/           # Retailer-specific scrapers
│       ├── supervinScraper.js
│       ├── andrupvinScraper.js
│       ├── laudrupvinScraper.js
│       └── justvinScraper.js
├── web/                    # Web application
│   ├── index.html
│   ├── app.js
│   └── styles.css
├── extension/              # Browser extension
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── popup.css
│   ├── content.js
│   └── background.js
└── package.json
```

## API Endpoints

### Search Wines
- **Endpoint**: `GET /api/wine/search?q=wine_name`
- **Query Parameters**:
  - `q` (required): Wine name to search for
- **Response**: Array of wines with prices from all retailers

Example:
```bash
curl "http://localhost:3000/api/wine/search?q=Châteauneuf-du-Pape"
```

## Development Notes

### Scraper Implementation

Each retailer scraper follows the same pattern:
1. Makes an HTTP request to the retailer's search URL
2. Parses the HTML response using Cheerio
3. Extracts wine name, price, and product URL
4. Returns standardized data format

**Note**: The current selectors are placeholders and need to be updated based on the actual HTML structure of each retailer's website. You may need to inspect each site's HTML to find the correct CSS selectors.

### Future Enhancements

- [ ] Price history tracking
- [ ] Price alerts
- [ ] Wine ratings and reviews
- [ ] Inventory status
- [ ] Wishlist functionality
- [ ] Extended retailer support
- [ ] Mobile app

## License

MIT

## Notes

- This is a work in progress
- Scrapers may need updates as retailer websites change
- Respect robots.txt and terms of service of retailer websites
