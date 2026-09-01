#!/bin/bash
# Hostinger VPS / Node.js Deployment Script for KangleiAstro

echo "🚀 Starting KangleiAstro Hostinger Deployment..."

# 1. Pull latest changes from Git main branch
echo "📥 Pulling latest updates from GitHub..."
git pull origin main

# 2. Fix file & directory permissions to prevent 403 Forbidden errors
echo "🔑 Fixing file & directory permissions (755 / 644)..."
chmod 755 .
find . -type d -exec chmod 755 {} +
find . -type f -exec chmod 644 {} +
chmod +x deploy_hostinger.sh

# 3. Install dependencies if updated
echo "📦 Installing npm dependencies..."
npm ci --production=false

# 4. Generate Prisma client if schema exists
if [ -f "prisma/schema.prisma" ]; then
    echo "🗄️ Generating Prisma client..."
    npx prisma generate
fi

# 5. Build production Next.js application
echo "🛠️ Building Next.js production bundle..."
npm run build

# 6. Ensure .htaccess exists in public_html / deployment root for Hostinger LiteSpeed/Apache
if [ -f "public/.htaccess" ]; then
    cp public/.htaccess .htaccess
    chmod 644 .htaccess
fi

# 7. Restart application process using PM2 or Node
echo "🔄 Restarting application with PM2..."
if command -v pm2 &> /dev/null; then
    pm2 restart kanglei-astro || pm2 restart all || pm2 start server.js --name "kanglei-astro"
    pm2 save
else
    echo "⚠️ PM2 not found. Please restart your Node.js application process in Hostinger hPanel."
fi

echo "✅ Hostinger Deployment Complete! Your live website is now updated."
