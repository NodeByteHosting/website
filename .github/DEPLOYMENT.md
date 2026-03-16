# NodeByte Website Deployment Guide

Complete guide for deploying the NodeByte Website (Next.js) on Ubuntu using systemd and Nginx with Cloudflare Origin Certificates.

**Service:** Website/Frontend (Next.js 14+ on Node.js 18+)  
**Environment:** Ubuntu 20.04 LTS or 22.04 LTS  
**Date:** February 2026

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Setup](#system-setup)
3. [Website Deployment](#website-deployment)
4. [Nginx Configuration](#nginx-configuration)
5. [SSL/TLS Setup](#ssltls-setup)
6. [Monitoring](#monitoring)
7. [Maintenance](#maintenance)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- Ubuntu 20.04 LTS or 22.04 LTS
- Node.js 18+
- npm or yarn
- Nginx 1.18+
- Git

### Required Accounts
- Cloudflare account with domain configured
- Access to server with sudo privileges

### Domain Assumptions
- Website: `yourdomain.com` and `www.yourdomain.com`

---

## System Setup

### 1. Update System
```bash
sudo apt update
sudo apt upgrade -y
```

### 2. Install Dependencies

#### Node.js 18+
```bash
# Add NodeSource repository for Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

#### Nginx
```bash
sudo apt install -y nginx
```

#### Additional Tools
```bash
sudo apt install -y git curl wget htop ufw
```

### 3. Create Deploy User
```bash
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG sudo deploy
```

### 4. Setup Firewall
```bash
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 5. Create Application Directory
```bash
sudo mkdir -p /var/www/nodebyte/website
sudo chown -R deploy:deploy /var/www/nodebyte
```

---

## Website Deployment

### 1. Clone Repository
```bash
cd /var/www/nodebyte
sudo -u deploy git clone <website-repo-url> website
cd website
sudo -u deploy git checkout development  # or your desired branch
```

### 2. Setup Environment Variables
```bash
sudo -u deploy cp .env.example .env
sudo -u deploy nano .env
```

Configure `.env`:
```env
# Environment
NODE_ENV=production

# API endpoint
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id

# Vercel Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS=true

# Additional environment variables as needed
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 3. Install Dependencies
```bash
cd /var/www/nodebyte/website

# Clean install (production dependencies only)
sudo -u deploy npm ci

# Verify installation
sudo -u deploy npm list --depth=0
```

### 4. Build Application
```bash
cd /var/www/nodebyte/website

# Build Next.js application
sudo -u deploy npm run build

# Verify build
ls -la .next
```

### 5. Create Systemd Service

Create `/etc/systemd/system/nodebyte-website.service`:

```ini
[Unit]
Description=NodeByte Website (Next.js) Service
After=network.target
Wants=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/nodebyte/website
Environment="PATH=/usr/bin:/bin:/usr/local/bin"
Environment="NODE_ENV=production"
Environment="PORT=3000"
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=30
StandardOutput=journal
StandardError=journal
SyslogIdentifier=nodebyte-website

# Performance tuning
LimitNOFILE=65000
LimitNPROC=65000

# Security
PrivateTmp=yes
NoNewPrivileges=yes

[Install]
WantedBy=multi-user.target
```

### 6. Enable and Start Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable nodebyte-website
sudo systemctl start nodebyte-website

# Verify
sudo systemctl status nodebyte-website
sudo journalctl -u nodebyte-website -n 50

# Test locally
curl http://localhost:3000
```

---

## Nginx Configuration

### 1. Create Nginx Configuration

Create `/etc/nginx/sites-available/nodebyte-website`:

```nginx
upstream website {
    server 127.0.0.1:3000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect www to non-www (optional)
    if ($server_name = www.yourdomain.com) {
        return 301 https://yourdomain.com$request_uri;
    }

    # SSL certificates (Cloudflare Origin Certificates)
    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Logging
    access_log /var/log/nginx/website-access.log combined;
    error_log /var/log/nginx/website-error.log warn;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=web_limit:10m rate=30r/s;
    limit_req zone=web_limit burst=50 nodelay;

    # Client body size limit
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json
               image/svg+xml;

    # Main application proxy
    location / {
        proxy_pass http://website;
        proxy_http_version 1.1;

        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Buffering
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }

    # Next.js static assets - cache aggressively
    location /_next/static/ {
        proxy_pass http://website;
        proxy_cache_valid 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Next.js image optimization
    location /_next/image {
        proxy_pass http://website;
        proxy_cache_valid 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # Public files with long cache
    location /public/ {
        proxy_pass http://website;
        proxy_cache_valid 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }

    # Favicon
    location = /favicon.ico {
        proxy_pass http://website;
        access_log off;
        expires 7d;
    }

    # Robots.txt
    location = /robots.txt {
        proxy_pass http://website;
        access_log off;
    }
}
```

### 2. Install Cloudflare Origin Certificates

```bash
# Create certificates directory
sudo mkdir -p /etc/ssl/certs /etc/ssl/private

# Create certificate file (get from Cloudflare Dashboard → SSL/TLS → Origin Server)
sudo tee /etc/ssl/certs/yourdomain.com.crt > /dev/null << 'EOF'
-----BEGIN CERTIFICATE-----
(Paste your Cloudflare certificate here)
-----END CERTIFICATE-----
EOF

# Create private key file
sudo tee /etc/ssl/private/yourdomain.com.key > /dev/null << 'EOF'
-----BEGIN PRIVATE KEY-----
(Paste your private key here)
-----END PRIVATE KEY-----
EOF

# Set correct permissions
sudo chmod 644 /etc/ssl/certs/yourdomain.com.crt
sudo chmod 600 /etc/ssl/private/yourdomain.com.key
sudo chown root:root /etc/ssl/certs/yourdomain.com.crt /etc/ssl/private/yourdomain.com.key
```

### 3. Enable Nginx Site
```bash
sudo ln -s /etc/nginx/sites-available/nodebyte-website /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## SSL/TLS Setup

### Cloudflare Configuration

1. **SSL/TLS → Overview**
   - Mode: Full (strict)
   - Minimum TLS Version: TLS 1.2

2. **Edge Certificates**
   - Always use HTTPS: On
   - HSTS: Enable (max-age=31536000)
   - TLS 1.3: On

3. **DNS**
   - A Record: `yourdomain.com` → Your server IP (Proxied/Orange)
   - CNAME Record: `www` → `yourdomain.com` (Proxied/Orange)

---

## Monitoring

### View Service Logs
```bash
# Real-time logs
sudo journalctl -u nodebyte-website -f

# Last 50 lines
sudo journalctl -u nodebyte-website -n 50

# Filter by time
sudo journalctl -u nodebyte-website --since "2 hours ago"

# Filter errors only
sudo journalctl -u nodebyte-website -p err
```

### Service Status
```bash
sudo systemctl status nodebyte-website
```

### Application Health
```bash
# Test local endpoint
curl http://localhost:3000

# Test through Nginx (HTTP)
curl -I http://yourdomain.com

# Test through Nginx (HTTPS)
curl -I -k https://yourdomain.com
```

### System Resources
```bash
# CPU/Memory usage
htop -p $(pgrep -f "npm start")

# Disk usage
df -h /var/www/nodebyte/website

# Network connections
sudo ss -tulpn | grep 3000

# Node.js processes
ps aux | grep node
```

### Nginx Logs
```bash
# Access logs
tail -f /var/log/nginx/website-access.log

# Error logs
tail -f /var/log/nginx/website-error.log

# Request statistics
awk '{print $9}' /var/log/nginx/website-access.log | sort | uniq -c
```

---

## Maintenance

### Updating Website

```bash
cd /var/www/nodebyte/website

# Fetch latest changes
sudo -u deploy git fetch origin
sudo -u deploy git pull origin development

# Install updated dependencies
sudo -u deploy npm ci

# Rebuild application
sudo -u deploy npm run build

# Restart service
sudo systemctl restart nodebyte-website

# Verify
sudo systemctl status nodebyte-website
sudo journalctl -u nodebyte-website -n 20
```

### Quick Update Script

Create `/home/deploy/update-website.sh`:

```bash
#!/bin/bash
set -e

WEBSITE_DIR="/var/www/nodebyte/website"
BRANCH="development"

echo "=== Updating NodeByte Website ==="
cd "$WEBSITE_DIR"

# Pull changes
git fetch origin
git pull origin "$BRANCH"

# Update dependencies and rebuild
npm ci
npm run build

# Restart service
sudo systemctl restart nodebyte-website
echo "Website updated and restarted"

# Check status
sleep 2
sudo systemctl status nodebyte-website --no-pager
```

Make executable:
```bash
chmod +x /home/deploy/update-website.sh
```

### Rollback
```bash
cd /var/www/nodebyte/website

# View recent commits
sudo -u deploy git log --oneline -10

# Checkout previous version
sudo -u deploy git checkout <commit-hash>

# Rebuild and restart
sudo -u deploy npm ci
sudo -u deploy npm run build
sudo systemctl restart nodebyte-website
```

### Clear Cache and Rebuild
```bash
cd /var/www/nodebyte/website

# Stop service
sudo systemctl stop nodebyte-website

# Clean build artifacts
sudo -u deploy rm -rf .next node_modules

# Fresh install and build
sudo -u deploy npm ci
sudo -u deploy npm run build

# Restart service
sudo systemctl start nodebyte-website
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
sudo journalctl -u nodebyte-website -n 50

# Verify Node.js is installed
node --version
npm --version

# Check if port is in use
sudo lsof -i :3000

# Test build manually
cd /var/www/nodebyte/website
sudo -u deploy npm run build
```

### Build Failures

```bash
# Check for missing dependencies
cd /var/www/nodebyte/website
sudo -u deploy npm list

# Clean and reinstall
sudo -u deploy rm -rf node_modules package-lock.json
sudo -u deploy npm install

# Check for TypeScript errors
sudo -u deploy npm run build 2>&1 | less
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/website-error.log

# Verify upstream is accessible
curl http://localhost:3000

# Test SSL
openssl s_client -connect yourdomain.com:443 -showcerts
```

### Performance Issues

```bash
# Check system resources
free -h
df -h

# Monitor Node.js process
top -p $(pgrep -f "npm start")

# Check for memory leaks
sudo -u deploy node --trace-warnings /var/www/nodebyte/website/.next/standalone/server.js

# Analyze build size
du -sh /var/www/nodebyte/website/.next
```

### Environment Variable Issues

```bash
# Verify environment variables loaded
sudo -u deploy bash -c 'cd /var/www/nodebyte/website && node -e "require(\"dotenv\").config(); console.log(process.env)"'

# Check systemd environment
sudo systemctl show nodebyte-website | grep Environment
```

---

## Quick Reference Commands

```bash
# Service management
sudo systemctl start nodebyte-website
sudo systemctl stop nodebyte-website
sudo systemctl restart nodebyte-website
sudo systemctl status nodebyte-website

# Logs
sudo journalctl -u nodebyte-website -f
sudo tail -f /var/log/nginx/website-access.log

# Health checks
curl http://localhost:3000
curl -I https://yourdomain.com

# Rebuild
cd /var/www/nodebyte/website
sudo -u deploy npm run build
sudo systemctl restart nodebyte-website

# Update
cd /var/www/nodebyte/website
sudo -u deploy git pull origin development
sudo -u deploy npm ci
sudo -u deploy npm run build
sudo systemctl restart nodebyte-website
```

---

## Performance Optimization

### Enable Next.js Standalone Output

In `next.config.mjs`, enable standalone output:

```javascript
export default {
  output: 'standalone',
  // ... other config
};
```

Then update systemd service to use standalone server for better performance.

### PM2 Alternative (Optional)

For advanced process management, consider using PM2:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start with PM2
cd /var/www/nodebyte/website
pm2 start npm --name "nodebyte-website" -- start

# Generate systemd service
pm2 startup systemd
pm2 save
```

---

**Last Updated:** February 28, 2026
