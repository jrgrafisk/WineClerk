# Wine Clerk Deployment Guide

This guide covers deploying Wine Clerk on the same OVH server as pedalpricer.cc.

## Server Setup

### 1. Clone and Install

```bash
cd /var/www
git clone <repository-url> wineclerk
cd wineclerk
npm install
```

### 2. Environment Configuration

Create `.env`:
```bash
PORT=3001
NODE_ENV=production
```

### 3. Nginx Configuration

Add this block to your existing nginx configuration (in the pedalpricer.cc server block):

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

Then reload nginx:
```bash
sudo systemctl reload nginx
```

### 4. Service Management

If using PM2 (same as pedalpricer):

```bash
pm2 start backend/server.js --name wine-clerk --env PORT=3001

# Save PM2 config to auto-start on server reboot
pm2 save
pm2 startup
```

Or with systemd, create `/etc/systemd/system/wine-clerk.service`:

```ini
[Unit]
Description=Wine Clerk Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/wineclerk
Environment="PORT=3001"
Environment="NODE_ENV=production"
ExecStart=/usr/bin/node backend/server.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable wine-clerk
sudo systemctl start wine-clerk
sudo systemctl status wine-clerk
```

### 5. Verify Deployment

```bash
# Check service is running
ps aux | grep wine-clerk

# Test the API
curl http://localhost:3001/wine/api/health

# Test through nginx
curl https://pedalpricer.cc/wine/
```

## Updates

To deploy updates:

```bash
cd /var/www/wineclerk
git pull origin main
npm install
pm2 restart wine-clerk
# or
sudo systemctl restart wine-clerk
```

## Logs

- **PM2**: `pm2 logs wine-clerk`
- **Systemd**: `sudo journalctl -u wine-clerk -f`
- **Nginx**: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`

## Future: Price History & Cron

Once price history is implemented, add a cron job similar to pedalpricer:

```bash
0 6 * * * cd /var/www/wineclerk && node crawler.js >> logs/crawler.log 2>&1
```

Make sure the `logs/` directory exists and is writable:
```bash
mkdir -p /var/www/wineclerk/logs
chmod 755 /var/www/wineclerk/logs
```
