const fs = require('fs');
const path = require('path');
const cp = require('child_process');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    const parentDir = path.dirname(dest);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    try {
      if (fs.existsSync(dest)) {
        try { fs.chmodSync(dest, 0o666); } catch (e) {}
        fs.unlinkSync(dest);
      }
    } catch (e) {}
    try {
      fs.copyFileSync(src, dest);
    } catch (err) {
      // If locked/busy, warn and continue
      console.warn(`[WARN] Could not overwrite file ${dest}: ${err.message}`);
    }
  }
}

async function buildOfflineMobile() {
  console.log('🚀 Preparing Offline Android Bundle for com.kangleiastro.manipuricalendar...');

  const rootDir = path.resolve(__dirname, '..');
  const outDir = path.join(rootDir, 'out');
  const androidAssetsPublic = path.join(rootDir, 'android', 'app', 'src', 'main', 'assets', 'public');
  const androidAssetsDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'assets');
  const appHtmlPath = path.join(rootDir, '.next', 'server', 'app', 'app.html');
  const staticPath = path.join(rootDir, '.next', 'static');
  const publicPath = path.join(rootDir, 'public');

  // 1. Verify .next build artifacts exist
  if (!fs.existsSync(appHtmlPath) || !fs.existsSync(staticPath)) {
    console.log('⚠️ .next build artifacts not found or incomplete. Running next build...');
    cp.execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });
  }

  if (!fs.existsSync(appHtmlPath)) {
    throw new Error('Could not find .next/server/app/app.html after build.');
  }

  // 2. Prepare out/ directory
  console.log('📦 Creating out/ directory with pre-rendered offline app...');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Copy app.html as index.html
  const appHtmlContent = fs.readFileSync(appHtmlPath, 'utf8');
  fs.writeFileSync(path.join(outDir, 'index.html'), appHtmlContent, 'utf8');
  console.log('✓ out/index.html created from pre-rendered /app');

  // Copy .next/static into out/_next/static
  const outStaticDir = path.join(outDir, '_next', 'static');
  copyRecursiveSync(staticPath, outStaticDir);
  console.log('✓ out/_next/static synced with all JavaScript and CSS chunks');

  // Copy public assets (icons, manifest, etc.) into out/
  if (fs.existsSync(publicPath)) {
    copyRecursiveSync(publicPath, outDir);
    console.log('✓ out/ synced with public assets and images');
  }

  // 3. Sync into android/app/src/main/assets/public
  console.log('📲 Syncing offline assets directly into Android app assets...');
  if (fs.existsSync(androidAssetsPublic)) {
    // Clear out dummy redirect index.html or old assets
    fs.rmSync(androidAssetsPublic, { recursive: true, force: true });
  }
  fs.mkdirSync(androidAssetsPublic, { recursive: true });
  copyRecursiveSync(outDir, androidAssetsPublic);
  console.log('✓ android/app/src/main/assets/public populated with full offline bundle');

  // 4. Update capacitor.config.json to REMOVE server.url so it loads 100% OFFLINE
  const offlineCapacitorConfig = {
    appId: "com.kangleiastro.manipuricalendar",
    appName: "Manipuri Calendar by KangleiAstro",
    webDir: "out",
    bundledWebRuntime: false,
    android: {
      allowMixedContent: true,
      captureInput: true,
      backgroundColor: "#0d1322"
    }
  };

  const rootConfigPath = path.join(rootDir, 'capacitor.config.json');
  fs.writeFileSync(rootConfigPath, JSON.stringify(offlineCapacitorConfig, null, 2) + '\n', 'utf8');
  console.log('✓ capacitor.config.json updated (remote server URL removed for true offline support)');

  const androidConfigPath = path.join(androidAssetsDir, 'capacitor.config.json');
  if (fs.existsSync(androidAssetsDir)) {
    fs.writeFileSync(androidConfigPath, JSON.stringify(offlineCapacitorConfig, null, 2) + '\n', 'utf8');
    console.log('✓ android/app/src/main/assets/capacitor.config.json updated');
  }

  console.log('\n========================================================');
  console.log('✅ OFFLINE ANDROID ASSETS READY!');
  console.log('Package: com.kangleiastro.manipuricalendar');
  console.log('The app will now load directly from device memory (zero internet needed).');
  console.log('========================================================\n');
}

buildOfflineMobile().catch((err) => {
  console.error('❌ Failed to prepare offline mobile bundle:', err);
  process.exit(1);
});
