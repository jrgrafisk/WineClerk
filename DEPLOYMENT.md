# Wine Clerk Deployment Guide

Deploy Wine Clerk on the same OVH server as pedalpricer.cc at `/wine` path.

## Quick Start

### 1. Clone and Install

```bash
cd /var/www
git clone <repository-url> wineclerk
cd wineclerk
npm install
```

### 2. Add Nginx Configuration

Add this block to your pedalpricer.cc server block in nginx:

```nginx
location /wine {
    proxy_pass http://localhost:3001/wine;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

Reload nginx:
```bash
sudo systemctl reload nginx
```

### 3. Start with PM2

```bash
cd /var/www/wineclerk
pm2 start backend/server.js --name wine-clerk --env PORT=3001
pm2 save
```

### 4. Verify

```bash
# Test the API
curl http://localhost:3001/wine/api/health

# Test through nginx
curl https://pedalpricer.cc/wine/
```

## Managing the Service

```bash
# View logs
pm2 logs wine-clerk

# Restart
pm2 restart wine-clerk

# Stop
pm2 stop wine-clerk

# Start
pm2 start wine-clerk
```

## Updates

```bash
cd /var/www/wineclerk
git pull origin main
npm install
pm2 restart wine-clerk
```

## Database

Wine Clerk uses SQLite stored at `web/data/prices.db` (same pattern as pedalpricer). The database is created automatically on first run.
