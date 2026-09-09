#!/bin/bash
# Hostinger VPS / Node.js Deployment Script for KangleiAstro

echo "🚀 Starting KangleiAstro Hostinger Deployment..."

# Ensure runtime data directory exists and is preserved
mkdir -p data

# Ensure .env exists so Supabase persistence & admin settings work after deploy
if [ ! -f ".env" ] && [ -f ".env.local" ]; then
    echo "📄 Creating .env from existing .env.local (kept outside git)..."
    cp .env.local .env
fi
if [ ! -f ".env" ]; then
    echo "⚠️  No .env found. Creating from .env.example — YOU MUST FILL IN REAL KEYS!"
    cp .env.example .env
    echo "   After first deploy: edit .env on the server and fill in:"
    echo "   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (and optionally SUPABASE_SERVICE_ROLE_KEY)"
fi

# 1. Pull latest changes from Git main branch
echo "📥 Pulling latest updates from GitHub..."
git pull origin main

# 2. Fix file & directory permissions to prevent 403 Forbidden errors
echo "🔑 Fixing file & directory permissions (755 / 644)..."
chmod 755 .
find . -type d -exec chmod 755 {} +
find . -type f -exec chmod 644 {} +
chmod +x deploy_hostinger.sh
chmod 755 data
chmod 666 data/*.json 2>/dev/null || true

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

# 6b. Remove leftover physical "blog" directory in root if present (prevents Apache directory redirect loops)
if [ -d "blog" ]; then
    echo "🧹 Removing conflicting physical 'blog' directory in root..."
    rm -rf blog
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
