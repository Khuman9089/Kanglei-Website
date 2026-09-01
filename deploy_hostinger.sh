#!/bin/bash
# Hostinger VPS / Node.js Deployment Script for KangleiAstro

echo "🚀 Starting KangleiAstro Hostinger Deployment..."

# 1. Pull latest changes from Git main branch
echo "📥 Pulling latest updates from GitHub..."
git pull origin main

# 2. Install dependencies if updated
echo "📦 Installing npm dependencies..."
npm ci --production=false

# 3. Generate Prisma client if schema exists
if [ -f "prisma/schema.prisma" ]; then
    echo "🗄️ Generating Prisma client..."
    npx prisma generate
fi

# 4. Build production Next.js application
echo "🛠️ Building Next.js production bundle..."
npm run build

# 5. Restart application process using PM2
echo "🔄 Restarting application with PM2..."
if command -v pm2 &> /dev/null; then
    pm2 restart kanglei-astro || pm2 restart all || pm2 start npm --name "kanglei-astro" -- start
else
    echo "⚠️ PM2 not found. Please restart your Node.js application process in Hostinger hPanel."
fi

echo "✅ Hostinger Deployment Complete! Your live website is now updated."
